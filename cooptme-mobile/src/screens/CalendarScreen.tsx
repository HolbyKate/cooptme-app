import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { Calendar, DateData, AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { Menu, Edit2, Trash2, Search, Bell, Tag, Calendar as CalendarIcon, List } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type EventCategory = {
  id: string;
  name: string;
  color: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  categoryId: string;
  notificationId?: string;
};

type ViewMode = 'month' | 'week' | 'agenda';

const DEFAULT_CATEGORIES: EventCategory[] = [
  { id: '1', name: 'Professionnel', color: '#4247BD' },
  { id: '2', name: 'Personnel', color: '#FF8F66' },
  { id: '3', name: 'Important', color: '#FF4444' },
];

const STORAGE_KEY = 'calendar_events';
const CATEGORIES_KEY = 'calendar_categories';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});
  const [categories, setCategories] = useState<EventCategory[]>(DEFAULT_CATEGORIES);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    categoryId: string;
  }>({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    categoryId: DEFAULT_CATEGORIES[0].id,
  });

  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Les notifications sont nécessaires pour les rappels d\'événements.');
    }
  };

  const loadData = async () => {
    try {
      const [storedEvents, storedCategories] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  };

  const saveData = async (newEvents: { [key: string]: Event[] }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les données');
    }
  };

  const scheduleNotification = async (event: Event) => {
    if (event.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(event.notificationId);
    }

    const trigger = new Date(event.startTime);
    trigger.setMinutes(trigger.getMinutes() - 30);

    if (trigger > new Date()) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Rappel d\'événement',
          body: `${event.title} commence dans 30 minutes`,
        },
        trigger,
      });
      return notificationId;
    }
  };

  const handleSearchSubmit = () => {
    const searchResults: Event[] = [];
    Object.values(events).forEach(dayEvents => {
      dayEvents.forEach(event => {
        if (
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          searchResults.push(event);
        }
      });
    });
    return searchResults;
  };

  const saveEvent = async () => {
    if (newEvent.title.trim() === '') {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }

    try {
      const eventData: Event = {
        id: editingEvent?.id || Math.random().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: selectedDate,
        startTime: newEvent.startTime.toISOString(),
        endTime: newEvent.endTime.toISOString(),
        categoryId: newEvent.categoryId,
      };

      const notificationId = await scheduleNotification(eventData);
      if (notificationId) {
        eventData.notificationId = notificationId;
      }

      const updatedEvents = { ...events };
      if (!updatedEvents[selectedDate]) {
        updatedEvents[selectedDate] = [];
      }

      if (editingEvent) {
        const eventIndex = updatedEvents[selectedDate].findIndex(
          e => e.id === editingEvent.id
        );
        if (eventIndex !== -1) {
          updatedEvents[selectedDate][eventIndex] = eventData;
        }
      } else {
        updatedEvents[selectedDate].push(eventData);
      }

      await saveData(updatedEvents);
      setEvents(updatedEvents);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'événement');
    }
  };

  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const event = events[selectedDate].find(e => e.id === eventId);
              if (event?.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(event.notificationId);
              }

              const updatedEvents = { ...events };
              updatedEvents[selectedDate] = events[selectedDate].filter(
                event => event.id !== eventId
              );
              await saveData(updatedEvents);
              setEvents(updatedEvents);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'événement');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      categoryId: DEFAULT_CATEGORIES[0].id,
    });
    setEditingEvent(null);
  };

  const getMarkedDates = () => {
    const marked = Object.keys(events).reduce((acc, date) => ({
    ...acc,
    [date]: {
      marked: true,
      selected: date === selectedDate,
      selectedColor: date === selectedDate ? '#FF8F66' : undefined,
      dotColor: '#FFFFFF',
      customContainerStyle: {
        backgroundColor: '#FF8F66',
        borderRadius: 20,
      },
    }
  }), {});

  if (!marked[selectedDate]) {
    marked[selectedDate] = {
      selected: true,
      selectedColor: '#4247BD',
    };
  }

  return marked;
};

  const renderEvent = (event: Event) => {
    const category = categories.find(c => c.id === event.categoryId);
    return (
      <View key={event.id} style={[styles.eventCard, { borderLeftColor: category?.color }]}>
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={[styles.categoryTag, { backgroundColor: category?.color }]}>
              {category?.name}
            </Text>
          </View>
          <Text style={styles.eventTime}>
            {new Date(event.startTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })} -
            {new Date(event.endTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
        <View style={styles.eventActions}>
          <TouchableOpacity
            onPress={() => {
              setEditingEvent(event);
              setNewEvent({
                title: event.title,
                description: event.description,
                startTime: new Date(event.startTime),
                endTime: new Date(event.endTime),
                categoryId: event.categoryId,
              });
              setModalVisible(true);
            }}
            style={styles.actionButton}
          >
            <Edit2 color="#4247BD" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteEvent(event.id)}
            style={styles.actionButton}
          >
            <Trash2 color="#FF4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendrier</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setSearchModalVisible(true)} style={styles.headerButton}>
            <Search color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
            style={styles.headerButton}
          >
            {viewMode === 'month' ? (
              <List color="#FFFFFF" size={24} />
            ) : (
              <CalendarIcon color="#FFFFFF" size={24} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
        {viewMode === 'month' ? (
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              selectedDayBackgroundColor: '#FF8F66',
              todayTextColor: '#FF8F66',
              arrowColor: '#FF8F66',
              'stylesheet.calendar.main': {
                dayContainer: {
                  borderRadius: 20,
                },
              },
            }}
          />
        ) : (
          <ExpandableCalendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            firstDay={1}
            markedDates={getMarkedDates()}
          />
        )}

        <View style={styles.eventSection}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventHeaderText}>
              Événements du {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                resetForm();
                setModalVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.eventList}>
            {events[selectedDate]?.map(renderEvent)}
          </ScrollView>
        </View>
      </CalendarProvider>

      {/* Modal d'ajout/modification d'événement */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
            />

            <View style={styles.categorySelector}>
              <Text style={styles.labelText}>Catégorie:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          category.id === newEvent.categoryId
                            ? category.color
                            : 'transparent',
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => setNewEvent({ ...newEvent, categoryId: category.id })}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {
                          color:
                            category.id === newEvent.categoryId
                              ? '#FFFFFF'
                              : category.color,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Heure de début: {newEvent.startTime.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Heure de fin: {newEvent.endTime.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            {(showStartTimePicker || showEndTimePicker) && (
              <DateTimePicker
                value={showStartTimePicker ? newEvent.startTime : newEvent.endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  if (event.type === 'set' && selectedDate) {
                    if (showStartTimePicker) {
                      setNewEvent({ ...newEvent, startTime: selectedDate });
                      setShowStartTimePicker(false);
                    } else {
                      setNewEvent({ ...newEvent, endTime: selectedDate });
                      setShowEndTimePicker(false);
                    }
                  }
                  setShowStartTimePicker(false);
                  setShowEndTimePicker(false);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEvent}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de recherche */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rechercher</Text>

            <TextInput
              style={styles.input}
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <ScrollView style={styles.searchResults}>
              {searchQuery.length > 0 && handleSearchSubmit().map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.searchResultItem}
                  onPress={() => {
                    setSelectedDate(event.date);
                    setSearchModalVisible(false);
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.searchResultTitle}>{event.title}</Text>
                  <Text style={styles.searchResultDate}>
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setSearchModalVisible(false);
                setSearchQuery('');
              }}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4247BD',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  eventSection: {
    flex: 1,
    padding: 16,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4247BD',
  },
  addButton: {
    backgroundColor: '#4247BD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#FFFFFF',
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666666',
  },
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4247BD',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#DDDDDD',
  },
  saveButton: {
    backgroundColor: '#4247BD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchResults: {
    maxHeight: 300,
    marginBottom: 16,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  searchResultDate: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});
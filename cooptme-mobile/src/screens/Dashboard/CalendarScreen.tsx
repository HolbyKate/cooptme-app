import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Edit2, Trash2, Search, List } from 'lucide-react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SharedHeader } from '../../components/SharedHeader';
import { RootStackParamList } from '@/navigation/types';


// Type definitions
type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;
type CalendarScreenRouteProp = RouteProp<RootStackParamList, 'Calendar'>;

interface EventCategory {
  id: string;
  name: string;
  color: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  categoryId: string;
  notificationId?: string;
}

interface NewEventForm {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  categoryId: string;
}

// Constants
const DEFAULT_CATEGORIES: EventCategory[] = [
  { id: '1', name: 'Professionnel', color: '#4247BD' },
  { id: '2', name: 'Personnel', color: '#FF8F66' },
  { id: '3', name: 'Important', color: '#FF4444' },
];

const STORAGE_KEY = 'calendar_events';

// Notification configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const initialEventForm: NewEventForm = {
  title: '',
  description: '',
  startTime: new Date(),
  endTime: new Date(),
  categoryId: DEFAULT_CATEGORIES[0].id,
};

export default function CalendarScreen() {
  const route = useRoute<CalendarScreenRouteProp>();
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  // State management
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventForm>(initialEventForm);

  // Data loading and permissions
  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
  let isMounted = true;
  const handleDateChange = async () => {
    const newDate = route.params?.selectedDate as string | undefined;
    if (!newDate || !isMounted) return;

    try {
      if (newDate !== selectedDate) {
        setSelectedDate(newDate);
      }
      if (isMounted) {
        navigation.setParams(undefined);
      }
    } catch (error) {
      console.error('Error handling date change:', error);
    }
  };

  handleDateChange();

  return () => {
    isMounted = false;
  };
}, [route.params?.selectedDate, navigation]);


  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Les notifications sont nécessaires pour les rappels d\'événements.');
    }
  };

  // Data management
  const loadData = useCallback(async () => {
    try {
      const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  }, []);

  const saveData = async (newEvents: Record<string, Event[]>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les données');
    }
  };

  // Event handlers
  const handleDeleteEvent = async (eventId: string) => {
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
              const event = events[selectedDate]?.find(e => e.id === eventId);
              if (event?.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(event.notificationId);
              }

              const updatedEvents = { ...events };
              updatedEvents[selectedDate] = events[selectedDate]?.filter(e => e.id !== eventId) ?? [];

              if (updatedEvents[selectedDate].length === 0) {
                delete updatedEvents[selectedDate];
              }

              await saveData(updatedEvents);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'événement');
            }
          },
        },
      ]
    );
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }

    try {
      const eventToSave: Event = {
        id: editingEvent?.id || `event_${Date.now()}`,
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: selectedDate,
        startTime: newEvent.startTime.toISOString(),
        endTime: newEvent.endTime.toISOString(),
        categoryId: newEvent.categoryId,
      };

      const updatedEvents = { ...events };
      if (!updatedEvents[selectedDate]) {
        updatedEvents[selectedDate] = [];
      }

      if (editingEvent) {
        const index = updatedEvents[selectedDate].findIndex(e => e.id === editingEvent.id);
        if (index !== -1) {
          updatedEvents[selectedDate][index] = eventToSave;
        }
      } else {
        updatedEvents[selectedDate].push(eventToSave);
      }

      await saveData(updatedEvents);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'événement');
    }
  };

  const resetForm = () => {
    setNewEvent(initialEventForm);
    setEditingEvent(null);
  };

  // Memoized values
  const markedDates = useMemo(() => {
    const dates: Record<string, { marked: boolean; selected?: boolean; selectedColor?: string }> = {};

    Object.keys(events).forEach(date => {
      if (events[date]?.length > 0) {
        dates[date] = {
          marked: true,
          selectedColor: '#FF8F66'
        };
      }
    });

    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        selectedColor: '#FF8F66'
      };
    }

    return dates;
  }, [events, selectedDate]);

  // Render methods
  const renderEvent = useCallback((event: Event) => {
    const category = DEFAULT_CATEGORIES.find(c => c.id === event.categoryId);

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
            onPress={() => handleDeleteEvent(event.id)}
            style={styles.actionButton}
          >
            <Trash2 color="#FF4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);

  const HeaderRight = useCallback(() => (
    <View style={styles.headerRight}>
      <TouchableOpacity
        onPress={() => setSearchModalVisible(true)}
        style={styles.headerButton}
      >
        <Search color="#FFFFFF" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
      >
        <List color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader
        title="Calendrier"
        rightContent={<HeaderRight />}
      />
      <View style={styles.content}>
        <Calendar
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#4247BD',
            todayTextColor: '#FF8F66',
            arrowColor: '#4247BD',
          }}
        />

        <View style={styles.eventSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
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
            {events[selectedDate]?.length > 0 ? (
              events[selectedDate].map(renderEvent)
            ) : (
              <Text style={styles.noEventsText}>Aucun événement pour cette date</Text>
            )}
          </ScrollView>
        </View>

        {/* Event Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setModalVisible(false);
            resetForm();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
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
                  {DEFAULT_CATEGORIES.map((category) => (
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
                  onPress={handleSaveEvent}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    {editingEvent ? 'Modifier' : 'Créer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
                {searchQuery.length > 0 && Object.entries(events).map(([date, dayEvents]) =>
                  dayEvents.filter(event =>
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(event => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        setSelectedDate(date);
                        setSearchModalVisible(false);
                        setSearchQuery('');
                      }}
                    >
                      <Text style={styles.searchResultTitle}>{event.title}</Text>
                      <Text style={styles.searchResultDate}>
                        {new Date(date).toLocaleDateString('fr-FR')}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  eventSection: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginRight: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
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
    borderColor: '#E5E7EB',
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
    borderColor: '#E5E7EB',
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
    backgroundColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#4247BD',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  searchResults: {
    maxHeight: 300,
    marginBottom: 16,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
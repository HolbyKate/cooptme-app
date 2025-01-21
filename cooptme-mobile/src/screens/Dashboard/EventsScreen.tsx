import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Calendar, MapPin, Clock } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';
import { eventService as EventService } from '../../api/services/events/event.service';
import { EventDTO } from '../../types/index';
import { Linking } from "react-native";
import type { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SharedHeader } from '../../components/SharedHeader';

type EventsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Events'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const eventTypeLabels = {
  job_fair: "🎯 Salon Emploi",
  conference: "🎤 Conférence",
  meetup: "👥 Meetup",
  school: "🎓 Ecole",
  other: "📅 Événement"
} as const;

export default function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await EventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const refreshedEvents = await EventService.refreshEvents();
      setEvents(refreshedEvents);
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addToCalendar = async (event: EventDTO) => {
  try {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().split('T')[0];
    const STORAGE_KEY = 'calendar_events';

    const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
    let existingEvents = storedEvents ? JSON.parse(storedEvents) : {};

    let [startHour, endHour] = event.time ? event.time.split('-').map(t => t.trim()) : ['09:00', '10:00'];

    const calendarEvent = {
      id: `${event.id}_${Date.now()}`,
      title: event.title,
      description: event.description,
      date: formattedDate,
      startTime: `${formattedDate}T${startHour}:00.000Z`,
      endTime: `${formattedDate}T${endHour}:00.000Z`,
      categoryId: '2',
      notificationId: null
    };

    if (!existingEvents[formattedDate]) {
      existingEvents[formattedDate] = [];
    }

    // Check for duplicate events
    const isDuplicate = existingEvents[formattedDate].some(
      (existing: any) => existing.id.startsWith(event.id)
    );

    if (isDuplicate) {
      Alert.alert(
        'Attention',
        'Cet événement existe déjà dans votre calendrier',
        [{ text: 'OK' }]
      );
      return;
    }

    existingEvents[formattedDate].push(calendarEvent);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingEvents));

    // Navigate to Calendar tab through the bottom tab navigation
    navigation.getParent()?.navigate('Calendar', { selectedDate: formattedDate });

    Alert.alert(
      'Succès',
      'Événement ajouté au calendrier',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout au calendrier:', error);
    Alert.alert(
      'Erreur',
      'Impossible d\'ajouter l\'événement au calendrier. Veuillez réessayer.',
      [{ text: 'OK' }]
    );
  }
};

  const renderEventCard = ({ item }: { item: EventDTO }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => item.url && Linking.openURL(item.url)}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventSource}>{item.source}</Text>
        <Text style={styles.eventType}>
          {eventTypeLabels[item.type] || eventTypeLabels.other}
        </Text>
      </View>

      <Text style={styles.eventTitle}>{item.title}</Text>

      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {item.time && (
          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>

      {item.organizer && (
        <Text style={styles.organizer}>Organisé par: {item.organizer}</Text>
      )}

      <View style={styles.descriptionContainer}>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addToCalendarButton}
        onPress={(e) => {
          e.stopPropagation();
          addToCalendar(item);
        }}
      >
        <Calendar size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <SharedHeader title="Événements" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4247BD" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader title="Événements" />
      <View style={styles.content}>
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4247BD"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun événement trouvé</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    paddingBottom: 70,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#4247BD",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  eventSource: {
    fontSize: 12,
    color: "#666",
  },
  organizer: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addToCalendarButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF8F66',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

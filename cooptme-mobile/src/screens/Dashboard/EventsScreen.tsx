import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Menu, Calendar as CalendarIcon, MapPin, Clock, Plus, X } from "lucide-react-native";
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { EventService, EventDTO } from "../../api/services/events/event.service";
import { Linking } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../types/index';

type EventsScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Events'>;

const CALENDAR_STORAGE_KEY = 'calendar_events_status';

export default function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState<Record<string, boolean>>({});

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    loadEvents();
    loadCalendarStatus();
  }, []);

  const loadCalendarStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
      if (status) {
        setCalendarStatus(JSON.parse(status));
      }
    } catch (error) {
      console.error("Error loading calendar status:", error);
    }
  };

  const toggleCalendarEvent = async (event: EventDTO) => {
    try {
      const newStatus = {
        ...calendarStatus,
        [event.id]: !calendarStatus[event.id]
      };
      
      await AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(newStatus));
      setCalendarStatus(newStatus);

      if (newStatus[event.id]) {
        // Convert date string to Date object
        const eventDate = new Date(event.date);
        
        // Navigate to Calendar screen with event details
        navigation.navigate('Calendar', {
          selectedDate: eventDate.toISOString().split('T')[0],
          newEvent: {
            title: event.title,
            description: event.description || '',
            date: eventDate.toISOString().split('T')[0],
            startTime: event.time?.split('-')[0]?.trim() || '09:00',
            endTime: event.time?.split('-')[1]?.trim() || '10:00',
            categoryId: '1', // Default to Professional category
          }
        });
      } else {
        // Show confirmation of removal
        Alert.alert(
          'Événement retiré',
          'L\'événement a été retiré de votre calendrier',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error("Error toggling calendar status:", error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la modification du calendrier'
      );
    }
  };

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

  const renderEventCard = ({ item }: { item: EventDTO }) => (
    <View style={styles.eventCard}>
      <TouchableOpacity
        style={styles.eventContent}
        onPress={() => item.url && Linking.openURL(item.url)}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventSource}>{item.source}</Text>
          <Text style={styles.eventType}>
            {item.type === "job_fair"
              ? "🎯 Salon Emploi"
              : item.type === "conference"
                ? "🎤 Conférence"
                : item.type === "meetup"
                  ? "👥 Meetup"
                  : "📅 Événement"}
          </Text>
        </View>

        <Text style={styles.eventTitle}>{item.title}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <CalendarIcon size={16} color="#666" />
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

        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.calendarButton,
          calendarStatus[item.id] && styles.calendarButtonActive
        ]}
        onPress={() => toggleCalendarEvent(item)}
      >
        {calendarStatus[item.id] ? (
          <X size={20} color="#FF4444" />
        ) : (
          <Plus size={20} color="#4247BD" />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4247BD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Événements</Text>
        <Image
          source={require("../../../assets/logo_blue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#4c51c6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  eventContent: {
    flex: 1,
    marginRight: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventType: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: "#4247BD",
  },
  eventTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  eventDescription: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventSource: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  organizer: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  emptyText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  calendarButtonActive: {
    backgroundColor: '#FEE2E2',
  },
});

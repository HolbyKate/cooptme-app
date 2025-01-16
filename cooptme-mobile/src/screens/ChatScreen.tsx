import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Search } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from 'expo-linear-gradient';
import { SharedHeader } from '../components/SharedHeader';
import { RootStackParamList } from '../types/navigation';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ChatListItem = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string | null;
  online: boolean;
};

const chatList: ChatListItem[] = [
  {
    id: "1",
    name: "Marie Dubois",
    lastMessage: "Super ! On se voit demain alors",
    timestamp: "10:30",
    unreadCount: 2,
    avatar: null,
    online: true,
  },
  {
    id: "2",
    name: "Thomas Martin",
    lastMessage: "Merci pour les informations",
    timestamp: "09:15",
    unreadCount: 0,
    avatar: null,
    online: false,
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: ChatListItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatConversation", {
          chatId: item.id,
          name: item.name,
        })
      }
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
        )}
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader title="Messages" />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Search color="#666" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        {filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune conversation trouvée</Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <LinearGradient
        colors={['transparent', '#FF8F66']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  chatList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#4247BD",
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  messagePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#4247BD",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadCount: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    opacity: 0.2,
  },
});

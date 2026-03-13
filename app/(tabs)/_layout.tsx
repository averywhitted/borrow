import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useHasUnreadMessages } from '../../store/threads';

// Pending incoming requests (TODO: derive from store)
const HAS_PENDING_REQUESTS = true;

function MessagesTabIcon({ color, size }: { color: string; size: number }) {
  const hasUnread = useHasUnreadMessages();
  const dotColor = HAS_PENDING_REQUESTS ? Colors.purple : hasUnread ? Colors.teal : null;

  return (
    <View style={{ width: size + 8, height: size + 8, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
      {dotColor && (
        <View style={{
          position: 'absolute', top: 0, right: 0,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: dotColor,
          borderWidth: 1.5, borderColor: Colors.white,
        }} />
      )}
    </View>
  );
}

function TabIcon({ name, color, size }: { name: React.ComponentProps<typeof MaterialIcons>['name']; color: string; size: number }) {
  return (
    <View style={{ width: size + 8, height: size + 8, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 2,
          borderTopColor: Colors.black,
          height: 60,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => <TabIcon name="menu-book" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessagesTabIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <TabIcon name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

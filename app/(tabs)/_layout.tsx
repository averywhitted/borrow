import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { getColors } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useHasUnreadMessages } from '../../store/threads';
import { useIsDark } from '../../store/theme';

// Pending incoming requests (TODO: derive from store)
const HAS_PENDING_REQUESTS = true;

function MessagesTabIcon({ color, size }: { color: string; size: number }) {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const hasUnread = useHasUnreadMessages();
  const dotColor = HAS_PENDING_REQUESTS ? C.purple : hasUnread ? C.teal : null;

  return (
    <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size + 14, height: size + 14, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
        {dotColor && (
          <View style={{
            position: 'absolute', top: 0, right: 0,
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: dotColor,
            borderWidth: 1.5, borderColor: C.white,
          }} />
        )}
      </View>
    </View>
  );
}

function TabIcon({ name, color, size }: { name: React.ComponentProps<typeof MaterialIcons>['name']; color: string; size: number }) {
  return (
    <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const isDark = useIsDark();
  const C = getColors(isDark);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.white,
          borderTopWidth: 2,
          borderTopColor: C.black,
          height: 60,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        },
        tabBarActiveTintColor: C.black,
        tabBarInactiveTintColor: C.gray,
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

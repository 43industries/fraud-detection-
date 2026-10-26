import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

function TabLabel({
  label,
  focused,
  color,
}: {
  label: string;
  focused: boolean;
  color: ColorValue;
}) {
  return (
    <Text style={{ color, fontSize: 11, fontWeight: focused ? '700' : '500' }}>{label}</Text>
  );
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundSelected,
        },
        tabBarActiveTintColor: '#0B5CAB',
        tabBarInactiveTintColor: theme.textSecondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Home" focused={focused} color={color} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Cases" focused={focused} color={color} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Alerts" focused={focused} color={color} />
          ),
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

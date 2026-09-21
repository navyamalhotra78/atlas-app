import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HomeTopBarProps {
  streakCount?: number;
}

export function HomeTopBar({ streakCount = 0 }: HomeTopBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].icon;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.sideGroup}>
        <Ionicons name="map-outline" size={26} color={iconColor} />
        <Ionicons name="stats-chart-outline" size={26} color={iconColor} style={styles.iconSpacing} />
      </View>
      <View style={styles.sideGroup}>
        <View style={styles.streak}>
          <Ionicons name="flame" size={24} color="#FF7A00" />
          <ThemedText style={styles.streakCount}>{streakCount}</ThemedText>
        </View>
        <Ionicons
          name="person-circle-outline"
          size={30}
          color={iconColor}
          style={styles.iconSpacing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sideGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 16,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

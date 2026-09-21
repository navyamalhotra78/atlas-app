import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { HomeTopBar } from '@/components/home-top-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Mode {
  key: Difficulty;
  label: string;
}

const MODES: Mode[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <HomeTopBar streakCount={5} />
      <View style={styles.modeGrid}>
        <View style={styles.modeRow}>
          {MODES.slice(0, 2).map((mode) => (
            <Pressable
              key={mode.key}
              style={styles.modeBox}
              onPress={() => router.push(`/mode/${mode.key}`)}>
              <ThemedText style={styles.modeLabel}>{mode.label}</ThemedText>
            </Pressable>
          ))}
        </View>
        <View style={styles.modeRow}>
          {MODES.slice(2).map((mode) => (
            <Pressable
              key={mode.key}
              style={styles.modeBox}
              onPress={() => router.push(`/mode/${mode.key}`)}>
              <ThemedText style={styles.modeLabel}>{mode.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  modeGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 15,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modeBox: {
    width: '42%',
    aspectRatio: 0.8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modeLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});

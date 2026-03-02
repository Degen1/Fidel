import { useState } from 'react';
import { StyleSheet, View, Appearance } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const THEME_OPTIONS = ['ብርሃን', 'ተቀያሪ', 'ጸልማት'];
const THEME_MODES = ['light', 'system', 'dark'] as const;

export default function SettingsScreen() {
  const [themeIndex, setThemeIndex] = useState(1);

  const handleThemeChange = (index: number) => {
    setThemeIndex(index);
    const selectedMode = THEME_MODES[index];
    Appearance.setColorScheme(selectedMode === 'system' ? null : selectedMode);
  };

  return (
    <ThemedView style={styles.safeArea}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ThemedText type="title">መማራጺ</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.rowLabel}>ልጪ</ThemedText>
          <SegmentedControl
            values={THEME_OPTIONS}
            selectedIndex={themeIndex}
            onChange={(event) => handleThemeChange(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    opacity: 0.75,
  },
  section: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    //backgroundColor: '#E5E7EB',
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
  },
  segmentedControl: {
    height: 46,
  },
});

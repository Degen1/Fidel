import { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Pressable } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

const LETTER_GROUPS = [
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
];
const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;
const LIGHT_COLORS = {
  screenBg: "#F3F4F6",
  columnBg: "#E5E7EB",
  activeItemBg: "#0EA5E9",
  itemText: "#1F2937",
  activeItemText: "#FFFFFF",
  mainText: "#111827",
  hintText: "#4B5563",
};
const DARK_COLORS = {
  screenBg: "#111827",
  columnBg: "#1F2937",
  activeItemBg: "#38BDF8",
  itemText: "#D1D5DB",
  activeItemText: "#FFFFFF",
  mainText: "#F9FAFB",
  hintText: "#9CA3AF",
};

export default function IndexScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const activeLetters = LETTER_GROUPS[activeGroupIndex];
  const canGoBack = activeGroupIndex > 0;
  const canGoNext = activeGroupIndex < LETTER_GROUPS.length - 1;

  const goToPreviousGroup = () => {
    if (!canGoBack) {
      return;
    }

    setActiveGroupIndex((current) => current - 1);
    setActiveIndex(0);
  };

  const goToNextGroup = () => {
    if (!canGoNext) {
      return;
    }

    setActiveGroupIndex((current) => current + 1);
    setActiveIndex(0);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < SWIPE_UP_THRESHOLD) {
          setActiveIndex((current) => (current + 1) % activeLetters.length);
        } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
          setActiveIndex((current) => (current - 1 + activeLetters.length) % activeLetters.length);
        }
      },
    }),
  ).current;

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]} {...panResponder.panHandlers}>
      <View style={[styles.lettersColumn, { backgroundColor: colors.columnBg }]}>
        <View style={styles.subjectList}>
          {activeLetters.map((letter, index) => {
            const isActive = index === activeIndex;

            return (
              <Pressable
                key={letter}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.letterItem,
                  isActive && styles.letterItemActive,
                  isActive && { backgroundColor: colors.activeItemBg },
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    { color: colors.itemText },
                    isActive && styles.letterTextActive,
                    isActive && { color: colors.activeItemText },
                  ]}
                >
                  {letter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.columnNavigation}>
          <Pressable
            onPress={goToPreviousGroup}
            disabled={!canGoBack}
            style={[
              styles.arrowButton,
              { backgroundColor: colors.activeItemBg },
              !canGoBack && styles.arrowButtonDisabled,
            ]}
          >
            <Text style={[styles.arrowText, { color: colors.activeItemText }]}>↑</Text>
          </Pressable>

          <Pressable
            onPress={goToNextGroup}
            disabled={!canGoNext}
            style={[
              styles.arrowButton,
              { backgroundColor: colors.activeItemBg },
              !canGoNext && styles.arrowButtonDisabled,
            ]}
          >
            <Text style={[styles.arrowText, { color: colors.activeItemText }]}>↓</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.contentSection}>
          <Text style={[styles.currentLetter, { color: colors.mainText }]}>{activeLetters[activeIndex]}</Text>
          <Text style={[styles.hint, { color: colors.hintText }]}>ንላዕሊ ድፍኡ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
  },
  lettersColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectList: {
    alignItems: "center",
  },
  letterItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letterItemActive: {
    backgroundColor: "#0EA5E9",
  },
  letterText: {
    fontSize: 30,
    fontWeight: "700",
  },
  letterTextActive: {
    color: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  contentSection: {
    alignItems: "center",
  },
  currentLetter: {
    fontSize: 140,
    fontWeight: "800",
    lineHeight: 160,
  },
  hint: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  columnNavigation: {
    gap: 10,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.45,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 26,
  },
});

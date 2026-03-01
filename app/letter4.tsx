import { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder } from "react-native";

const LETTERS = ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"];
const SWIPE_UP_THRESHOLD = -40;

export default function IndexScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < SWIPE_UP_THRESHOLD) {
          setActiveIndex((current) => (current + 1) % LETTERS.length);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.screen} {...panResponder.panHandlers}>
      <View style={styles.lettersColumn}>
        {LETTERS.map((letter, index) => {
          const isActive = index === activeIndex;

          return (
            <View key={letter} style={[styles.letterItem, isActive && styles.letterItemActive]}>
              <Text style={[styles.letterText, isActive && styles.letterTextActive]}>{letter}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.mainArea}>
        <Text style={styles.currentLetter}>{LETTERS[activeIndex]}</Text>
        <Text style={styles.hint}>Swipe up to cycle</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
  },
  lettersColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
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
    color: "#1F2937",
    fontWeight: "700",
  },
  letterTextActive: {
    color: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  currentLetter: {
    fontSize: 140,
    color: "#111827",
    fontWeight: "800",
    lineHeight: 160,
  },
  hint: {
    marginTop: 8,
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "600",
  },
});

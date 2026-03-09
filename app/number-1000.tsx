import { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
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

export default function ThousandsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < SWIPE_UP_THRESHOLD) {
          setActiveIndex((current) => (current + 1) % NUMBERS.length);
        } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
          setActiveIndex((current) => (current - 1 + NUMBERS.length) % NUMBERS.length);
        }
      },
    }),
  ).current;

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]} {...panResponder.panHandlers}>
      <Text style={[styles.screenZero, { color: colors.mainText, top: insets.top + 8 }]}>000</Text>

      <View style={[styles.numbersColumn, { backgroundColor: colors.columnBg }]}>
        {NUMBERS.map((number, index) => {
          const isActive = index === activeIndex;

          return (
            <Pressable
              key={number}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.numberItem,
                isActive && styles.numberItemActive,
                isActive && { backgroundColor: colors.activeItemBg },
              ]}
            >
              <Text
                style={[
                  styles.numberText,
                  { color: colors.itemText },
                  isActive && styles.numberTextActive,
                  isActive && { color: colors.activeItemText },
                ]}
              >
                {number}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mainArea}>
        <Text style={[styles.currentNumber, { color: colors.mainText }]}>{NUMBERS[activeIndex]}000</Text>
        <Text style={[styles.hint, { color: colors.hintText }]}>ንላዕሊ ድፍኡ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
  },
  screenZero: {
    position: "absolute",
    right: 18,
    fontSize: 28,
    fontWeight: "800",
    zIndex: 10,
  },
  numbersColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
    alignItems: "center",
  },
  numberItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  numberItemActive: {
    backgroundColor: "#0EA5E9",
  },
  numberText: {
    fontSize: 30,
    fontWeight: "700",
  },
  numberTextActive: {
    color: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  currentNumber: {
    fontSize: 140,
    fontWeight: "800",
    lineHeight: 160,
  },
  hint: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});

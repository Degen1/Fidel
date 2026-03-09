import { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Pressable } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import NumbersOne from "./numbers1";
import NumbersTwo from "./numbers2";
import NumbersThree from "./numbers3";
import NumbersFour from "./numbers4";
import ColorsOne from "./colors1";
import ColorsTwo from "./colors2";
import ColorsThree from "./colors3";

const LETTER_GROUPS = [
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
   ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
   ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
   ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
];
const SEGMENT_OPTIONS = ["letters", "numbers", "colors"];
const NUMBER_TABS = [NumbersOne, NumbersTwo, NumbersThree, NumbersFour];
const COLOR_TABS = [ColorsOne, ColorsTwo, ColorsThree];
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
  const [numberPageIndex, setNumberPageIndex] = useState(0);
  const [colorPageIndex, setColorPageIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const activeLetters = LETTER_GROUPS[activeGroupIndex];
  const ActiveNumbersScreen = NUMBER_TABS[numberPageIndex];
  const ActiveColorsScreen = COLOR_TABS[colorPageIndex];
  const canGoBack = activeGroupIndex > 0;
  const canGoNext = activeGroupIndex < LETTER_GROUPS.length - 1;
  const canGoBackNumbers = numberPageIndex > 0;
  const canGoNextNumbers = numberPageIndex < NUMBER_TABS.length - 1;
  const canGoBackColors = colorPageIndex > 0;
  const canGoNextColors = colorPageIndex < COLOR_TABS.length - 1;
  const showBottomNavigation = segmentIndex === 0 || segmentIndex === 1 || segmentIndex === 2;
  const segmentBottom = Math.max(insets.bottom + 8, 14);
  const navigationBottom = segmentBottom + 56;

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

  const handleBack = () => {
    if (segmentIndex === 0) {
      goToPreviousGroup();
      return;
    }

    if (segmentIndex === 1 && canGoBackNumbers) {
      setNumberPageIndex((current) => current - 1);
      return;
    }

    if (segmentIndex === 2 && canGoBackColors) {
      setColorPageIndex((current) => current - 1);
    }
  };

  const handleNext = () => {
    if (segmentIndex === 0) {
      goToNextGroup();
      return;
    }

    if (segmentIndex === 1 && canGoNextNumbers) {
      setNumberPageIndex((current) => current + 1);
      return;
    }

    if (segmentIndex === 2 && canGoNextColors) {
      setColorPageIndex((current) => current + 1);
    }
  };

  const currentCanGoBack = segmentIndex === 0 ? canGoBack : segmentIndex === 1 ? canGoBackNumbers : canGoBackColors;
  const currentCanGoNext = segmentIndex === 0 ? canGoNext : segmentIndex === 1 ? canGoNextNumbers : canGoNextColors;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.screenBg }]} edges={[]}>
      <View style={styles.contentContainer}>
        {segmentIndex === 0 ? (
          <View style={styles.screen} {...panResponder.panHandlers}>
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
            </View>

            <View style={styles.mainArea}>
              <View style={styles.contentSection}>
                <Text style={[styles.currentLetter, { color: colors.mainText }]}>{activeLetters[activeIndex]}</Text>
                <Text style={[styles.hint, { color: colors.hintText }]}>ንላዕሊ ድፍኡ</Text>
              </View>
            </View>
          </View>
        ) : null}
        {segmentIndex === 1 ? <ActiveNumbersScreen /> : null}
        {segmentIndex === 2 ? <ActiveColorsScreen hideNavigation /> : null}
      </View>

      {showBottomNavigation ? (
        <View style={[styles.leftNavigation, { bottom: navigationBottom }]}>
          <Pressable
            onPress={handleBack}
            disabled={!currentCanGoBack}
            style={[
              styles.arrowButton,
              { backgroundColor: colors.activeItemBg },
              !currentCanGoBack && styles.arrowButtonDisabled,
            ]}
          >
            <Text style={[styles.arrowText, { color: colors.activeItemText }]}>↑</Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={!currentCanGoNext}
            style={[
              styles.arrowButton,
              { backgroundColor: colors.activeItemBg },
              !currentCanGoNext && styles.arrowButtonDisabled,
            ]}
          >
            <Text style={[styles.arrowText, { color: colors.activeItemText }]}>↓</Text>
          </Pressable>
        </View>
      ) : null}

      <SegmentedControl
        values={SEGMENT_OPTIONS}
        selectedIndex={segmentIndex}
        onChange={(event) => setSegmentIndex(event.nativeEvent.selectedSegmentIndex)}
        backgroundColor="transparent"
        tintColor={colors.activeItemBg}
        style={[styles.bottomSegment, { bottom: segmentBottom }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
  },
  lettersColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
    justifyContent: "flex-start",
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
  leftNavigation: {
    position: "absolute",
    left: 16,
    gap: 10,
    zIndex: 20,
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
  bottomSegment: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 46,
    backgroundColor: "transparent",
    zIndex: 20,
  },
});

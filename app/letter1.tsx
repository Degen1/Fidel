import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Pressable, Modal, ScrollView } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import NumbersOne from "./numbers1";
import NumbersTwo from "./numbers2";
import NumbersThree from "./numbers3";

const LETTER_GROUPS = [
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
  ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"],
  ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"],
  ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"],
  ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"],
  ["ወ", "ዉ", "ዊ", "ዋ", "ዌ", "ው", "ዎ"],
  ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],

];
const PATTERN_ITEMS = ["11", "12", "ሀሀ", "ሀ ሁ"];
const SEGMENT_OPTIONS = ["letters", "numbers", "patterns"];
const NUMBER_TABS = [NumbersOne, NumbersTwo, NumbersThree];
const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;
const MODAL_CLOSE_SWIPE_THRESHOLD = 56;
const LETTERS_PER_ROW = 7;
const MODAL_ROW_COLORS = [
  "#F7E7CF",
  "#D8E8F8",
  "#D6ECDD",
  "#F2DDDD",
  "#E5DDF0",
  "#F7E7CF",
  "#D8E8F8",
  "#D6ECDD",
];
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

export type Letter1Segment = (typeof SEGMENT_OPTIONS)[number];

type Letter1ScreenProps = {
  segmentOverride?: Letter1Segment;
  hideSegmentControl?: boolean;
  onOverflowBack?: () => void;
  onOverflowNext?: () => void;
};

const getSegmentIndexFromParam = (segment: string | string[] | undefined) => {
  const value = Array.isArray(segment) ? segment[0] : segment;

  if (!value) {
    return 0;
  }

  const normalized = value.toLowerCase();
  const aliasMap: Record<string, Letter1Segment> = {
    letters: "letters",
    letter: "letters",
    numbers: "numbers",
    number: "numbers",
    patterns: "patterns",
    pattern: "patterns",
    colors: "patterns",
    color: "patterns",
  };
  const resolvedValue = aliasMap[normalized] ?? "letters";
  const index = SEGMENT_OPTIONS.indexOf(resolvedValue);

  return index >= 0 ? index : 0;
};

export default function IndexScreen({
  segmentOverride,
  hideSegmentControl = false,
  onOverflowBack,
  onOverflowNext,
}: Letter1ScreenProps) {
  const params = useLocalSearchParams<{ segment?: string | string[] }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [numberPageIndex, setNumberPageIndex] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(() => getSegmentIndexFromParam(segmentOverride ?? params.segment));
  const [showAllLetters, setShowAllLetters] = useState(false);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const activeLetters = LETTER_GROUPS[activeGroupIndex];
  const activePattern = PATTERN_ITEMS[patternIndex];
  const ActiveNumbersScreen = NUMBER_TABS[numberPageIndex];
  const canGoBack = activeGroupIndex > 0;
  const canGoNext = activeGroupIndex < LETTER_GROUPS.length - 1;
  const canGoBackNumbers = numberPageIndex > 0;
  const canGoNextNumbers = numberPageIndex < NUMBER_TABS.length - 1;
  const canGoBackPatterns = patternIndex > 0;
  const canGoNextPatterns = patternIndex < PATTERN_ITEMS.length - 1;
  const showBottomNavigation = segmentIndex === 0 || segmentIndex === 1 || segmentIndex === 2;
  const segmentBottom = Math.max(insets.bottom + 8, 14);
  const navigationBottom = hideSegmentControl ? segmentBottom : segmentBottom + 56;
  const letterButtonTop = insets.top + 12;
  const allLetters = useMemo(() => Array.from(new Set(LETTER_GROUPS.flat())), []);
  const modalScrollOffsetRef = useRef(0);
  const allLetterRows = useMemo(() => {
    const rows: string[][] = [];

    for (let index = 0; index < allLetters.length; index += LETTERS_PER_ROW) {
      rows.push(allLetters.slice(index, index + LETTERS_PER_ROW));
    }

    return rows;
  }, [allLetters]);

  useEffect(() => {
    setSegmentIndex(getSegmentIndexFromParam(segmentOverride ?? params.segment));
  }, [segmentOverride, params.segment]);

  useEffect(() => {
    if (segmentIndex !== 0) {
      setShowAllLetters(false);
    }
  }, [segmentIndex]);

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

  const patternPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < SWIPE_UP_THRESHOLD) {
          setPatternIndex((current) => (current + 1) % PATTERN_ITEMS.length);
        } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
          setPatternIndex((current) => (current - 1 + PATTERN_ITEMS.length) % PATTERN_ITEMS.length);
        }
      },
    }),
  ).current;

  const modalPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dy > 8 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
        modalScrollOffsetRef.current <= 0,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 8 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
        modalScrollOffsetRef.current <= 0,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > MODAL_CLOSE_SWIPE_THRESHOLD || gestureState.vy > 0.75) {
          setShowAllLetters(false);
        }
      },
    }),
  ).current;

  const handleBack = () => {
    if (segmentIndex === 0) {
      if (canGoBack) {
        goToPreviousGroup();
        return;
      }

      onOverflowBack?.();
      return;
    }

    if (segmentIndex === 1) {
      if (canGoBackNumbers) {
        setNumberPageIndex((current) => current - 1);
        return;
      }

      onOverflowBack?.();
      return;
    }

    if (canGoBackPatterns) {
      setPatternIndex((current) => current - 1);
      return;
    }

    onOverflowBack?.();
  };

  const handleNext = () => {
    if (segmentIndex === 0) {
      if (canGoNext) {
        goToNextGroup();
        return;
      }

      onOverflowNext?.();
      return;
    }

    if (segmentIndex === 1) {
      if (canGoNextNumbers) {
        setNumberPageIndex((current) => current + 1);
        return;
      }

      onOverflowNext?.();
      return;
    }

    if (canGoNextPatterns) {
      setPatternIndex((current) => current + 1);
      return;
    }

    onOverflowNext?.();
  };

  const currentCanGoBack =
    (segmentIndex === 0 ? canGoBack : segmentIndex === 1 ? canGoBackNumbers : canGoBackPatterns) || !!onOverflowBack;
  const currentCanGoNext =
    (segmentIndex === 0 ? canGoNext : segmentIndex === 1 ? canGoNextNumbers : canGoNextPatterns) || !!onOverflowNext;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.screenBg }]} edges={[]}>
      <View style={styles.contentContainer}>
        {segmentIndex === 0 ? (
          <View style={styles.screen} {...panResponder.panHandlers}>
            <View style={[styles.leftColumn, { backgroundColor: colors.columnBg }]}>
              <View style={styles.subjectList}>
                {activeLetters.map((letter, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <Pressable
                      key={letter}
                      onPress={() => setActiveIndex(index)}
                      style={[
                        styles.leftItem,
                        isActive && styles.leftItemActive,
                        isActive && { backgroundColor: colors.activeItemBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.leftItemText,
                          { color: colors.itemText },
                          isActive && styles.leftItemTextActive,
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
              <Pressable
                onPress={() => setShowAllLetters(true)}
                style={[
                  styles.fiCircleButton,
                  {
                    top: letterButtonTop,
                    backgroundColor: colors.columnBg,
                    borderColor: colors.activeItemBg,
                  },
                ]}
              >
                <Text style={[styles.fiCircleButtonText, { color: colors.mainText }]}>ፊ</Text>
              </Pressable>

              <View style={styles.contentSection}>
                <>
                  <Text style={[styles.currentLetter, { color: colors.mainText }]}>{activeLetters[activeIndex]}</Text>
                  <Text style={[styles.hint, { color: colors.hintText }]}>ንላዕሊ ድፍኡ</Text>
                </>
              </View>
            </View>
          </View>
        ) : null}

        {segmentIndex === 1 ? <ActiveNumbersScreen /> : null}

        {segmentIndex === 2 ? (
          <View style={styles.screen} {...patternPanResponder.panHandlers}>
            <View style={[styles.leftColumn, { backgroundColor: colors.columnBg }]}>
              <View style={styles.subjectList}>
                {PATTERN_ITEMS.map((pattern, index) => {
                  const isActive = index === patternIndex;

                  return (
                    <Pressable
                      key={pattern}
                      onPress={() => setPatternIndex(index)}
                      style={[
                        styles.leftItem,
                        isActive && styles.leftItemActive,
                        isActive && { backgroundColor: colors.activeItemBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.patternItemText,
                          { color: colors.itemText },
                          isActive && styles.leftItemTextActive,
                          isActive && { color: colors.activeItemText },
                        ]}
                      >
                        {pattern}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.mainArea}>
              <View style={styles.contentSection}>
                <Text style={[styles.currentPattern, { color: colors.mainText }]}>
                  {`${activePattern} ${activePattern} ${activePattern}`}
                </Text>
                <Text style={[styles.hint, { color: colors.hintText }]}>ንላዕሊ ድፍኡ</Text>
              </View>
            </View>
          </View>
        ) : null}
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

      {!hideSegmentControl ? (
        <SegmentedControl
          values={SEGMENT_OPTIONS}
          selectedIndex={segmentIndex}
          onChange={(event) => setSegmentIndex(event.nativeEvent.selectedSegmentIndex)}
          backgroundColor="transparent"
          tintColor={colors.activeItemBg}
          style={[styles.bottomSegment, { bottom: segmentBottom }]}
        />
      ) : null}

      <Modal
        transparent
        animationType="slide"
        visible={showAllLetters}
        onRequestClose={() => setShowAllLetters(false)}
      >
        <View style={styles.fullScreenModal}>
          <View
            style={[
              styles.modalContentContainer,
              {
                backgroundColor: colors.columnBg,
                paddingBottom: Math.max(insets.bottom + 10, 16),
              },
            ]}
            {...modalPanResponder.panHandlers}
          >
            <View style={styles.modalHandleArea}>
              <View style={[styles.modalSwipeHandle, { backgroundColor: colors.hintText }]} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.mainText }]}>ኩሎም ፊደላት</Text>
            <ScrollView
              style={styles.lettersGrid}
              contentContainerStyle={styles.lettersGridContent}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                modalScrollOffsetRef.current = event.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
            >
              {allLetterRows.map((row, rowIndex) => (
                <View
                  key={`letters-row-${rowIndex}`}
                  style={[styles.lettersRowCard, { backgroundColor: MODAL_ROW_COLORS[rowIndex % MODAL_ROW_COLORS.length] }]}
                >
                  <View style={styles.lettersRow}>
                    {row.map((letter) => (
                      <View key={`${rowIndex}-${letter}`} style={styles.modalLetterCell}>
                        <Text style={[styles.modalLetterText, { color: colors.mainText }]}>{letter}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  leftColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  subjectList: {
    alignItems: "center",
  },
  leftItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leftItemActive: {
    backgroundColor: "#0EA5E9",
  },
  leftItemText: {
    fontSize: 30,
    fontWeight: "700",
  },
  patternItemText: {
    fontSize: 18,
    fontWeight: "700",
  },
  leftItemTextActive: {
    color: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fiCircleButton: {
    position: "absolute",
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },
  fiCircleButtonText: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  contentSection: {
    alignItems: "center",
  },
  currentLetter: {
    fontSize: 140,
    fontWeight: "800",
    lineHeight: 160,
  },
  currentPattern: {
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 62,
    textAlign: "center",
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
  fullScreenModal: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalSwipeHandle: {
    alignSelf: "center",
    width: 48,
    height: 6,
    borderRadius: 3,
  },
  modalHandleArea: {
    width: "100%",
    paddingTop: 2,
    paddingBottom: 10,
    alignItems: "center",
  },
  modalContentContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  lettersGrid: {
    flex: 1,
    width: "100%",
  },
  lettersGridContent: {
    paddingTop: 4,
    paddingBottom: 6,
  },
  lettersRowCard: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  lettersRow: {
    flexDirection: "row",
  },
  modalLetterCell: {
    flex: 1,
    marginHorizontal: 3,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  modalLetterText: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
});

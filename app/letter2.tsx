import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, PanResponder } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SegmentKey = "shapes" | "size" | "patterns";

type Item = {
  label: string;
  preview: string;
};

type Letter2Variant = "pre-k" | "first-grade";

type Letter2ScreenProps = {
  variant?: Letter2Variant;
};

const SEGMENT_OPTIONS: SegmentKey[] = ["shapes", "size", "patterns"];
const SEGMENT_LABELS = ["shapes", "size", "patterns"];
const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;

const PRE_K_SHAPE_ITEMS: Item[] = [
  { label: "Circle", preview: "○" },
  { label: "Square", preview: "□" },
  { label: "Triangle", preview: "△" },
  { label: "Diamond", preview: "◇" },
  { label: "Star", preview: "★" },
  { label: "Hexagon", preview: "⬡" },
];

const FIRST_GRADE_SHAPE_ITEMS: Item[] = [
  { label: "Human", preview: "🧑" },
  { label: "Boy", preview: "👦" },
  { label: "Girl", preview: "👧" },
  { label: "Dog", preview: "🐶" },
  { label: "Cat", preview: "🐱" },
  { label: "Bird", preview: "🐦" },
];

const SIZE_ITEMS: Item[] = [
  { label: "small", preview: "S" },
  { label: "medium", preview: "M" },
  { label: "large", preview: "L" },
];

const PRE_K_PATTERN_ITEMS: Item[] = [
  { label: "11", preview: "11" },
  { label: "12", preview: "12" },
  { label: "ሀሀ", preview: "ሀሀ" },
  { label: "ሀ ሁ", preview: "ሀ ሁ" },
];

const FIRST_GRADE_PATTERN_ITEMS: Item[] = [
  { label: "1 2 3", preview: "1 2 3" },
  { label: "1 1 2", preview: "1 1 2" },
  { label: "1 2 1", preview: "1 2 1" },
  { label: "2 3 1", preview: "2 3 1" },
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

const SIZE_PREVIEW = [62, 92, 124];

const getSegmentIndexFromParam = (segment: string | string[] | undefined) => {
  const value = Array.isArray(segment) ? segment[0] : segment;

  if (!value) {
    return 0;
  }

  const normalized = value.toLowerCase() === "sizes" ? "size" : value.toLowerCase();
  const index = SEGMENT_OPTIONS.indexOf(normalized as SegmentKey);

  return index >= 0 ? index : 0;
};

export default function Letter2Screen({ variant = "first-grade" }: Letter2ScreenProps) {
  const params = useLocalSearchParams<{ segment?: string | string[] }>();
  const [segmentIndex, setSegmentIndex] = useState(() => getSegmentIndexFromParam(params.segment));
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Record<SegmentKey, number>>({
    shapes: 0,
    size: 0,
    patterns: 0,
  });

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const shapeItems = variant === "pre-k" ? PRE_K_SHAPE_ITEMS : FIRST_GRADE_SHAPE_ITEMS;
  const patternItems = variant === "pre-k" ? PRE_K_PATTERN_ITEMS : FIRST_GRADE_PATTERN_ITEMS;
  const itemGroups: Record<SegmentKey, Item[]> = useMemo(
    () => ({
      shapes: shapeItems,
      size: SIZE_ITEMS,
      patterns: patternItems,
    }),
    [shapeItems, patternItems],
  );

  useEffect(() => {
    setSegmentIndex(getSegmentIndexFromParam(params.segment));
  }, [params.segment]);

  const currentSegment = SEGMENT_OPTIONS[segmentIndex];
  const currentItems = itemGroups[currentSegment];
  const currentIndex = selectedIndices[currentSegment];
  const currentItem = currentItems[currentIndex];
  const selectedShape = shapeItems[selectedIndices.shapes];
  const selectedSize = SIZE_ITEMS[selectedIndices.size];
  const selectedPattern = patternItems[selectedIndices.patterns].preview;
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < currentItems.length - 1;

  const segmentBottom = Math.max(insets.bottom + 8, 14);
  const navigationBottom = segmentBottom + 56;
  const plusTop = insets.top + 12;
  const pickerTop = plusTop + 50;

  const setCurrentIndex = (nextIndex: number) => {
    setSelectedIndices((current) => ({ ...current, [currentSegment]: nextIndex }));
  };

  const goBack = () => {
    if (!canGoBack) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (!canGoNext) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const previewText =
    currentSegment === "size"
      ? selectedShape.preview
      : currentSegment === "patterns"
        ? variant === "pre-k"
          ? `${selectedPattern} ${selectedPattern} ${selectedPattern}`
          : `${selectedPattern}   ${selectedPattern}`
        : currentItem.preview;

  const previewLabel =
    currentSegment === "size" ? `${selectedShape.label} • ${selectedSize.label}` : currentItem.label;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < SWIPE_UP_THRESHOLD) {
            setSelectedIndices((current) => {
              const max = itemGroups[currentSegment].length;
              const nextIndex = (current[currentSegment] + 1) % max;
              return { ...current, [currentSegment]: nextIndex };
            });
          } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
            setSelectedIndices((current) => {
              const max = itemGroups[currentSegment].length;
              const nextIndex = (current[currentSegment] - 1 + max) % max;
              return { ...current, [currentSegment]: nextIndex };
            });
          }
        },
      }),
    [currentSegment, itemGroups],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.screenBg }]} edges={[]}>
      <View style={styles.screen} {...panResponder.panHandlers}>
        <View style={[styles.leftColumn, { backgroundColor: colors.columnBg }]}>
          {currentItems.map((item, index) => {
            const isActive = index === currentIndex;

            return (
              <Pressable
                key={`${currentSegment}-${item.label}`}
                onPress={() => setCurrentIndex(index)}
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
                  {item.preview}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.mainArea}>
          {currentSegment === "size" ? (
            <Pressable
              onPress={() => setShowShapePicker((current) => !current)}
              style={[styles.plusButton, { top: plusTop, backgroundColor: colors.activeItemBg }]}
            >
              <Text style={[styles.plusButtonText, { color: colors.activeItemText }]}>+</Text>
            </Pressable>
          ) : null}

          {currentSegment === "size" && showShapePicker ? (
            <View style={[styles.shapePicker, { top: pickerTop, backgroundColor: colors.columnBg }]}>
              {shapeItems.map((shape, index) => {
                const isActive = selectedIndices.shapes === index;

                return (
                  <Pressable
                    key={shape.label}
                    onPress={() => {
                      setSelectedIndices((current) => ({ ...current, shapes: index }));
                      setShowShapePicker(false);
                    }}
                    style={[styles.shapePickerItem, isActive && { backgroundColor: colors.activeItemBg }]}
                  >
                    <Text
                      style={[
                        styles.shapePickerItemText,
                        { color: colors.itemText },
                        isActive && { color: colors.activeItemText },
                      ]}
                    >
                      {shape.preview} {shape.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <Text
            style={[
              styles.mainPreview,
              { color: colors.mainText },
              currentSegment === "size" && {
                fontSize: SIZE_PREVIEW[selectedIndices.size],
                lineHeight: SIZE_PREVIEW[selectedIndices.size] + 12,
              },
              currentSegment === "patterns" && styles.patternPreview,
            ]}
          >
            {previewText}
          </Text>
          {currentSegment !== "patterns" ? (
            <Text style={[styles.mainLabel, { color: colors.hintText }]}>{previewLabel}</Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.leftNavigation, { bottom: navigationBottom }]}>
        <Pressable
          onPress={goBack}
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
          onPress={goNext}
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

      <SegmentedControl
        values={SEGMENT_LABELS}
        selectedIndex={segmentIndex}
        onChange={(event) => {
          const nextIndex = event.nativeEvent.selectedSegmentIndex;
          setSegmentIndex(nextIndex);
          if (nextIndex !== 1) {
            setShowShapePicker(false);
          }
        }}
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
  leftColumn: {
    width: 88,
    paddingTop: 64,
    paddingBottom: 24,
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
    fontSize: 22,
    fontWeight: "700",
  },
  leftItemTextActive: {
    color: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  plusButton: {
    position: "absolute",
    top: 20,
    right: 10,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 12,
  },
  plusButtonText: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 30,
  },
  shapePicker: {
    position: "absolute",
    top: 70,
    right: 10,
    width: 160,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    zIndex: 12,
  },
  shapePickerItem: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  shapePickerItemText: {
    fontSize: 14,
    fontWeight: "700",
  },
  mainPreview: {
    marginTop: 14,
    fontSize: 94,
    fontWeight: "800",
    lineHeight: 108,
  },
  patternPreview: {
    fontSize: 44,
    lineHeight: 58,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  mainLabel: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
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

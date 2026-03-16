import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, PanResponder } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import ColorsOne from "./colors1";
import ColorsTwo from "./colors2";
import ColorsThree from "./colors3";
import { SIMPLE_COLORS, type ColorItem } from "./(tabs)/colors";

type SegmentKey = "colors" | "shapes" | "size";
type NonColorSegmentKey = "shapes" | "size";

type Item = {
  label: string;
  preview: string;
  filledPreview?: string;
};

type Letter2Variant = "pre-k" | "first-grade";

type Letter2ScreenProps = {
  variant?: Letter2Variant;
};

const SEGMENT_OPTIONS: SegmentKey[] = ["colors", "shapes", "size"];
const SEGMENT_LABELS = ["colors", "shapes", "size"];
const COLOR_TABS = [ColorsOne, ColorsTwo, ColorsThree];
const REQUIRED_TWO_COLOR_MIXES = 3;
const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;

const PRE_K_SHAPE_ITEMS: Item[] = [
  { label: "ክብ", preview: "○", filledPreview: "●" },
  { label: "ካሬ", preview: "□", filledPreview: "■" },
  { label: "ስሉስ ኩርናዕ", preview: "△", filledPreview: "▲" },
  { label: "ሮምብ", preview: "◇", filledPreview: "◆" },
  { label: "ኮኾብ", preview: "★", filledPreview: "★" },
  { label: "ሽዱሽተ ኩርናዕ", preview: "⬡", filledPreview: "⬢" },
];

const FIRST_GRADE_SHAPE_ITEMS: Item[] = [
  { label: "ሰብ", preview: "🧑" },
  { label: "ወዲ", preview: "👦" },
  { label: "ጓል", preview: "👧" },
  { label: "ከልቢ", preview: "🐶" },
  { label: "ድሙ", preview: "🐱" },
  { label: "ዑፍ", preview: "🐦" },
];

const SIZE_ITEMS: Item[] = [
  { label: "ንእሽቶ", preview: "S" },
  { label: "ማእከላይ", preview: "M" },
  { label: "ዓብዪ", preview: "L" },
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

  const normalized = value.toLowerCase();
  const aliasMap: Record<string, SegmentKey> = {
    colors: "colors",
    color: "colors",
    patterns: "colors",
    pattern: "colors",
    shapes: "shapes",
    shape: "shapes",
    size: "size",
    sizes: "size",
  };
  const normalizedValue = aliasMap[normalized] ?? "colors";
  const index = SEGMENT_OPTIONS.indexOf(normalizedValue);

  return index >= 0 ? index : 0;
};

export default function Letter2Screen({ variant = "first-grade" }: Letter2ScreenProps) {
  const params = useLocalSearchParams<{ segment?: string | string[] }>();
  const [segmentIndex, setSegmentIndex] = useState(() => getSegmentIndexFromParam(params.segment));
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showShapeColorPicker, setShowShapeColorPicker] = useState(false);
  const [selectedShapeColorValue, setSelectedShapeColorValue] = useState<string | null>(null);
  const [colorPageIndex, setColorPageIndex] = useState(0);
  const [baseMixedColors, setBaseMixedColors] = useState<ColorItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Record<NonColorSegmentKey, number>>({
    shapes: 0,
    size: 0,
  });

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const shapeItems = variant === "pre-k" ? PRE_K_SHAPE_ITEMS : FIRST_GRADE_SHAPE_ITEMS;
  const itemGroups: Record<NonColorSegmentKey, Item[]> = useMemo(
    () => ({
      shapes: shapeItems,
      size: SIZE_ITEMS,
    }),
    [shapeItems],
  );

  useEffect(() => {
    setSegmentIndex(getSegmentIndexFromParam(params.segment));
  }, [params.segment]);

  const currentSegment = SEGMENT_OPTIONS[segmentIndex];
  const currentNonColorSegment: NonColorSegmentKey = currentSegment === "size" ? "size" : "shapes";
  const currentItems = itemGroups[currentNonColorSegment];
  const currentIndex = selectedIndices[currentNonColorSegment];
  const currentItem = currentItems[currentIndex];
  const selectedShape = shapeItems[selectedIndices.shapes];
  const selectedSize = SIZE_ITEMS[selectedIndices.size];
  const segmentBottom = Math.max(insets.bottom + 8, 14);
  const navigationBottom = segmentBottom + 56;
  const plusTop = insets.top + 12;
  const pickerTop = plusTop + 50;
  const shapeColor = selectedShapeColorValue ?? colors.mainText;

  const ActiveColorsScreen = COLOR_TABS[colorPageIndex];
  const canGoBackColors = colorPageIndex > 0;
  const hasCompletedTwoColorMixes = baseMixedColors.length >= REQUIRED_TWO_COLOR_MIXES;
  const canGoNextColors = colorPageIndex < COLOR_TABS.length - 1 && (colorPageIndex !== 1 || hasCompletedTwoColorMixes);
  const canGoBackItems = currentIndex > 0;
  const canGoNextItems = currentIndex < currentItems.length - 1;
  const canGoBack = currentSegment === "colors" ? canGoBackColors : canGoBackItems;
  const canGoNext = currentSegment === "colors" ? canGoNextColors : canGoNextItems;

  const handleAddBaseMixedColor = useCallback((nextColor: ColorItem) => {
    setBaseMixedColors((current) => {
      if (current.some((color) => color.value.toLowerCase() === nextColor.value.toLowerCase())) {
        return current;
      }

      return [...current, nextColor];
    });
  }, []);

  const setCurrentIndex = (nextIndex: number) => {
    if (currentSegment === "colors") {
      return;
    }

    setSelectedIndices((current) => ({ ...current, [currentNonColorSegment]: nextIndex }));
  };

  const goBack = () => {
    if (!canGoBack) {
      return;
    }

    if (currentSegment === "colors") {
      setColorPageIndex((current) => current - 1);
      return;
    }

    setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (!canGoNext) {
      return;
    }

    if (currentSegment === "colors") {
      setColorPageIndex((current) => current + 1);
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const previewText =
    currentSegment === "size"
      ? selectedShape.preview
      : currentSegment === "shapes" && selectedShapeColorValue
        ? currentItem.filledPreview ?? currentItem.preview
        : currentItem.preview;
  const previewLabel =
    currentSegment === "size" ? `${selectedShape.label} • ${selectedSize.label}` : currentItem.label;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          currentSegment !== "colors" &&
          Math.abs(gestureState.dy) > 8 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderRelease: (_, gestureState) => {
          if (currentSegment === "colors") {
            return;
          }

          if (gestureState.dy < SWIPE_UP_THRESHOLD) {
            setSelectedIndices((current) => {
              const max = itemGroups[currentNonColorSegment].length;
              const nextIndex = (current[currentNonColorSegment] + 1) % max;
              return { ...current, [currentNonColorSegment]: nextIndex };
            });
          } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
            setSelectedIndices((current) => {
              const max = itemGroups[currentNonColorSegment].length;
              const nextIndex = (current[currentNonColorSegment] - 1 + max) % max;
              return { ...current, [currentNonColorSegment]: nextIndex };
            });
          }
        },
      }),
    [currentSegment, currentNonColorSegment, itemGroups],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.screenBg }]} edges={[]}>
      {currentSegment === "colors" ? (
        <ActiveColorsScreen
          hideNavigation
          baseMixedColors={baseMixedColors}
          onAddBaseMixedColor={colorPageIndex === 1 ? handleAddBaseMixedColor : undefined}
        />
      ) : (
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
                onPress={() => {
                  setShowShapePicker((current) => !current);
                  setShowShapeColorPicker(false);
                }}
                style={[styles.plusButton, { top: plusTop, backgroundColor: colors.activeItemBg }]}
              >
                <Text style={[styles.plusButtonText, { color: colors.activeItemText }]}>+</Text>
              </Pressable>
            ) : null}

            {currentSegment === "shapes" ? (
              <Pressable
                onPress={() => {
                  setShowShapeColorPicker((current) => !current);
                  setShowShapePicker(false);
                }}
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

            {currentSegment === "shapes" && showShapeColorPicker ? (
              <View style={[styles.shapePicker, { top: pickerTop, backgroundColor: colors.columnBg }]}>
                {SIMPLE_COLORS.map((colorOption) => {
                  const isActive = selectedShapeColorValue === colorOption.value;
                  const colorHex = colorOption.value;

                  return (
                    <Pressable
                      key={`shape-color-${colorOption.value}`}
                      onPress={() => {
                        setSelectedShapeColorValue(colorOption.value);
                        setShowShapeColorPicker(false);
                      }}
                      style={[styles.colorPickerItem, isActive && { backgroundColor: colors.activeItemBg }]}
                    >
                      <View style={[styles.colorPickerSwatch, { backgroundColor: colorHex }]} />
                      <Text
                        style={[
                          styles.shapePickerItemText,
                          { color: colors.itemText },
                          isActive && { color: colors.activeItemText },
                        ]}
                      >
                        {colorOption.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <Text
              style={[
                styles.mainPreview,
                { color: currentSegment === "shapes" ? shapeColor : colors.mainText },
                currentSegment === "size" && {
                  fontSize: SIZE_PREVIEW[selectedIndices.size],
                  lineHeight: SIZE_PREVIEW[selectedIndices.size] + 12,
                },
              ]}
            >
              {previewText}
            </Text>

            <Text style={[styles.mainLabel, { color: colors.hintText }]}>{previewLabel}</Text>
          </View>
        </View>
      )}

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
          if (nextIndex !== SEGMENT_OPTIONS.indexOf("size")) {
            setShowShapePicker(false);
          }
          if (nextIndex !== SEGMENT_OPTIONS.indexOf("shapes")) {
            setShowShapeColorPicker(false);
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
  colorPickerItem: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorPickerSwatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#FFFFFF55",
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

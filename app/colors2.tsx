import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, PanResponder } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SIMPLE_COLORS, type ColorItem, type ColorsScreenProps } from "@/components/colors-screen";

const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;

const LIGHT_COLORS = {
  screenBg: "#F3F4F6",
  columnBg: "#E5E7EB",
  titleText: "#111827",
  hintText: "#4B5563",
  activeBorder: "#0F172A",
  activeItemText: "#FFFFFF",
};

const DARK_COLORS = {
  screenBg: "#111827",
  columnBg: "#1F2937",
  titleText: "#F9FAFB",
  hintText: "#9CA3AF",
  activeBorder: "#F9FAFB",
  activeItemText: "#111827",
};

const normalizeHex = (value: string) => {
  const hex = value.replace("#", "").trim();

  if (hex.length === 3) {
    return hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  return hex;
};

const hexToRgb = (value: string) => {
  const normalized = normalizeHex(value);

  if (normalized.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

const buildMixKey = (first: ColorItem, second: ColorItem) =>
  [first.value.toLowerCase(), second.value.toLowerCase()].sort().join("|");

const PRIMARY_MIX_RESULTS: Record<string, { label: string; value: string }> = {
  [buildMixKey(SIMPLE_COLORS[1], SIMPLE_COLORS[2])]: { label: "ብጫ", value: "#FFFF00" },
  [buildMixKey(SIMPLE_COLORS[1], SIMPLE_COLORS[0])]: { label: "ማጀንታ", value: "#FF00FF" },
  [buildMixKey(SIMPLE_COLORS[0], SIMPLE_COLORS[2])]: { label: "ሳያን", value: "#00FFFF" },
};

const mixColors = (first: ColorItem, second: ColorItem): ColorItem => {
  const key = buildMixKey(first, second);
  const knownPrimaryMix = PRIMARY_MIX_RESULTS[key];

  if (knownPrimaryMix) {
    return {
      label: knownPrimaryMix.label,
      value: knownPrimaryMix.value,
    };
  }

  const firstRgb = hexToRgb(first.value);
  const secondRgb = hexToRgb(second.value);
  const mixedValue = rgbToHex(
    Math.round((firstRgb.r + secondRgb.r) / 2),
    Math.round((firstRgb.g + secondRgb.g) / 2),
    Math.round((firstRgb.b + secondRgb.b) / 2),
  );

  return {
    label: `${first.label} + ${second.label}`,
    value: mixedValue,
  };
};

export default function ColorsTwo({
  hideNavigation = false,
  baseMixedColors,
  onAddBaseMixedColor,
}: ColorsScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMixColors, setSelectedMixColors] = useState<[ColorItem | null, ColorItem | null]>([null, null]);
  const [pickerTarget, setPickerTarget] = useState<0 | 1 | null>(null);
  const [localMixedColors, setLocalMixedColors] = useState<ColorItem[]>([]);
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const mixedColors = baseMixedColors ?? localMixedColors;

  const colorOptions = useMemo<ColorItem[]>(() => [...SIMPLE_COLORS, ...mixedColors], [mixedColors]);
  const canGoBack = activeIndex > 0;
  const canGoNext = activeIndex < colorOptions.length - 1;

  useEffect(() => {
    if (activeIndex >= colorOptions.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, colorOptions.length]);

  const mixedPreview = useMemo(() => {
    const [firstColor, secondColor] = selectedMixColors;

    if (!firstColor || !secondColor) {
      return null;
    }

    if (firstColor.value.toLowerCase() === secondColor.value.toLowerCase()) {
      return null;
    }

    return mixColors(firstColor, secondColor);
  }, [selectedMixColors]);

  useEffect(() => {
    if (!mixedPreview) {
      return;
    }

    if (onAddBaseMixedColor) {
      onAddBaseMixedColor(mixedPreview);
      return;
    }

    setLocalMixedColors((current) => {
      if (current.some((item) => item.value.toLowerCase() === mixedPreview.value.toLowerCase())) {
        return current;
      }

      return [...current, mixedPreview];
    });
  }, [mixedPreview, onAddBaseMixedColor]);

  const goToPrevious = () => {
    if (!canGoBack) {
      return;
    }

    setActiveIndex((current) => current - 1);
  };

  const goToNext = () => {
    if (!canGoNext) {
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < SWIPE_UP_THRESHOLD) {
            setActiveIndex((current) => (current + 1) % colorOptions.length);
          } else if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
            setActiveIndex((current) => (current - 1 + colorOptions.length) % colorOptions.length);
          }
        },
      }),
    [colorOptions.length],
  );

  const selectMixColor = (slot: 0 | 1, color: ColorItem) => {
    setSelectedMixColors((current) => {
      const otherSlot = slot === 0 ? 1 : 0;
      const otherColor = current[otherSlot];

      if (otherColor && otherColor.value.toLowerCase() === color.value.toLowerCase()) {
        return current;
      }

      const next: [ColorItem | null, ColorItem | null] = [...current] as [ColorItem | null, ColorItem | null];
      next[slot] = color;
      return next;
    });
    setPickerTarget(null);
  };

  const activeColor = colorOptions[activeIndex] ?? colorOptions[0];
  const previewColor = mixedPreview?.value ?? activeColor.value;
  const previewLabel = mixedPreview?.label ?? activeColor.label;
  const firstMixColorValue = selectedMixColors[0]?.value ?? themeColors.activeBorder;
  const secondMixColorValue = selectedMixColors[1]?.value ?? themeColors.activeBorder;

  return (
    <View style={[styles.screen, { backgroundColor: themeColors.screenBg }]} {...panResponder.panHandlers}>
      <View
        style={[
          styles.leftColumn,
          { backgroundColor: themeColors.columnBg },
          hideNavigation && styles.leftColumnWithoutNavigation,
        ]}
      >
        <View style={styles.subjectList}>
          {SIMPLE_COLORS.map((color, index) => {
            const isActive = index === activeIndex;
            const colorHex = color.value;

            return (
              <Pressable
                key={`primary-${color.value}`}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.colorItem,
                  { backgroundColor: colorHex },
                  isActive && styles.colorItemActive,
                  isActive && { borderColor: themeColors.activeBorder },
                ]}
              >
                {isActive ? <Text style={styles.activeCheck}>✓</Text> : null}
              </Pressable>
            );
          })}

          {mixedColors.length > 0 ? <View style={[styles.mixedDivider, { backgroundColor: themeColors.hintText }]} /> : null}

          {mixedColors.map((color, index) => {
            const itemIndex = SIMPLE_COLORS.length + index;
            const isActive = itemIndex === activeIndex;
            const colorHex = color.value;

            return (
              <Pressable
                key={`mixed-${color.value}`}
                onPress={() => setActiveIndex(itemIndex)}
                style={[
                  styles.colorItem,
                  { backgroundColor: colorHex },
                  isActive && styles.colorItemActive,
                  isActive && { borderColor: themeColors.activeBorder },
                ]}
              >
                {isActive ? <Text style={styles.activeCheck}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        {!hideNavigation ? (
          <View style={styles.columnNavigation}>
            <Pressable
              onPress={goToPrevious}
              disabled={!canGoBack}
              style={[
                styles.arrowButton,
                { backgroundColor: themeColors.activeBorder },
                !canGoBack && styles.arrowButtonDisabled,
              ]}
            >
              <Text style={[styles.arrowText, { color: themeColors.screenBg }]}>↑</Text>
            </Pressable>

            <Pressable
              onPress={goToNext}
              disabled={!canGoNext}
              style={[
                styles.arrowButton,
                { backgroundColor: themeColors.activeBorder },
                !canGoNext && styles.arrowButtonDisabled,
              ]}
            >
              <Text style={[styles.arrowText, { color: themeColors.screenBg }]}>↓</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.mainArea}>
        <View style={styles.mixControls}>
          <View style={styles.mixSlot}>
            <Pressable
              onPress={() => setPickerTarget((current) => (current === 0 ? null : 0))}
              style={[
                styles.plusButton,
                { backgroundColor: firstMixColorValue },
                selectedMixColors[0] && { borderWidth: 2, borderColor: themeColors.activeBorder },
              ]}
            >
              {!selectedMixColors[0] ? (
                <Text style={[styles.plusButtonText, { color: themeColors.screenBg }]}>+</Text>
              ) : null}
            </Pressable>
          </View>

          <Text style={[styles.operator, { color: themeColors.titleText }]}>+</Text>

          <View style={styles.mixSlot}>
            <Pressable
              onPress={() => setPickerTarget((current) => (current === 1 ? null : 1))}
              style={[
                styles.plusButton,
                { backgroundColor: secondMixColorValue },
                selectedMixColors[1] && { borderWidth: 2, borderColor: themeColors.activeBorder },
              ]}
            >
              {!selectedMixColors[1] ? (
                <Text style={[styles.plusButtonText, { color: themeColors.screenBg }]}>+</Text>
              ) : null}
            </Pressable>
          </View>
        </View>

        {pickerTarget !== null ? (
          <View
            style={[
              styles.colorPicker,
              { backgroundColor: themeColors.columnBg, borderColor: themeColors.activeBorder },
              pickerTarget === 0 ? styles.colorPickerLeft : styles.colorPickerRight,
            ]}
          >
            {SIMPLE_COLORS.map((color) => {
              const otherSlot = pickerTarget === 0 ? 1 : 0;
              const otherSelected = selectedMixColors[otherSlot];
              const isDisabled =
                !!otherSelected && otherSelected.value.toLowerCase() === color.value.toLowerCase();
              const pickerColorHex = color.value;

              return (
                <Pressable
                  key={`picker-${color.value}`}
                  onPress={() => selectMixColor(pickerTarget, color)}
                  disabled={isDisabled}
                  style={[styles.colorPickerItem, isDisabled && styles.colorPickerItemDisabled]}
                >
                  <View
                    style={[styles.pickerSwatch, { backgroundColor: pickerColorHex }, isDisabled && styles.pickerSwatchDisabled]}
                  />
                  <Text style={[styles.pickerText, { color: themeColors.titleText }, isDisabled && styles.pickerTextDisabled]}>
                    {color.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.contentSection}>
          <Text style={[styles.title, { color: themeColors.titleText }]}>{previewLabel}</Text>
          <View style={[styles.previewCircle, { backgroundColor: previewColor }]} />
          <Text style={[styles.hint, { color: themeColors.hintText }]}>
            {mixedPreview ? "Mixed color" : "Select two colors to mix"}
          </Text>
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
  leftColumn: {
    width: 90,
    paddingTop: 64,
    paddingBottom: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftColumnWithoutNavigation: {
    justifyContent: "flex-start",
  },
  subjectList: {
    alignItems: "center",
  },
  mixedDivider: {
    width: 42,
    height: 1,
    opacity: 0.5,
    marginVertical: 4,
  },
  colorItem: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorItemActive: {
    borderColor: "#0F172A",
    transform: [{ scale: 1.08 }],
  },
  activeCheck: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  mainArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mixControls: {
    width: "100%",
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 12,
  },
  mixSlot: {
    alignItems: "center",
    minWidth: 92,
  },
  plusButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButtonText: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 30,
  },
  operator: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: "800",
  },
  colorPicker: {
    position: "absolute",
    top: 86,
    width: 170,
    borderWidth: 2,
    borderRadius: 12,
    padding: 6,
    zIndex: 20,
  },
  colorPickerLeft: {
    left: 18,
  },
  colorPickerRight: {
    right: 18,
  },
  colorPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 8,
  },
  colorPickerItemDisabled: {
    opacity: 0.35,
  },
  pickerSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF55",
  },
  pickerSwatchDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: "700",
  },
  pickerTextDisabled: {
    textDecorationLine: "line-through",
  },
  contentSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  previewCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  hint: {
    marginTop: 10,
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

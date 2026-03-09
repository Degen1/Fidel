import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, PanResponder } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ColorItem = {
  label: string;
  value: string;
};

export const SIMPLE_COLORS: ColorItem[] = [
  { label: "ሰማያዊ", value: "#3B82F6" },
  { label: "ቀይሕ", value: "#EF4444" },
  { label: "ቀጠልያ", value: "#22C55E" },
];

export const EXTENDED_COLORS: ColorItem[] = [
  ...SIMPLE_COLORS,
  { label: "ኣራንሺ", value: "#F97316" },
  { label: "ጸሊም", value: "#000000" },
  { label: "ግራጫ", value: "#9CA3AF" },
  { label: "ብጫ", value: "#EAB308" },
  { label: "ጻዕዳ", value: "#FFFFFF" },
];

const SWIPE_UP_THRESHOLD = -40;
const SWIPE_DOWN_THRESHOLD = 40;
const LIGHT_COLORS = {
  screenBg: "#F3F4F6",
  columnBg: "#E5E7EB",
  titleText: "#111827",
  hintText: "#4B5563",
  activeBorder: "#0F172A",
};
const DARK_COLORS = {
  screenBg: "#111827",
  columnBg: "#1F2937",
  titleText: "#F9FAFB",
  hintText: "#9CA3AF",
  activeBorder: "#F9FAFB",
};

export type ColorsScreenProps = {
  hideNavigation?: boolean;
  palette?: ColorItem[];
};

export default function ColorsScreen({ hideNavigation = false, palette = EXTENDED_COLORS }: ColorsScreenProps) {
  const colorOptions = palette.length > 0 ? palette : EXTENDED_COLORS;
  const [activeIndex, setActiveIndex] = useState(0);
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const canGoBack = activeIndex > 0;
  const canGoNext = activeIndex < colorOptions.length - 1;

  useEffect(() => {
    if (activeIndex >= colorOptions.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, colorOptions.length]);

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

  const activeColor = colorOptions[activeIndex] ?? colorOptions[0];
  const activeLabel = useMemo(() => activeColor.label, [activeColor]);

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
          {colorOptions.map((color, index) => {
            const isActive = index === activeIndex;

            return (
              <Pressable
                key={`${color.value}-${index}`}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.colorItem,
                  { backgroundColor: color.value },
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
        <View style={styles.contentSection}>
          <Text style={[styles.title, { color: themeColors.titleText }]}>{activeLabel}</Text>
          <View style={[styles.previewCircle, { backgroundColor: activeColor.value }]} />
          <Text style={[styles.hint, { color: themeColors.hintText }]}>ንላዕሊ ድፍኡ</Text>
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
    paddingHorizontal: 20,
  },
  contentSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
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

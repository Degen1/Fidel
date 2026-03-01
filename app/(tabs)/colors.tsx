import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const COLORS = [
  { label: "Red", value: "#EF4444" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#22C55E" },
  { label: "Orange", value: "#F97316" },
  { label: "Purple", value: "#A855F7" },
  { label: "Teal", value: "#14B8A6" },
  { label: "Yellow", value: "#EAB308" },
];

export default function ColorsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeColor = COLORS[activeIndex];
  const activeLabel = useMemo(() => activeColor.label, [activeColor]);

  return (
    <View style={styles.screen}>
      <View style={styles.leftColumn}>
        {COLORS.map((color, index) => {
          const isActive = index === activeIndex;

          return (
            <Pressable
              key={color.value}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.colorItem,
                { backgroundColor: color.value },
                isActive && styles.colorItemActive,
              ]}
            >
              {isActive ? <Text style={styles.activeCheck}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mainArea}>
        <Text style={styles.title}>Colors</Text>
        <View style={[styles.previewCircle, { backgroundColor: activeColor.value }]} />
        <Text style={styles.previewLabel}>{activeLabel}</Text>
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
  leftColumn: {
    width: 90,
    paddingTop: 64,
    paddingBottom: 24,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    color: "#111827",
    fontWeight: "700",
    marginBottom: 20,
  },
  previewCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  previewLabel: {
    marginTop: 16,
    fontSize: 28,
    color: "#111827",
    fontWeight: "700",
  },
});

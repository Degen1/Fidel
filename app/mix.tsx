import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type ShapeName = "circle" | "square" | "triangle" | "diamond";

const SHAPES: { label: string; value: ShapeName }[] = [
  { label: "Circle", value: "circle" },
  { label: "Square", value: "square" },
  { label: "Triangle", value: "triangle" },
  { label: "Diamond", value: "diamond" },
];

const COLORS = [
  { label: "Red", value: "#EF4444" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#22C55E" },
  { label: "Orange", value: "#F97316" },
  { label: "Purple", value: "#A855F7" },
  { label: "Teal", value: "#14B8A6" },
  { label: "Yellow", value: "#EAB308" },
];

export default function ShapesColorsScreen() {
  const [shapeIndex, setShapeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const activeShape = SHAPES[shapeIndex];
  const activeColor = COLORS[colorIndex];
  const previewLabel = useMemo(
    () => `${activeColor.label} ${activeShape.label}`,
    [activeColor.label, activeShape.label],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.leftColumn}>
        <Text style={styles.columnTitle}>Colors</Text>
        {COLORS.map((color, index) => {
          const isActive = index === colorIndex;

          return (
            <Pressable
              key={color.value}
              onPress={() => setColorIndex(index)}
              style={[
                styles.colorItem,
                { backgroundColor: color.value },
                isActive && styles.colorItemActive,
              ]}
            >
              {isActive ? <Text style={styles.checkText}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mainArea}>
        <Text style={styles.title}>Mix & Match</Text>
        <View style={styles.previewCanvas}>{renderShape(activeShape.value, activeColor.value)}</View>
        <Text style={styles.previewLabel}>{previewLabel}</Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.columnTitle}>Shapes</Text>
        {SHAPES.map((shape, index) => {
          const isActive = index === shapeIndex;

          return (
            <Pressable
              key={shape.value}
              onPress={() => setShapeIndex(index)}
              style={[styles.shapeItem, isActive && styles.shapeItemActive]}
            >
              <Text style={[styles.shapeText, isActive && styles.shapeTextActive]}>{shape.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function renderShape(shape: ShapeName, color: string) {
  if (shape === "triangle") {
    return (
      <View
        style={[
          styles.triangle,
          {
            borderBottomColor: color,
          },
        ]}
      />
    );
  }

  if (shape === "diamond") {
    return <View style={[styles.diamond, { backgroundColor: color }]} />;
  }

  if (shape === "square") {
    return <View style={[styles.square, { backgroundColor: color }]} />;
  }

  return <View style={[styles.circle, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
  },
  leftColumn: {
    width: 100,
    paddingTop: 56,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  rightColumn: {
    width: 90,
    paddingTop: 56,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  shapeItem: {
    width: 80,
    height: 48,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1D5DB",
  },
  shapeItemActive: {
    backgroundColor: "#0EA5E9",
  },
  shapeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  shapeTextActive: {
    color: "#FFFFFF",
  },
  colorItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorItemActive: {
    borderColor: "#0F172A",
    transform: [{ scale: 1.08 }],
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  previewCanvas: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  previewLabel: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  square: {
    width: 150,
    height: 150,
    borderRadius: 14,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 75,
    borderRightWidth: 75,
    borderBottomWidth: 135,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  diamond: {
    width: 114,
    height: 114,
    transform: [{ rotate: "45deg" }],
    borderRadius: 12,
  },
});

import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type GameShape = {
  id: string;
  label: string;
  symbol: string;
};

const GAME_SHAPES: GameShape[] = [
  { id: "circle", label: "ክብ", symbol: "●" },
  { id: "square", label: "ካሬ", symbol: "■" },
  { id: "triangle", label: "ስሉስ ኩርናዕ", symbol: "▲" },
  { id: "diamond", label: "ሮምብ", symbol: "◆" },
  { id: "star", label: "ኮኾብ", symbol: "★" },
  { id: "hexagon", label: "ሽዱሽተ ኩርናዕ", symbol: "⬢" },
];

const TOTAL_ROUNDS = 8;
const LIGHT_COLORS = {
  screenBg: "#F3F4F6",
  panelBg: "#FFFFFF",
  panelBorder: "#D1D5DB",
  text: "#111827",
  secondaryText: "#4B5563",
  buttonBg: "#2563EB",
  buttonText: "#FFFFFF",
};
const DARK_COLORS = {
  screenBg: "#111827",
  panelBg: "#1F2937",
  panelBorder: "#374151",
  text: "#F9FAFB",
  secondaryText: "#9CA3AF",
  buttonBg: "#38BDF8",
  buttonText: "#0F172A",
};

const getRandomShapeIndex = (excludeIndex?: number) => {
  let nextIndex = Math.floor(Math.random() * GAME_SHAPES.length);

  while (excludeIndex !== undefined && GAME_SHAPES.length > 1 && nextIndex === excludeIndex) {
    nextIndex = Math.floor(Math.random() * GAME_SHAPES.length);
  }

  return nextIndex;
};

export default function Game3Screen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetShapeIndex, setTargetShapeIndex] = useState(() => getRandomShapeIndex());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const targetShape = GAME_SHAPES[targetShapeIndex];

  const handleShapePress = (index: number) => {
    if (roundComplete || gameComplete) {
      return;
    }

    if (index === targetShapeIndex) {
      setScore((current) => current + 1);
      setFeedback("correct");
      setRoundComplete(true);

      if (round >= TOTAL_ROUNDS) {
        setGameComplete(true);
      }

      return;
    }

    setFeedback("wrong");
  };

  const handleNextRound = () => {
    if (gameComplete || round >= TOTAL_ROUNDS) {
      return;
    }

    setRound((current) => current + 1);
    setTargetShapeIndex((current) => getRandomShapeIndex(current));
    setFeedback(null);
    setRoundComplete(false);
  };

  const handlePlayAgain = () => {
    setRound(1);
    setScore(0);
    setTargetShapeIndex(getRandomShapeIndex());
    setFeedback(null);
    setRoundComplete(false);
    setGameComplete(false);
  };

  const feedbackText = gameComplete
    ? `ጽቡቕ ስራሕ! ነጥቢ ${score}/${TOTAL_ROUNDS}`
    : feedback === "correct"
      ? "ትኽክል! ናብ ዝቕጽል ዙር ድፍእ።"
      : feedback === "wrong"
        ? "እንደገና ፈትን።"
        : "ዝሰማማዕ ቅርጺ ምረጽ።";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.screenBg }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.title, { color: colors.text }]}>ጸወታ ቅርጺ ቅድመ-ኬ</Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            ዙር {round}/{TOTAL_ROUNDS}
          </Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>ነጥቢ {score}</Text>
        </View>

        <View style={[styles.promptCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.promptLabel, { color: colors.secondaryText }]}>ነዚ ቅርጺ ምረጽ</Text>
          <Text style={[styles.promptSymbol, { color: colors.text }]}>{targetShape.symbol}</Text>
          <Text style={[styles.promptText, { color: colors.text }]}>{targetShape.label}</Text>
        </View>

        <View style={styles.grid}>
          {GAME_SHAPES.map((shape, index) => (
            <Pressable
              key={shape.id}
              onPress={() => handleShapePress(index)}
              style={({ pressed }) => [
                styles.shapeCard,
                {
                  backgroundColor: colors.panelBg,
                  borderColor: colors.panelBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.shapeCardSymbol, { color: colors.text }]}>{shape.symbol}</Text>
              <Text style={[styles.shapeCardText, { color: colors.secondaryText }]}>{shape.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text
          style={[
            styles.feedbackText,
            {
              color:
                feedback === "wrong" ? "#EF4444" : feedback === "correct" || gameComplete ? "#16A34A" : colors.text,
            },
          ]}
        >
          {feedbackText}
        </Text>

        {roundComplete && !gameComplete ? (
          <Pressable
            onPress={handleNextRound}
            style={[styles.actionButton, { backgroundColor: colors.buttonBg }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>ቀጻሊ ዙር</Text>
          </Pressable>
        ) : null}

        {gameComplete ? (
          <Pressable onPress={handlePlayAgain} style={[styles.actionButton, { backgroundColor: colors.buttonBg }]}>
            <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>እንደገና ተጻወት</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  metaText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 14,
  },
  promptLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  promptSymbol: {
    marginTop: 8,
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 76,
  },
  promptText: {
    fontSize: 22,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shapeCard: {
    width: "31.5%",
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  shapeCardSymbol: {
    fontSize: 34,
    fontWeight: "800",
  },
  shapeCardText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  feedbackText: {
    marginTop: 6,
    minHeight: 24,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },
  actionButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: "800",
  },
});

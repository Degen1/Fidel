import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type RoundPrompt = "bigger" | "smaller";
type Side = "left" | "right";
type RoundState = {
  leftSizeIndex: number;
  rightSizeIndex: number;
  prompt: RoundPrompt;
};

const SIZE_LEVELS = [
  { label: "ንእሽቶ", diameter: 72 },
  { label: "ማእከላይ", diameter: 106 },
  { label: "ዓብዪ", diameter: 140 },
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
  shapeFill: "#38BDF8",
};
const DARK_COLORS = {
  screenBg: "#111827",
  panelBg: "#1F2937",
  panelBorder: "#374151",
  text: "#F9FAFB",
  secondaryText: "#9CA3AF",
  buttonBg: "#38BDF8",
  buttonText: "#0F172A",
  shapeFill: "#60A5FA",
};

const getRandomIndex = (max: number, excludeIndex?: number) => {
  let index = Math.floor(Math.random() * max);

  while (excludeIndex !== undefined && max > 1 && index === excludeIndex) {
    index = Math.floor(Math.random() * max);
  }

  return index;
};

const buildRoundState = (): RoundState => {
  const leftSizeIndex = getRandomIndex(SIZE_LEVELS.length);
  const rightSizeIndex = getRandomIndex(SIZE_LEVELS.length, leftSizeIndex);
  const prompt: RoundPrompt = Math.random() > 0.5 ? "bigger" : "smaller";

  return { leftSizeIndex, rightSizeIndex, prompt };
};

const getCorrectSide = (roundState: RoundState): Side => {
  const leftSize = SIZE_LEVELS[roundState.leftSizeIndex].diameter;
  const rightSize = SIZE_LEVELS[roundState.rightSizeIndex].diameter;

  if (roundState.prompt === "bigger") {
    return leftSize > rightSize ? "left" : "right";
  }

  return leftSize < rightSize ? "left" : "right";
};

export default function Game4Screen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>(() => buildRoundState());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const handleSidePress = (side: Side) => {
    if (roundComplete || gameComplete) {
      return;
    }

    if (side === getCorrectSide(roundState)) {
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
    setRoundState(buildRoundState());
    setFeedback(null);
    setRoundComplete(false);
  };

  const handlePlayAgain = () => {
    setRound(1);
    setScore(0);
    setRoundState(buildRoundState());
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
        : "ትኽክለኛ ዓቐን ምረጽ።";

  const promptText = roundState.prompt === "bigger" ? "ዓብዪ ምረጽ" : "ንእሽቶ ምረጽ";
  const leftSize = SIZE_LEVELS[roundState.leftSizeIndex].diameter;
  const rightSize = SIZE_LEVELS[roundState.rightSizeIndex].diameter;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.screenBg }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.title, { color: colors.text }]}>ጸወታ ዓቐን ቅድመ-ኬ</Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            ዙር {round}/{TOTAL_ROUNDS}
          </Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>ነጥቢ {score}</Text>
        </View>

        <View style={[styles.promptCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.promptLabel, { color: colors.secondaryText }]}>{promptText}</Text>
        </View>

        <View style={styles.optionsRow}>
          <Pressable
            onPress={() => handleSidePress("left")}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: colors.panelBg,
                borderColor: colors.panelBorder,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.sizeCircle,
                {
                  width: leftSize,
                  height: leftSize,
                  borderRadius: leftSize / 2,
                  backgroundColor: colors.shapeFill,
                },
              ]}
            />
          </Pressable>

          <Pressable
            onPress={() => handleSidePress("right")}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: colors.panelBg,
                borderColor: colors.panelBorder,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.sizeCircle,
                {
                  width: rightSize,
                  height: rightSize,
                  borderRadius: rightSize / 2,
                  backgroundColor: colors.shapeFill,
                },
              ]}
            />
          </Pressable>
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
    fontSize: 28,
    fontWeight: "800",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    height: 220,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeCircle: {
    alignSelf: "center",
  },
  feedbackText: {
    marginTop: 16,
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

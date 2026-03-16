import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type GameColor = {
  id: string;
  label: string;
  hex: string;
};

type RoundState = {
  targetIndex: number;
  optionIndices: number[];
};

const GAME_COLORS: GameColor[] = [
  { id: "blue", label: "ሰማያዊ", hex: "#2563EB" },
  { id: "red", label: "ቀይሕ", hex: "#DC2626" },
  { id: "green", label: "ቀጠልያ", hex: "#16A34A" },
  { id: "yellow", label: "ብጫ", hex: "#EAB308" },
  { id: "magenta", label: "ማጀንታ", hex: "#DB2777" },
  { id: "cyan", label: "ሳያን", hex: "#06B6D4" },
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

const getRandomIndex = (excludeIndex?: number) => {
  let nextIndex = Math.floor(Math.random() * GAME_COLORS.length);

  while (excludeIndex !== undefined && GAME_COLORS.length > 1 && nextIndex === excludeIndex) {
    nextIndex = Math.floor(Math.random() * GAME_COLORS.length);
  }

  return nextIndex;
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

const buildRoundState = (excludeTarget?: number): RoundState => {
  const targetIndex = getRandomIndex(excludeTarget);
  const wrongOptions: number[] = [];

  while (wrongOptions.length < 2) {
    const candidate = getRandomIndex(targetIndex);
    if (!wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate);
    }
  }

  return {
    targetIndex,
    optionIndices: shuffle([targetIndex, ...wrongOptions]),
  };
};

export default function Game5Screen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>(() => buildRoundState());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const targetColor = GAME_COLORS[roundState.targetIndex];

  const handleOptionPress = (selectedColorIndex: number) => {
    if (roundComplete || gameComplete) {
      return;
    }

    if (selectedColorIndex === roundState.targetIndex) {
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
    setRoundState((current) => buildRoundState(current.targetIndex));
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
        : "ትኽክለኛ ቃል ምረጽ።";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.screenBg }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.title, { color: colors.text }]}>ጸወታ ሕብሪ-ቃል ቅድመ-ኬ</Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            ዙር {round}/{TOTAL_ROUNDS}
          </Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>ነጥቢ {score}</Text>
        </View>

        <View style={[styles.promptCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.promptLabel, { color: colors.secondaryText }]}>ንዝርአ ሕብሪ ዝሰማማዕ ቃል ምረጽ</Text>
          <View style={[styles.promptSwatch, { backgroundColor: targetColor.hex }]} />
        </View>

        <View style={styles.optionsContainer}>
          {roundState.optionIndices.map((optionIndex) => (
            <Pressable
              key={`option-${optionIndex}`}
              onPress={() => handleOptionPress(optionIndex)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.panelBg,
                  borderColor: colors.panelBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{GAME_COLORS[optionIndex].label}</Text>
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
    textAlign: "center",
    paddingHorizontal: 14,
  },
  promptSwatch: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#FFFFFFAA",
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 26,
    fontWeight: "800",
  },
  feedbackText: {
    marginTop: 10,
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

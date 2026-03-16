import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type RoundState = {
  count: number;
  options: number[];
};

const TOTAL_ROUNDS = 8;
const MIN_COUNT = 1;
const MAX_COUNT = 9;
const LIGHT_COLORS = {
  screenBg: "#F3F4F6",
  panelBg: "#FFFFFF",
  panelBorder: "#D1D5DB",
  text: "#111827",
  secondaryText: "#4B5563",
  buttonBg: "#2563EB",
  buttonText: "#FFFFFF",
  starColor: "#F59E0B",
};
const DARK_COLORS = {
  screenBg: "#111827",
  panelBg: "#1F2937",
  panelBorder: "#374151",
  text: "#F9FAFB",
  secondaryText: "#9CA3AF",
  buttonBg: "#38BDF8",
  buttonText: "#0F172A",
  starColor: "#FBBF24",
};

const getRandomCount = (excludeCount?: number) => {
  let nextCount = Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1)) + MIN_COUNT;

  while (excludeCount !== undefined && MAX_COUNT > MIN_COUNT && nextCount === excludeCount) {
    nextCount = Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1)) + MIN_COUNT;
  }

  return nextCount;
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

const buildRoundState = (excludeCount?: number): RoundState => {
  const count = getRandomCount(excludeCount);
  const wrongOptions: number[] = [];

  while (wrongOptions.length < 2) {
    const candidate = getRandomCount(count);
    if (!wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate);
    }
  }

  return {
    count,
    options: shuffle([count, ...wrongOptions]),
  };
};

export default function Game6Screen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>(() => buildRoundState());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const stars = useMemo(() => Array.from({ length: roundState.count }), [roundState.count]);

  const handleOptionPress = (value: number) => {
    if (roundComplete || gameComplete) {
      return;
    }

    if (value === roundState.count) {
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
    setRoundState((current) => buildRoundState(current.count));
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
        : "ትኽክለኛ ቁጽሪ ምረጽ።";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.screenBg }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.title, { color: colors.text }]}>ጸወታ ቆጸራ ቅድመ-ኬ</Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            ዙር {round}/{TOTAL_ROUNDS}
          </Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>ነጥቢ {score}</Text>
        </View>

        <View style={[styles.promptCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.promptLabel, { color: colors.secondaryText }]}>እዞም ኮኾብ ክንደይ እዮም?</Text>
          <View style={styles.starsWrap}>
            {stars.map((_, index) => (
              <Text key={`star-${index}`} style={[styles.star, { color: colors.starColor }]}>
                ★
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.optionsRow}>
          {roundState.options.map((option) => (
            <Pressable
              key={`option-${option}`}
              onPress={() => handleOptionPress(option)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.panelBg,
                  borderColor: colors.panelBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
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
    fontSize: 16,
    fontWeight: "700",
  },
  starsWrap: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  star: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "31.5%",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 34,
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

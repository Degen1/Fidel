import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type GameColor = {
  id: string;
  label: string;
  hex: string;
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

const getRandomColorIndex = (excludeIndex?: number) => {
  let nextIndex = Math.floor(Math.random() * GAME_COLORS.length);

  while (excludeIndex !== undefined && GAME_COLORS.length > 1 && nextIndex === excludeIndex) {
    nextIndex = Math.floor(Math.random() * GAME_COLORS.length);
  }

  return nextIndex;
};

const getReadableTextColor = (hex: string) => {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

  return luminance > 160 ? "#111827" : "#FFFFFF";
};

export default function Game1Screen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [targetColorIndex, setTargetColorIndex] = useState(() => getRandomColorIndex());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const targetColor = GAME_COLORS[targetColorIndex];

  const handleColorPress = (index: number) => {
    if (roundComplete || gameComplete) {
      return;
    }

    if (index === targetColorIndex) {
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
    setTargetColorIndex((current) => getRandomColorIndex(current));
    setFeedback(null);
    setRoundComplete(false);
  };

  const handlePlayAgain = () => {
    setRound(1);
    setScore(0);
    setTargetColorIndex(getRandomColorIndex());
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
        : "ዝሰማማዕ ሕብሪ ምረጽ።";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.screenBg }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.title, { color: colors.text }]}>ጸወታ ሕብሪ ቅድመ-ኬ</Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>
            ዙር {round}/{TOTAL_ROUNDS}
          </Text>
          <Text style={[styles.metaText, { color: colors.secondaryText }]}>ነጥቢ {score}</Text>
        </View>

        <View style={[styles.promptCard, { backgroundColor: colors.panelBg, borderColor: colors.panelBorder }]}>
          <Text style={[styles.promptLabel, { color: colors.secondaryText }]}>ነዚ ሕብሪ ምረጽ</Text>
          <View style={[styles.promptSwatch, { backgroundColor: targetColor.hex }]} />
          <Text style={[styles.promptText, { color: colors.text }]}>{targetColor.label}</Text>
        </View>

        <View style={styles.grid}>
          {GAME_COLORS.map((color, index) => (
            <Pressable
              key={color.id}
              onPress={() => handleColorPress(index)}
              style={({ pressed }) => [
                styles.colorCard,
                {
                  backgroundColor: color.hex,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
            >
              <Text style={[styles.colorCardText, { color: getReadableTextColor(color.hex) }]}>
                {color.label}
              </Text>
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
  promptSwatch: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FFFFFFAA",
  },
  promptText: {
    fontSize: 30,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorCard: {
    width: "31.5%",
    aspectRatio: 1.1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  colorCardText: {
    fontSize: 15,
    fontWeight: "800",
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

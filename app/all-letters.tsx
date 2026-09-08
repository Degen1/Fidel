import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TIGRINYA_LETTER_GROUPS } from "@/constants/tigrinya-alphabet";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AllLettersScreen() {
  const isDark = useColorScheme() === "dark";
  const backgroundColor = isDark ? "#0F172A" : "#F8FAFC";
  const cardColor = isDark ? "#1E293B" : "#FFFFFF";
  const borderColor = isDark ? "#334155" : "#E2E8F0";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const accentColor = isDark ? "#38BDF8" : "#0284C7";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top", "left", "right"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {TIGRINYA_LETTER_GROUPS.map((group) => (
          <View
            key={group[0]}
            style={[styles.rowCard, { backgroundColor: cardColor, borderColor }]}
          >
            {group.map((letter, index) => (
              <View key={letter} style={styles.letterCell}>
                <Text style={[styles.letter, { color: index === 0 ? accentColor : textColor }]}>{letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
  },
  rowCard: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 7,
    marginBottom: 8,
  },
  letterCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontSize: 27,
    fontWeight: "600",
    lineHeight: 33,
  },
});

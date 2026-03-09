import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";

type DropdownTopicKey = "letters" | "numbers" | "colors" | "shapes" | "size" | "patterns";

const TOPIC_OPTIONS: DropdownTopicKey[] = [
  "letters",
  "numbers",
  "colors",
  "shapes",
  "size",
  "patterns",
];

const TOPIC_ROUTES: Record<DropdownTopicKey, Href> = {
  letters: { pathname: "/more", params: { segment: "letters" } },
  numbers: { pathname: "/more", params: { segment: "numbers" } },
  colors: { pathname: "/more", params: { segment: "colors" } },
  shapes: { pathname: "/letters2", params: { segment: "shapes" } },
  size: { pathname: "/letters2", params: { segment: "size" } },
  patterns: { pathname: "/letters2", params: { segment: "patterns" } },
};

export default function MineScreen() {
  const colorScheme = useColorScheme();
  const [selectedTopic, setSelectedTopic] = useState<DropdownTopicKey>("letters");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#111827" : "#F3F4F6";
  const cardColor = isDark ? "#1F2937" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const borderColor = isDark ? "#374151" : "#D1D5DB";

  const handleSelectOption = (option: DropdownTopicKey) => {
    setSelectedTopic(option);
    setShowDropdown(false);
    router.push(TOPIC_ROUTES[option]);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]} edges={["top"]}>
      <View style={styles.content}>
        <Text style={[styles.homeTitle, { color: textColor }]}>Home</Text>

        <View style={styles.dropdownWrapper}>
          <Pressable
            onPress={() => setShowDropdown((current) => !current)}
            style={[styles.dropdownButton, { backgroundColor: cardColor, borderColor }]}
          >
            <Text style={[styles.dropdownButtonText, { color: textColor }]}>{selectedTopic}</Text>
            <Text style={[styles.dropdownArrow, { color: textColor }]}>
              {showDropdown ? "▲" : "▼"}
            </Text>
          </Pressable>

          {showDropdown ? (
            <View style={[styles.dropdownMenu, { backgroundColor: cardColor, borderColor }]}>
              {TOPIC_OPTIONS.map((option) => {
                const isActive = option === selectedTopic;

                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSelectOption(option)}
                    style={[styles.dropdownOption, isActive && styles.dropdownOptionActive]}
                  >
                    <Text style={[styles.dropdownOptionText, { color: textColor }]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  homeTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
  },
  dropdownWrapper: {
    zIndex: 10,
  },
  dropdownButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  dropdownArrow: {
    fontSize: 14,
    fontWeight: "700",
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownOption: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dropdownOptionActive: {
    backgroundColor: "rgba(14, 165, 233, 0.22)",
  },
  dropdownOptionText: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

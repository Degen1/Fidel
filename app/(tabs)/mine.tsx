import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Letter1Screen, { type Letter1Segment } from "../letter1";
import Letter2Screen, { type Letter2Segment } from "../letter2";
import { useColorScheme } from "@/hooks/use-color-scheme";

type DropdownTopicKey = Letter1Segment | Letter2Segment;

const TOPIC_OPTIONS: DropdownTopicKey[] = [
  "letters",
  "numbers",
  "patterns",
  "colors",
  "shapes",
  "size",
];

const LETTER1_TOPICS: Letter1Segment[] = ["letters", "numbers", "patterns"];

const isLetter1Topic = (topic: DropdownTopicKey): topic is Letter1Segment =>
  LETTER1_TOPICS.includes(topic as Letter1Segment);

export default function MineScreen() {
  const colorScheme = useColorScheme();
  const [selectedTopic, setSelectedTopic] = useState<DropdownTopicKey>("letters");
  const [showDropdown, setShowDropdown] = useState(false);
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#111827" : "#F3F4F6";
  const cardColor = isDark ? "#1F2937" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const borderColor = isDark ? "#374151" : "#D1D5DB";

  const handleSelectOption = (option: DropdownTopicKey) => {
    setSelectedTopic(option);
    setShowDropdown(false);
  };

  const selectedTopicIndex = TOPIC_OPTIONS.indexOf(selectedTopic);
  const hasPreviousTopic = selectedTopicIndex > 0;
  const hasNextTopic = selectedTopicIndex < TOPIC_OPTIONS.length - 1;

  const moveTopic = (direction: -1 | 1) => {
    setSelectedTopic((current) => {
      const currentIndex = TOPIC_OPTIONS.indexOf(current);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = Math.max(0, Math.min(TOPIC_OPTIONS.length - 1, safeIndex + direction));
      return TOPIC_OPTIONS[nextIndex];
    });
    setShowDropdown(false);
  };

  const selectedTopicScreen = isLetter1Topic(selectedTopic) ? (
    <Letter1Screen
      key={`topic-${selectedTopic}`}
      segmentOverride={selectedTopic}
      hideSegmentControl
      onOverflowBack={hasPreviousTopic ? () => moveTopic(-1) : undefined}
      onOverflowNext={hasNextTopic ? () => moveTopic(1) : undefined}
    />
  ) : (
    <Letter2Screen
      key={`topic-${selectedTopic}`}
      segmentOverride={selectedTopic}
      hideSegmentControl
      onOverflowBack={hasPreviousTopic ? () => moveTopic(-1) : undefined}
      onOverflowNext={hasNextTopic ? () => moveTopic(1) : undefined}
    />
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
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

        <View style={styles.topicContent}>{selectedTopicScreen}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  headerRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 50,
    marginBottom: 6,
  },
  homeTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  dropdownWrapper: {
    zIndex: 50,
    width: 132,
  },
  dropdownButton: {
    minHeight: 34,
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  dropdownArrow: {
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownMenu: {
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    position: "absolute",
    top: 34,
    left: 0,
    right: 0,
  },
  dropdownOption: {
    minHeight: 32,
    paddingHorizontal: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dropdownOptionActive: {
    backgroundColor: "rgba(14, 165, 233, 0.22)",
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  topicContent: {
    flex: 1,
    marginTop: 2,
  },
});

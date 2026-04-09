import { useState } from "react";
import { View, StyleSheet } from "react-native";

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
const TAB_BAR_CLEARANCE = 64;

const isLetter1Topic = (topic: DropdownTopicKey): topic is Letter1Segment =>
  LETTER1_TOPICS.includes(topic as Letter1Segment);

const getRandomTopic = (): DropdownTopicKey => {
  const randomIndex = Math.floor(Math.random() * TOPIC_OPTIONS.length);
  return TOPIC_OPTIONS[randomIndex];
};

export default function MineScreen() {
  const colorScheme = useColorScheme();
  const [selectedTopic, setSelectedTopic] = useState<DropdownTopicKey>(() => getRandomTopic());
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#111827" : "#F3F4F6";

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
  };

  const selectedTopicScreen = isLetter1Topic(selectedTopic) ? (
    <Letter1Screen
      key={`topic-${selectedTopic}`}
      segmentOverride={selectedTopic}
      hideSegmentControl
      extraBottomInset={TAB_BAR_CLEARANCE}
      onOverflowBack={hasPreviousTopic ? () => moveTopic(-1) : undefined}
      onOverflowNext={hasNextTopic ? () => moveTopic(1) : undefined}
    />
  ) : (
    <Letter2Screen
      key={`topic-${selectedTopic}`}
      segmentOverride={selectedTopic}
      hideSegmentControl
      extraBottomInset={TAB_BAR_CLEARANCE}
      onOverflowBack={hasPreviousTopic ? () => moveTopic(-1) : undefined}
      onOverflowNext={hasNextTopic ? () => moveTopic(1) : undefined}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View style={styles.topicContent}>{selectedTopicScreen}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topicContent: {
    flex: 1,
  },
});

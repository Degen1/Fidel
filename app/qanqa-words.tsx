import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { DICTIONARY_WORDS, DictionaryWord } from "@/constants/qanqa-dictionary-words";
import { useColorScheme } from "@/hooks/use-color-scheme";

const LIGHT = {
  background: "#ffffff",
  title: "#101828",
  text: "#1d2939",
  muted: "#667085",
  section: "#475467",
};

const DARK = {
  background: "#020617",
  title: "#f8fafc",
  text: "#e2e8f0",
  muted: "#94a3b8",
  section: "#cbd5e1",
};

export default function HomeScreen() {
  const router = useRouter();
  const words = DICTIONARY_WORDS;
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [listHeight, setListHeight] = useState(0);
  const reelHeight = Math.max(listHeight || height, 1);
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? DARK : LIGHT;

  const onListLayout = (event: LayoutChangeEvent) => {
    const nextHeight = Math.round(event.nativeEvent.layout.height);
    if (nextHeight > 0 && nextHeight !== listHeight) {
      setListHeight(nextHeight);
    }
  };

  const renderLines = (values: string[] | undefined, style: StyleProp<TextStyle>) => {
    if (!values || values.length === 0) {
      return <Text style={[styles.emptyText, { color: palette.muted }]}>—</Text>;
    }

    return values.map((value, idx) => (
      <Text key={`${value}-${idx}`} style={style}>
        • {value}
      </Text>
    ));
  };

  const renderReel = ({ item }: { item: DictionaryWord }) => {
    return (
      <View style={[styles.reelPage, { height: reelHeight }]}>
        <View
          style={[
            styles.reelCard,
            { backgroundColor: palette.background },
          ]}>
          <Text style={[styles.word, { color: palette.title }]}>{item.word}</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: palette.section }]}>ትርጉም</Text>
            {renderLines(item.definitions, [styles.text, { color: palette.text }])}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: palette.section }]}>ኣብነት</Text>
            {item.examples && item.examples.length > 0 ? (
              item.examples.map((example, idx) => (
                <Text key={`${item.id}-example-${idx}`} style={[styles.exampleText, { color: palette.text }]}>
                  • {example}
                </Text>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: palette.muted }]}>—</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: palette.section }]}>ተመሳሳሊ</Text>
            <Text style={[styles.text, { color: palette.text }]}>
              {item.synonyms && item.synonyms.length > 0 ? item.synonyms.join(" • ") : "—"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: palette.section }]}>ተጻራሪ</Text>
            <Text style={[styles.text, { color: palette.text }]}>
              {item.antonyms && item.antonyms.length > 0 ? item.antonyms.join(" • ") : "—"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: palette.background }]}
      edges={["left", "right"]}
    >
      <View style={[styles.header, { height: insets.top + 48, paddingTop: insets.top }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="መዝገብ ቃላት ድለዩ"
          activeOpacity={0.7}
          onPress={() => router.push("/qanqa-dictionary")}
          style={styles.searchButton}
        >
          <MaterialIcons name="search" size={25} color={palette.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer} onLayout={onListLayout}>
        <FlatList
          data={words}
          renderItem={renderReel}
          keyExtractor={(item) => item.id}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={reelHeight}
          snapToAlignment="start"
          disableIntervalMomentum
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: reelHeight,
            offset: reelHeight * index,
            index,
          })}
          ListEmptyComponent={
            <View style={[styles.reelPage, { height: reelHeight }]}>
              <View
                style={[
                  styles.reelCard,
                  {
                    backgroundColor: palette.background,
                  },
                ]}>
                <Text style={[styles.word, { color: palette.title }]}>No words yet</Text>
                <Text style={[styles.text, { color: palette.text }]}>
                  Add words in the code list and they will appear here automatically.
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 20,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  reelPage: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  reelCard: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
    borderRadius: 0,
    borderWidth: 0,
    paddingHorizontal: 18,
    paddingVertical: 20,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  word: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  section: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 3,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 3,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

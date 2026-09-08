import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { DICTIONARY_WORDS, DictionaryWord } from "@/constants/qanqa-dictionary-words";
import { useColorScheme } from "@/hooks/use-color-scheme";

const LIGHT = {
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#e6e6e6",
  inputBackground: "#fafafa",
  inputBorder: "#d1d5db",
  clearButton: "#eeeeee",
  textPrimary: "#111827",
  textSecondary: "#475467",
  textMuted: "#667085",
};

const DARK = {
  background: "#020617",
  card: "#0f172a",
  cardBorder: "#1f2937",
  inputBackground: "#0b1220",
  inputBorder: "#334155",
  clearButton: "#1f2937",
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
};

export default function DictionaryScreen() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? DARK : LIGHT;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return DICTIONARY_WORDS;
    }

    return DICTIONARY_WORDS.filter((word) =>
      [
        word.word,
        ...word.definitions,
        ...word.examples,
        ...(word.synonyms ?? []),
        ...(word.antonyms ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderBullets = (
    values: string[] | undefined,
    textStyle: StyleProp<TextStyle>
  ) =>
    (values ?? []).map((value, index) => (
      <View key={`${value}-${index}`} style={styles.bulletRow}>
        <Text style={[styles.bullet, { color: palette.textSecondary }]}>•</Text>
        <Text style={textStyle}>{value}</Text>
      </View>
    ));

  const renderItem = ({ item }: { item: DictionaryWord }) => {
    const isOpen = openId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => toggleOpen(item.id)}
        style={[
          styles.dictCard,
          { borderColor: palette.cardBorder, backgroundColor: palette.card },
        ]}>
        <View style={styles.dictHeaderRow}>
          <Text style={[styles.dictWord, { color: palette.textPrimary }]}>{item.word}</Text>
          <Text style={[styles.dictChevron, { color: palette.textMuted }]}>{isOpen ? "▲" : "▼"}</Text>
        </View>

        <Text style={[styles.dictLabel, { color: palette.textSecondary }]}>ትርጉም</Text>
        {renderBullets(item.definitions, [styles.dictText, { color: palette.textPrimary }])}

        <Text style={[styles.dictLabel, { marginTop: 8, color: palette.textSecondary }]}>ኣብነት</Text>
        {renderBullets(item.examples, [styles.dictExample, { color: palette.textPrimary }])}

        {isOpen ? (
          <>
            <Text style={[styles.dictLabel, { marginTop: 10, color: palette.textSecondary }]}>ተመሳሳሊ</Text>
            {item.synonyms && item.synonyms.length > 0 ? (
              renderBullets(item.synonyms, [styles.dictText, { color: palette.textPrimary }])
            ) : (
              <Text style={[styles.dictText, { color: palette.textMuted }]}>—</Text>
            )}

            <Text style={[styles.dictLabel, { marginTop: 10, color: palette.textSecondary }]}>ተጻራሪ</Text>
            {item.antonyms && item.antonyms.length > 0 ? (
              renderBullets(item.antonyms, [styles.dictText, { color: palette.textPrimary }])
            ) : (
              <Text style={[styles.dictText, { color: palette.textMuted }]}>—</Text>
            )}
          </>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: palette.background }]}
      edges={["left", "right"]}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View
            style={[
              styles.dictSearchRow,
              { borderColor: palette.inputBorder, backgroundColor: palette.inputBackground },
            ]}
          >
            <TextInput
              value={search}
              onChangeText={(value) => {
                setSearch(value);
                setOpenId(null);
              }}
              placeholder="ቃል ድለዩ..."
              placeholderTextColor={palette.textMuted}
              style={[styles.dictSearchInput, { color: palette.textPrimary }]}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {search.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearch("");
                  setOpenId(null);
                }}
                style={[styles.dictClearBtn, { backgroundColor: palette.clearButton }]}
              >
                <Text style={[styles.dictClearText, { color: palette.textPrimary }]}>ምጽራይ</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingTop: 30, alignItems: "center" }}>
            <Text style={{ color: palette.textMuted }}>የለን</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  dictSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 0,
    marginBottom: 10,
  },
  dictSearchInput: {
    flex: 1,
    height: 45,
    borderRadius: 20,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  dictClearBtn: {
    height: 35,
    borderRadius: 20,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  dictClearText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dictCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dictHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dictWord: {
    fontSize: 18,
    fontWeight: "800",
  },
  dictChevron: {
    fontSize: 12,
    fontWeight: "900",
    paddingLeft: 10,
  },
  dictLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  dictText: {
    fontSize: 14,
    lineHeight: 20,
  },
  dictExample: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    width: 16,
    fontWeight: "900",
    lineHeight: 20,
  },
});

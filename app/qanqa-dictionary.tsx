import React, { useDeferredValue, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { DICTIONARY_WORDS, DictionaryWord } from "@/constants/qanqa-dictionary-words";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { AppText as Text, AppTextInput as TextInput } from "@/components/app-text";
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
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [openId, setOpenId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? DARK : LIGHT;

  const filtered = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase();
    if (!query) {
      return DICTIONARY_WORDS.slice(0, 250);
    }

    const ranked: DictionaryWord[][] = [[], [], [], [], [], []];
    for (const entry of DICTIONARY_WORDS) {
      const headword = entry.word.toLocaleLowerCase();
      const relatedWords = [...(entry.synonyms ?? []), ...(entry.antonyms ?? [])].map((value) =>
        value.toLocaleLowerCase()
      );

      let rank = Number.POSITIVE_INFINITY;
      if (headword === query) rank = 0;
      else if (headword.startsWith(query)) rank = 1;
      else if (headword.includes(query)) rank = 2;
      else if (relatedWords.some((value) => value === query)) rank = 3;
      else if (relatedWords.some((value) => value.startsWith(query))) rank = 4;
      else if (relatedWords.some((value) => value.includes(query))) rank = 5;

      if (Number.isFinite(rank) && ranked[rank].length < 250) ranked[rank].push(entry);
    }

    return ranked.flat().slice(0, 250);
  }, [deferredSearch]);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setOpenId(null);
    setTimeout(() => setRefreshing(false), 600);
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
        {item.definitions.length > 0 ? (
          renderBullets(item.definitions, [styles.dictText, { color: palette.textPrimary }])
        ) : (
          <Text style={[styles.dictText, { color: palette.textMuted }]}>ኣብ ምንጪ ኣይተረኽበን</Text>
        )}

        <Text style={[styles.dictLabel, { marginTop: 8, color: palette.textSecondary }]}>ኣብነት</Text>
        {item.examples.length > 0 ? (
          renderBullets(item.examples, [styles.dictExample, { color: palette.textPrimary }])
        ) : (
          <Text style={[styles.dictText, { color: palette.textMuted }]}>ኣብ ምንጪ ኣይተረኽበን</Text>
        )}

        {isOpen ? (
          <>
            <Text style={[styles.dictLabel, { marginTop: 10, color: palette.textSecondary }]}>ተመሳሳሊ</Text>
            {item.synonyms && item.synonyms.length > 0 ? (
              renderBullets(item.synonyms, [styles.dictText, { color: palette.textPrimary }])
            ) : (
              <Text style={[styles.dictText, { color: palette.textMuted }]}>ኣብ ምንጪ ኣይተረኽበን</Text>
            )}

            <Text style={[styles.dictLabel, { marginTop: 10, color: palette.textSecondary }]}>ተጻራሪ</Text>
            {item.antonyms && item.antonyms.length > 0 ? (
              renderBullets(item.antonyms, [styles.dictText, { color: palette.textPrimary }])
            ) : (
              <Text style={[styles.dictText, { color: palette.textMuted }]}>ኣብ ምንጪ ኣይተረኽበን</Text>
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
      <StatusBar
        animated
        translucent
        backgroundColor="transparent"
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: 14 + (Platform.OS === "android" ? insets.top : 0) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={palette.textPrimary}
            colors={[palette.textPrimary]}
            progressBackgroundColor={palette.background}
          />
        }
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
    paddingTop: 14,
    paddingBottom: 18,
  },
  dictSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderCurve: "continuous",
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 14,
  },
  dictSearchInput: {
    flex: 1,
    minHeight: 54,
    borderRadius: 27,
    borderCurve: "continuous",
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  dictClearBtn: {
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
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

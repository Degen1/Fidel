import { useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Image, ScrollView, useWindowDimensions } from "react-native";
import { useRouter, type Href } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

export type SubjectSectionKey = "class" | "games" | "tests";

const GRID_HORIZONTAL_PADDING = 16;
const GRID_GUTTER = 16;
const GRID_COLUMNS = 3;

const APP_SECTIONS = {
  class: {
    apps: [
      { name: "ፊደል", href: "/letters1?segment=letters", image: require("../assets/images/prek1.png") },
      { name: "ቁጽሪ", href: "/letters1?segment=numbers", image: require("../assets/images/prek1.png") },
      { name: "ምድጋም", href: "/letters1?segment=patterns", image: require("../assets/images/prek1.png") },
      { name: "ሕብሪ", href: "/prek2?segment=colors", image: require("../assets/images/prek2.png") },
      { name: "ቅርጺ", href: "/prek2?segment=shapes", image: require("../assets/images/prek2.png") },
      { name: "ግዝፊ", href: "/prek2?segment=size", image: require("../assets/images/prek2.png") },
      { name: "ቁጽሪ", href: "/letters1", image: require("../assets/images/first1.png") },
      { name: "ትግሪኛ", href: "/letters2", image: require("../assets/images/first2.png") },
      { name: "ኢንግሊሽ", href: "/letters6", image: require("../assets/images/first3.png") },
      { name: "ስነ ፍልጠት", href: "/letters3", image: require("../assets/images/first4.png") },
    ],
  },
  games: {
    apps: [
      { name: "ሕብሪ", href: "/game1", image: require("../assets/images/game1.png") },
      { name: "ቁጽሪ", href: "/game2", image: require("../assets/images/game2.png") },
      { name: "ቅርጺ", href: "/game3", image: require("../assets/images/game3.png") },
      { name: "ግዝፊ", href: "/game4", image: require("../assets/images/game4.png") },
      { name: "ሕቶ", href: "/game5", image: require("../assets/images/game5.png") },
      { name: "ክንደይ", href: "/game6", image: require("../assets/images/game6.png") },
    ],
  },
  tests: {
    apps: [
      { name: "ፈተና1", href: "/colors1", image: require("../assets/images/game1.png") },
      { name: "ፈተና2", href: "/colors2", image: require("../assets/images/game2.png") },
      { name: "ፈተና3", href: "/colors3", image: require("../assets/images/game3.png") },
      { name: "ፈተና4", href: "/colors1", image: require("../assets/images/game4.png") },
      { name: "ፈተና5", href: "/colors2", image: require("../assets/images/game5.png") },
      { name: "ፈተና6", href: "/colors3", image: require("../assets/images/game6.png") },
    ],
  },
} as const;

type AppItem = (typeof APP_SECTIONS)[SubjectSectionKey]["apps"][number];

const splitIntoRows = <T,>(items: readonly T[], rowSize: number) => {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += rowSize) {
    rows.push(items.slice(index, index + rowSize));
  }

  return rows;
};

type SubjectSectionScreenProps = {
  sectionKey: SubjectSectionKey;
};

export function SubjectSectionScreen({ sectionKey }: SubjectSectionScreenProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#111827" : "#F3F4F6";
  const cardColor = isDark ? "#1F2937" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDark ? "#CBD5E1" : "#555555";
  const contentBottomPadding = Math.max(insets.bottom + 84, 104);
  const selectedSection = APP_SECTIONS[sectionKey];
  const isClassSection = sectionKey === "class";
  const bookWidth =
    (screenWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_GUTTER * (GRID_COLUMNS - 1)) /
    GRID_COLUMNS;
  const bookCoverHeight = bookWidth * 1.6;
  const gradeApps = useMemo(() => {
    if (isClassSection) {
      const preK = selectedSection.apps.slice(0, 6);
      const firstGrade = selectedSection.apps.slice(6, 10);

      return { preK, firstGrade };
    }

    return {
      preK: selectedSection.apps,
      firstGrade: selectedSection.apps,
    };
  }, [isClassSection, selectedSection.apps]);

  const renderAppCard = (app: AppItem, keyPrefix: string) => (
    <Pressable
      key={`${keyPrefix}-${app.name}`}
      onPress={() => router.push(app.href as Href)}
      accessibilityRole="button"
      accessibilityLabel={app.name}
      style={({ pressed }) => [
        styles.appCard,
        isClassSection && { width: bookWidth },
        pressed && styles.appCardPressed,
      ]}
    >
      {isClassSection ? (
        <View
          style={[
            styles.book,
            {
              width: bookWidth,
              height: bookCoverHeight + 20,
              backgroundColor,
            },
          ]}
        >
          <Image
            source={app.image}
            style={{
              width: bookWidth,
              height: bookCoverHeight,
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
          <View style={styles.bookCaption}>
            <Text numberOfLines={2} style={[styles.bookTitle, { color: secondaryTextColor }]}>
              {app.name}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.appImageContainer, { backgroundColor: cardColor }]}>
            <Image source={app.image} style={styles.appImage} resizeMode="cover" />
          </View>
          <Text numberOfLines={2} style={[styles.appCardText, { color: textColor }]}>
            {app.name}
          </Text>
        </>
      )}
    </Pressable>
  );

  const renderThreeColumnRows = (
    apps: readonly AppItem[],
    groupKey: string
  ) => {
    const rows = splitIntoRows(apps, 3);

    return rows.map((rowApps, rowIndex) => (
      <View
        key={`${groupKey}-row-${rowIndex}`}
        style={[
          styles.appsRow,
          isClassSection && styles.bookRow,
          rowIndex === rows.length - 1 && styles.appsRowLast,
        ]}
      >
        {rowApps.map((app) => renderAppCard(app, `${groupKey}-r${rowIndex}`))}
        {Array.from({ length: Math.max(0, 3 - rowApps.length) }).map((_, spacerIndex) => (
          <View
            key={`${groupKey}-spacer-${rowIndex}-${spacerIndex}`}
            style={[styles.appCardSpacer, isClassSection && { width: bookWidth }]}
          />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]} edges={["top"]}>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={[
          styles.contentContainerInner,
          isClassSection && styles.bookContent,
          { paddingBottom: contentBottomPadding },
        ]}
        scrollIndicatorInsets={{ bottom: contentBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.groupTitle, isClassSection && styles.bookGroupTitle, { color: textColor }]}>
          ቅድሚ ቀዳማይ ክፍሊ
        </Text>
        <View style={styles.appsGrid}>
          {renderThreeColumnRows(gradeApps.preK, `${sectionKey}-prek`)}
        </View>
        <Text style={[styles.groupTitle, isClassSection && styles.bookGroupTitle, { color: textColor }]}>
          ቀዳማይ ክፍሊ
        </Text>
        <View style={styles.appsGrid}>
          {renderThreeColumnRows(gradeApps.firstGrade, `${sectionKey}-first`)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerInner: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  bookContent: {
    paddingHorizontal: GRID_HORIZONTAL_PADDING,
    paddingTop: GRID_HORIZONTAL_PADDING,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 4,
  },
  bookGroupTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
    marginTop: 6,
  },
  appsGrid: {
    width: "100%",
  },
  appsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookRow: {
    marginBottom: GRID_GUTTER,
  },
  appsRowLast: {
    marginBottom: 0,
  },
  appCard: {
    width: "32%",
    alignItems: "center",
  },
  appCardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
  appCardSpacer: {
    width: "32%",
  },
  book: {
    alignItems: "center",
  },
  bookCaption: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  appImage: {
    width: "100%",
    height: "100%",
  },
  bookTitle: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  appCardText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});

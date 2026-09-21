import {
  useMemo,
  useState } from "react";
import { View,
  Platform,
  RefreshControl,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { AppText as Text } from "@/components/app-text";
export type SubjectSectionKey = "class" | "games" | "tests";

const GRID_HORIZONTAL_PADDING = 16;
const GRID_GUTTER = 12;
const GRID_COLUMNS = 3;
const MAX_CONTENT_WIDTH = 720;

const APP_SECTIONS = {
  class: {
    apps: [
      { name: "ፊደል", href: "/letter1?segment=letters", image: require("../assets/images/cover-letters.png") },
      { name: "ቁጽሪ", href: "/letter1?segment=numbers", image: require("../assets/images/cover-numbers-prek.png") },
      { name: "ምድጋም", href: "/letter1?segment=patterns", image: require("../assets/images/cover-patterns.png") },
      { name: "ሕብሪ", href: "/letter2?segment=colors", image: require("../assets/images/cover-colors.png") },
      { name: "ቅርጺ", href: "/letter2?segment=shapes", image: require("../assets/images/cover-shapes.png") },
      { name: "ግዝፊ", href: "/letter2?segment=size", image: require("../assets/images/cover-sizes.png") },
      { name: "ቁጽሪ", href: "/letters1", image: require("../assets/images/cover-math.png") },
      { name: "ትግሪኛ", href: "/letters2", image: require("../assets/images/cover-tigrinya.png") },
      { name: "ኢንግሊሽ", href: "/letters6", image: require("../assets/images/cover-english.png") },
      { name: "ስነ ፍልጠት", href: "/letters3", image: require("../assets/images/cover-science.png") },
    ],
  },
  games: {
    apps: [
      { name: "ሕብሪ", href: "/game1", image: require("../assets/images/game-cover-colors.png") },
      { name: "ቁጽሪ", href: "/game2", image: require("../assets/images/game-cover-numbers.png") },
      { name: "ቅርጺ", href: "/game3", image: require("../assets/images/game-cover-shapes.png") },
      { name: "ግዝፊ", href: "/game4", image: require("../assets/images/game-cover-sizes.png") },
      { name: "ሕቶ", href: "/game5", image: require("../assets/images/game-cover-quiz.png") },
      { name: "ክንደይ", href: "/game6", image: require("../assets/images/game-cover-counting.png") },
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
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = isDark ? "#0B1220" : "#F8FAFC";
  const cardColor = isDark ? "#1F2937" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const secondaryTextColor = isDark ? "#CBD5E1" : "#475569";
  const separatorColor = isDark ? "#263244" : "#DCE3EA";
  const contentBottomPadding = Math.max(insets.bottom + 84, 104);
  const selectedSection = APP_SECTIONS[sectionKey];
  const isClassSection = sectionKey === "class";
  const contentWidth = Math.min(screenWidth, MAX_CONTENT_WIDTH);
  const bookWidth =
    (contentWidth - GRID_HORIZONTAL_PADDING * 2 - GRID_GUTTER * (GRID_COLUMNS - 1)) /
    GRID_COLUMNS;
  const bookCoverHeight = bookWidth * 1.5;
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

  const handleRefresh = () => {
    setRefreshing(true);
    requestAnimationFrame(() => setRefreshing(false));
  };

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
              height: bookCoverHeight + 28,
              backgroundColor,
            },
          ]}
        >
          <View
            style={[
              styles.bookCover,
              {
                width: bookWidth,
                height: bookCoverHeight,
                borderColor: separatorColor,
                boxShadow: isDark
                  ? "0 5px 14px rgba(0, 0, 0, 0.28)"
                  : "0 5px 14px rgba(15, 23, 42, 0.12)",
              },
            ]}
          >
            <Image source={app.image} style={styles.bookImage} contentFit="cover" transition={150} />
            <View style={styles.bookSpine} />
          </View>
          <View style={styles.bookCaption}>
            <Text numberOfLines={2} style={[styles.bookTitle, { color: secondaryTextColor }]}>
              {app.name}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.appImageContainer, { backgroundColor: cardColor }]}>
            <Image source={app.image} style={styles.appImage} contentFit="cover" transition={150} />
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

  const renderGroup = (title: string, apps: readonly AppItem[], groupKey: string) => (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, isClassSection && styles.bookGroupTitle, { color: textColor }]}>
          {title}
        </Text>
        <View style={[styles.groupRule, { backgroundColor: separatorColor }]} />
      </View>
      <View style={styles.appsGrid}>{renderThreeColumnRows(apps, groupKey)}</View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]} edges={["left", "right"]}>
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={textColor}
            colors={[textColor]}
            progressBackgroundColor={backgroundColor}
          />
        }
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.contentContainerInner,
          isClassSection && styles.bookContent,
          {
            paddingTop:
              (isClassSection ? 10 : 14) + (Platform.OS === "android" ? insets.top : 0),
            paddingBottom: contentBottomPadding,
          },
        ]}
        scrollIndicatorInsets={{ bottom: contentBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centeredContent}>
          {renderGroup("ቅድሚ ቀዳማይ ክፍሊ", gradeApps.preK, `${sectionKey}-prek`)}
          {renderGroup("ቀዳማይ ክፍሊ", gradeApps.firstGrade, `${sectionKey}-first`)}
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
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 24,
  },
  bookContent: {
    paddingHorizontal: 0,
    paddingTop: 10,
  },
  centeredContent: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: GRID_HORIZONTAL_PADDING,
  },
  group: {
    paddingBottom: 28,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
  },
  groupRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  bookGroupTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
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
    marginBottom: 18,
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
  bookCover: {
    overflow: "hidden",
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  bookImage: {
    width: "100%",
    height: "100%",
  },
  bookSpine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
    backgroundColor: "rgba(15, 23, 42, 0.10)",
  },
  bookCaption: {
    height: 28,
    paddingTop: 4,
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
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  appCardText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});

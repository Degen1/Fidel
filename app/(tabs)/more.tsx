import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Pressable, Image, ScrollView, PanResponder } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

const SUBJECT_TABS = ["class", "games", "tests"] as const;
type SubjectTab = (typeof SUBJECT_TABS)[number];
const SWIPE_DISTANCE_THRESHOLD = 40;
const SWIPE_VELOCITY_THRESHOLD = 0.35;

const getSegmentIndexFromParam = (segment: string | string[] | undefined) => {
  const value = Array.isArray(segment) ? segment[0] : segment;

  if (!value) {
    return 0;
  }

  const normalized = value.toLowerCase();
  const aliasMap: Record<string, SubjectTab> = {
    class: "class",
    games: "games",
    tests: "tests",
    letters: "class",
    numbers: "games",
    colors: "tests",
  };
  const resolvedValue = aliasMap[normalized] ?? "class";
  const index = SUBJECT_TABS.indexOf(resolvedValue);

  return index >= 0 ? index : 0;
};

const APP_SECTIONS = {
  class: {
    title: "Class",
    apps: [
      { name: "Pre-K 1", href: "/letters1", image: require("../../assets/images/prek1.png") },
      { name: "Pre-K 2", href: "/prek2", image: require("../../assets/images/prek1.png") },
      { name: "Pre-K 3", href: "/letters1", image: require("../../assets/images/icon.png") },
      { name: "first grade 1", href: "/letters1", image: require("../../assets/images/icon.png") },
      { name: "first grade 2", href: "/letters2", image: require("../../assets/images/icon.png") },
      { name: "first grade 3", href: "/letters6", image: require("../../assets/images/icon.png") },
      { name: "second grade 1", href: "/letters7", image: require("../../assets/images/icon.png") },
      { name: "second grade 2", href: "/letters8", image: require("../../assets/images/icon.png") },
      { name: "second grade 3", href: "/letters9", image: require("../../assets/images/icon.png") },
    ],
  },
  games: {
    title: "Games",
    apps: [
      { name: "ሕብሪ", href: "/game1", image: require("../../assets/images/game1.png") },
      { name: "ቁጽሪ", href: "/game2", image: require("../../assets/images/game2.png") },
      { name: "ቅርጺ", href: "/game3", image: require("../../assets/images/game3.png") },
      { name: "ግዝፊ", href: "/game4", image: require("../../assets/images/game4.png") },
      { name: "ሕቶ", href: "/game5", image: require("../../assets/images/game5.png") },
      { name: "ክንደይ", href: "/game6", image: require("../../assets/images/game6.png") },
    ],
  },
  tests: {
    title: "Tests",
    apps: [
      { name: "colors1", href: "/colors1", image: require("../../assets/images/icon.png") },
      { name: "colors2", href: "/colors2", image: require("../../assets/images/icon.png") },
      { name: "colors3", href: "/colors3", image: require("../../assets/images/icon.png") },
      { name: "colors4", href: "/colors1", image: require("../../assets/images/icon.png") },
      { name: "colors5", href: "/colors2", image: require("../../assets/images/icon.png") },
      { name: "colors6", href: "/colors3", image: require("../../assets/images/icon.png") },
    ],
  },
} as const;

const splitIntoRows = <T,>(items: T[], rowSize: number) => {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += rowSize) {
    rows.push(items.slice(index, index + rowSize));
  }

  return rows;
};

export default function NumbersScreen() {
  const params = useLocalSearchParams<{ segment?: string | string[] }>();
  const colorScheme = useColorScheme();
  const [segmentIndex, setSegmentIndex] = useState(() => getSegmentIndexFromParam(params.segment));
  const router = useRouter();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    setSegmentIndex(getSegmentIndexFromParam(params.segment));
  }, [params.segment]);

  const backgroundColor = isDark ? "#111827" : "#F3F4F6";
  const cardColor = isDark ? "#1F2937" : "#E5E7EB";
  const textColor = isDark ? "#F9FAFB" : "#111827";
  const selectedKey = SUBJECT_TABS[segmentIndex] as keyof typeof APP_SECTIONS;
  const selectedSection = APP_SECTIONS[selectedKey];
  const isClassSection = selectedKey === "class";
  const gradeApps = useMemo(() => {
    if (isClassSection) {
      const preK = selectedSection.apps.slice(0, 3);
      const firstGrade = selectedSection.apps.slice(3, 6);
      const secondGrade = selectedSection.apps.slice(6, 9);

      return { preK, firstGrade, secondGrade };
    }

    // For Games/Tests, show all 6 apps in each grade block (3 columns x 2 rows).
    return {
      preK: selectedSection.apps,
      firstGrade: selectedSection.apps,
      secondGrade: selectedSection.apps,
    };
  }, [isClassSection, selectedSection.apps]);

  const renderAppCard = (app: (typeof selectedSection.apps)[number], keyPrefix: string) => (
    <Pressable
      key={`${keyPrefix}-${app.name}`}
      onPress={() => router.push(app.href)}
      style={[styles.appCard, isClassSection && styles.letterAppCard]}
    >
      <View
        style={[
          styles.appImageContainer,
          { backgroundColor: cardColor },
          isClassSection && styles.letterImageContainer,
        ]}
      >
        <Image source={app.image} style={styles.appImage} resizeMode="cover" />
      </View>

      <Text style={[styles.appCardText, { color: textColor }]}>{app.name}</Text>
    </Pressable>
  );

  const renderThreeColumnRows = (
    apps: (typeof selectedSection.apps)[number][],
    groupKey: string
  ) => {
    const rows = splitIntoRows(apps, 3);

    return rows.map((rowApps, rowIndex) => (
      <View
        key={`${groupKey}-row-${rowIndex}`}
        style={[styles.appsRow, rowIndex === rows.length - 1 && styles.appsRowLast]}
      >
        {rowApps.map((app) => renderAppCard(app, `${groupKey}-r${rowIndex}`))}
        {Array.from({ length: Math.max(0, 3 - rowApps.length) }).map((_, spacerIndex) => (
          <View key={`${groupKey}-spacer-${rowIndex}-${spacerIndex}`} style={styles.appCardSpacer} />
        ))}
      </View>
    ));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          return isHorizontalSwipe && Math.abs(gestureState.dx) > 12;
        },
        onPanResponderRelease: (_, gestureState) => {
          const swipedLeft =
            gestureState.dx <= -SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx <= -SWIPE_VELOCITY_THRESHOLD;
          const swipedRight =
            gestureState.dx >= SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx >= SWIPE_VELOCITY_THRESHOLD;

          if (swipedLeft) {
            setSegmentIndex((currentIndex) => Math.min(SUBJECT_TABS.length - 1, currentIndex + 1));
            return;
          }

          if (swipedRight) {
            setSegmentIndex((currentIndex) => Math.max(0, currentIndex - 1));
          }
        },
      }),
    []
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor }]}
      edges={["top"]}
      {...panResponder.panHandlers}
    >
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          values={SUBJECT_TABS}
          selectedIndex={segmentIndex}
          onChange={(event) => setSegmentIndex(event.nativeEvent.selectedSegmentIndex)}
          style={styles.segmentedControl}
        />
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerInner}
        showsVerticalScrollIndicator={false}
      >
        <>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{selectedSection.title}</Text>
          <Text style={[styles.groupTitle, { color: textColor }]}>Pre-K</Text>
          <View style={[styles.appsGrid, isClassSection && styles.lettersAppsList]}>
            {isClassSection
              ? gradeApps.preK.map((app) => renderAppCard(app, `${selectedKey}-prek`))
              : renderThreeColumnRows(gradeApps.preK, `${selectedKey}-prek`)}
          </View>
          <Text style={[styles.groupTitle, { color: textColor }]}>First Grade</Text>
          <View style={[styles.appsGrid, isClassSection && styles.lettersAppsList]}>
            {isClassSection
              ? gradeApps.firstGrade.map((app) => renderAppCard(app, `${selectedKey}-first`))
              : renderThreeColumnRows(gradeApps.firstGrade, `${selectedKey}-first`)}
          </View>
          <Text style={[styles.groupTitle, { color: textColor }]}>Second Grade</Text>
          <View style={[styles.appsGrid, isClassSection && styles.lettersAppsList]}>
            {isClassSection
              ? gradeApps.secondGrade.map((app) => renderAppCard(app, `${selectedKey}-second`))
              : renderThreeColumnRows(gradeApps.secondGrade, `${selectedKey}-second`)}
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  segmentedControlContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  segmentedControl: {
    height: 46,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerInner: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 4,
  },
  appsGrid: {
    width: "100%",
  },
  appsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  appsRowLast: {
    marginBottom: 0,
  },
  lettersAppsList: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
  appCard: {
    width: "32%",
    marginBottom: 10,
    alignItems: "center",
  },
  appCardSpacer: {
    width: "32%",
  },
  letterAppCard: {
    width: "100%",
    marginBottom: 12,
  },
  appImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  letterImageContainer: {
    aspectRatio: 2,
  },
  appImage: {
    width: "100%",
    height: "100%",
  },
  appCardText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});

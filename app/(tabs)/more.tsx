import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

const SUBJECT_TABS = ["class", "games", "tests"] as const;
type SubjectTab = (typeof SUBJECT_TABS)[number];

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
    title: "Pre-K",
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
      { name: "numbers1", href: "/numbers1", image: require("../../assets/images/icon.png") },
      { name: "numbers2", href: "/numbers2", image: require("../../assets/images/icon.png") },
      { name: "numbers3", href: "/numbers3", image: require("../../assets/images/icon.png") },
      { name: "numbers4", href: "/numbers4", image: require("../../assets/images/icon.png") },
      { name: "numbers5", href: "/numbers5", image: require("../../assets/images/icon.png") },
      { name: "numbers6", href: "/numbers6", image: require("../../assets/images/icon.png") },
    ],
  },
  tests: {
    title: "Tests",
    apps: [
      { name: "colors1", href: "/colors1", image: require("../../assets/images/icon.png") },
      { name: "colors2", href: "/colors2", image: require("../../assets/images/icon.png") },
      { name: "colors3", href: "/colors3", image: require("../../assets/images/icon.png") },
      { name: "colors4", href: "/colors4", image: require("../../assets/images/icon.png") },
      { name: "colors5", href: "/colors5", image: require("../../assets/images/icon.png") },
      { name: "colors6", href: "/colors6", image: require("../../assets/images/icon.png") },
    ],
  },
} as const;

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
  const classPreKApps = APP_SECTIONS.class.apps.slice(0, 3);
  const classFirstGradeApps = APP_SECTIONS.class.apps.slice(3, 6);
  const classSecondGradeApps = APP_SECTIONS.class.apps.slice(6, 9);

  const renderAppCard = (app: (typeof selectedSection.apps)[number], keyPrefix: string) => (
    <Pressable
      key={`${keyPrefix}-${app.name}`}
      onPress={() => router.push(app.href)}
      style={[styles.appCard, { backgroundColor: cardColor }, isClassSection && styles.letterAppCard]}
    >
      <Image source={app.image} style={styles.appImage} resizeMode="cover" />
      <View style={styles.appCardLabel}>
        <Text style={styles.appCardText}>{app.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]} edges={["top"]}>
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
        {isClassSection ? (
          <>
            <Text style={[styles.sectionTitle, { color: textColor }]}>{selectedSection.title}</Text>
            <View style={[styles.appsGrid, styles.lettersAppsList]}>
              {classPreKApps.map((app) => renderAppCard(app, selectedKey))}
            </View>
            <Text style={[styles.groupTitle, { color: textColor }]}>first grade</Text>
            <View style={[styles.appsGrid, styles.lettersAppsList]}>
              {classFirstGradeApps.map((app) => renderAppCard(app, selectedKey))}
            </View>
            <Text style={[styles.groupTitle, { color: textColor }]}>second grade</Text>
            <View style={[styles.appsGrid, styles.lettersAppsList]}>
              {classSecondGradeApps.map((app) => renderAppCard(app, selectedKey))}
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: textColor }]}>{selectedSection.title}</Text>
            <View style={styles.appsGrid}>
              {selectedSection.apps.map((app) => renderAppCard(app, selectedKey))}
            </View>
          </>
        )}
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lettersAppsList: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
  appCard: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  letterAppCard: {
    width: "100%",
    aspectRatio: 2,
    marginBottom: 12,
  },
  appImage: {
    width: "100%",
    height: "100%",
  },
  appCardLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  appCardText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});

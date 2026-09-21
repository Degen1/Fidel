import {
  useCallback,
  useMemo,
  useState,
  type ComponentProps } from "react";
import { Pressable,
  StyleSheet,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

import { FIRST_GRADE_COURSES, type FirstGradeCourseKey } from "@/constants/first-grade-courses";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { AppText as Text } from "@/components/app-text";
type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const COURSE_ICONS: Record<FirstGradeCourseKey, MaterialIconName[]> = {
  math: ["pin", "compare-arrows", "add", "remove", "category", "straighten"],
  tigrinya: ["text-fields", "extension", "short-text", "directions-run", "menu-book", "edit"],
  english: ["abc", "volume-up", "waving-hand", "palette", "family-restroom", "chat-bubble-outline"],
  science: ["accessibility-new", "eco", "local-florist", "pets", "water-drop", "wb-sunny"],
};

export function FirstGradeCourseScreen({ courseKey }: { courseKey: FirstGradeCourseKey }) {
  const course = FIRST_GRADE_COURSES[courseKey];
  const [lessonIndex, setLessonIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const isDark = useColorScheme() === "dark";
  const lesson = course.lessons[lessonIndex];
  const colors = {
    background: isDark ? "#0B1220" : "#F8FAFC",
    rail: isDark ? "#050A14" : "#E2E8F0",
    elevated: isDark ? "#1D2939" : "#F1F5F9",
    text: isDark ? "#F8FAFC" : "#14213D",
    secondary: isDark ? "#B6C2D2" : "#526074",
    border: isDark ? "#2D3B52" : "#E2E8F0",
  };

  const selectLesson = (index: number) => {
    setLessonIndex(index);
    setShowAnswer(false);
  };

  const showPreviousLesson = useCallback(() => {
    setLessonIndex((current) => Math.max(0, current - 1));
    setShowAnswer(false);
  }, []);

  const showNextLesson = useCallback(() => {
    setLessonIndex((current) => Math.min(course.lessons.length - 1, current + 1));
    setShowAnswer(false);
  }, [course.lessons.length]);

  const lessonGesture = useMemo(
    () =>
      Gesture.Race(
        Gesture.Fling().direction(Directions.UP).onEnd(() => scheduleOnRN(showNextLesson)),
        Gesture.Fling().direction(Directions.DOWN).onEnd(() => scheduleOnRN(showPreviousLesson)),
      ),
    [showNextLesson, showPreviousLesson],
  );

  return (
    <GestureDetector gesture={lessonGesture}>
      <View style={[styles.screen, { backgroundColor: colors.background }]}> 
        <View style={[styles.lessonRail, { backgroundColor: colors.rail, borderRightColor: colors.border }]}> 
          <View style={styles.lessonRailContent}>
            {course.lessons.map((item, index) => {
              const active = index === lessonIndex;
              return (
                <Pressable
                  key={item.title}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  accessibilityState={{ selected: active }}
                  onPress={() => selectLesson(index)}
                  style={({ pressed }) => [
                    styles.lessonTab,
                    { backgroundColor: active ? course.accent : "transparent", borderColor: active ? course.accent : colors.border },
                    pressed && styles.pressed,
                  ]}
                >
                  {courseKey === "tigrinya" && index === 0 ? (
                    <Text style={[styles.lessonLetter, { color: active ? "#FFFFFF" : colors.secondary }]}>ፊ</Text>
                  ) : (
                    <MaterialIcons
                      name={COURSE_ICONS[courseKey][index]}
                      size={27}
                      color={active ? "#FFFFFF" : colors.secondary}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.lessonCard}>
          <Text selectable style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
          <Text selectable style={[styles.explanation, { color: colors.secondary }]}>{lesson.explanation}</Text>

          <View style={[styles.sectionBlock, { borderTopColor: colors.border }]}> 
            <Text selectable style={[styles.sectionLabel, { color: colors.text }]}>ኣብነታት</Text>
            {lesson.examples.map((example) => (
              <Text selectable key={example} style={[styles.example, { color: colors.text }]}>• {example}</Text>
            ))}
          </View>

          <View style={[styles.sectionBlock, { borderTopColor: colors.border }]}> 
            <View style={styles.practiceHeading}>
              <MaterialIcons name="lightbulb-outline" size={22} color={course.accent} />
              <Text selectable style={[styles.sectionLabel, { color: colors.text }]}>ንለማመድ</Text>
            </View>
            <Text selectable style={[styles.question, { color: colors.text }]}>{lesson.question}</Text>
            {showAnswer ? (
              <View style={[styles.answer, { backgroundColor: colors.elevated }]}> 
                <Text selectable style={[styles.answerText, { color: colors.text }]}>{lesson.answer}</Text>
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowAnswer((current) => !current)}
              style={({ pressed }) => [styles.answerButton, { backgroundColor: course.accent }, pressed && styles.pressed]}
            >
              <Text style={styles.answerButtonText}>{showAnswer ? "መልሲ ሕባእ" : "መልሲ ርአ"}</Text>
            </Pressable>
          </View>
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: "row" },
  lessonRail: { width: 88, flexGrow: 0, borderRightWidth: StyleSheet.hairlineWidth },
  lessonRailContent: { flex: 1, paddingHorizontal: 10, paddingTop: 64, paddingBottom: 100, gap: 10, alignItems: "center" },
  mainContent: { flex: 1, justifyContent: "center", paddingHorizontal: 22, paddingTop: 48, paddingBottom: 120, width: "100%", maxWidth: 620, alignSelf: "center" },
  lessonTab: { width: 52, height: 52, borderWidth: 1, borderRadius: 14, borderCurve: "continuous", justifyContent: "center", alignItems: "center" },
  lessonLetter: { fontSize: 27, lineHeight: 34, fontWeight: "800", textAlign: "center" },
  lessonCard: { gap: 8 },
  lessonTitle: { fontSize: 25, lineHeight: 35, fontWeight: "900" },
  explanation: { fontSize: 17, lineHeight: 28, paddingTop: 3 },
  sectionBlock: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 16, gap: 8, marginTop: 12 },
  sectionLabel: { fontSize: 15, lineHeight: 22, fontWeight: "900" },
  example: { fontSize: 16, lineHeight: 26 },
  practiceHeading: { flexDirection: "row", alignItems: "center", gap: 8 },
  question: { fontSize: 17, lineHeight: 27, fontWeight: "700" },
  answer: { padding: 13, borderRadius: 12, borderCurve: "continuous" },
  answerText: { fontSize: 16, lineHeight: 25, fontWeight: "700" },
  answerButton: { alignSelf: "flex-start", minHeight: 42, paddingHorizontal: 17, borderRadius: 12, borderCurve: "continuous", alignItems: "center", justifyContent: "center" },
  answerButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});

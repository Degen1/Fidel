import { StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { AppText as Text } from "@/components/app-text";
export default function OthersScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? "#111827" : "#F3F4F6", paddingTop: insets.top }]} edges={["left", "right"]}>
      <View style={styles.content}>
        <Text style={[styles.message, { color: isDark ? "#F9FAFB" : "#111827" }]}>coming soom</Text>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
});

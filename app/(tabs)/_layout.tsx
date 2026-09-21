import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs
      backBehavior="none"
      labelStyle={{
        fontFamily: "AbyssinicaSIL",
        fontWeight: process.env.EXPO_OS === "android" ? "400" : undefined,
      }}
    >
      <NativeTabs.Trigger name="class">
        <NativeTabs.Trigger.Label>ክፍሊ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="books.vertical.fill" md="menu_book" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="games">
        <NativeTabs.Trigger.Label>ጸወታ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gamecontroller.fill" md="sports_esports" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="translate">
        <NativeTabs.Trigger.Label>ትርጉም</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="globe" md="language" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="words">
        <NativeTabs.Trigger.Label>ቃላት</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.stack.fill" md="view_carousel" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>መማረጺ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs backBehavior="none">
      <NativeTabs.Trigger name="class">
        <NativeTabs.Trigger.Label>ክድሊ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('../../assets/images/tab.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="games">
        <NativeTabs.Trigger.Label>ጸወታ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gamecontroller.fill" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="translate">
        <NativeTabs.Trigger.Label>ትርጉም</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="globe" drawable="ic_menu_mapmode" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="words">
        <NativeTabs.Trigger.Label>ቃላት</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.stack.fill" drawable="ic_menu_view" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>መማረጺ</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

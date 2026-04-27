import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs backBehavior="none">
      <NativeTabs.Trigger name="class">
        <Label>ክድሊ</Label>
        <Icon src={require('../../assets/images/tab.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="games">
        <Label>ጸወታ</Label>
        <Icon sf="gamecontroller.fill" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tests">
        <Label>ፈተና</Label>
        <Icon sf="checkmark.circle.fill" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>መማረጺ</Label>
        <Icon sf="gearshape.fill" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

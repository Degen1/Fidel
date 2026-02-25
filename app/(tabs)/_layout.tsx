import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {

  return (
    <NativeTabs>
          <NativeTabs.Trigger name="index">
            <Label>ደጀን</Label>
            <Icon sf={"house.fill"} 
            drawable="ic_menu_mylocation" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="explore">
            <Label>ተወሳኺ</Label>
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="settings">
            <Label>ተወሳኺ</Label>
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          
    </NativeTabs>
  );
}

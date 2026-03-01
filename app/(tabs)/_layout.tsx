import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {

  return (
    <NativeTabs>
          <NativeTabs.Trigger name="letters">
            <Label>ፊደል</Label>
            <Icon sf={"house.fill"} 
            drawable="ic_menu_mylocation" />
          </NativeTabs.Trigger>

          

           <NativeTabs.Trigger name="numbers">
            <Label>ቁጽሪ</Label>
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="colors">
            <Label>ሕብሪ</Label>
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="settings">
            <Label>መማረጺ</Label>
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          
    </NativeTabs>
  );
}

import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {

  return (
    <NativeTabs>
          <NativeTabs.Trigger name="letters">
            <Label>ፊደል</Label>
            <Icon src={require('../../assets/images/tab-letter-fi.png')} />
          </NativeTabs.Trigger>

          

           <NativeTabs.Trigger name="numbers">
            <Label>ቁጽሪ</Label>
            <Icon sf={"3.circle.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="colors">
            <Label>ሕብሪ</Label>
            <Icon sf={"paintpalette.fill"} 
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

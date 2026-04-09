import { NativeTabs,Label, Icon } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {

  return (
    <NativeTabs>
          <NativeTabs.Trigger name="mine">
            <Label>ናተይ</Label>
            <Icon src={require('../../assets/images/tab.png')} />
          </NativeTabs.Trigger>

          

           <NativeTabs.Trigger name="more">
            <Label>ክፍሊ</Label>
            <Icon sf={"3.circle.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="others">
           <Label>ሕብሪ</Label>
            <Icon sf={"paintpalette.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="settings">
          <Label>መማረጺ</Label>
            <Icon sf={"gearshape.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          

          
    </NativeTabs>
  );
}

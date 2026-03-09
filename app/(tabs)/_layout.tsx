import { NativeTabs, Icon } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {

  return (
    <NativeTabs>
          <NativeTabs.Trigger name="mine">
            <Icon src={require('../../assets/images/tab-letter-fi.png')} />
          </NativeTabs.Trigger>

          

           <NativeTabs.Trigger name="more">
            <Icon sf={"3.circle.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="colors">
            <Icon sf={"paintpalette.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="settings">
            <Icon sf={"paperplane.fill"} 
            drawable="ic_menu_manage" />
          </NativeTabs.Trigger>

          
    </NativeTabs>
  );
}

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { LogBox, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { APP_FONT_FAMILY } from '@/components/app-text';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

LogBox.ignoreLogs(["It looks like you might be using shared value's .value inside reanimated inline style."]);

const withAppFont = (theme: typeof DefaultTheme) => ({
  ...theme,
  fonts: Object.fromEntries(
    Object.entries(theme.fonts).map(([name, style]) => [
      name,
      {
        ...style,
        fontFamily: APP_FONT_FAMILY,
        ...(process.env.EXPO_OS === 'android' ? { fontWeight: '400' as const } : null),
      },
    ]),
  ) as typeof theme.fonts,
});
const appLightTheme = withAppFont(DefaultTheme);
const appDarkTheme = withAppFont(DarkTheme);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    [APP_FONT_FAMILY]: require('../assets/fonts/AbyssinicaSIL-Regular.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? appDarkTheme : appLightTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
            animationMatchesGesture: true,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
              animationMatchesGesture: false,
            }}
          />
          <Stack.Screen
            name="all-letters"
            options={{
              presentation: 'modal',
              gestureEnabled: true,
              gestureDirection: 'vertical',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar
          animated
          translucent
          backgroundColor="transparent"
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

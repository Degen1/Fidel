import { forwardRef } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  type TextInputProps,
  type TextProps,
} from "react-native";

export const APP_FONT_FAMILY = "AbyssinicaSIL";
const APP_FONT_STYLE = {
  fontFamily: APP_FONT_FAMILY,
  ...(process.env.EXPO_OS === "android"
    ? { fontWeight: "400" as const, fontStyle: "normal" as const }
    : null),
};

export const AppText = forwardRef<NativeText, TextProps>(function AppText(
  { style, ...props },
  ref,
) {
  return <NativeText ref={ref} {...props} style={[style, APP_FONT_STYLE]} />;
});

export const AppTextInput = forwardRef<NativeTextInput, TextInputProps>(
  function AppTextInput({ style, ...props }, ref) {
    return (
      <NativeTextInput
        ref={ref}
        {...props}
        style={[style, APP_FONT_STYLE]}
      />
    );
  },
);

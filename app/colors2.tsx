import ColorsScreen, { EXTENDED_COLORS, type ColorsScreenProps } from "./(tabs)/colors";

export default function ColorsTwo(props: ColorsScreenProps) {
  return <ColorsScreen {...props} palette={EXTENDED_COLORS} />;
}

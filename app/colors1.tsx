import ColorsScreen, { SIMPLE_COLORS, type ColorsScreenProps } from "./(tabs)/colors";

export default function ColorsOne(props: ColorsScreenProps) {
  return <ColorsScreen {...props} palette={SIMPLE_COLORS} />;
}

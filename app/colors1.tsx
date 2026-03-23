import ColorsScreen, { SIMPLE_COLORS, type ColorsScreenProps } from "@/components/colors-screen";

export default function ColorsOne(props: ColorsScreenProps) {
  return <ColorsScreen {...props} palette={SIMPLE_COLORS} />;
}

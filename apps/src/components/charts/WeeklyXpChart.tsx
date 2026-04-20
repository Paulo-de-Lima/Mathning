import { StyleSheet, Text, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "../../theme/colors";

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type Props = {
  values: number[];
  maxY?: number;
};

/** Gráfico de barras — XP por dia (valores 0–80 no protótipo). */
export function WeeklyXpChart({ values, maxY = 80 }: Props) {
  const w = 280;
  const h = 140;
  const padL = 28;
  const padB = 24;
  const chartW = w - padL - 8;
  const chartH = h - padB - 8;
  const max = Math.max(maxY, ...values, 1);
  const step = chartW / values.length;
  const barW = Math.min(22, step * 0.55);

  const yTicks = [0, 20, 40, 60, 80];

  return (
    <View style={styles.wrap}>
      <Svg width={w} height={h}>
        {yTicks.map((t) => {
          const y = padB + chartH - (t / max) * chartH;
          return (
            <Line
              key={t}
              x1={padL}
              y1={y}
              x2={w - 4}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray="4 6"
            />
          );
        })}
        {yTicks.map((t) => {
          const y = padB + chartH - (t / max) * chartH + 4;
          return (
            <SvgText key={`y-${t}`} x={4} y={y} fontSize={9} fill="#6B7280">
              {t}
            </SvgText>
          );
        })}
        {values.map((v, i) => {
          const bh = (v / max) * chartH;
          const x = padL + i * step + (step - barW) / 2;
          const y = padB + chartH - bh;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={Math.max(bh, v > 0 ? 4 : 0)}
              rx={4}
              fill={colors.primary}
            />
          );
        })}
      </Svg>
      <View style={styles.labels}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.lab}>
            {label}
          </Text>
        ))}
      </View>
      <Text style={styles.caption}>XP ganho por dia da semana</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 252,
    marginTop: -8,
    paddingLeft: 20,
  },
  lab: { fontSize: 10, color: colors.muted, width: 32, textAlign: "center" },
  caption: {
    marginTop: 10,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
});

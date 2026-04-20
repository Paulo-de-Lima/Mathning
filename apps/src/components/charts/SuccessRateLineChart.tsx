import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";
import { colors } from "../../theme/colors";

type Props = {
  /** Valores 0–100, um por rótulo */
  points: number[];
  labels: string[];
};

export function SuccessRateLineChart({ points, labels }: Props) {
  const w = 300;
  const h = 150;
  const padL = 36;
  const padB = 28;
  const chartW = w - padL - 12;
  const chartH = h - padB - 12;
  const max = 100;
  const n = points.length;
  const step = n > 1 ? chartW / (n - 1) : chartW;

  const yTicks = [0, 25, 50, 75, 100];

  const coords = points.map((v, i) => {
    const x = padL + i * step;
    const y = padB + chartH - (v / max) * chartH;
    return { x, y, v };
  });

  const poly = coords.map((c) => `${c.x},${c.y}`).join(" ");

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
              x2={w - 8}
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
            <SvgText key={`y-${t}`} x={4} y={y} fontSize={10} fill="#6B7280">
              {t}
            </SvgText>
          );
        })}
        <Polyline
          points={poly}
          fill="none"
          stroke={colors.success}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((c, i) => (
          <Circle key={i} cx={c.x} cy={c.y} r={5} fill={colors.success} />
        ))}
      </Svg>
      <View style={styles.xLabels}>
        {labels.map((label) => (
          <Text key={label} style={styles.xLab}>
            {label}
          </Text>
        ))}
      </View>
      <Text style={styles.caption}>Taxa de acerto mensal (%)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 260,
    marginTop: -18,
    paddingLeft: 24,
  },
  xLab: { fontSize: 11, color: colors.muted, width: 48, textAlign: "center" },
  caption: {
    marginTop: 12,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
});

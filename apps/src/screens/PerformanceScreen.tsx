import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { xpToNextLevel } from "@mathning/shared";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SuccessRateLineChart } from "../components/charts/SuccessRateLineChart";
import { WeeklyXpChart } from "../components/charts/WeeklyXpChart";
import { BottomNav } from "../components/BottomNav";
import { useAuthContext } from "../context/AuthContext";
import { useAppHeader } from "../hooks/useAppHeader";
import type { RootStackParamList } from "../navigation/types";
import { colors, radius } from "../theme/colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
  default: {},
});

function weekBarsFromProgress(totalXp: number, lastActiveDate: string): number[] {
  const days = [0, 0, 0, 0, 0, 0, 0];
  let idx = 0;
  if (lastActiveDate) {
    const d = new Date(`${lastActiveDate}T12:00:00`);
    const w = d.getDay();
    idx = w === 0 ? 6 : w - 1;
  } else {
    const w = new Date().getDay();
    idx = w === 0 ? 6 : w - 1;
  }
  days[idx] = Math.min(80, Math.max(0, totalXp));
  return days;
}

export function PerformanceScreen() {
  const navigation = useNavigation<Nav>();
  useAppHeader(navigation, "Desempenho");
  const { progress, loading } = useAuthContext();

  if (loading || !progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { currentLevel, xpIntoLevel, xpForNext } = xpToNextLevel(progress.xp);
  const nextLevel = currentLevel + 1;
  const xpRemaining = Math.max(0, xpForNext - xpIntoLevel);
  const total = progress.stats.correct + progress.stats.wrong;
  const rate =
    total > 0 ? Math.round((progress.stats.correct / total) * 100) : 0;
  const wrongPct = total > 0 ? Math.round((progress.stats.wrong / total) * 100) : 0;

  const weekValues = weekBarsFromProgress(progress.xp, progress.lastActiveDate);
  const linePoints = [0, 0, 0, rate];
  const lineLabels = ["Jan", "Fev", "Mar", "Abr"];

  const tips = [
    "Continue praticando diariamente para manter sua sequência",
    "Revise lições anteriores para reforçar o aprendizado",
    rate >= 60
      ? "Sua taxa de acerto está ótima! Mantenha o ritmo"
      : "Foque nas lições com mais erros para subir sua taxa",
  ];

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heroTitle}>Desempenho</Text>
        <Text style={styles.heroSub}>
          Visão geral do seu progresso e estatísticas detalhadas.
        </Text>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.cardHead}>
            <Ionicons name="ribbon-outline" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Métricas principais</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCell, { backgroundColor: colors.metricBlueBg }]}>
              <View style={styles.metricLabelRow}>
                <Text style={styles.metricLabel}>Nível</Text>
                <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
              </View>
              <Text style={[styles.metricVal, { color: colors.metricBlueText }]}>
                {currentLevel}
              </Text>
            </View>
            <View style={[styles.metricCell, { backgroundColor: colors.metricPurpleBg }]}>
              <View style={styles.metricLabelRow}>
                <Text style={styles.metricLabel}>XP total</Text>
                <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
              </View>
              <Text style={[styles.metricVal, { color: colors.primary }]}>{progress.xp}</Text>
            </View>
            <View style={[styles.metricCell, { backgroundColor: colors.metricGreenBg }]}>
              <View style={styles.metricLabelRow}>
                <Text style={styles.metricLabel}>Taxa</Text>
                <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
              </View>
              <Text style={[styles.metricVal, { color: colors.success }]}>{rate}%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.cardHeadBetween}>
            <Text style={styles.cardTitlePlain}>XP até o próximo nível</Text>
            <Ionicons name="trending-up" size={22} color={colors.primary} />
          </View>
          <View style={styles.barThick}>
            <View
              style={[
                styles.barThickFill,
                { width: `${(xpIntoLevel / xpForNext) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.xpFoot}>
            <Text style={styles.muted}>
              {xpIntoLevel} / {xpForNext} XP
            </Text>
            <Text style={styles.xpRemain}>
              Faltam {xpRemaining} XP · nível {nextLevel}
            </Text>
          </View>
        </View>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.cardHead}>
            <Ionicons name="calendar-outline" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Atividade semanal</Text>
          </View>
          <WeeklyXpChart values={weekValues} />
        </View>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.cardHead}>
            <Ionicons name="trending-up" size={22} color={colors.success} />
            <Text style={styles.cardTitle}>Evolução da taxa de acerto</Text>
          </View>
          <SuccessRateLineChart points={linePoints} labels={lineLabels} />
        </View>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.cardHead}>
            <Ionicons name="locate-outline" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Estatísticas detalhadas</Text>
          </View>
          <View style={styles.detailOk}>
            <View style={styles.detailIconWrap}>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </View>
            <View style={styles.detailMid}>
              <Text style={styles.detailLbl}>Total de acertos</Text>
              <Text style={styles.detailNum}>{progress.stats.correct}</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailSmall}>do total</Text>
              <Text style={styles.detailPctOk}>{rate}%</Text>
            </View>
          </View>
          <View style={styles.detailBad}>
            <View style={[styles.detailIconWrap, styles.detailIconBad]}>
              <Ionicons name="close" size={20} color="#fff" />
            </View>
            <View style={styles.detailMid}>
              <Text style={styles.detailLbl}>Total de erros</Text>
              <Text style={styles.detailNum}>{progress.stats.wrong}</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailSmall}>do total</Text>
              <Text style={styles.detailPctBad}>{wrongPct}%</Text>
            </View>
          </View>
          <View style={styles.detailDivider} />
          <Text style={styles.detailTotalFoot}>
            Total de {total} exercícios completados
          </Text>
        </View>

        <View style={styles.tipsCard}>
          <View style={styles.tipsHead}>
            <Ionicons name="information-circle" size={22} color={colors.infoText} />
            <Text style={styles.tipsTitle}>Dicas para melhorar</Text>
          </View>
          {tips.map((t, i) => (
            <Text key={i} style={styles.tipLine}>
              • {t}
            </Text>
          ))}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} route="Performance" />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 36, gap: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  heroSub: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  cardHeadBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  cardTitlePlain: { fontSize: 16, fontWeight: "700", color: colors.text, flex: 1 },
  metricsRow: { flexDirection: "row", gap: 8 },
  metricCell: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 88,
    justifyContent: "center",
  },
  metricLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 0.5,
  },
  metricVal: { fontSize: 22, fontWeight: "800" },
  barThick: {
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginBottom: 10,
  },
  barThickFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  xpFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  muted: { color: colors.muted, fontSize: 14 },
  xpRemain: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  detailOk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.successBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  detailBad: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.errorBg,
    borderRadius: 14,
    padding: 14,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  detailIconBad: { backgroundColor: colors.error },
  detailMid: { flex: 1 },
  detailLbl: { fontSize: 13, color: colors.muted, marginBottom: 2 },
  detailNum: { fontSize: 24, fontWeight: "800", color: colors.text },
  detailRight: { alignItems: "flex-end" },
  detailSmall: { fontSize: 12, color: colors.muted },
  detailPctOk: { fontSize: 16, fontWeight: "700", color: colors.successDark },
  detailPctBad: { fontSize: 16, fontWeight: "700", color: colors.errorDark },
  detailDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  detailTotalFoot: {
    textAlign: "center",
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  tipsCard: {
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    marginBottom: 8,
  },
  tipsHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  tipsTitle: { fontSize: 16, fontWeight: "700", color: colors.infoText },
  tipLine: {
    fontSize: 14,
    color: colors.infoText,
    lineHeight: 22,
    marginBottom: 4,
  },
});

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import {
  DAILY_GOAL_EXERCISES,
  getLesson,
  getModuleById,
  xpToNextLevel,
} from "@mathning/shared";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  android: { elevation: 4 },
  default: {},
});

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  useAppHeader(navigation, "Mathning");
  const { progress, loading, error, demo } = useAuthContext();
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  if (loading || !progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.muted}>Carregando…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{error}</Text>
      </View>
    );
  }

  const { currentLevel, xpIntoLevel, xpForNext } = xpToNextLevel(progress.xp);
  const nextLevel = currentLevel + 1;
  const xpRemaining = Math.max(0, xpForNext - xpIntoLevel);
  const today = new Date().toISOString().slice(0, 10);
  const daily =
    progress.dailyExerciseDate === today ? progress.dailyExerciseCount ?? 0 : 0;
  const dailyPct = Math.min(100, Math.round((daily / DAILY_GOAL_EXERCISES) * 100));
  const goalMet = daily >= DAILY_GOAL_EXERCISES;
  const modTitle =
    getModuleById(progress.currentModuleId)?.title ?? progress.currentModuleId;
  const lessonLabel =
    getLesson(progress.currentModuleId, progress.currentLessonId)?.title ??
    progress.currentLessonId;

  const totalAnswers = progress.stats.correct + progress.stats.wrong;
  const rate =
    totalAnswers > 0
      ? Math.round((progress.stats.correct / totalAnswers) * 100)
      : 0;

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {demo && showDemoBanner && (
          <View style={styles.banner}>
            <Ionicons name="warning-outline" size={22} color={colors.warning} />
            <Text style={styles.bannerTxt} accessibilityRole="text">
              Modo demonstração ativo. Configure EXPO_PUBLIC_* no arquivo .env para conectar ao
              Firebase.
            </Text>
            <Pressable
              onPress={() => setShowDemoBanner(false)}
              hitSlop={10}
              accessibilityLabel="Fechar aviso"
            >
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>
        )}

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.eyebrow}>Seu nível</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelLeft}>
              <Text style={styles.levelNum}>{currentLevel}</Text>
              <Ionicons name="information-circle-outline" size={18} color={colors.muted} />
            </View>
            <View style={styles.ribbonWrap}>
              <Ionicons name="ribbon-outline" size={36} color={colors.primaryMuted} />
            </View>
          </View>
          <View style={styles.bar}>
            <View
              style={[
                styles.barFill,
                { width: `${(xpIntoLevel / xpForNext) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.levelFooter}>
            <Text style={styles.muted}>
              {xpIntoLevel} / {xpForNext} XP
            </Text>
            <Text style={styles.xpHint}>
              Faltam {xpRemaining} XP para o nível {nextLevel}
            </Text>
          </View>
        </View>

        <View style={[styles.card, cardShadow]}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIconBox}>
              <Ionicons name="locate-outline" size={22} color={colors.success} />
            </View>
            <View style={styles.goalTitles}>
              <Text style={styles.h2}>Meta de hoje</Text>
              <Text style={styles.muted}>
                {daily} de {DAILY_GOAL_EXERCISES} exercícios
              </Text>
            </View>
            {goalMet && (
              <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            )}
          </View>
          <View style={styles.bar}>
            <View style={[styles.barFill, styles.barGreen, { width: `${dailyPct}%` }]} />
          </View>
          {goalMet && (
            <View style={styles.goalSuccessRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.goalSuccessTxt}>Parabéns! Meta de hoje concluída!</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.h2}>Continuar</Text>
          <Text style={styles.muted}>
            <Text>Módulo: </Text>
            <Text style={styles.bold}>{modTitle}</Text>
            <Text> · Lição: </Text>
            <Text style={styles.bold}>{lessonLabel}</Text>
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("TheoryDetail", {
                moduleId: progress.currentModuleId,
                lessonId: progress.currentLessonId,
              })
            }
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.primaryBtnTxt}>Continuar de onde parei</Text>
          </Pressable>
        </View>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.h2}>Estatísticas de hoje</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <View style={[styles.statIconBg, { backgroundColor: colors.streakBg }]}>
                <Ionicons name="pulse-outline" size={22} color={colors.streak} />
              </View>
              <Text style={styles.statNum}>{progress.streak ?? 0}</Text>
              <Text style={styles.statLabel}>Dia de sequência</Text>
            </View>
            <View style={styles.statCol}>
              <View style={[styles.statIconBg, { backgroundColor: colors.successBg }]}>
                <Ionicons name="checkmark" size={22} color={colors.success} />
              </View>
              <Text style={styles.statNum}>{progress.stats.correct}</Text>
              <Text style={styles.statLabel}>Acertos</Text>
            </View>
            <View style={styles.statCol}>
              <View style={[styles.statIconBg, { backgroundColor: colors.errorBg }]}>
                <Ionicons name="close" size={22} color={colors.error} />
              </View>
              <Text style={styles.statNum}>{progress.stats.wrong}</Text>
              <Text style={styles.statLabel}>Erros</Text>
            </View>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.muted}>Taxa de acerto</Text>
            <Text style={styles.rateVal}>{rate}%</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} route="Dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 32, gap: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: colors.warningBg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: 12,
  },
  bannerTxt: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 18 },
  eyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 6,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  levelLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  levelNum: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.primary,
  },
  ribbonWrap: {
    padding: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
  },
  bar: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginBottom: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  barGreen: { backgroundColor: colors.success },
  levelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  xpHint: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  muted: { color: colors.muted, fontSize: 14 },
  h2: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  bold: { fontWeight: "700", color: colors.text },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.successBg,
    alignItems: "center",
    justifyContent: "center",
  },
  goalTitles: { flex: 1 },
  goalSuccessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  goalSuccessTxt: { color: colors.successDark, fontSize: 14, fontWeight: "600" },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.btn,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14,
  },
  statCol: { flex: 1, alignItems: "center", gap: 6 },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statNum: { fontSize: 22, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 12, color: colors.muted, textAlign: "center" },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  rateVal: { fontSize: 16, fontWeight: "700", color: colors.primary },
  err: { color: colors.error },
});

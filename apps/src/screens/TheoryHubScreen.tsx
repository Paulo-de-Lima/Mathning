import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { MODULES } from "@mathning/shared";
import { Ionicons } from "@expo/vector-icons";
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
import { isLessonUnlocked } from "../lib/progression";
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

const THEORY_VISUAL = {
  add: { color: "#10B981", icon: "add-circle" as const, label: "Adição" },
  subtract: { color: "#A855F7", icon: "remove-circle" as const, label: "Subtração" },
  multiply: { color: "#F59E0B", icon: "close-circle" as const, label: "Multiplicação" },
  divide: { color: "#2563EB", icon: "git-compare" as const, label: "Divisão" },
};

/**
 * Tela principal de Teoria (mesmo nível da Trilha): lista fases e assuntos para ler antes de praticar.
 */
export function TheoryHubScreen() {
  const navigation = useNavigation<Nav>();
  useAppHeader(navigation, "Teoria");
  const { progress, loading } = useAuthContext();
  const completed = progress?.completedLessonIds ?? [];

  if (loading || !progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const activeModules = MODULES.filter((m) => m.available);
  const lockedModules = MODULES.filter((m) => !m.available);

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, cardShadow]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="library-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Biblioteca de Teoria</Text>
              <Text style={styles.heroSub}>
                Estude primeiro, pratique depois. Aqui você lê os conceitos com exemplos visuais.
              </Text>
            </View>
          </View>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <Ionicons name="book-outline" size={14} color={colors.primary} />
              <Text style={styles.heroMetaTxt}>
                {activeModules.reduce((acc, m) => acc + m.lessons.length, 0)} assuntos
              </Text>
            </View>
            <View style={styles.heroMetaPill}>
              <Ionicons name="checkmark-circle-outline" size={14} color={colors.successDark} />
              <Text style={styles.heroMetaTxt}>{completed.length} concluídos</Text>
            </View>
          </View>
        </View>

        {activeModules.map((mod, phaseIdx) => {
          return (
            <View key={mod.id} style={styles.moduleSection}>
              <View style={styles.moduleHead}>
                <View style={styles.moduleHeadLeft}>
                  <View style={styles.moduleBadge}>
                    <Text style={styles.moduleBadgeTxt}>{phaseIdx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.moduleLabel}>Fase {phaseIdx + 1}</Text>
                    <Text style={styles.moduleTitle}>{mod.title}</Text>
                  </View>
                </View>
                <View style={styles.moduleReadPill}>
                  <Text style={styles.moduleReadPillTxt}>Somente leitura</Text>
                </View>
              </View>
              <Text style={styles.moduleDesc}>{mod.description}</Text>

              {mod.lessons.map((lesson) => {
                const isDone = completed.includes(lesson.id);
                const open = isLessonUnlocked(mod.id, lesson.id, completed);
                const visual = THEORY_VISUAL[lesson.operation];
                const goTheoryDetail = () =>
                  navigation.navigate("TheoryDetail", {
                    moduleId: mod.id,
                    lessonId: lesson.id,
                  });
                const goPractice = () =>
                  navigation.navigate("Exercise", {
                    moduleId: mod.id,
                    lessonId: lesson.id,
                  });

                return (
                  <View
                    key={lesson.id}
                    style={[
                      styles.topicCard,
                      cardShadow,
                      !open && styles.topicCardLocked,
                    ]}
                  >
                    <View style={styles.topicTop}>
                      <View
                        style={[
                          styles.topicIcon,
                          { backgroundColor: `${visual.color}1F` },
                        ]}
                      >
                        <Ionicons
                          name={open ? visual.icon : "lock-closed"}
                          size={20}
                          color={open ? visual.color : colors.locked}
                        />
                      </View>
                      <View style={styles.topicMain}>
                        <View style={styles.topicTitleRow}>
                          <Text style={[styles.topicTitle, !open && styles.topicTitleOff]}>
                            {lesson.title}
                          </Text>
                          <View style={[styles.operationPill, { backgroundColor: `${visual.color}1A` }]}>
                            <Text style={[styles.operationPillTxt, { color: visual.color }]}>
                              {visual.label}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.topicSummary, !open && styles.topicSummaryOff]}>
                          {lesson.summary}
                        </Text>
                        <View style={styles.topicFoot}>
                          <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={colors.muted} />
                            <Text style={styles.metaTxt}>Leitura rápida</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Ionicons name="eye-outline" size={14} color={colors.muted} />
                            <Text style={styles.metaTxt}>Exemplos visuais</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.topicActions}>
                      <Pressable
                        disabled={!open}
                        onPress={goTheoryDetail}
                        style={({ pressed }) => [
                          styles.readBtn,
                          pressed && open && { opacity: 0.9 },
                          !open && styles.readBtnDisabled,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Ler teoria: ${lesson.title}`}
                      >
                        <Ionicons
                          name={open ? "book-outline" : "lock-closed-outline"}
                          size={16}
                          color={open ? colors.primary : colors.locked}
                        />
                        <Text style={[styles.readBtnTxt, !open && styles.readBtnTxtOff]}>
                          {open ? "Ler teoria" : "Bloqueado"}
                        </Text>
                      </Pressable>
                      {open && lesson.practiceEnabled !== false ? (
                        <Pressable
                          onPress={goPractice}
                          style={({ pressed }) => [
                            styles.practiceBtn,
                            pressed && { opacity: 0.9 },
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={`Praticar ${lesson.title}`}
                        >
                          <Text style={styles.practiceBtnTxt}>Praticar</Text>
                        </Pressable>
                      ) : null}
                      {isDone ? (
                        <View style={styles.donePill}>
                          <Ionicons name="checkmark-circle" size={14} color={colors.successDark} />
                          <Text style={styles.donePillTxt}>Concluído</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {lockedModules.map((mod, i) => {
          const phaseNum = activeModules.length + i + 1;
          return (
            <View key={mod.id} style={[styles.comingSoonCard, cardShadow]}>
              <View style={styles.comingSoonRow}>
                <Ionicons name="lock-closed" size={18} color={colors.locked} />
                <Text style={styles.comingSoonLabel}>Fase {phaseNum} · Em breve</Text>
              </View>
              <Text style={styles.comingSoonTitle}>{mod.title}</Text>
              <Text style={styles.comingSoonDesc}>{mod.description}</Text>
            </View>
          );
        })}
      </ScrollView>
      <BottomNav navigation={navigation} route="Teoria" />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 36, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heroTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  heroIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextWrap: { flex: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  heroSub: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  heroMetaRow: { marginTop: 12, flexDirection: "row", gap: 8, flexWrap: "wrap" },
  heroMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  heroMetaTxt: { fontSize: 12, color: colors.text, fontWeight: "600" },
  moduleSection: { gap: 10 },
  moduleHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  moduleHeadLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  moduleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleBadgeTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
  moduleLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  moduleTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
  },
  moduleReadPill: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  moduleReadPillTxt: { color: colors.primaryText, fontWeight: "700", fontSize: 11 },
  moduleDesc: { color: colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 2 },
  topicCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: 12,
  },
  topicCardLocked: { opacity: 0.6 },
  topicTop: { flexDirection: "row", gap: 12 },
  topicIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  topicMain: { flex: 1, gap: 6 },
  topicTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  topicTitle: { fontSize: 17, fontWeight: "800", color: colors.text, flex: 1 },
  topicTitleOff: { color: colors.muted },
  operationPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  operationPillTxt: { fontSize: 11, fontWeight: "700" },
  topicSummary: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  topicSummaryOff: { color: "#9CA3AF" },
  topicFoot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 12, color: colors.muted },
  topicActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  readBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9DDF0",
    backgroundColor: "#F7F8FF",
  },
  readBtnDisabled: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  readBtnTxt: { color: colors.primaryText, fontSize: 13, fontWeight: "700" },
  readBtnTxtOff: { color: colors.locked },
  practiceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  practiceBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 13 },
  donePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  donePillTxt: {
    color: colors.successDark,
    fontSize: 12,
    fontWeight: "700",
  },
  comingSoonCard: {
    borderRadius: radius.card,
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  comingSoonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  comingSoonLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  comingSoonTitle: { color: colors.text, fontSize: 17, fontWeight: "800", marginBottom: 4 },
  comingSoonDesc: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});

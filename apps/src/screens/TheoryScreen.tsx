import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import {
  getLesson,
  getModuleById,
  markLessonCompleted,
  setCurrentLesson,
} from "@mathning/shared";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { useAppHeader } from "../hooks/useAppHeader";
import { markDemoLessonDone } from "../lib/demoProgress";
import { isLessonUnlocked } from "../lib/progression";
import type { RootStackParamList } from "../navigation/types";
import { colors, radius } from "../theme/colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, "TheoryDetail">;

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

export function TheoryScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<R>();
  const { moduleId, lessonId } = params;
  const { progress, db, uid, demo, updateLocalDemo, refreshProgress } =
    useAuthContext();

  const lesson = getLesson(moduleId, lessonId);
  const moduleMeta = getModuleById(moduleId);
  const completed = progress?.completedLessonIds ?? [];
  const unlocked = progress
    ? isLessonUnlocked(moduleId, lessonId, completed)
    : false;

  useAppHeader(navigation, lesson?.title ?? "Teoria");

  useEffect(() => {
    if (!lesson || !progress || !unlocked) return;
    if (
      progress.currentModuleId === moduleId &&
      progress.currentLessonId === lessonId
    ) {
      return;
    }
    if (demo) {
      void updateLocalDemo({
        ...progress,
        currentModuleId: moduleId,
        currentLessonId: lessonId,
      });
      return;
    }
    if (db && uid) {
      void (async () => {
        await setCurrentLesson(db, uid, moduleId, lessonId);
        await refreshProgress();
      })();
    }
  }, [
    lesson,
    moduleId,
    lessonId,
    progress,
    unlocked,
    demo,
    db,
    uid,
    updateLocalDemo,
    refreshProgress,
  ]);

  async function handleCompleteLesson() {
    if (!progress || !lesson) return;
    if (demo) {
      await updateLocalDemo(markDemoLessonDone(progress, lessonId));
    } else if (db && uid) {
      await markLessonCompleted(db, uid, lessonId);
      await refreshProgress();
    }
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text>Conteúdo não encontrado.</Text>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Este assunto ainda está bloqueado.</Text>
        <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnTxt}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const alreadyDone = completed.includes(lessonId);

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="book-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.eyebrow}>Teoria</Text>
          {moduleMeta ? (
            <Text style={styles.moduleName}>{moduleMeta.title}</Text>
          ) : null}
          <Text style={styles.h1}>{lesson.title}</Text>
          <Text style={styles.lead}>
            Leia com calma antes de praticar — assim os exercícios fazem mais sentido.
          </Text>
        </View>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.sectionTitle}>O que você vai aprender</Text>
          <Text style={styles.body}>{lesson.summary}</Text>
          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color={colors.streak} />
            <Text style={styles.tipTxt}>
              Dica: relate a operações do dia a dia (compras, divisão de contas) para fixar o
              conceito.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            navigation.navigate("Exercise", { moduleId, lessonId })
          }
          accessibilityRole="button"
          accessibilityLabel="Ir para a prática deste assunto"
        >
          <Ionicons name="fitness-outline" size={22} color="#fff" />
          <Text style={styles.primaryBtnTxt}>Pratique agora</Text>
        </Pressable>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.small}>
            Depois de praticar, você pode marcar o assunto como concluído na trilha.
          </Text>
          {alreadyDone ? (
            <View style={styles.doneRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              <Text style={styles.ok}>Assunto concluído na trilha</Text>
            </View>
          ) : (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => void handleCompleteLesson()}
            >
              <Text style={styles.secondaryBtnTxt}>Marcar como concluído</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 32, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  hero: { marginBottom: 4 },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  moduleName: { fontSize: 14, color: colors.muted, marginBottom: 4 },
  h1: { fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: 10 },
  lead: { fontSize: 15, color: colors.muted, lineHeight: 22 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  body: { fontSize: 16, color: "#3d3a45", lineHeight: 26 },
  tipBox: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12,
    backgroundColor: colors.streakBg,
    borderRadius: radius.sm,
  },
  tipTxt: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.btn,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 17 },
  secondaryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: radius.btn,
    alignItems: "center",
  },
  secondaryBtnTxt: { color: colors.text, fontWeight: "700" },
  small: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  ok: { fontWeight: "700", color: colors.successDark },
  muted: { color: colors.muted, marginBottom: 12 },
  btn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
});

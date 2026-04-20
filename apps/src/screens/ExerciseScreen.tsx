import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  answersMatch,
  explainSolution,
  formatProblem,
  generateArithmeticProblem,
  getLesson,
  parseUserAnswer,
  recordExerciseOutcome,
  type ArithmeticProblem,
} from "@mathning/shared";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthContext } from "../context/AuthContext";
import { recordDemoExercise } from "../lib/demoProgress";
import { isLessonUnlocked } from "../lib/progression";
import type { RootStackParamList } from "../navigation/types";

type R = RouteProp<RootStackParamList, "Exercise">;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ExerciseScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<R>();
  const { moduleId, lessonId } = params;
  const { progress, db, uid, demo, updateLocalDemo, refreshProgress } =
    useAuthContext();

  const lesson = getLesson(moduleId, lessonId);
  const completed = progress?.completedLessonIds ?? [];
  const unlocked = progress
    ? isLessonUnlocked(moduleId, lessonId, completed)
    : false;

  const [tier, setTier] = useState<1 | 2 | 3>(1);
  const [problem, setProblem] = useState<ArithmeticProblem | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "bad">("idle");
  const [sessionStreak, setSessionStreak] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    setTier(1);
    setSessionStreak(0);
    setProblem(generateArithmeticProblem(lesson.operation, 1));
    setInput("");
    setFeedback("idle");
  }, [moduleId, lessonId, lesson]);

  async function handleSubmit() {
    if (!lesson || !problem || !progress || busy) return;
    const val = parseUserAnswer(input);
    if (val === null) return;

    const ok = answersMatch(val, problem.answer);
    setFeedback(ok ? "ok" : "bad");
    setBusy(true);

    const streakAfter = ok ? sessionStreak + 1 : 0;

    if (demo) {
      const next = recordDemoExercise(progress, ok, streakAfter, lessonId);
      await updateLocalDemo(next);
    } else if (db && uid) {
      await recordExerciseOutcome(db, uid, ok, streakAfter, lessonId);
      await refreshProgress();
    }

    let nextTier = tier;
    let nextStreak = streakAfter;
    if (ok) {
      if (streakAfter >= 3 && tier < 3) {
        nextTier = (tier + 1) as 1 | 2 | 3;
        nextStreak = 0;
      }
    } else if (tier > 1) {
      nextTier = (tier - 1) as 1 | 2 | 3;
      nextStreak = 0;
    }

    setTimeout(() => {
      setTier(nextTier);
      setSessionStreak(nextStreak);
      setProblem(generateArithmeticProblem(lesson.operation, nextTier));
      setInput("");
      setFeedback("idle");
      setBusy(false);
    }, 1400);
  }

  if (!lesson || !unlocked) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Não disponível.</Text>
      </View>
    );
  }

  if (lesson.practiceEnabled === false) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>Prática</Text>
        <Text style={styles.h1}>{lesson.title}</Text>
        <View style={styles.card}>
          <Text style={styles.muted}>
            A prática interativa para este assunto ainda não está disponível. Continue estudando a teoria e
            use as operações básicas para treinar cálculo.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryBtnTxt}>Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (!problem) {
    return (
      <View style={styles.center}>
        <Text>Preparando…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>Prática · {lesson.title}</Text>
      <Text style={styles.h1}>Qual é o resultado?</Text>
      <View style={styles.card}>
        <Text style={styles.sum}>{formatProblem(problem)}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
          placeholder="?"
          placeholderTextColor="#9a94a8"
        />
        <Pressable
          style={[styles.primaryBtn, busy && styles.disabled]}
          disabled={busy}
          onPress={() => void handleSubmit()}
        >
          <Text style={styles.primaryBtnTxt}>Verificar</Text>
        </Pressable>
        {feedback === "ok" && (
          <Text style={styles.ok}>Muito bem! +XP</Text>
        )}
        {feedback === "bad" && (
          <View style={styles.fbBad}>
            <Text style={styles.bad}>Não foi dessa vez.</Text>
            <Text style={styles.small}>{explainSolution(problem)}</Text>
          </View>
        )}
        <Text style={styles.small}>
          Nível {tier} · Sequência na sessão: {sessionStreak}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, backgroundColor: "#f6f4f8", flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  eyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6b6578",
    marginBottom: 4,
  },
  h1: { fontSize: 22, fontWeight: "700", color: "#1a1a22", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2dfe8",
  },
  sum: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#1a1a22",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2dfe8",
    borderRadius: 12,
    padding: 14,
    fontSize: 22,
    marginBottom: 12,
    backgroundColor: "#f6f4f8",
    color: "#1a1a22",
  },
  primaryBtn: {
    backgroundColor: "#5b4dff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.6 },
  ok: { marginTop: 12, color: "#0d9b5c", fontWeight: "600" },
  fbBad: { marginTop: 12 },
  bad: { color: "#c53030", fontWeight: "600" },
  small: { marginTop: 12, fontSize: 13, color: "#6b6578" },
  muted: { color: "#6b6578" },
});

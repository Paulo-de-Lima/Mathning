import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  getLesson,
  getModuleById,
  markLessonCompleted,
  setCurrentLesson,
  type Operation,
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

type TheoryTab = "concept" | "examples";

type LessonExample = {
  id: string;
  title: string;
  expression: string;
  a: number;
  b: number;
  result: number;
  explanation: string;
  schoolMath: {
    top: number;
    bottom: number;
    operationSymbol: "+" | "-" | "x" | "÷";
    note: string;
  };
};

const OPERATION_UI: Record<
  Operation,
  { icon: React.ComponentProps<typeof Ionicons>["name"]; color: string; visualColor: string }
> = {
  add: { icon: "add", color: "#00C853", visualColor: "#10B981" },
  subtract: { icon: "remove", color: "#A855F7", visualColor: "#A855F7" },
  multiply: { icon: "close", color: "#F59E0B", visualColor: "#F59E0B" },
  divide: { icon: "git-compare-outline", color: "#2563EB", visualColor: "#2563EB" },
};

function getExamples(operation: Operation): LessonExample[] {
  if (operation === "add") {
    return [
      {
        id: "ex-1",
        title: "Exemplo 1",
        expression: "2 + 3 = 5",
        a: 2,
        b: 3,
        result: 5,
        explanation: "Ao juntar 2 com 3, temos 5 no total.",
        schoolMath: {
          top: 2,
          bottom: 3,
          operationSymbol: "+",
          note: "Somamos as unidades: 2 + 3 = 5.",
        },
      },
      {
        id: "ex-2",
        title: "Exemplo 2",
        expression: "5 + 4 = 9",
        a: 5,
        b: 4,
        result: 9,
        explanation: "Ao juntar 5 com 4, temos 9 no total.",
        schoolMath: {
          top: 5,
          bottom: 4,
          operationSymbol: "+",
          note: "Somamos as unidades: 5 + 4 = 9.",
        },
      },
    ];
  }

  if (operation === "subtract") {
    return [
      {
        id: "ex-1",
        title: "Exemplo 1",
        expression: "5 - 2 = 3",
        a: 5,
        b: 2,
        result: 3,
        explanation: "Se tirarmos 2 de 5, sobram 3.",
        schoolMath: {
          top: 5,
          bottom: 2,
          operationSymbol: "-",
          note: "Subtraímos as unidades: 5 - 2 = 3.",
        },
      },
      {
        id: "ex-2",
        title: "Exemplo 2",
        expression: "9 - 4 = 5",
        a: 9,
        b: 4,
        result: 5,
        explanation: "Se tirarmos 4 de 9, sobram 5.",
        schoolMath: {
          top: 9,
          bottom: 4,
          operationSymbol: "-",
          note: "Subtraímos as unidades: 9 - 4 = 5.",
        },
      },
    ];
  }

  if (operation === "multiply") {
    return [
      {
        id: "ex-1",
        title: "Exemplo 1",
        expression: "3 x 4 = 12",
        a: 3,
        b: 4,
        result: 12,
        explanation: "3 grupos de 4 formam 12 no total.",
        schoolMath: {
          top: 3,
          bottom: 4,
          operationSymbol: "x",
          note: "Multiplicar 3 por 4 significa somar 4 três vezes.",
        },
      },
      {
        id: "ex-2",
        title: "Exemplo 2",
        expression: "2 x 6 = 12",
        a: 2,
        b: 6,
        result: 12,
        explanation: "2 grupos de 6 também formam 12.",
        schoolMath: {
          top: 2,
          bottom: 6,
          operationSymbol: "x",
          note: "Multiplicar 2 por 6 significa somar 6 duas vezes.",
        },
      },
    ];
  }

  return [
    {
      id: "ex-1",
      title: "Exemplo 1",
      expression: "8 ÷ 2 = 4",
      a: 8,
      b: 2,
      result: 4,
      explanation: "Ao dividir 8 em 2 partes iguais, cada parte fica com 4.",
      schoolMath: {
        top: 8,
        bottom: 2,
        operationSymbol: "÷",
        note: "Procuramos quantas vezes o 2 cabe no 8: cabe 4 vezes.",
      },
    },
    {
      id: "ex-2",
      title: "Exemplo 2",
      expression: "12 ÷ 3 = 4",
      a: 12,
      b: 3,
      result: 4,
      explanation: "Ao dividir 12 em 3 partes iguais, cada parte fica com 4.",
      schoolMath: {
        top: 12,
        bottom: 3,
        operationSymbol: "÷",
        note: "Procuramos quantas vezes o 3 cabe no 12: cabe 4 vezes.",
      },
    },
  ];
}

function renderTokens(count: number, color: string) {
  return Array.from({ length: count }).map((_, i) => (
    <View key={i} style={[styles.token, { borderColor: color, backgroundColor: `${color}22` }]}>
      <View style={[styles.tokenDot, { backgroundColor: color }]} />
    </View>
  ));
}

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
  const [activeTab, setActiveTab] = useState<TheoryTab>("concept");

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
  const operationUi = useMemo(
    () => OPERATION_UI[lesson.operation],
    [lesson.operation],
  );
  const examples = useMemo(() => getExamples(lesson.operation), [lesson.operation]);
  const operationName = lesson.title;

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { backgroundColor: operationUi.color }]}>
          <View style={styles.heroTitleRow}>
            <Ionicons name={operationUi.icon} size={20} color="#fff" />
            <Text style={styles.heroTitle}>{operationName}</Text>
          </View>
          <Text style={styles.heroSubtitle}>{lesson.summary}</Text>
        </View>

        <View style={styles.tabWrap}>
          <Pressable
            style={[styles.tabBtn, activeTab === "concept" && styles.tabBtnActive]}
            onPress={() => setActiveTab("concept")}
          >
            <Text style={[styles.tabTxt, activeTab === "concept" && styles.tabTxtActive]}>
              Conceito
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === "examples" && styles.tabBtnActive]}
            onPress={() => setActiveTab("examples")}
          >
            <Text style={[styles.tabTxt, activeTab === "examples" && styles.tabTxtActive]}>
              Exemplos
            </Text>
          </Pressable>
        </View>

        {activeTab === "concept" ? (
          <>
            <View style={[styles.card, cardShadow]}>
              <Text style={styles.sectionTitle}>O que é {operationName}?</Text>
              <Text style={styles.body}>{lesson.summary}</Text>
              <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={18} color={colors.infoText} />
                <Text style={styles.tipTxt}>
                  Dica importante: praticar o conceito no dia a dia ajuda a fixar mais rápido.
                </Text>
              </View>
            </View>

            <View style={[styles.card, cardShadow]}>
              <Text style={styles.sectionTitle}>Vocabulário</Text>
              <Text style={styles.vocabLine}>
                <Text style={styles.vocabStrong}>Operação:</Text> o cálculo que estamos fazendo.
              </Text>
              <Text style={styles.vocabLine}>
                <Text style={styles.vocabStrong}>Resultado:</Text> o número final da conta.
              </Text>
              <Text style={styles.vocabLine}>
                <Text style={styles.vocabStrong}>Símbolo:</Text> o sinal usado nesta operação.
              </Text>
            </View>
          </>
        ) : (
          <>
            {examples.map((example) => (
              <View key={example.id} style={[styles.card, cardShadow]}>
                <View style={styles.exampleTitleRow}>
                  <View
                    style={[styles.exampleNumberBadge, { backgroundColor: operationUi.visualColor }]}
                  >
                    <Text style={styles.exampleNumberBadgeTxt}>
                      {example.id.endsWith("1") ? "1" : "2"}
                    </Text>
                  </View>
                  <Text style={styles.exampleTitle}>{example.title}</Text>
                </View>

                <View style={styles.expressionBox}>
                  <Text style={styles.expressionTxt}>{example.expression}</Text>
                </View>

                <Text style={styles.visualLabel}>Visualização:</Text>
                <View style={styles.visualBox}>
                  <View style={styles.visualRow}>
                    <View style={styles.tokenWrap}>
                      {renderTokens(example.a, operationUi.visualColor)}
                    </View>
                    <Text style={styles.visualOp}>{example.schoolMath.operationSymbol}</Text>
                    <View style={styles.tokenWrap}>
                      {renderTokens(example.b, operationUi.visualColor)}
                    </View>
                    <Text style={styles.visualOp}>=</Text>
                    <View style={styles.tokenWrap}>
                      {renderTokens(example.result, operationUi.visualColor)}
                    </View>
                  </View>
                </View>

                <View style={styles.schoolBox}>
                  <Text style={styles.schoolTitle}>Conta tradicional (escola)</Text>
                  <View style={styles.schoolCalc}>
                    <Text style={styles.schoolLine}>{String(example.schoolMath.top).padStart(3, " ")}</Text>
                    <Text style={styles.schoolLine}>
                      {example.schoolMath.operationSymbol}
                      {String(example.schoolMath.bottom).padStart(2, " ")}
                    </Text>
                    <View style={styles.schoolDivider} />
                    <Text style={styles.schoolLine}>{String(example.result).padStart(3, " ")}</Text>
                  </View>
                  <Text style={styles.schoolNote}>{example.schoolMath.note}</Text>
                </View>

                <View style={styles.answerBox}>
                  <Text style={styles.answerTxt}>Resposta: {example.explanation}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={[styles.practiceCard, cardShadow]}>
          <Text style={styles.practiceTitle}>Pronto para praticar?</Text>
          <Text style={styles.practiceSub}>
            Agora que você entendeu o conceito, pratique com exercícios interativos.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Exercise", { moduleId, lessonId })}
            accessibilityRole="button"
            accessibilityLabel="Ir para a prática deste assunto"
          >
            <Text style={styles.primaryBtnTxt}>Ir para Exercícios</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        <View style={[styles.card, cardShadow]}>
          <Text style={styles.small}>
            {moduleMeta
              ? `Fase atual: ${moduleMeta.title}. Depois de praticar, marque este assunto como concluído na trilha.`
              : "Depois de praticar, marque este assunto como concluído na trilha."}
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
  hero: {
    borderRadius: radius.card,
    padding: 18,
    marginBottom: 2,
  },
  heroTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  heroTitle: { color: "#fff", fontSize: 31, fontWeight: "800" },
  heroSubtitle: { color: "#EEFFF4", fontSize: 15, lineHeight: 22 },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: radius.pill,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  tabBtnActive: { backgroundColor: "#fff" },
  tabTxt: { fontSize: 13, fontWeight: "600", color: colors.muted },
  tabTxtActive: { color: colors.text },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  body: { fontSize: 16, color: "#3d3a45", lineHeight: 25 },
  tipBox: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12,
    backgroundColor: colors.infoBg,
    borderLeftWidth: 3,
    borderLeftColor: colors.infoText,
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
  vocabLine: { fontSize: 14, color: colors.text, marginBottom: 8, lineHeight: 22 },
  vocabStrong: { fontWeight: "700" },
  exampleTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  exampleNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  exampleNumberBadgeTxt: { color: "#fff", fontWeight: "800", fontSize: 13 },
  exampleTitle: { fontSize: 20, fontWeight: "700", color: colors.text },
  expressionBox: {
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    alignItems: "center",
  },
  expressionTxt: { fontSize: 39, fontWeight: "800", color: colors.text },
  visualLabel: { fontSize: 13, color: colors.muted, marginBottom: 8 },
  visualBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#FCFCFD",
  },
  visualRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  tokenWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  token: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenDot: { width: 9, height: 9, borderRadius: 5 },
  visualOp: { fontSize: 18, fontWeight: "700", color: colors.muted },
  schoolBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9DDF0",
    backgroundColor: "#F7F8FF",
    padding: 12,
    marginBottom: 12,
  },
  schoolTitle: { fontSize: 13, fontWeight: "700", color: colors.primaryText, marginBottom: 8 },
  schoolCalc: {
    width: 74,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E4E7F7",
  },
  schoolLine: {
    textAlign: "right",
    fontSize: 16,
    color: colors.text,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },
  schoolDivider: { height: 1, backgroundColor: "#BFC4D9", marginVertical: 4 },
  schoolNote: { marginTop: 8, fontSize: 12, color: colors.muted, lineHeight: 18 },
  answerBox: {
    backgroundColor: colors.successBg,
    borderColor: "#C7F3D5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  answerTxt: { fontSize: 13, color: colors.successDark },
  practiceCard: {
    backgroundColor: "#F4F1FF",
    borderRadius: radius.card,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#DDD6FE",
  },
  practiceTitle: { fontSize: 17, fontWeight: "800", color: colors.text, marginBottom: 8 },
  practiceSub: { fontSize: 14, color: colors.muted, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
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

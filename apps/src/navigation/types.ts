export type RootStackParamList = {
  Dashboard: undefined;
  LearningPath: undefined;
  /** Lista de teoria (mesmo nível da Trilha). */
  Teoria: undefined;
  TheoryDetail: { moduleId: string; lessonId: string };
  Exercise: { moduleId: string; lessonId: string };
  Performance: undefined;
};

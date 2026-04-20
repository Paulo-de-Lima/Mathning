import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../context/AuthContext";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ExerciseScreen } from "../screens/ExerciseScreen";
import { LearningPathScreen } from "../screens/LearningPathScreen";
import { TheoryHubScreen } from "../screens/TheoryHubScreen";
import { TheoryScreen } from "../screens/TheoryScreen";
import { PerformanceScreen } from "../screens/PerformanceScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F5F7F9",
  },
};

export function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTitleStyle: { fontWeight: "700" },
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "Mathning" }}
          />
          <Stack.Screen
            name="LearningPath"
            component={LearningPathScreen}
            options={{ title: "Trilha" }}
          />
          <Stack.Screen
            name="Teoria"
            component={TheoryHubScreen}
            options={{ title: "Teoria" }}
          />
          <Stack.Screen
            name="TheoryDetail"
            component={TheoryScreen}
            options={{ title: "Teoria" }}
          />
          <Stack.Screen
            name="Exercise"
            component={ExerciseScreen}
            options={{ title: "Prática" }}
          />
          <Stack.Screen
            name="Performance"
            component={PerformanceScreen}
            options={{ title: "Desempenho" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

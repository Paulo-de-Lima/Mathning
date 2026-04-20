import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect } from "react";
import { Alert, Pressable, View } from "react-native";
import type { RootStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function infoPress() {
  Alert.alert(
    "Mathning",
    "Pratique matemática na sua trilha, acompanhe metas diárias e veja seu desempenho.",
  );
}

export function useAppHeader(navigation: Nav, title: string) {
  useLayoutEffect(() => {
    const apply = () => {
      const canBack = navigation.canGoBack();
      navigation.setOptions({
        title,
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#1A1A22",
        headerShadowVisible: true,
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "700", fontSize: 17, color: "#1A1A22" },
        headerLeft: canBack
          ? () => (
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={12}
                style={{ marginLeft: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Ionicons name="arrow-back" size={24} color="#1A1A22" />
              </Pressable>
            )
          : () => null,
        headerRight: () => (
          <View style={{ marginRight: 4 }}>
            <Pressable
              onPress={infoPress}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Informações"
            >
              <Ionicons name="information-circle-outline" size={26} color="#1A1A22" />
            </Pressable>
          </View>
        ),
      });
    };
    apply();
    return navigation.addListener("focus", apply);
  }, [navigation, title]);
}

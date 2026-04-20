import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors, radius } from "../theme/colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: {
  key: keyof Pick<
    RootStackParamList,
    "Dashboard" | "LearningPath" | "Teoria" | "Performance"
  >;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconActive: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "Dashboard", label: "Início", icon: "home-outline", iconActive: "home" },
  { key: "LearningPath", label: "Trilha", icon: "book-outline", iconActive: "book" },
  {
    key: "Teoria",
    label: "Teoria",
    icon: "document-text-outline",
    iconActive: "document-text",
  },
  {
    key: "Performance",
    label: "Desempenho",
    icon: "bar-chart-outline",
    iconActive: "bar-chart",
  },
];

export function BottomNav({
  navigation,
  route,
}: {
  navigation: Nav;
  route: (typeof TABS)[number]["key"];
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map((item) => {
        const active = route === item.key;
        const iconName = active ? item.iconActive : item.icon;
        return (
          <Pressable
            key={item.key}
            style={[styles.btn, active && styles.btnActive]}
            onPress={() => navigation.navigate(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={active ? colors.primary : colors.navInactive}
            />
            <Text style={[styles.txt, active && styles.txtActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.card,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    gap: 4,
    borderRadius: radius.sm,
    marginHorizontal: 2,
  },
  btnActive: {
    backgroundColor: colors.overlayPurple,
  },
  txt: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.navInactive,
  },
  txtActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Image } from "react-native";
import Logo from "../../assets/mathning_sem_fundo.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />

      <View style={styles.content}>
        {/* Topo */}
        <View style={styles.header}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Bem-vindo ao Mathning</Text>
          <Text style={styles.subtitle}>
            Faça login para continuar aprendendo matemática de forma leve e prática.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#9CA3AF"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta?</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}> Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#5B4CF0";
const PRIMARY_LIGHT = "#E9E5FF";
const BACKGROUND = "#F5F6FA";
const CARD = "#FFFFFF";
const TEXT = "#1F2937";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
  width: 300,
  height: 120,
  marginBottom: 20,
},

  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: PRIMARY,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFC",
    fontSize: 15,
    color: TEXT,
  },

  forgotButton: {
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 2,
  },

  forgotText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "600",
  },

  loginButton: {
    height: 54,
    backgroundColor: PRIMARY,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    fontSize: 14,
    color: MUTED,
  },

  footerLink: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "700",
  },
});
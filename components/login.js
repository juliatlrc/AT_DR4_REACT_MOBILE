import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Home from "./home";

const saveSession = async (email, password) => {
  try {
    await SecureStore.setItemAsync("userEmail", email);
    await SecureStore.setItemAsync("userPassword", password);
  } catch (error) {
    console.error("Erro ao salvar sessão:", error);
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [resetEmail, setResetEmail] = useState(""); // Email para redefinir senha
  const [modalVisible, setModalVisible] = useState(false); // Controla o modal de esqueci minha senha
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false); // Modal de confirmação de redefinição de senha
  const navigation = useNavigation();

  // Função de Login
  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salvar as credenciais no SecureStore
      await saveSession(email, password);

      // Navegar diretamente para a tela principal (sem verificar status)
      navigation.navigate("Main", { screen: "Home" } || "Main", {
        screen: "EditEmployeeProfile",
      });
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  // Função para enviar email de redefinição de senha
  const handleResetPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setModalVisible(false); // Fecha o primeiro modal
      setConfirmationModalVisible(true); // Abre o modal de confirmação
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o email de redefinição. Verifique o email."
      );
    }
  };

  // Função para redirecionar para criar conta
  const handleCreateAccount = () => {
    navigation.navigate("CadastroColaborador");
  };

  return (
    <View style={styles.container}>
      {/* Título do sistema */}
      <Text style={styles.systemTitle}>Sistema ACME</Text>

      <Text style={styles.title}>Login</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {/* Botão de Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão para criar conta */}
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createAccountButtonText}>
          Criar Conta de Colaborador
        </Text>
      </TouchableOpacity>

      {/* Botão para abrir o modal de esqueci minha senha */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* Modal para redefinir senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Redefinir senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={resetEmail}
              onChangeText={(text) => setResetEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.modalButtonText}>Enviar email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Email enviado</Text>
            <Text>
              O link para redefinição de senha foi enviado para o seu email.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setConfirmationModalVisible(false);
                navigation.navigate("Login"); // Fecha e redireciona para o login
              }}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  systemTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3b3dbf",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#3b3dbf",
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountButton: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    textAlign: "center",
    color: "#3b3dbf",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#3b3dbf",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: "#000",
    fontSize: 16,
  },
});

export default Login;

import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore para verificar o bloqueio
import { useNavigation } from "@react-navigation/native"; // React Navigation para navegação
import { db } from "../firebase/config"; // Firestore importado

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      // Tenta fazer o login via Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Após login bem-sucedido, verifica o status do colaborador no Firestore
      const colaboradorRef = doc(db, "colaboradores", user.uid);
      const colaboradorDoc = await getDoc(colaboradorRef);

      if (colaboradorDoc.exists()) {
        const colaboradorData = colaboradorDoc.data();

        if (colaboradorData.isBlocked) {
          // Se o colaborador estiver bloqueado, exibe alerta e impede login
          setError("Conta bloqueada. Entre em contato com o administrador.");
          return;
        }

        // Caso contrário, navega para a página Home
        navigation.navigate("Home");
      } else {
        setError("Dados do colaborador não encontrados.");
      }
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Entrar" onPress={handleLogin} color="#3b3dbf" />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <Button
          title="Criar Conta de Colaborador"
          onPress={() => navigation.navigate("CadastroColaborador")}
          color="#3b3dbf"
        />
      </View>
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
  signupContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    marginBottom: 10,
  },
});

export default Login;

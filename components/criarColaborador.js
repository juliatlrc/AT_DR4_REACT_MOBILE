import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Importa o Firestore

const CadastroColaborador = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    const auth = getAuth();

    try {
      // Cria a conta do usuário com Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Adiciona o colaborador ao Firestore
      await setDoc(doc(db, "colaboradores", user.uid), {
        email: user.email,
        role: "colaborador", // Define o papel como colaborador
        isBlocked: false, // O colaborador não está bloqueado por padrão
      });

      setSuccess(true); // Exibe mensagem de sucesso
      setError(null);
      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login.");
    } catch (error) {
      setError("Erro ao criar conta de colaborador. Tente novamente.");
      Alert.alert(
        "Erro",
        "Erro ao criar conta de colaborador. Tente novamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Colaborador</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && (
        <Text style={styles.success}>
          Conta criada com sucesso! Faça login.
        </Text>
      )}

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
        autoCapitalize="none"
      />
      <Button title="Criar Conta" onPress={handleRegister} color="#3b3dbf" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CadastroColaborador;

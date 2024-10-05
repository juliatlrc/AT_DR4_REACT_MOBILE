import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Snackbar, Text } from "react-native-paper";
import ContactMailIcon from "react-native-vector-icons/MaterialIcons"; // Usando Material Icons para o ícone
import firestore from "firebase/firestore"; // Usando Firestore do Firebase

const CadastroContatos = () => {
  const [form, setForm] = useState({
    nomeContato: "",
    fornecedor: "",
    telefone: "",
    email: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !form.nomeContato ||
      !form.fornecedor ||
      !form.telefone ||
      !form.email
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Adicionar o contato ao Firestore
      await firestore().collection("contatos").add({
        nomeContato: form.nomeContato,
        fornecedor: form.fornecedor,
        telefone: form.telefone,
        email: form.email,
      });
      setSuccess(true);
      setForm({ nomeContato: "", fornecedor: "", telefone: "", email: "" });
    } catch (error) {
      console.error("Erro ao cadastrar contato: ", error);
      setError(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <ContactMailIcon name="contact-mail" size={100} color="#ff6f00" />
      </View>

      <Text style={styles.title}>Cadastro de Contatos</Text>

      <TextInput
        label="Nome do Contato"
        value={form.nomeContato}
        onChangeText={(text) => handleChange("nomeContato", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Fornecedor"
        value={form.fornecedor}
        onChangeText={(text) => handleChange("fornecedor", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Telefone"
        value={form.telefone}
        onChangeText={(text) => handleChange("telefone", text)}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Cadastrar Contato
      </Button>

      {/* Snackbar de Sucesso */}
      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        style={styles.snackbarSuccess}
      >
        Contato cadastrado com sucesso!
      </Snackbar>

      {/* Snackbar de Erro */}
      <Snackbar
        visible={error}
        onDismiss={() => setError(false)}
        duration={3000}
        style={styles.snackbarError}
      >
        Erro ao cadastrar contato!
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6f00",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#ff6f00",
  },
  snackbarSuccess: {
    backgroundColor: "green",
  },
  snackbarError: {
    backgroundColor: "red",
  },
});

export default CadastroContatos;

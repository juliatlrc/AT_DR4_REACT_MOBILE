import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { db } from "../firebase/config"; // Firebase JS SDK configurado

const CadastroProdutos = () => {
  const [form, setForm] = useState({
    nomeProduto: "",
    descricao: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Função para lidar com a alteração dos campos do formulário
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Função para submeter o formulário
  const handleSubmit = async () => {
    if (form.nomeProduto === "" || form.descricao === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await db.collection("produtos").add({
        nomeProduto: form.nomeProduto,
        descricao: form.descricao,
      });
      setSuccess(true);
      setForm({ nomeProduto: "", descricao: "" }); // Resetar o formulário
    } catch (error) {
      console.error("Erro ao adicionar o produto: ", error);
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Produtos</Text>

      <TextInput
        label="Nome do Produto"
        value={form.nomeProduto}
        onChangeText={(text) => handleChange("nomeProduto", text)}
        style={styles.input}
        mode="outlined"
        autoComplete={false}
      />
      <TextInput
        label="Descrição"
        value={form.descricao}
        onChangeText={(text) => handleChange("descricao", text)}
        style={styles.input}
        mode="outlined"
        multiline
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Cadastrar Produto
      </Button>

      {/* Snackbar de Sucesso */}
      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        style={styles.snackbarSuccess}
      >
        Produto cadastrado com sucesso!
      </Snackbar>

      {/* Snackbar de Erro */}
      <Snackbar
        visible={error}
        onDismiss={() => setError(false)}
        duration={3000}
        style={styles.snackbarError}
      >
        Erro ao cadastrar o produto!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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

export default CadastroProdutos;

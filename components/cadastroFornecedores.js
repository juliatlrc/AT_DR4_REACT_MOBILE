import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  IconButton,
  Snackbar,
} from "react-native-paper";
import BusinessIcon from "react-native-vector-icons/MaterialIcons"; // Usando ícones de Material Icons

const CadastroFornecedores = () => {
  const [form, setForm] = useState({
    nomeEmpresa: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (
      !form.nomeEmpresa ||
      !form.cnpj ||
      !form.endereco ||
      !form.telefone ||
      !form.email
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // Lógica para envio dos dados ao backend pode ser implementada aqui
    console.log(form);
    setSuccess(true);
    setForm({
      nomeEmpresa: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <BusinessIcon name="business" size={100} color="#ff6f00" />
      </View>

      <Text style={styles.title}>Cadastro de Fornecedores</Text>

      <TextInput
        label="Nome da Empresa"
        value={form.nomeEmpresa}
        onChangeText={(text) => handleChange("nomeEmpresa", text)}
        style={styles.input}
        mode="outlined"
        autoComplete={false}
      />
      <TextInput
        label="CNPJ"
        value={form.cnpj}
        onChangeText={(text) => handleChange("cnpj", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Endereço"
        value={form.endereco}
        onChangeText={(text) => handleChange("endereco", text)}
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

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        icon="check"
      >
        Cadastrar Fornecedor
      </Button>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        style={styles.snackbarSuccess}
      >
        Fornecedor cadastrado com sucesso!
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
});

export default CadastroFornecedores;

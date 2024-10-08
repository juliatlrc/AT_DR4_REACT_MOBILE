import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Snackbar,
  Menu,
  Divider,
  Text,
} from "react-native-paper";
import firestore from "firebase/firestore";
import { useRoute } from "@react-navigation/native"; // Para capturar o ID da requisição

const CadastroCotacoes = () => {
  const route = useRoute();
  const { id } = route.params; // Captura o ID da requisição da rota
  const [form, setForm] = useState({
    nomeEmpresa: "",
    nomeFuncionario: "",
    preco: "",
    produto: "",
    contato: "",
  });

  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [contatosDisponiveis, setContatosDisponiveis] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Função para buscar a requisição específica pelo ID
  const fetchRequisicao = useCallback(async () => {
    try {
      const docRef = firestore().collection("requisicoes").doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        setForm((prevForm) => ({
          ...prevForm,
          produto: docSnap.data().nomeProduto,
        }));
      } else {
        Alert.alert("Erro", "Requisição não encontrada.");
        setError(true);
      }
    } catch (error) {
      console.error("Erro ao buscar requisição: ", error);
      setError(true);
    }
  }, [id]);

  // Função para buscar fornecedores do Firestore
  const fetchContatos = useCallback(async () => {
    try {
      const contatosSnapshot = await firestore().collection("contatos").get();
      const contatosList = contatosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContatosDisponiveis(contatosList);
    } catch (error) {
      console.error("Erro ao buscar contatos: ", error);
    }
  }, []);

  useEffect(() => {
    fetchContatos();
    if (id) {
      fetchRequisicao(); // Busca a requisição com base no ID
    }
  }, [fetchContatos, fetchRequisicao, id]);

  const handleChange = (name, value) => {
    if (name === "nomeEmpresa") {
      const fornecedorSelecionado = contatosDisponiveis.find(
        (contato) => contato.fornecedor === value
      );
      if (fornecedorSelecionado) {
        setForm({
          ...form,
          nomeEmpresa: fornecedorSelecionado.fornecedor,
          contato: fornecedorSelecionado.email, // Preencher o contato com o email
          nomeFuncionario: fornecedorSelecionado.nomeContato, // Preencher nome do funcionário
        });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!form.nomeEmpresa || !form.preco || !form.produto) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await firestore().collection("cotacoes").add({
        nomeEmpresa: form.nomeEmpresa,
        nomeFuncionario: form.nomeFuncionario,
        preco: form.preco,
        produto: form.produto,
        contato: form.contato,
        requisicaoId: id,
      });
      setSuccess(true);
      setForm({
        nomeEmpresa: "",
        nomeFuncionario: "",
        preco: "",
        produto: "",
        contato: "",
      });
    } catch (error) {
      console.error("Erro ao enviar cotação: ", error);
      setError(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Cotações</Text>

      <TextInput
        label="Fornecedor (Nome da Empresa)"
        value={form.nomeEmpresa}
        onChangeText={(value) => handleChange("nomeEmpresa", value)}
        mode="outlined"
        style={styles.input}
      />

      <Menu
        visible={!!contatosDisponiveis.length}
        anchor={
          <TextInput label="Selecionar Fornecedor" value={form.nomeEmpresa} />
        }
        onDismiss={() => setForm({ ...form, nomeEmpresa: "" })}
      >
        {contatosDisponiveis.map((contato) => (
          <Menu.Item
            key={contato.id}
            onPress={() => handleChange("nomeEmpresa", contato.fornecedor)}
            title={contato.fornecedor}
          />
        ))}
      </Menu>

      <TextInput
        label="Nome do Funcionário"
        value={form.nomeFuncionario}
        mode="outlined"
        disabled
        style={styles.input}
      />

      <TextInput
        label="Preço"
        value={form.preco}
        onChangeText={(value) => handleChange("preco", value)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Produto"
        value={form.produto}
        mode="outlined"
        disabled
        style={styles.input}
      />

      <TextInput
        label="Contato (Email)"
        value={form.contato}
        mode="outlined"
        disabled
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Cadastrar Cotação
      </Button>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        style={styles.snackbarSuccess}
      >
        Cotação cadastrada com sucesso!
      </Snackbar>

      <Snackbar
        visible={error}
        onDismiss={() => setError(false)}
        duration={3000}
        style={styles.snackbarError}
      >
        Erro ao cadastrar cotação!
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#ff6f00",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff6f00",
  },
  snackbarSuccess: {
    backgroundColor: "green",
  },
  snackbarError: {
    backgroundColor: "red",
  },
});

export default CadastroCotacoes;

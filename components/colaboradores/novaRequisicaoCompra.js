import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { db } from "../../firebase/config"; // Configuração do Firestore
import { addDoc, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { useTheme, Button, Card, Snackbar } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native"; // Navegação

const NovaRequisicao = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Hook de navegação
  const { requisicao, isEdit } = route.params || {}; // Parâmetros passados da tela de listagem
  const [descricao, setDescricao] = useState(requisicao?.descricao || "");
  const [nomeProduto, setNomeProduto] = useState(requisicao?.nomeProduto || "");
  const [marcaSelecionada, setMarcaSelecionada] = useState(
    requisicao?.marca || ""
  );
  const [quantidade, setQuantidade] = useState(requisicao?.quantidade || 1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        if (isEdit) {
          // Atualizar uma requisição existente
          await updateDoc(doc(db, "requisicoes", requisicao.id), {
            descricao,
            nomeProduto,
            marca: marcaSelecionada,
            quantidade,
            estado: "Pendente",
            dataSolicitacao: new Date(),
          });
        } else {
          // Criar uma nova requisição
          await addDoc(collection(db, "requisicoes"), {
            descricao,
            nomeProduto,
            marca: marcaSelecionada,
            quantidade,
            estado: "Pendente",
            dataSolicitacao: new Date(),
            uidColaborador: user.uid,
            nomeColaborador: user.displayName,
            statusPedido: "A esperar",
          });
        }
        setSuccess(true);
        setError(null);

        // Após o sucesso, redireciona para a tela Home
        setTimeout(() => {
          navigation.navigate("Home"); // Redireciona para a tela Home
        }, 1000); // Atraso de 1 segundo para dar tempo de exibir o Snackbar
      } catch (err) {
        console.error("Erro ao enviar requisição: ", err);
        setError("Erro ao enviar a requisição.");
      }
    } else {
      setError("Você precisa estar logado para fazer uma requisição.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>
            {isEdit ? "Editar Requisição" : "Nova Requisição de Compra"}
          </Text>

          {success && (
            <Snackbar
              visible={success}
              onDismiss={() => setSuccess(false)}
              action={{
                label: "OK",
                onPress: () => setSuccess(false),
              }}
            >
              {isEdit
                ? "Requisição atualizada com sucesso!"
                : "Requisição enviada com sucesso!"}
            </Snackbar>
          )}
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição do Produto</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={(text) => setDescricao(text)}
              placeholder="Digite a descrição"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
              style={styles.input}
              value={nomeProduto}
              onChangeText={(text) => setNomeProduto(text)}
              placeholder="Digite o nome do produto"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              value={marcaSelecionada}
              onChangeText={(text) => setMarcaSelecionada(text)}
              placeholder="Digite a marca do produto"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantidade.toString()}
              onChangeText={(text) => setQuantidade(Number(text))}
            />
          </View>

          {isEdit && (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              Editar Requisição
            </Button>
          )}

          {!isEdit && (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              Enviar Requisição
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#6200ee",
  },
});

export default NovaRequisicao;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Card, IconButton, Snackbar } from "react-native-paper";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Configuração do Firestore
import { getAuth } from "firebase/auth";

const ListarRequisicoesAdmin = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const q = collection(db, "requisicoes");
        const querySnapshot = await getDocs(q);
        const requisicoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequisicoes(requisicoesList);
      } catch (error) {
        console.error("Erro ao buscar requisições: ", error);
      }
      setLoading(false);
    };

    fetchRequisicoes();
  }, []);

  // Função para excluir uma requisição
  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta requisição?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "requisicoes", id));
              setRequisicoes(
                requisicoes.filter((requisicao) => requisicao.id !== id)
              );
            } catch (err) {
              console.error("Erro ao excluir a requisição: ", err);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Função para criar uma nova requisição
  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
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
        setSuccess(true);
        setError(null);
        // Atualizar a lista de requisições após criação
        setRequisicoes((prev) => [
          ...prev,
          {
            descricao,
            nomeProduto,
            marca: marcaSelecionada,
            quantidade,
            estado: "Pendente",
            dataSolicitacao: new Date(),
          },
        ]);
        setModalVisible(false); // Fechar o modal após o envio
      } catch (err) {
        console.error("Erro ao enviar requisição: ", err);
        setError("Erro ao enviar a requisição.");
      }
    } else {
      setError("Você precisa estar logado para fazer uma requisição.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisições de Compra</Text>

      {/* Botão para abrir o modal de nova requisição */}
      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        Nova Requisição
      </Button>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : requisicoes.length === 0 ? (
        <Text style={{ textAlign: "center" }}>
          Nenhuma requisição encontrada.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {requisicoes.map((requisicao) => (
            <Card key={requisicao.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.requisicaoText}>
                  Produto: {requisicao.nomeProduto}
                </Text>
                <Text style={styles.requisicaoText}>
                  Descrição: {requisicao.descricao}
                </Text>
                <Text style={styles.requisicaoText}>
                  Marca: {requisicao.marca}
                </Text>
                <Text style={styles.requisicaoText}>
                  Quantidade: {requisicao.quantidade}
                </Text>
                <IconButton
                  icon="delete"
                  size={24}
                  onPress={() => handleDelete(requisicao.id)}
                  style={styles.deleteButton}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Modal para criar nova requisição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Nova Requisição de Compra</Text>

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

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Enviar Requisição
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.button}
              >
                Cancelar
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

      {success && (
        <Snackbar
          visible={success}
          onDismiss={() => setSuccess(false)}
          action={{
            label: "OK",
            onPress: () => setSuccess(false),
          }}
        >
          Requisição enviada com sucesso!
        </Snackbar>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  requisicaoText: {
    marginBottom: 5,
    fontSize: 16,
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ListarRequisicoesAdmin;

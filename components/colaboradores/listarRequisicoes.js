import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config"; // Configuração do Firestore
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; // Navegação

const ListarRequisicoes = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Para controle de "pull to refresh"
  const navigation = useNavigation(); // Navegação

  const fetchRequisicoes = async () => {
    setLoading(true); // Exibe o indicador de carregamento
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const q = query(
        collection(db, "requisicoes"),
        where("uidColaborador", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const requisicoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      requisicoesList.sort((a, b) => {
        if (a.data && b.data) {
          return a.data.seconds - b.data.seconds;
        }
        return 0;
      });

      setRequisicoes(requisicoesList);
      setLoading(false); // Remove o indicador de carregamento
      setRefreshing(false); // Finaliza o estado de "pull to refresh"
    }
  };

  useEffect(() => {
    fetchRequisicoes(); // Buscar as requisições ao carregar a página
  }, []);

  // Função para recarregar ao arrastar para baixo
  const onRefresh = () => {
    setRefreshing(true);
    fetchRequisicoes();
  };

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
        },
      ]
    );
  };

  // Função para visualizar e editar uma requisição
  const handleEditRequisicao = (requisicao) => {
    navigation.navigate("Main", {
      screen: "Nova Requisição de Compra", // O nome exato da tab
      params: { requisicao, isEdit: true },
    });
  };

  // Função para determinar estilos e ícones com base no status da requisição
  const getStatusStyles = (status) => {
    switch (status) {
      case "aprovado":
        return {
          color: "green",
          icon: <MaterialIcons name="check-circle" size={24} color="green" />,
        };
      case "pendente":
        return {
          color: "orange",
          icon: (
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="orange"
            />
          ),
        };
      case "rejeitado":
        return {
          color: "red",
          icon: <FontAwesome name="times-circle" size={24} color="red" />,
        };
      default:
        return {
          color: "gray",
          icon: <MaterialIcons name="help-outline" size={24} color="gray" />,
        };
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } // Adiciona o controle de "pull to refresh"
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          Minhas Requisições de Compra
        </Text>

        {/* Botão de recarregar */}
        <Button
          icon="reload"
          mode="contained"
          onPress={fetchRequisicoes}
          style={{ marginBottom: 16 }}
        >
          Recarregar
        </Button>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : requisicoes.length === 0 ? (
          <Text style={{ textAlign: "center" }}>
            Nenhuma requisição encontrada.
          </Text>
        ) : (
          requisicoes.map((requisicao) => {
            const statusStyles = getStatusStyles(requisicao.statusPedido);

            return (
              <View
                key={requisicao.id}
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: statusStyles.color,
                  padding: 16,
                  marginBottom: 16,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {statusStyles.icon && (
                    <View style={{ marginRight: 8 }}>{statusStyles.icon}</View>
                  )}
                  <Text style={{ fontWeight: "bold" }}>
                    Descrição:{" "}
                    {requisicao.descricao || "Descrição não disponível"}
                  </Text>
                </View>

                <Text>
                  Produto: {requisicao.nomeProduto || "Produto não disponível"}
                </Text>

                <Text>
                  Estado: {requisicao.estado || "Estado não disponível"} | Data:{" "}
                  {requisicao.data
                    ? new Date(
                        requisicao.data.seconds * 1000
                      ).toLocaleDateString()
                    : "Data não disponível"}{" "}
                  | Status: {requisicao.statusPedido || "Status não disponível"}
                </Text>

                {/* Ações */}
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  {/* Excluir */}
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => handleDelete(requisicao.id)}
                  />

                  {/* Editar */}
                  <Button
                    mode="outlined"
                    onPress={() => handleEditRequisicao(requisicao)}
                    style={{ marginLeft: 8 }}
                  >
                    Editar Requisição
                  </Button>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ListarRequisicoes;

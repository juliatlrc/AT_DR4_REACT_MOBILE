import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config"; // Configuração do Firestore
import { CSVLink } from "react-csv";
import { useNavigation } from "@react-navigation/native"; // Para navegação entre telas
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons"; // Icones

const ListarRequisicoesAdmin = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRequisicoes = async () => {
      const q = query(collection(db, "requisicoes"));
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

  // Função para alterar o status de uma requisição
  const handleStatusChange = async (id, newStatus) => {
    try {
      const requisicaoRef = doc(db, "requisicoes", id);
      await updateDoc(requisicaoRef, { statusPedido: newStatus });
      setRequisicoes(
        requisicoes.map((requisicao) =>
          requisicao.id === id
            ? { ...requisicao, statusPedido: newStatus }
            : requisicao
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar o status da requisição: ", err);
    }
  };

  // Função para exportar uma requisição para CSV
  const generateCSVData = (requisicao) => {
    const data = requisicao.data
      ? new Date(requisicao.data.seconds * 1000).toLocaleDateString()
      : "Data não disponível";

    return [
      ["Descrição", requisicao.descricao || "Descrição não disponível"],
      ["Estado", requisicao.estado || "Estado não disponível"],
      ["Data", data],
      ["Quantidade", requisicao.quantidade || "Quantidade não disponível"],
      ["Produto", requisicao.nomeProduto || "Produto não disponível"],
      ["Marca", requisicao.marca || "Marca não disponível"],
      ["Status Pedido", requisicao.statusPedido || "Status não disponível"],
    ];
  };

  // Função para retornar a cor e o ícone com base no status
  const getStatusStyles = (status) => {
    switch (status) {
      case "A esperar":
        return {
          color: "yellow",
          icon: (
            <MaterialIcons name="hourglass-empty" size={24} color="yellow" />
          ),
        };
      case "Em cotação":
        return {
          color: "blue",
          icon: (
            <MaterialCommunityIcons name="autorenew" size={24} color="blue" />
          ),
        };
      case "Cotado":
        return {
          color: "green",
          icon: <FontAwesome name="check-square" size={24} color="green" />,
        };
      default:
        return { color: "gray", icon: null };
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 20,
        }}
      >
        Requisições de Compra - Admin
      </Text>

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
                Estado: {requisicao.estado || "Estado não disponível"} | Data:{" "}
                {requisicao.data
                  ? new Date(
                      requisicao.data.seconds * 1000
                    ).toLocaleDateString()
                  : "Data não disponível"}{" "}
                | Produto: {requisicao.nomeProduto || "Produto não disponível"}{" "}
                | Status: {requisicao.statusPedido || "Status não disponível"}
              </Text>

              <View style={{ marginTop: 10 }}>
                {/* Alterar status da requisição */}
                <Picker
                  selectedValue={requisicao.statusPedido || "A esperar"}
                  onValueChange={(value) =>
                    handleStatusChange(requisicao.id, value)
                  }
                  style={{ height: 50, width: "100%" }}
                >
                  <Picker.Item label="A esperar" value="A esperar" />
                  <Picker.Item label="Em cotação" value="Em cotação" />
                  <Picker.Item label="Cotado" value="Cotado" />
                </Picker>
              </View>

              {/* Ações */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {/* Excluir */}
                <IconButton
                  icon="delete"
                  size={24}
                  onPress={() => handleDelete(requisicao.id)}
                />

                {/* Exportar CSV */}
                <Button
                  onPress={() =>
                    Alert.alert(
                      "Exportar CSV não suportado no React Native. Use uma solução nativa."
                    )
                  }
                  mode="outlined"
                  style={{ marginLeft: 8 }}
                >
                  Exportar CSV
                </Button>

                {/* Criar Cotação */}
                <Button
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("CriarCotacao", { id: requisicao.id })
                  }
                  style={{ marginLeft: 8 }}
                >
                  Criar Cotação
                </Button>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default ListarRequisicoesAdmin;

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { List, IconButton, Button } from "react-native-paper";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore"; // Firestore
import { db } from "../../firebase/config";
import { MaterialIcons } from "@expo/vector-icons"; // Ícones do Expo

const GerenciarColaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função para buscar todos os colaboradores no Firestore
  const fetchColaboradores = async () => {
    try {
      const colaboradoresSnapshot = await getDocs(
        collection(db, "colaboradores")
      );
      const colaboradoresList = colaboradoresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setColaboradores(colaboradoresList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
      setError(true);
      setLoading(false);
    }
  };

  // Função para bloquear/desbloquear colaboradores
  const toggleBlockStatus = async (colaboradorId, isBlocked) => {
    try {
      const colaboradorRef = doc(db, "colaboradores", colaboradorId);
      await updateDoc(colaboradorRef, {
        isBlocked: !isBlocked, // Inverte o status atual de bloqueio
      });
      // Atualiza a lista de colaboradores localmente
      setColaboradores(
        colaboradores.map((colaborador) =>
          colaborador.id === colaboradorId
            ? { ...colaborador, isBlocked: !isBlocked }
            : colaborador
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status de bloqueio:", error);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

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
        Gerenciar Colaboradores
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>
          Erro ao carregar colaboradores
        </Text>
      ) : (
        <View>
          {colaboradores.map((colaborador) => (
            <List.Item
              key={colaborador.id}
              title={`${colaborador.nome} ${colaborador.sobrenome}`}
              description={`Email: ${colaborador.email} - Status: ${
                colaborador.isBlocked ? "Bloqueado" : "Ativo"
              }`}
              right={() => (
                <IconButton
                  icon={colaborador.isBlocked ? "check-circle" : "block"}
                  color={colaborador.isBlocked ? "green" : "red"}
                  size={24}
                  onPress={() =>
                    toggleBlockStatus(colaborador.id, colaborador.isBlocked)
                  }
                />
              )}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default GerenciarColaboradores;

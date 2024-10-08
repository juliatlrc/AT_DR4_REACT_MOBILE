import React from "react";
import { View, ActivityIndicator, Modal, Text } from "react-native";
import Routes from "./components/rotas/routes"; // Rotas para usuários logados
import NotUserRoutes from "./components/rotas/notUserRoutes"; // Rotas para usuários não logados
import { AuthProvider, useAuth } from "./contexts/context";
import { NetworkProvider, useNetwork } from "./contexts/networkProvider";

// Componente de Loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// Componente principal de conteúdo
const AppContent = () => {
  const { loggedIn, loading } = useAuth(); // Estado de autenticação
  const { isConnected } = useNetwork(); // Estado da conexão de rede

  if (loading) {
    return <LoadingScreen />; // Mostra tela de carregamento
  }

  return (
    <>
      {/* Modal para mostrar quando a conexão estiver offline */}
      <Modal transparent={true} visible={!isConnected} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Conexão perdida
            </Text>
            <Text>Estamos tentando reconectar...</Text>
          </View>
        </View>
      </Modal>

      {/* Verificação de login para mostrar rotas adequadas */}
      {loggedIn ? <Routes /> : <NotUserRoutes />}
    </>
  );
};

// Função principal do app
export default function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <AppContent />
      </NetworkProvider>
    </AuthProvider>
  );
}

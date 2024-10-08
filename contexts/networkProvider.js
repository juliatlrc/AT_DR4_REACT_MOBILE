import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Modal, Text } from "react-native";
import * as Network from "expo-network";

// Crie o contexto
const NetworkContext = createContext();

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Função para verificar o status da conexão
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
    };

    // Verifica a conexão ao carregar o app
    checkConnection();

    // Usa polling para verificar a conexão a cada 5 segundos (ou o tempo que preferir)
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

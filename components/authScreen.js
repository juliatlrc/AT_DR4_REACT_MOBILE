import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store"; // Expo Secure Store
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthScreen = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const userEmailKey = "userEmail"; // Chave para armazenar o email
  const userPasswordKey = "userPassword"; // Chave para armazenar a senha

  // Função para salvar as credenciais no SecureStore
  const saveCredentials = async (email, password) => {
    try {
      await SecureStore.setItemAsync(userEmailKey, email);
      await SecureStore.setItemAsync(userPasswordKey, password);
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error);
    }
  };

  useEffect(() => {
    // Verificar se há uma sessão salva no SecureStore ao iniciar o app
    const loadCredentialsAndLogin = async () => {
      const storedEmail = await SecureStore.getItemAsync(userEmailKey);
      const storedPassword = await SecureStore.getItemAsync(userPasswordKey);

      if (storedEmail && storedPassword) {
        try {
          // Tenta fazer o login automaticamente com as credenciais salvas
          const userCredential = await signInWithEmailAndPassword(
            auth,
            storedEmail,
            storedPassword
          );
          setUser(userCredential.user);
        } catch (error) {
          console.error("Erro ao fazer login automaticamente:", error);
        }
      }
      setLoading(false);
    };

    loadCredentialsAndLogin();
  }, []);

  // Função de login para testar o armazenamento
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      // Realiza o login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salva as credenciais no SecureStore
      await saveCredentials(email, password);

      // Atualiza o estado do usuário
      setUser(user);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Remover dados do SecureStore
      await SecureStore.deleteItemAsync(userEmailKey);
      await SecureStore.deleteItemAsync(userPasswordKey);

      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {user ? (
        <>
          <Text>Bem-vindo, {user.email}</Text>
          <Button title="Sair" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>Você não está logado.</Text>
          {/* Exemplo de login */}
          <Button
            title="Login"
            onPress={() => handleLogin("email@example.com", "senha123")}
          />
        </>
      )}
    </View>
  );
};

export default AuthScreen;

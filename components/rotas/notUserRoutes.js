import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CadastroColaborador from "../colaboradores/criarColaborador";

// Importar as telas que você deseja adicionar às rotas
import Home from "../home";
import Login from "../login";

// Criar o Stack Navigator
const Stack = createStackNavigator();

// Componente que define as rotas
const NotUserRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Ocultar o cabeçalho
        />
        <Stack.Screen
          name="CadastroColaborador"
          component={CadastroColaborador}
          options={{ headerShown: false }} // Ocultar o cabeçalho
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NotUserRoutes;

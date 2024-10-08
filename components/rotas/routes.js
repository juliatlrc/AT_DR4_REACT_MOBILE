import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importar as telas
import Home from "../home";
import Login from "../login";
import TabNavigator from "./tabRoutes";

// Criar o Stack Navigator
const Stack = createStackNavigator();

// Componente que define as rotas
const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login} // Passar o componente diretamente no 'component'
          options={{ headerShown: false }} // Ocultar o cabeçalho
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator} // Componente de tabs aqui
          options={{ headerShown: false }} // Ocultar o cabeçalho
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, signOut } from "firebase/auth";
import { View, Text, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Importação dos componentes
import Home from "./components/home";
import CadastroContatos from "./components/cadastroContatos";
import CadastroFornecedores from "./components/cadastroFornecedores";
// import ConsultaCotacoes from "./features/acme/components/consultaCotacoes";
import CadastroProdutos from "./components/cadastroProdutos";
// import CadastroCotacoes from "./features/acme/components/cadastroCotacoes";
import Login from "./components/login";
// import GerenciarColaboradores from "./features/acme/components/gerenciarColaboradores";
import CadastroColaborador from "./components/criarColaborador";
// import NovaRequisicaoCompra from "./features/acme/components/novaRequisicaoCompra";
// import ListarRequisicoes from "./features/acme/components/listarRequisicoes";
// import ListarRequisicoesAdmin from "./features/acme/components/listarRequisicoesAdmin";

// Criação dos navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente de Loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Carregando...</Text>
  </View>
);

// Componente de Menu com Tabs
function MenuTabs({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cadastro Fornecedores"
        component={CadastroFornecedores}
        options={{
          tabBarLabel: "Fornecedores",
          tabBarIcon: ({ color, size }) => (
            <Icon name="business" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cadastro Contatos"
        component={CadastroContatos}
        options={{
          tabBarLabel: "Contatos",
          tabBarIcon: ({ color, size }) => (
            <Icon name="contacts" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cadastro Cotacoes"
        component={CadastroContatos}
        options={{
          tabBarLabel: "Contatos",
          tabBarIcon: ({ color, size }) => (
            <Icon name="" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="ConsultaCotacoes"
        component={ConsultaCotacoes}
        options={{
          tabBarLabel: "Cotações",
          tabBarIcon: ({ color, size }) => (
            <Icon name="assessment" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Cadastro Produtos"
        component={CadastroProdutos}
        options={{
          tabBarLabel: "Produtos",
          tabBarIcon: ({ color, size }) => (
            <Icon name="inventory" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Impede o comportamento padrão
            signOut(getAuth())
              .then(() => {
                navigation.replace("Login"); // Redireciona para a tela de login
              })
              .catch((error) => {
                console.error("Erro ao fazer logout:", error);
              });
          },
        }}
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Icon name="logout" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Componente principal que lida com autenticação e navegação
function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Exibe o Menu (Tabs) se o usuário estiver logado
        <Stack.Screen
          name="Menu"
          component={MenuTabs}
          options={{ headerShown: false }}
        />
      ) : (
        // Exibe as telas de login e cadastro se o usuário não estiver logado
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroColaborador"
            component={CadastroColaborador}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// Componente App que contém a navegação
export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}

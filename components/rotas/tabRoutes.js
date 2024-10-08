import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, View } from "react-native";

// Importa ícones
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Importa as telas
import Home from "../home";
import NovaRequisicao from "../colaboradores/novaRequisicaoCompra";
import ListarRequisicoes from "../colaboradores/listarRequisicoes";
import EditEmployeeProfile from "../colaboradores/edicao";
import CadastroCotacoes from "../cadastroCotacoes";

// Firestore setup (importação)
import { db } from "../../firebase/config"; // Importa a instância do Firestore

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  // Função de logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Nova Requisição de Compra") {
            iconName = "add-circle";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Minhas solicitações") {
            iconName = "list";
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === "Configurações") {
            iconName = "settings";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#ff6f00",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Nova Requisição de Compra" component={NovaRequisicao} />
      <Tab.Screen name="Minhas solicitações" component={ListarRequisicoes} />
      <Tab.Screen name="Configurações" component={EditEmployeeProfile} />

      {/* Tela de Logout */}
      <Tab.Screen
        name="Logout"
        component={() => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: "red" }}>Logout</Text>
          </TouchableOpacity>
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="exit-to-app" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

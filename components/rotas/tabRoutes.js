import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Importa as telas
import Home from "../home";
import NovaRequisicao from "../colaboradores/novaRequisicaoCompra";
import ListarRequisicoes from "../colaboradores/listarRequisicoes";
import EditEmployeeProfile from "../colaboradores/edicao";
import CadastroCotacoes from "../cadastroCotacoes";
import ListarRequisicoesAdmin from "../listarRequisicoesAdmin";

// Firestore setup (importação)
import { db } from "../../firebase/config"; // Importa a instância do Firestore

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [role, setRole] = useState(null); // Estado para armazenar o papel do usuário (admin ou colaborador)
  const [loading, setLoading] = useState(true); // Estado para carregar enquanto busca o papel do usuário
  const navigation = useNavigation();
  const auth = getAuth();

  // Função para obter o papel do usuário logado
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "colaboradores", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role); // Define o papel do usuário (colaborador/admin)
          }
        } catch (error) {
          console.error("Erro ao buscar papel do usuário: ", error);
        } finally {
          setLoading(false); // Para o estado de carregamento
        }
      }
    };

    fetchUserRole();
  }, [auth]);

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

  // Renderiza as rotas baseadas no papel do usuário
  const renderRoutesForRole = () => {
    if (role === "admin") {
      // Rotas para administradores
      return (
        <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen
            name="Listar Requisições"
            component={ListarRequisicoesAdmin}
          />
        </>
      );
    } else if (role === "colaborador") {
      // Rotas para colaboradores
      return (
        <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen
            name="Nova Requisição de Compra"
            component={NovaRequisicao}
          />
          <Tab.Screen
            name="Minhas solicitações"
            component={ListarRequisicoes}
          />
          <Tab.Screen name="Configurações" component={EditEmployeeProfile} />
        </>
      );
    }

    return null; // Exibe nada enquanto o papel não é obtido
  };

  // Renderiza tela de carregamento enquanto busca o papel do usuário
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff6f00" />
      </View>
    );
  }

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
      {renderRoutesForRole()}

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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Telas simuladas para cada rota
const HomeScreen = ({ navigation }) => (
  <View style={styles.center}>
    <Text>Home Screen</Text>
    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Text style={styles.linkText}>Logout</Text>
    </TouchableOpacity>
  </View>
);

const FornecedoresScreen = () => (
  <View style={styles.center}>
    <Text>Cadastro de Fornecedores</Text>
  </View>
);

const ContatosScreen = () => (
  <View style={styles.center}>
    <Text>Cadastro de Contatos</Text>
  </View>
);

const ProdutosScreen = () => (
  <View style={styles.center}>
    <Text>Cadastro de Produtos</Text>
  </View>
);

const RequisicoesAdminScreen = () => (
  <View style={styles.center}>
    <Text>Listar Requisições (Admin)</Text>
  </View>
);

const CotacoesScreen = () => (
  <View style={styles.center}>
    <Text>Consulta de Cotações</Text>
  </View>
);

const NovaRequisicaoScreen = () => (
  <View style={styles.center}>
    <Text>Nova Requisição (Colaborador)</Text>
  </View>
);

const ListarRequisicoesScreen = () => (
  <View style={styles.center}>
    <Text>Listar Requisições (Colaborador)</Text>
  </View>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

const Menu = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserLoggedIn(true);
        try {
          const docRef = doc(db, "colaboradores", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          } else {
            console.error("Documento de colaborador não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar o papel do usuário:", error);
        }
      } else {
        setUserLoggedIn(false);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false); // Reseta o estado do usuário logado
        setUserRole(null); // Reseta o papel do usuário
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!userLoggedIn) {
    return (
      <View style={styles.center}>
        <Text>Usuário não logado. Faça login para acessar o menu.</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Fornecedores") {
              iconName = "business";
            } else if (route.name === "Contatos") {
              iconName = "contacts";
            } else if (route.name === "Produtos") {
              iconName = "inventory";
            } else if (route.name === "Requisições (Admin)") {
              iconName = "list";
            } else if (route.name === "Cotações") {
              iconName = "attach-money";
            } else if (route.name === "Nova Requisição") {
              iconName = "add";
            } else if (route.name === "Listar Requisições") {
              iconName = "list";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ff6f00",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {userRole === "admin" && (
          <>
            <Tab.Screen name="Fornecedores" component={FornecedoresScreen} />
            <Tab.Screen name="Contatos" component={ContatosScreen} />
            <Tab.Screen name="Produtos" component={ProdutosScreen} />
            <Tab.Screen
              name="Requisições (Admin)"
              component={RequisicoesAdminScreen}
            />
            <Tab.Screen name="Cotações" component={CotacoesScreen} />
          </>
        )}
        {userRole === "colaborador" && (
          <>
            <Tab.Screen
              name="Nova Requisição"
              component={NovaRequisicaoScreen}
            />
            <Tab.Screen
              name="Listar Requisições"
              component={ListarRequisicoesScreen}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    marginTop: 10,
    fontSize: 16,
  },
});

export default Menu;

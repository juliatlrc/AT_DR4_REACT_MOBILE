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
import { db } from "../../firebase/config";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Telas simuladas para cada rota
const HomeScreen = () => (
  <View style={styles.center}>
    <Text>Home Screen</Text>
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
        // Navegação após logout
        // Pode redirecionar para uma tela de login, se necessário
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

  return (
    <NavigationContainer>
      {userLoggedIn && (
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
              <Tab.Screen name="Nova Requisição" component={HomeScreen} />
              <Tab.Screen name="Listar Requisições" component={HomeScreen} />
            </>
          )}
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Menu;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Hook customizado para lidar com permissões do usuário
const useUserPermissions = () => {
  const [isColaborador, setIsColaborador] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userDocRef = doc(db, "colaboradores", uid);
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const { role } = docSnap.data();
            setIsColaborador(role === "colaborador");
            setIsAdmin(role === "admin");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar documento do Firestore: ", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { isColaborador, isAdmin, loading };
};

// Componente de loading
const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Verificando permissões...</Text>
  </View>
);

// Componente que exibe a lista de cotações para cada produto
const ProductWithCotacoes = ({ produto, cotacoes }) => (
  <View style={styles.productCard}>
    <View style={styles.cardHeader}>
      <Icon name="inventory" size={40} color="#3f51b5" />
      <Text style={styles.productName}>{produto.nomeProduto}</Text>
    </View>
    {cotacoes.length > 0 ? (
      cotacoes.map((cotacao) => (
        <View key={cotacao.id} style={styles.cotacaoContainer}>
          <Text style={styles.cotacaoText}>
            Empresa: {cotacao.nomeEmpresa} - Preço: R$ {cotacao.preco}
          </Text>
        </View>
      ))
    ) : (
      <Text style={styles.noCotacoesText}>Nenhuma cotação disponível</Text>
    )}
  </View>
);

const Home = () => {
  const { isColaborador, isAdmin, loading } = useUserPermissions();
  const [produtos, setProdutos] = useState([]);
  const [allCotacoes, setAllCotacoes] = useState([]);

  // Fetch produtos e cotações
  useEffect(() => {
    if (isAdmin) {
      const fetchData = async () => {
        try {
          // Fetch produtos
          const produtosSnapshot = await getDocs(collection(db, "produtos"));
          const produtosList = produtosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProdutos(produtosList);

          // Fetch cotações para todos os produtos
          const cotacoesSnapshot = await getDocs(collection(db, "cotacoes"));
          const cotacoesList = cotacoesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllCotacoes(cotacoesList);
        } catch (error) {
          console.error("Erro ao buscar produtos e cotações: ", error);
        }
      };
      fetchData();
    }
  }, [isAdmin]);

  // Filtra as cotações de acordo com o produto
  const getCotacoesForProduct = (produto) => {
    return allCotacoes.filter(
      (cotacao) => cotacao.produto === produto.nomeProduto
    );
  };

  if (loading) return <LoadingIndicator />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isAdmin && (
        <>
          <Text style={styles.adminTitle}>Lista de Produtos com Cotações</Text>

          {produtos.map((produto) => (
            <ProductWithCotacoes
              key={produto.id}
              produto={produto}
              cotacoes={getCotacoesForProduct(produto)}
            />
          ))}
        </>
      )}

      {!isColaborador && !isAdmin && (
        <Text style={styles.restrictedText}>
          Acesso restrito. Entre em contato com o administrador.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cotacaoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  cotacaoText: {
    fontSize: 14,
    color: "#333",
  },
  noCotacoesText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  restrictedText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});

export default Home;

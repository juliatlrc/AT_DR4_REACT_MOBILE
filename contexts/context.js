import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Criação do contexto de autenticação
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener do Firebase para verificar se o usuário está logado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário está logado: ", user); // Debugging: Verificar se o usuário está logado
        setLoggedIn(true); // Usuário está logado
      } else {
        console.log("Usuário não está logado."); // Debugging: Verificar se o usuário não está logado
        setLoggedIn(false); // Usuário não está logado
      }
      setLoading(false); // Carregamento finalizado
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

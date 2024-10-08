import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import * as ImagePicker from "expo-image-picker";

const EditEmployeeProfile = () => {
  const [userInfo, setUserInfo] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
    sexo: "",
    profilePicture: "",
    funcional: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch inicial das informações do funcionário
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const docRef = doc(db, "colaboradores", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          Alert.alert("Erro", "Usuário não encontrado no sistema.");
        }
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [user]);

  // Função para abrir a câmera e tirar uma foto
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos da permissão da câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, profilePicture: result.assets[0].uri });
    }
  };

  // Função para abrir a galeria e escolher uma foto
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar a galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, profilePicture: result.assets[0].uri });
    }
  };

  // Função para salvar as alterações e atualizar a página
  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const docRef = doc(db, "colaboradores", user.uid);
      await updateDoc(docRef, {
        nome: userInfo.nome,
        dataNascimento: userInfo.dataNascimento,
        sexo: userInfo.sexo,
        profilePicture: userInfo.profilePicture, // Pode ser base64 ou um link externo
      });
      Alert.alert("Sucesso", "Informações atualizadas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar alterações: ", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* Foto de perfil */}
      <TouchableOpacity onPress={openGallery}>
        <View style={styles.profilePictureContainer}>
          {userInfo.profilePicture ? (
            <Image
              source={{ uri: userInfo.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.placeholderPicture}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Botões para Capturar Foto ou Selecionar da Galeria */}
      <View style={styles.buttonContainer}>
        <Button title="Tirar Foto" onPress={openCamera} />
        <Button title="Escolher da Galeria" onPress={openGallery} />
      </View>

      {/* Nome */}
      <TextInput
        style={styles.input}
        value={userInfo.nome}
        onChangeText={(text) => setUserInfo({ ...userInfo, nome: text })}
        placeholder="Nome"
      />

      {/* Data de Nascimento */}
      <TextInput
        style={styles.input}
        value={userInfo.dataNascimento}
        onChangeText={(text) =>
          setUserInfo({ ...userInfo, dataNascimento: text })
        }
        placeholder="Data de Nascimento"
      />

      {/* Sexo */}
      <TextInput
        style={styles.input}
        value={userInfo.sexo}
        onChangeText={(text) => setUserInfo({ ...userInfo, sexo: text })}
        placeholder="Sexo"
      />

      {/* Funcional (não editável) */}
      <TextInput
        style={styles.input}
        value={userInfo.funcional}
        editable={false}
        placeholder="Funcional"
      />

      {/* Role (não editável) */}
      <TextInput
        style={styles.input}
        value={userInfo.role}
        editable={false}
        placeholder="Cargo"
      />

      {/* Botão de salvar */}
      <Button
        title={isUpdating ? "Salvando..." : "Salvar Alterações"}
        onPress={handleSave}
        disabled={isUpdating}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  placeholderPicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditEmployeeProfile;

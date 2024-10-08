import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RadioButton } from "react-native-paper"; // Para o Radio Button
import { Camera } from "expo-camera"; // Para tirar foto
import * as ImagePicker from "expo-image-picker"; // Para escolher imagem da galeria
import { db, storage } from "../../firebase/config"; // Importa Firestore e Storage

const ConfiguracaoPerfil = () => {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [funcional, setFuncional] = useState("");
  const [sexo, setSexo] = useState(""); // Estado para o sexo
  const [dataNascimento, setDataNascimento] = useState(""); // Estado para data de nascimento
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null); // Para armazenar a foto
  const [imageUrl, setImageUrl] = useState(""); // URL da foto do perfil existente
  const [uploading, setUploading] = useState(false); // Estado de upload

  const auth = getAuth();
  const user = auth.currentUser;

  // Carregar as informações do colaborador do Firestore
  useEffect(() => {
    const fetchColaboradorData = async () => {
      try {
        const docRef = doc(db, "colaboradores", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmail(data.email);
          setNome(data.nome || "");
          setFuncional(data.funcional || "");
          setSexo(data.sexo || "");
          setDataNascimento(data.dataNascimento || "");
          setImageUrl(data.profilePicture || "");
        } else {
          Alert.alert("Erro", "Colaborador não encontrado");
        }
      } catch (error) {
        setError("Erro ao carregar os dados.");
      }
    };

    fetchColaboradorData();
  }, [user]);

  // Função para formatar a data de nascimento enquanto o usuário digita
  const formatDate = (text) => {
    let formattedText = text.replace(/\D/g, ""); // Remove tudo que não é número
    if (formattedText.length > 2) {
      formattedText =
        formattedText.substring(0, 2) + "/" + formattedText.substring(2);
    }
    if (formattedText.length > 5) {
      formattedText =
        formattedText.substring(0, 5) + "/" + formattedText.substring(5);
    }
    return formattedText;
  };

  // Função para fazer upload da imagem no Firebase Storage
  const uploadImage = async (uri) => {
    setUploading(true); // Inicia estado de upload
    const response = await fetch(uri);
    const blob = await response.blob(); // Converte a imagem para blob
    const storageRef = ref(storage, `colaboradores/${user.uid}/perfil.jpg`);

    try {
      await uploadBytes(storageRef, blob); // Upload da imagem
      const downloadUrl = await getDownloadURL(storageRef); // URL da imagem após o upload
      setImageUrl(downloadUrl); // Define o novo URL da imagem
      setUploading(false); // Finaliza o estado de upload
      return downloadUrl;
    } catch (error) {
      setUploading(false);
      Alert.alert("Erro", "Erro ao fazer upload da imagem.");
      console.error("Erro ao fazer upload da imagem: ", error);
    }
  };

  // Função para atualizar os dados no Firestore
  const handleUpdate = async () => {
    try {
      let updatedImageUrl = imageUrl;

      // Se houver uma nova imagem, faça o upload para o Firebase Storage
      if (image) {
        updatedImageUrl = await uploadImage(image);
      }

      // Atualiza as informações do colaborador no Firestore
      await updateDoc(doc(db, "colaboradores", user.uid), {
        nome: nome,
        funcional: funcional,
        sexo: sexo,
        dataNascimento: dataNascimento,
        profilePicture: updatedImageUrl,
      });

      setSuccess(true); // Exibe mensagem de sucesso
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      setError("Erro ao atualizar o perfil. Tente novamente.");
      Alert.alert("Erro", "Erro ao atualizar o perfil. Tente novamente.");
    }
  };

  // Função para escolher uma foto da galeria
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  // Função para tirar uma foto usando a câmera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações do Perfil</Text>

      {uploading && (
        <Text style={styles.uploadingText}>Fazendo upload da imagem...</Text>
      )}

      {imageUrl && !image && (
        <Image source={{ uri: imageUrl }} style={styles.profileIcon} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {success && (
        <Text style={styles.success}>Perfil atualizado com sucesso!</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={(text) => setNome(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Funcional"
        value={funcional}
        onChangeText={(text) => setFuncional(text)}
        editable={false} // Campo não editável
      />

      <Text style={styles.label}>Sexo:</Text>
      <View style={styles.radioContainer}>
        <RadioButton.Group
          onValueChange={(newValue) => setSexo(newValue)}
          value={sexo}
        >
          <View style={styles.radioButton}>
            <RadioButton value="Masculino" />
            <Text>Masculino</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="Feminino" />
            <Text>Feminino</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (DD/MM/YYYY)"
        value={dataNascimento}
        onChangeText={(text) => setDataNascimento(formatDate(text))}
        keyboardType="numeric"
        maxLength={10} // Limitar a data ao formato DD/MM/YYYY
      />

      <View style={styles.imageContainer}>
        {imageUrl && !image && (
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        )}
        {image && <Image source={{ uri: image }} style={styles.profileImage} />}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImageFromGallery}
          >
            <Text style={styles.buttonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Atualizar Perfil" onPress={handleUpdate} color="#3b3dbf" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  uploadingText: {
    textAlign: "center",
    color: "#3b3dbf",
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#3b3dbf",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ConfiguracaoPerfil;

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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native"; // Para navegação
import { db, storage } from "../../firebase/config";

const CadastroColaborador = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [funcional, setFuncional] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cargo, setCargo] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null);

  const navigation = useNavigation(); // Hook para navegação

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const handleRegister = async () => {
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let imageUrl = "";

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `colaboradores/${user.uid}/perfil.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "colaboradores", user.uid), {
        email: user.email,
        nome: nome,
        funcional: funcional,
        sexo: sexo,
        dataNascimento: dataNascimento,
        cargo: cargo,
        role: "colaborador",
        isBlocked: false,
        profilePicture: imageUrl,
      });

      setSuccess(true);
      setError(null);
      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login.");
      navigation.goBack(); // Volta para a tela de login após o cadastro
    } catch (error) {
      setError("Erro ao criar conta de colaborador. Tente novamente.");
      Alert.alert(
        "Erro",
        "Erro ao criar conta de colaborador. Tente novamente."
      );
    }
  };

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
      <Text style={styles.title}>Cadastro de Colaborador</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && (
        <Text style={styles.success}>
          Conta criada com sucesso! Faça login.
        </Text>
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
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (DD/MM/YYYY)"
        value={dataNascimento}
        onChangeText={(text) => setDataNascimento(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={(text) => setCargo(text)}
      />

      <View style={styles.imageContainer}>
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

      <Button title="Criar Conta" onPress={handleRegister} color="#3b3dbf" />

      {/* Botão para voltar à tela de login */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar para Login</Text>
      </TouchableOpacity>
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
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#3b3dbf",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CadastroColaborador;

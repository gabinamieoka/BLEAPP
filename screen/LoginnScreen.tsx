import React, { useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import do Picker

const LoginnScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Paciente");

  // Função para renderizar a imagem com base no tipo de usuário
  const renderImage = () => {
    if (userType === "Paciente") {
      return (
        <Image
          style={styles.userImage}
          source={require('../img/iconPacient.png')}
        />
      );
    } else if (userType === "Médico") {
      return (
        <Image
          style={styles.userImage}
          source={require("../img/iconDoctor.png")}
        />
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
      <View style={styles.sloganWrapper}>
          {/* Imagem do Slogan */}
          <Image
            style={styles.sloganImage}
            source={require("../img/iconLogo.png")}
          />
        </View>
        <View style={styles.heartRateTitleWrapper}>
          <Text style={styles.heartRateTitleText}>Login Page</Text>

          {/* Renderizar a imagem com base na seleção do tipo de usuário */}
          {renderImage()}

          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label="Paciente" value="Paciente" />
            <Picker.Item label="Médico" value="Médico" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => {
              // Ação de login
              navigation.navigate("BluetoothConnection");
            }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Ação de criar conta
              navigation.navigate("CreateAccount");
            }}
            style={[styles.ctaButton, styles.createAccountButton]}
          >
            <Text style={styles.ctaButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  sloganWrapper: {
    alignItems: "center",
    marginBottom: 5,
  },
  sloganImage: {
    width: 200,  // Ajuste a largura da imagem conforme necessário
    height: 100,  // Ajuste a altura da imagem conforme necessário
    resizeMode: "contain",  // Para garantir que a imagem se ajuste bem ao espaço
  },
  heartRateTitleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heartRateTitleText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#7a7a7a",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
 
  ctaButton: {
    width: "100%",
    backgroundColor: "#74d7da",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginVertical: 10,
    borderRadius: 8,
  },
  createAccountButton: {
    backgroundColor: "#0cc0df",
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default LoginnScreen;
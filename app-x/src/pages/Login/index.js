import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import * as Animatable from "react-native-animatable";
import { auth } from "../../../firebase.js"
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro de autenticação", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerForm: {
    backgroundColor: "#FFFF",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#000",
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
  },
});

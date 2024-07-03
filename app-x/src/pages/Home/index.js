import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { auth, db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [userType, setUserType] = useState(null); // State to store user type
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          setUserDisplayName(userDoc.data().nome);
          setUserType(userDoc.data().tipo); // Set user type from Firestore
        }
      } else {
        setUserDisplayName(null);
        setUserType(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Olá, {userDisplayName}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerHome}>
        {/* Renderizar o botão apenas se o tipo de usuário não for 'apoiador' */}
        {userType !== "apoiador" && (
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.btn}>
            <Text style={styles.btnText}>Criar novo Integrante</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Users')} style={styles.btn}>
          <Text style={styles.btnText}>Ver Integrantes</Text>
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
  containerHome: {
    backgroundColor: "#FFFF",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  btn: {
    backgroundColor: "#000",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

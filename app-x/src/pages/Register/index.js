import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { createUser, db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [superior, setSuperior] = useState("");
  const [superiores, setSuperiores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'tipo' ou 'superior'
  const [successMessage, setSuccessMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSuperiores = async () => {
      let querySnapshot;
      if (type === "coordenador") {
        querySnapshot = await db.collection("users").where("tipo", "==", "admin").get();
      } else if (type === "líder") {
        querySnapshot = await db.collection("users").where("tipo", "==", "coordenador").get();
      } else if (type === "apoiador") {
        querySnapshot = await db.collection("users").where("tipo", "==", "líder").get();
      }
      const fetchedSuperiores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuperiores(fetchedSuperiores);
    };

    fetchSuperiores();
  }, [type]);

  const handleRegister = async () => {
    try {
      await createUser(email, password, name, type, superior);
      setSuccessMessage("Usuário criado com sucesso!");
      clearFields();
      navigation.navigate("Home"); // Navega de volta para a tela inicial do admin
    } catch (error) {
      Alert.alert("Erro de criação", error.message);
    }
  };
  
  const clearFields = () => {
    setEmail("");
    setPassword("");
    setName("");
    setType("");
    setSuperior("");
  };
  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelectItem = (item) => {
    if (modalType === "tipo") {
      setType(item);
    } else if (modalType === "superior") {
      setSuperior(item);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Criar novo usuário</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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

        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Tipo:</Text>
          <TouchableOpacity style={styles.button} onPress={() => openModal("tipo")}>
            <Text style={styles.buttonText}>{type ? type : "Selecione o tipo"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Superior:</Text>
          <TouchableOpacity style={styles.button} onPress={() => openModal("superior")}>
            <Text style={styles.buttonText}>{superior ? superior : "Selecione o superior"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Criar</Text>
        </TouchableOpacity>
        
        {/* Exibe a mensagem de sucesso */}
        {successMessage !== "" && (
          <Animatable.View animation="fadeIn" style={styles.successMessage}>
            <Text style={styles.successText}>{successMessage}</Text>
          </Animatable.View>
        )}
      </Animatable.View>

      {/* Modal para seleção de Tipo ou Superior */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalType === "tipo" ? "Selecione o tipo" : "Selecione o superior"}</Text>
            {modalType === "tipo" ? (
              <View style={styles.modalList}>
                <TouchableOpacity onPress={() => handleSelectItem("coordenador")} style={styles.modalListItem}>
                  <Text style={styles.modalListItemText}>Coordenador</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSelectItem("líder")} style={styles.modalListItem}>
                  <Text style={styles.modalListItemText}>Líder</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSelectItem("apoiador")} style={styles.modalListItem}>
                  <Text style={styles.modalListItemText}>Apoiador</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalList}>
                {superiores.map(sup => (
                  <TouchableOpacity key={sup.id} onPress={() => handleSelectItem(sup.nome)} style={styles.modalListItem}>
                    <Text style={styles.modalListItemText}>{sup.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#FFF",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 20,
    fontSize: 16,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#000",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalClose: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: "#666",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalList: {
    marginTop: 10,
  },
  modalListItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  modalListItemText: {
    fontSize: 16,
  },
  successMessage: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  successText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

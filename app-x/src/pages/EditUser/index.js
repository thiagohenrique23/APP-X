import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, auth } from "../../../firebase";

export default function EditUser() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [superior, setSuperior] = useState("");
  const [superiores, setSuperiores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const currentUserDoc = await db.collection("users").doc(currentUser.uid).get();
          if (currentUserDoc.exists) {
            const currentUserData = currentUserDoc.data();
            setIsAdmin(currentUserData.tipo === "admin");
            console.log("Current user type:", currentUserData.tipo); // Debugging line
          } else {
            Alert.alert("Erro", "Dados do usuário logado não encontrados.");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário logado:", error);
        Alert.alert("Erro", "Não foi possível buscar os dados do usuário logado.");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setNome(userData.nome);
          setEmail(userData.email);
          setTipo(userData.tipo);
          setSuperior(userData.superior);
          console.log("User data fetched:", userData); // Debugging line
        } else {
          Alert.alert("Erro", "Usuário não encontrado.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        Alert.alert("Erro", "Não foi possível buscar o usuário.");
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchSuperiores = async () => {
      let querySnapshot;
      if (tipo === "coordenador") {
        querySnapshot = await db.collection("users").where("tipo", "==", "admin").get();
      } else if (tipo === "líder") {
        querySnapshot = await db.collection("users").where("tipo", "==", "coordenador").get();
      } else if (tipo === "apoiador") {
        querySnapshot = await db.collection("users").where("tipo", "==", "líder").get();
      }
      const fetchedSuperiores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuperiores(fetchedSuperiores);
      console.log("Fetched superiores:", fetchedSuperiores); // Debugging line
    };

    if (tipo) fetchSuperiores();
  }, [tipo]);

  const handleUpdate = async () => {
    try {
      await db.collection("users").doc(userId).update({ nome, email, tipo, superior });
      Alert.alert("Sucesso", "Usuário atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      Alert.alert("Erro", "Não foi possível atualizar o usuário.");
    }
  };

  const handleDelete = async () => {
    try {
      await db.collection("users").doc(userId).delete();
      Alert.alert("Sucesso", "Usuário excluído com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      Alert.alert("Erro", "Não foi possível excluir o usuário.");
    }
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
      setTipo(item);
    } else if (modalType === "superior") {
      setSuperior(item);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Editar Usuário</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Tipo:</Text>
          <TouchableOpacity style={styles.button} onPress={() => openModal("tipo")}>
            <Text style={styles.buttonText}>{tipo ? tipo : "Selecione o tipo"}</Text>
          </TouchableOpacity>
        </View>

        {tipo && tipo !== "apoiador" && (
          <View style={styles.buttonContainer}>
            <Text style={styles.title}>Superior:</Text>
            <TouchableOpacity style={styles.button} onPress={() => openModal("superior")}>
              <Text style={styles.buttonText}>{superior ? superior : "Selecione o superior"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAdmin && (
          <>
            <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
              <Text style={styles.btnText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleDelete}>
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </>
        )}
      </Animatable.View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
        <Text style={styles.btnText}>Voltar</Text>
      </TouchableOpacity>

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
});

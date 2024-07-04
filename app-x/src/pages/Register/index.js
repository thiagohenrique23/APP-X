import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { createUser, auth, db } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [superior, setSuperior] = useState('');
  const [superiores, setSuperiores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchSuperiores();
  }, [type]);

  const fetchSuperiores = async () => {
    try {
      let querySnapshot;
      if (type === 'coordenador') {
        querySnapshot = await db.collection('users').where('tipo', '==', 'admin').get();
      } else if (type === 'líder') {
        querySnapshot = await db.collection('users').where('tipo', '==', 'coordenador').get();
      } else if (type === 'apoiador') {
        querySnapshot = await db.collection('users').where('tipo', '==', 'líder').get();
      } else {
        setSuperiores([]);
        return;
      }

      const fetchedSuperiores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuperiores(fetchedSuperiores);
    } catch (error) {
      console.error('Erro ao buscar superiores:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setErrorMessage('O endereço de e-mail já está em uso por outra conta.');
        return;
      }
      await createUser(email, password, name, type, superior);

      setSuccessMessage('Usuário criado com sucesso!');
      clearFields();

      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
        navigation.navigate('Home');
      }, 2000);
    } catch (error) {
      setErrorMessage(`Erro ao criar usuário: ${error.message}`);
    }
  };

  const checkEmailExists = async (email) => {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    return !snapshot.empty;
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setType('');
    setSuperior('');
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelectItem = (item) => {
    if (modalType === 'tipo') {
      setType(item);
    } else if (modalType === 'superior') {
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
        {errorMessage !== '' && (
          <Animatable.View animation="fadeIn" style={styles.errorMessage}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Animatable.View>
        )}

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
          <TouchableOpacity style={styles.button} onPress={() => openModal('tipo')}>
            <Text style={styles.buttonText}>{type ? type : 'Selecione o tipo'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Superior:</Text>
          <TouchableOpacity style={styles.button} onPress={() => openModal('superior')}>
            <Text style={styles.buttonText}>{superior ? superior : 'Selecione o superior'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Criar</Text>
        </TouchableOpacity>

        {successMessage !== '' && (
          <Animatable.View animation="fadeIn" style={styles.successMessage}>
            <Text style={styles.successText}>{successMessage}</Text>
          </Animatable.View>
        )}

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
              <Text style={styles.modalTitle}>{modalType === 'tipo' ? 'Selecione o tipo' : 'Selecione o superior'}</Text>
              {modalType === 'tipo' ? (
                <View style={styles.modalList}>
                  <TouchableOpacity onPress={() => handleSelectItem('coordenador')} style={styles.modalListItem}>
                    <Text style={styles.modalListItemText}>Coordenador</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectItem('líder')} style={styles.modalListItem}>
                    <Text style={styles.modalListItemText}>Líder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectItem('apoiador')} style={styles.modalListItem}>
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
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: '#CCC',
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
    backgroundColor: '#000',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#007BFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalList: {
    marginTop: 10,
  },
  modalListItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  modalListItemText: {
    fontSize: 16,
  },
  errorMessage: {
    backgroundColor: '#FFC0CB',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
  },
  successMessage: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  successText: {
    color: '#008000',
    fontSize: 16,
  },
});

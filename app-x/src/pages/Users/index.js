import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { db } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await db.collection('users').get();
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            await db.collection('users').doc(id).delete();
            setUsers(users.filter(user => user.id !== id));
            Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Nome: {item.nome}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
      <View style={styles.cardButtons}>
        {(item.tipo !== 'admin') && (
          <>
            <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('EditUser', { userId: item.id })}>
              <Text style={styles.cardButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.cardButtonText}>Excluir</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Todos os usuários</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerUsers}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.btn}>
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
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
  containerUsers: {
    backgroundColor: '#FFFF',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
    paddingTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  cardButtonText: {
    color: '#FFF',
    fontSize: 14,
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
});

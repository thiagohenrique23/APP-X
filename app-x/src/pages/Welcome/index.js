import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable"

export default function Welcome() {

    const navigation = useNavigation();

    return (

        <View style={styles.container}>

            <View style={styles.containerLogo}>

                <Animatable.Image
                    delay={100}
                    animation='flipInX'
                    source={require('../../assets/logo.png')}
                    style={{ width: '100%' }}
                    resizeMode='contain'
                />

            </View>

            <Animatable.View delay={600} animation='fadeInUp' style={styles.containerForm}>

                <Text style={styles.title}>Monitore, organize de qualquer lugar!</Text>
                <Text style={styles.text}>Faça login para começar</Text>

                <TouchableOpacity onPress={ () => navigation.navigate('Login')} style={styles.btn}>

                    <Text style={styles.btnText}>Acessar</Text>

                </TouchableOpacity>

            </Animatable.View>

        </View>

    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    containerLogo: {
        flex: 4,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },

    containerForm: {
        flex: 2,
        backgroundColor: '#000',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },

    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12
    },

    text: {
        color: '#a1a1a1'
    },

    btn: {
        position: 'absolute',
        backgroundColor: '#FFF',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    btnText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    }

})
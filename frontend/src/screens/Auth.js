import React, { Component } from 'react'
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity } from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = { ...initialState }

    signinOrSignup = () => {
        if(this.setState.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })

            showSuccess('Usuário Cadastrado!')
            this.setState({ ...initialState })
        } catch (error) {
            showError(error)
        }
    }

    signin = async () => {
        try {
            const response = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            if(response.data){
                AsyncStorage.setItem('userDataTasks', JSON.stringify(response.data))
                axios.defaults.headers.common['Authorization'] = `bearer ${response.data.token}`
                this.props.navigation.navigate('Home', response.data)
            }
        } catch (error) {
            showError(error)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((total, accumulator) => total && accumulator)

        return(
            <ImageBackground style={styles.background} source={backgroundImage}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>{this.state.stageNew ? 'Crie a sua conta' : 'Informe os seus dados'}</Text>
                </View>
                {this.state.stageNew && <AuthInput style={styles.input} icon='user' placeholder='Nome' value={this.state.name} onChangeText={name => this.setState({ name })} />}
                <AuthInput style={styles.input} icon='at' placeholder='E-mail' value={this.state.email} onChangeText={email => this.setState({ email })} />
                <AuthInput style={styles.input} icon='lock' placeholder='Senha' secureTextEntry={true} value={this.state.password} onChangeText={password => this.setState({ password })} />
                {this.state.stageNew && <AuthInput style={styles.input} icon='asterisk' placeholder='Confirmação de senha' secureTextEntry={true} value={this.state.confirmPassword} onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
                <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
                    <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                        <Text style={styles.buttonText}>{this.state.stageNew ? 'Registrar' : 'Entrar'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>{this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: ' #FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})
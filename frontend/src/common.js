import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000'

function showError(error) {
    if(error.response && error.response.data) {
        Alert.alert('Oops!', `Ocorreu um erro: ${error.response.data}`)
    } else {
        Alert.alert('Oops!', `Ocorreu um error: ${error}`)
    }
}

function showSuccess(message) {
    Alert.alert('Oba!', message)
}

export {
    server,
    showError,
    showSuccess
}
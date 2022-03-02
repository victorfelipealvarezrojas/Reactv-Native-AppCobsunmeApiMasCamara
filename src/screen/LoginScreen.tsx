import { StackScreenProps } from '@react-navigation/stack'
import React, { Fragment, useContext, useEffect } from 'react'
import {
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform, Keyboard,
    Alert,
    TouchableOpacity
} from 'react-native'
import { Background } from '../components/Background'
import { WhiteLogo } from '../components/WhiteLogo'
import { AuthContext } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { loginStyles } from '../theme/loginTheme'

//como estoy dentro del stack navigator tengo las propiedades del objeto que permite la navegacion
interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {
    const { signIn, errorMessage, removeError } = useContext(AuthContext)
    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    });

    const onLogin = () => {
        signIn({ correo: email, password })
        Keyboard.dismiss();
    }

    useEffect(() => {
        if (errorMessage.length === 0) return;
        Alert.alert('Login incorrecto', errorMessage, [{ text: 'OK', onPress: (() => removeError()) }]);
    }, [errorMessage])

    return (
        <Fragment>
            {/*Background */}
            <Background />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/*keyboard avoid view */}
                <View style={loginStyles.formContainer}>
                    <WhiteLogo />
                    <Text style={loginStyles.title} >Login</Text>
                    <Text style={loginStyles.label} >Email:</Text>
                    <TextInput
                        placeholder='Ingrese su Email'
                        placeholderTextColor='rgba(255,255,255,0.4)'
                        keyboardType='email-address' //para que aparezca el @
                        underlineColorAndroid='white'
                        style={loginStyles.inputField}
                        selectionColor='white'
                        onChangeText={(value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={onLogin}//desde el enter del teclado
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Text style={loginStyles.label} >Password:</Text>
                    <TextInput
                        placeholder='************'
                        placeholderTextColor='rgba(255,255,255,0.4)'
                        underlineColorAndroid='white'
                        secureTextEntry
                        style={loginStyles.inputField}
                        selectionColor='white'
                        onChangeText={(value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={onLogin}//desde el enter del teclado
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onLogin}
                        >
                            <Text style={loginStyles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={loginStyles.newUserContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('RegisterScreen')}
                        >
                            <Text style={loginStyles.buttonText}>Nueva Cuenta </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Fragment>
    )
}

import { StackScreenProps } from '@react-navigation/stack'
import React, { Fragment, useContext, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, Text, View, TextInput, Keyboard, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { WhiteLogo } from '../components/WhiteLogo'
import { AuthContext } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { loginStyles } from '../theme/loginTheme'

interface Props extends StackScreenProps<any, any> { }

export const RegisterScreen = ({ navigation }: Props) => {
    const { signUp, errorMessage, removeError } = useContext(AuthContext);
    const { email, password, name, onChange } = useForm({
        email: '',
        name: '',
        password: ''
    });

    useEffect(() => {
        if (errorMessage.length === 0) return;
        Alert.alert('Registro incorrecto', errorMessage, [{ text: 'OK', onPress: (() => removeError()) }]);
    }, [errorMessage])

    const onRegister = () => {
        console.log(email, password);
        signUp({ nombre: name, correo: email, password })
        Keyboard.dismiss();
    }


    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/*keyboard avoid view */}
                <View style={loginStyles.formContainer}>
                    <WhiteLogo />
                    <Text style={loginStyles.title} >Registro</Text>
                    <Text style={loginStyles.label} >Nombre:</Text>
                    <TextInput
                        placeholder='Ingrese su Nombre'
                        placeholderTextColor='rgba(255,255,255,0.4)'
                        underlineColorAndroid='white'
                        style={loginStyles.inputField}
                        selectionColor='white'
                        onChangeText={(value) => onChange(value, 'name')}
                        value={name}
                        onSubmitEditing={onRegister}//desde el enter del teclado
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
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
                        onSubmitEditing={onRegister}//desde el enter del teclado
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
                        onSubmitEditing={onRegister}//desde el enter del teclado
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onRegister}
                        >
                            <Text style={loginStyles.buttonText}>Crear Cuenta</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        position: 'absolute',
                        top: 10,
                        left: 13,
                        borderWidth: 1,
                        borderColor: 'white',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 100,
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('LoginScreen')}
                        >
                            <Text style={loginStyles.buttonText}>Login </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </>
    )
}

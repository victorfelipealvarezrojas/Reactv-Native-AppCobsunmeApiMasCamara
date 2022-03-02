import React, { createContext, useEffect, useReducer } from "react";
import { LoginData, LoginRegister, LoginResponse, Usuario } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from "../api/cafeApi";

type AuthContextProps = {
    errorMessage: string,
    token: string | null,
    user: Usuario | null,
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (obj: LoginRegister) => void;
    signIn: (obj: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: '',
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [state, dispatcher] = useReducer(authReducer, authInitialState)

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async () => {
        const tokenLocalStorage = await AsyncStorage.getItem('token');

        if (!tokenLocalStorage) return dispatcher({ type: 'notAuthenticated' });

        const { data: { token, usuario }, status } = await cafeApi.get<LoginResponse>('/auth');

        if (status !== 200) return dispatcher({ type: 'notAuthenticated' });

        dispatcher({
            type: 'signUn',
            payload: {
                token,
                user: usuario
            }
        });

    }

    const signIn = async ({ correo, password }: LoginData) => {
        try {
            const { data: { token, usuario } } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatcher({
                type: 'signUn',
                payload: {
                    token,
                    user: usuario
                }
            });

            await AsyncStorage.setItem('token', token);

        } catch (error: any) {
            console.log(error.response.data.msg);
            dispatcher({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion Incorrecta.'
            })
        }

    };
    const signUp = async ({ nombre, correo, password }: LoginRegister) => {
        try {
            const { data: { token, usuario } } = await cafeApi.post<LoginResponse>('/usuarios', { nombre,correo, password });
            dispatcher({
                type: 'signUn',
                payload: {
                    token,
                    user: usuario
                }
            });

            await AsyncStorage.setItem('token', token);

        } catch (error: any) {
            dispatcher({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Informacion Incorrecta.'
            })
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatcher({
            type: 'logout',
        });

    };
    const removeError = () => {
        dispatcher({
            type: 'removeError'
        })
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            {children}
        </AuthContext.Provider>
    )
}


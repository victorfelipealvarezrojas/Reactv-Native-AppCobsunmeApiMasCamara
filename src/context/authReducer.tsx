import { Usuario } from "../interfaces/appInterfaces";

//es el estado inicial, lo que emitire desde mi componnete de orden superior, son para el state del reducer
export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    errorMessage: string;
    user: Usuario | null;
}

//tipados para el action.type del switch y el valor del payload
export type AuthAction =
    | { type: 'signUn', payload: { token: string, user: Usuario } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            }
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            }
        case 'signUn':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user,
            }
        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null
            }
        default:
            return state;
    }
}




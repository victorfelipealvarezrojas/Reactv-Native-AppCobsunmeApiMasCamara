import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screen/LoginScreen';
import { RegisterScreen } from '../screen/RegisterScreen';
import { ProtectedScreen } from '../screen/ProtectedScreen';
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from '../screen/LoadingScreen';
import { ProductsNavigator } from './ProductsNavigator';

const Stack = createStackNavigator();

export const Navigator = () => {

    const { status } = useContext(AuthContext);

    if (status === 'checking') return <LoadingScreen />

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            {
                (status !== 'authenticated')
                    ? (
                        <>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} />
                            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                        </>
                    )
                    : (
                        <>
                            {/*ProductsNavigator maneja las rutas de productos y busqueda de producto */}
                            <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
                            <Stack.Screen name="NotifiProtectedScreencations" component={ProtectedScreen} />
                        </>
                    )
            }
        </Stack.Navigator>
    );
}
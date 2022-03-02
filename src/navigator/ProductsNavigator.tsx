import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from '../screen/ProductsScreen';
import { ProductScreen } from '../screen/ProductScreen';

export type ProductStackParams = {
    ProductsScreen: undefined,
    //parametros que recibe la ruta
    ProductScreen: {
        id?: string,
        name?: string
    }
}

const Stack = createStackNavigator<ProductStackParams>();

export const ProductsNavigator = () => {

    
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: {
                    backgroundColor: 'white'
                },
                headerStyle: {
                    elevation: 0,
                    shadowColor: 'transparent'
                }
            }}
        >
            <Stack.Screen
                name="ProductsScreen"
                component={ProductsScreen}
                options={{ title: 'Productos' }}
            />
            <Stack.Screen
                name="ProductScreen"
                component={ProductScreen}
            />
        </Stack.Navigator>
    )
}


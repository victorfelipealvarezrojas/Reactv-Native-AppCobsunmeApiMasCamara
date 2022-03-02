import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { ProductStackParams } from '../navigator/ProductsNavigator'
import { ProductContext } from '../context/ProductsContext'

interface Props extends StackScreenProps<ProductStackParams, 'ProductsScreen'> { };

export const ProductsScreen = ({ navigation }: Props) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { products, loadProducts } = useContext(ProductContext)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style = {{marginRight:10}}
                    onPress={() => navigation.navigate('ProductScreen',{})}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            )
        })
    }, []);

    const loadProductFromBackend = async() => {
        setIsRefreshing(true);
        await loadProducts();
        setIsRefreshing(false);
    };

    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>
            <FlatList
                data={products}
                keyExtractor={(p) => p._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('ProductScreen', {
                            id: item._id,
                            name: item.nombre
                        })}
                    >
                        <Text style={styles.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}

                refreshControl = {
                    <RefreshControl
                        refreshing= {isRefreshing}
                        onRefresh = {loadProductFromBackend}
                    />
                }

            />
        </View>
    )
}

const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    }
});

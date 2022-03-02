import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ProductStackParams } from '../navigator/ProductsNavigator'
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductStackParams, 'ProductScreen'> { };

export const ProductScreen = ({ route, navigation }: Props) => {
    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductContext);
    const { id = '', name = '' } = route.params;

    const [temp, setTemp] = useState<string>();

    //const [selectedLanguage, setSelectedLanguage] = useState();
    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
    });

    const { categories } = useCategories();

    useEffect(() => {
        navigation.setOptions({
            title: nombre ? nombre : 'Sin nombre de producto'
        });
    }, [nombre]);

    useEffect(() => {
        loadProducto();
    }, []);

    const loadProducto = async () => {
        if (id.length === 0) return;
        const product = await loadProductById(id);
        console.log("product", product)
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre,
        });
    }

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id);
        } else {
            const tempCategorieId = categoriaId || categories[0]._id;
            const newProduct = await addProduct(tempCategorieId, nombre);
            onChange(newProduct._id, '_id');
        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel || !resp.assets?.[0].uri) return;
            setTemp(resp.assets?.[0].uri);
            uploadImage(resp, _id);
        });
    }

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets?.[0].uri) return;

            setTemp(resp.assets?.[0].uri);
            uploadImage(resp, _id);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto:</Text>
                <TextInput
                    placeholder='Producto'
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />
                <Text style={styles.label}>Categoria:</Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}>
                    {
                        categories.map(cat => (
                            <Picker.Item
                                label={cat.nombre}
                                value={cat._id}
                                key={cat._id}
                            />
                        ))
                    }
                </Picker>

                <Button
                    title="Guardar"
                    onPress={() => saveOrUpdate()}
                    color="#5856D6"
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Button
                        title="Camara"
                        onPress={takePhoto}
                        color="#5856D6"
                    />
                    <View style={{ width: 10 }} />
                    <Button
                        title="Galeria"
                        onPress={takePhotoFromGallery}
                        color="#5856D6"
                    />
                </View>
                {
                    (img.length > 0) && (
                        <Image
                            source={{
                                uri: img
                            }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 400,
                            }}
                        />
                    )
                }
                {

                    (temp) && (
                        <Image
                            source={{
                                uri: temp
                            }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 400,
                            }}
                        />
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 15,
    }
});
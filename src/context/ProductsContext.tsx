import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from "../interfaces/appInterfaces";

type ProductContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; // TODO: cambiar ANY
}

export const ProductContext = createContext({} as ProductContextProps);

export const ProductsProvider = ({ children }: any) => {
    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {
        const response = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        setProducts([...response.data.productos]);

    }

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        const response = await cafeApi.post<Producto>(`/productos`, {
            nombre: productName,
            categoria: categoryId
        });
        setProducts([...products, response.data]);
        return response.data;
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        const response = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId
        });

        setProducts(products.map((prod): any => {
            return (prod._id === productId) ? response.data : prod;
        }));
    };

    const deleteProduct = async (id: string) => {

    };

    const loadProductById = async (id: string): Promise<Producto> => {
        const response = await cafeApi.get<Producto>(`/productos/${id}`);
        return response.data;
    };

    const uploadImage = async (data: ImagePickerResponse, id: string) => {
        const fileToUpload = {
            uri: data.assets?.[0].uri,
            type: data.assets?.[0].type,
            name: data.assets?.[0].fileName,
        }

        const formaData = new FormData();
        formaData.append('archivo', fileToUpload);
        try {
            const response = await cafeApi.put<Producto>(`/uploads/productos/${id}`, formaData);
            console.log("response",response)
        } catch (error) {
            console.log("error",error)
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage
        }}>
            {children}
        </ProductContext.Provider>
    )
}
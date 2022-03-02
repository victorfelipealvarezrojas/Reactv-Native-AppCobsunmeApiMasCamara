import { useEffect, useState } from "react"
import cafeApi from "../api/cafeApi";
import { Categoria, CategoriesResponse } from "../interfaces/appInterfaces";


export const useCategories = () => {
    const [isloading, setIsloading] = useState(true);
    const [categories, setCategories] = useState<Categoria[]>([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const response = await cafeApi.get<CategoriesResponse>('/categorias');
        setCategories(response.data.categorias);
        setIsloading(false);
    };

    return {
        categories,
        isloading,
    };
}

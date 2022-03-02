import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://cafeapp-react-native.herokuapp.com/api';

const cafeApi = axios.create({ baseURL });

//envio el token por medio de este midlleware en todas mis peticiones dentro de los headers
cafeApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        console.log("token",token)

        if (token) {
            config.headers['x-token'] = token;
        }

        return config;
    }
);

export default cafeApi;
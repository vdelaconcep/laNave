import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const apiGeoref = axios.create({
    baseURL: 'https://apis.datos.gob.ar/georef/api'
})
import { apiClient } from "@/services/apiClient";

export const obtenerVentas = (headers) => {
    return apiClient.get('/ventas', {headers});
};
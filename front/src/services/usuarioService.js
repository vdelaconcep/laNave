import apiClient from "@/services/apiClient";

export const obtenerUsuarios = (headers) => {
    return apiClient.get('/usuarios', {headers});
};
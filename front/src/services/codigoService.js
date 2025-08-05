import apiClient from "@/services/apiClient";

export const generarCodigo = (codigo, headers) => {
    return apiClient.post('/codigos/crear', codigo, {headers});
}
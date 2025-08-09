import { apiClient } from "@/services/apiClient";

export const generarCodigo = (codigo, headers) => {
    return apiClient.post('/codigos/crear', codigo, {headers});
}

export const obtenerCodigos = (headers) => {
    return apiClient.get('/codigos', {headers});
}

export const eliminarCodigo = (id, headers) => {
    return apiClient.delete(`/codigos/eliminar/${id}`, {headers});
}

export const buscarCodigo = (codigo) => {
    return apiClient.get(`/codigos/buscar/${codigo}`);
}
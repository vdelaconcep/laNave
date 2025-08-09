import { apiClient } from "@/services/apiClient";

export const obtenerUsuarios = (headers) => {
    return apiClient.get('/usuarios', {headers});
};

export const cambiarRolDeUsuario = (id, headers) => {
    return apiClient.put(`/usuarios/cambiarRol/${id}`, {}, {headers});
};

export const eliminarRegistro = (id, headers) => {
    return apiClient.delete(`/usuarios/eliminar/${id}`, {headers});
};
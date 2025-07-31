import apiClient from "@/services/apiClient";

export const altaProducto = (productoNuevo, headers) => {
    return apiClient.post('/productos/alta', productoNuevo, {headers});
};
export const actualizarProducto = (id, datos, headers) => {
    return apiClient.put(`/productos/actualizar/${id}`, datos, {headers});
};
export const eliminarProducto = (id, headers) => {
    return apiClient.delete(`/productos/eliminar/${id}`, {headers});
};
export const obtenerProducto = (clave, valor) => {
    return apiClient.get(`/productos?${clave}=${valor}`);
};
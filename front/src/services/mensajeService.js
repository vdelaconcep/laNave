import apiClient from "@/services/apiClient";

export const obtenerMensajes = (headers) => {
    return apiClient.get('/mensajes', {headers});
};

export const obtenerMensajesNuevos = (headers) => {
    return apiClient.get('/mensajes/nuevos', { headers });
};

export const eliminarMensajes = (id, headers) => {
    return apiClient.delete(`/mensajes/eliminar/${id}`, {headers});
};

export const enviarRespuesta = (email, respuesta, headers) => {
    return apiClient.post('/mensajes/responder', {email, respuesta}, {headers});
};

import { apiClient } from "@/services/apiClient";

export const compra = (carrito) => {
    return apiClient.post('/comprar', { carrito });
};
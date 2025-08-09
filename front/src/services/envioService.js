import { apiGeoref } from "@/services/apiClient";

export const listarProvincias = () => {
    return apiGeoref.get('/provincias?campos=id,nombre');
};

export const listarMunicipios = (idProvincia) => {
    return apiGeoref.get(`/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`);
}
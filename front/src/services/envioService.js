import { apiGeoref } from "@/services/apiClient";

export const listarProvincias = () => {
    return apiGeoref.get('/provincias?campos=id,nombre');
};

export const listarDepartamentos = (idProvincia) => {
    return apiGeoref.get("https://apis.datos.gob.ar/georef/api/departamentos", {
        params: {
            provincia: idProvincia,
            max: 500
        }
    });
};

export const listarLocalidades = (idProvincia, idDepartamento) => {
    return apiGeoref.get("https://apis.datos.gob.ar/georef/api/localidades", {
        params: {
            provincia: idProvincia,
            departamento: idDepartamento,
            max: 500
        }
    });
};


import { useState } from "react";

// Hook para gestionar datos ingresados en un formulario

const useFormulario = (funcionEnvio) => {

    const [inputs, setInputs] = useState({});
    
        const gestionIngreso = (evento) => {
            const name = evento.target.name;
            const value = evento.target.value;
            setInputs((values) => ({ ...values, [name]: value }));
        };
    
        const gestionEnvio = (evento) => {
            evento.preventDefault();
            // Acción a realizar con los datos ingresados
            funcionEnvio(inputs);
        };
    
    return {
        inputs,
        setInputs,
        gestionEnvio,
        gestionIngreso
    }
};

export default useFormulario;
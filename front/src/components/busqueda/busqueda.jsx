import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormulario from '@/hooks/useFormulario';
import '@/components/busqueda/busqueda.css'

const Busqueda = () => {

    // Para redirigir después de registrarse
    const navigate = useNavigate();

    // Gestión de envío del formulario
    const buscar = (datos) => {
        navigate(`/resultados?banda=${encodeURIComponent(datos.bandaBuscada)}`);
    };

    const { inputs, gestionIngreso, gestionEnvio } = useFormulario(buscar);
    return (
        <form onSubmit={gestionEnvio} className='busqueda-form'>
            <input
                className="form-control busqueda-input"
                name="bandaBuscada"
                type="search"
                placeholder="Buscá por banda"
                value={inputs.bandaBuscada}
                onChange={gestionIngreso}
            />
            <button type="submit" className='busqueda-btn'><i className="fas fa-search search-icon"></i></button>
        </form>
    );
};

export default Busqueda;
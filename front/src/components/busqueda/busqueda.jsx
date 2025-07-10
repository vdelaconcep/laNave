import { useState } from 'react';
import '@/components/busqueda/busqueda.css'

const Busqueda = () => {

    const [inputFocus, setInputFocus] = useState(false);
    return (
        <form className='busqueda-form'>
            <input
                className="form-control busqueda-input"
                name="banda"
                type="search"
                placeholder="Buscá por banda"
                onFocus={() => { setInputFocus(true); }}
                onBlur={() => { setInputFocus(false); }}
            />
            <button type="submit" className={`busqueda-btn ${inputFocus ? 'activo' : ''}`}><i className="fas fa-search search-icon"></i></button>
        </form>
    );
};

export default Busqueda;
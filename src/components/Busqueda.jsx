import React from 'react';
import './css/busqueda.css'

const Busqueda = () => {
    return (
        <form action="/busqueda" method="POST">
        <input className="form-control search-input" name="banda" type="text" placeholder="Buscá por banda..." />
            <button type="submit" className="boton-busqueda" style={{ backgroundColor: "transparent", border: "none" }}><i class="fas fa-search search-icon"></i></button>
        </form>
    );
};

export default Busqueda;
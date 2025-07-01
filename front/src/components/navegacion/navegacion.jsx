import ItemDesplegable from '@/components/navegacion/itemDesplegable';
import Busqueda from '@/components/busqueda/busqueda';
import { useState } from 'react';
import '@/components/navegacion/navegacion.css';
import { Link } from "react-router-dom";

const dataProductos = [
    {
        texto: "Remeras",
        linkTo: "/remeras"
    },
    {
        texto: "Buzos",
        linkTo: "/buzos"
    },
    {
        texto: "Mochilas",
        linkTo: "/mochilas"
    }
];

const dataServicios = [
    {
        texto: "Remeras",
        linkTo: "/remeras"
    },
    {
        texto: "Buzos",
        linkTo: "/buzos"
    },
    {
        texto: "Mochilas",
        linkTo: "/mochilas"
    }
];

const fijos = [
    {
        texto: "Nosotros",
        linkTo: "/nosotros"
    },
    {
        texto: "Contacto",
        linkTo: "/contacto"
    }
];

const Navegacion = ({ pantalla }) => {

    const clases = {
        pantalla: pantalla === 'pantallaChica' ? 'pChica' : '',
        div: pantalla === 'pantallaChica' ? 'dropdown' : '',
        ul: pantalla === 'pantallaChica' ? 'dropdown-menu listaDesplegable' : '',
        li: pantalla === 'pantallaChica' ? 'listaDesplegable-item' : 'navegacion-item'
    }

    const [desplegado, setDesplegado] = useState(null)

    return (
        <nav>
            <div className={`${clases.div}`}>
                <button
                    className='menuBarras btn d-block d-lg-none text-white'
                    type='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    style={{ border: "none" }}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <ul className={`${clases.ul} ${clases.pantalla} d-lg-flex list-unstyled mb-0`}>
                    <li className='d-block d-md-none p-2 ps-4 pe-4'>
                        <Busqueda />
                    </li>
                    <ItemDesplegable
                        titulo={"Productos"}
                        listaVinculos={dataProductos}
                        pantalla={pantalla}
                        desplegado={desplegado}
                        setDesplegado={setDesplegado}
                    />

                    <ItemDesplegable
                        titulo={"Servicios"}
                        listaVinculos={dataServicios}
                        pantalla={pantalla}
                        desplegado={desplegado}
                        setDesplegado={setDesplegado}
                    />
                    {fijos.map((vinculo) => (
                        <li key={vinculo.linkTo} className={`${clases.li}`}><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navegacion;
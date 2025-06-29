import ItemDesplegable from '@/components/navegacion/itemDesplegable';
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
        nav: pantalla === 'pantallaChica' ? 'dropdown' : '',
        ul: pantalla === 'pantallaChica' ? 'dropdown-menu' : ''
    }

    return (
        <nav className={`${clases.nav}`}>
            <div className='dropdown'>
                <button className='menuBarras btn d-block d-lg-none text-white' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i className="fa-solid fa-bars"></i>  <i className="fa-solid fa-caret-down"></i>
                </button>
                <ul className={`${clases.ul} d-lg-flex list-unstyled mb-0`}>
                    <ItemDesplegable titulo={"Productos"} listaVinculos={dataProductos} pantalla={pantalla} />
                    {fijos.map((vinculo) => (
                        <li key={vinculo.linkTo} className="navegacion-item"><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navegacion;
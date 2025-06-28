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

const Navegacion = () => {

    return (
        <nav>
            <button className='menuBarras btn d-block d-lg-none' type='button'>
                <i className="fa-solid fa-bars"></i> <i className="fa-solid fa-caret-down"></i>
            </button>
            <ul className='d-none d-lg-flex list-unstyled mb-0'>
                <ItemDesplegable titulo={"Productos"} listaVinculos={dataProductos} pantalla={"pantallaGrande"} />
                {fijos.map((vinculo) => (
                    <li key={vinculo.linkTo} className="menuPrincipal-item"><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                ))}
            </ul>
        </nav>
    );
};

export default Navegacion;
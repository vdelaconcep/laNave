import { Link } from "react-router-dom";
import '@/components/navegacion/navegacion.css';

const ItemDesplegable = ({ titulo, listaVinculos, pantalla }) => {

    const idLista = `lista-${titulo.toLowerCase()}`;

    const dataBsToggleBoton = pantalla === "pantallaChica" ? "collapse" : "dropdown";

    const claseUl = pantalla === "pantallaChica" ? "collapse" : "dropdown-menu";

    return (
        <li className="dropdown navegacion-item">
            <button
                className="btn dropdown-toggle" type="button"
                data-bs-toggle={dataBsToggleBoton}
                data-bs-target={`#${idLista}`}
                aria-expanded="false"
                aria-controls="lista-desplegable"
                onClick={(e) => e.stopPropagation()}
            >
                {titulo}
            </button>
            <ul id={`${idLista}`} className={`lista-desplegable list-unstyled ${claseUl}`}>
                {listaVinculos.map((vinculo) => (
                    <li key={vinculo.linkTo} className="menuDesplegable-item text-white"><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                ))}
            </ul>
        </li>
    );
};

export default ItemDesplegable;
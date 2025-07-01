import { Link } from "react-router-dom";
import '@/components/navegacion/navegacion.css';

const ItemDesplegable = ({ titulo, listaVinculos, pantalla }) => {

    const idLista = `lista-${titulo.toLowerCase()}`;

    const dataBsToggleBoton = pantalla === "pantallaChica" ? "collapse" : "dropdown";

    const clases = {
        li: pantalla === "pantallaChica" ? "listaDesplegable-item" : "dropdown-center navegacion-item",
        ul: pantalla === "pantallaChica" ? "collapse listaColapsable" : "dropdown-menu listaDesplegable",
        vinculo: pantalla === "pantallaChica" ? "listaColapsable-item" : "listaDesplegable-item"
    }

    return (
        <li className={`${clases.li}`}>
            <button
                className="btn dropdown-toggle" type="button"
                data-bs-toggle={dataBsToggleBoton}
                data-bs-target={`#${idLista}`}
                aria-expanded="false"
                aria-controls="listaDesplegable"
                onClick={(e) => e.stopPropagation()}
                style={{border: "none"}}
            >
                {titulo}
            </button>

            <ul id={`${idLista}`} className={`list-unstyled ${clases.ul}`}>
                {listaVinculos.map((vinculo) => (
                    <li key={vinculo.linkTo} className={`${clases.vinculo}`}><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                ))}
            </ul>
        </li>
    );
};

export default ItemDesplegable;
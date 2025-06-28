import { Link } from "react-router-dom";
import '@/components/navegacion/navegacion.css';

const ItemDesplegable = ({ titulo, listaVinculos, pantalla }) => {
    const dataBsToggleBoton = pantalla === "pantallaChica" ? "collapse" : "dropdown";

    const claseUl = pantalla === "pantallaChica" ? "collapse" : "dropdown-menu";

    return (
        <li className="dropdown menuPrincipal-item desplegable">
            <button className="btn btn-desplegable dropdown-toggle" type="button" data-bs-toggle={dataBsToggleBoton} data-bs-target="#lista-desplegable" aria-expanded="false" aria-controls="lista-desplegable">
                {titulo}
            </button>
            <ul id="lista-desplegable" className={`lista-desplegable list-unstyled ${claseUl}`}>
                {listaVinculos.map((vinculo) => (
                    <li key={vinculo.linkTo} className="menuDesplegable-item"><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                ))}
            </ul>
        </li>
    );
};

export default ItemDesplegable;
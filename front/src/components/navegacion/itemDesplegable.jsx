import { Link } from "react-router-dom";
import { useRef, useEffect} from "react";
import '@/components/navegacion/navegacion.css';

const ItemDesplegable = ({ titulo, listaVinculos, pantalla, desplegado, setDesplegado }) => {
    // Para reconocer la lista que despliega ESTE ítem
    const idLista = `lista-${titulo.toLowerCase()}`;

    // Clases variables según pantalla
    const clases = {
        pantalla: pantalla === "pantallaChica" ? "" : "pGrande",
        li: pantalla === "pantallaChica" ? "listaDesplegable-item" : "dropdown-center navegacion-item",
        ul: pantalla === "pantallaChica" ? "collapse listaColapsable" : "dropdown-menu listaDesplegable",
        vinculo: pantalla === "pantallaChica" ? "listaColapsable-item" : "listaDesplegable-item"
    }

    // Controles para abrir y cerrar ESTE ítem desplegable al hacer click en el botón
    const estaDesplegado = desplegado === titulo;

    const ulRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        if (estaDesplegado) {
            ulRef.current.classList.add("show");
            ulRef.current.classList.remove("ocultando");
        } else if (ulRef.current.classList.contains("show")) {
            ulRef.current.classList.add("ocultando");
            setTimeout(() => {
                ulRef.current.classList.remove("ocultando");
                ulRef.current.classList.remove("show");
            }, 200);
        }
    }, [estaDesplegado]);

    // Para cerrar el ítem cuando se hace click en otra parte de la pantalla
    useEffect(() => {
        const cerrarMenu = (e) => {
            if (estaDesplegado && !btnRef.current.contains(e.target)) {
                setDesplegado(null);
            }
        };

        document.addEventListener("click", cerrarMenu);
        return () => document.removeEventListener("click", cerrarMenu);
    }, [estaDesplegado, setDesplegado]);

    // Componente Ítem desplegable (elemento en la lista de navegación)
    return (
        <li className={`${clases.li}`}>
            <button
                className="btn dropdown-toggle"
                ref={btnRef}
                type="button"
                data-bs-toggle={pantalla === "pantallaChica" ? "collapse" : ""}
                data-bs-target={`#${idLista}`}
                aria-expanded="false"
                aria-controls={`${idLista}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setDesplegado(estaDesplegado ? null : titulo);
                }}
                style={{border: "none", borderRadius: "0"}}
            >
                {titulo}
            </button>

            <ul
                id={`${idLista}`}
                className={`list-unstyled ${clases.ul} ${clases.pantalla}`}
                ref={ulRef}
            >
                {listaVinculos.map((vinculo) => (
                    <li key={vinculo.linkTo} className={`${clases.vinculo}`}>
                        <Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default ItemDesplegable;
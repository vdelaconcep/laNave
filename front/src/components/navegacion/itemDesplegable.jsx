import { Link } from "react-router-dom";
import { useState, useRef, useEffect} from "react";
import '@/components/navegacion/navegacion.css';

const ItemDesplegable = ({ titulo, listaVinculos, pantalla, desplegado, setDesplegado }) => {

    const idLista = `lista-${titulo.toLowerCase()}`;
    const clases = {
        li: pantalla === "pantallaChica" ? "listaDesplegable-item" : "dropdown-center navegacion-item",
        ul: pantalla === "pantallaChica" ? "collapse listaColapsable" : "dropdown-menu listaDesplegable",
        vinculo: pantalla === "pantallaChica" ? "listaColapsable-item" : "listaDesplegable-item"
    }

    const estaDesplegado = desplegado === titulo;

    const ulRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        if (ulRef.current) {
            if (estaDesplegado) {
                ulRef.current.classList.add("show");
                ulRef.current.classList.remove("ocultando");
            } else if (ulRef.current.classList.contains("show")) {
                ulRef.current.classList.add("ocultando");
                setTimeout(() => {
                    ulRef.current.classList.remove("ocultando");
                    ulRef.current.classList.remove("show");
                }, 100);
            }
        }
    }, [estaDesplegado]);

    useEffect(() => {
        const cerrarMenu = (e) => {
            if (estaDesplegado && !btnRef.current.contains(e.target)) {
                setDesplegado(null);
            }
        };

        document.addEventListener("click", cerrarMenu);
        return () => document.removeEventListener("click", cerrarMenu);
    }, [estaDesplegado, setDesplegado]);

    return (
        <li className={`${clases.li}`}>
            <button
                className="btn dropdown-toggle"
                ref={btnRef}
                type="button"
                data-bs-toggle={pantalla === "pantallaChica" ? "collapse" : ""}
                data-bs-target={`#${idLista}`}
                aria-expanded="false"
                aria-controls="listaDesplegable"
                onClick={(e) => {
                    e.stopPropagation();
                    setDesplegado(estaDesplegado ? null : titulo);
                }}
                style={{border: "none"}}
            >
                {titulo}
            </button>

            <ul
                id={`${idLista}`}
                className={`list-unstyled ${clases.ul}`}
                ref={ulRef}
            >
                {listaVinculos.map((vinculo) => (
                    <li key={vinculo.linkTo} className={`${clases.vinculo}`}><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                ))}
            </ul>
        </li>
    );
};

export default ItemDesplegable;
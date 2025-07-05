import ItemDesplegable from '@/components/navegacion/itemDesplegable';
import Busqueda from '@/components/busqueda/busqueda';
import { useState, useEffect, useRef } from 'react';
import '@/components/navegacion/navegacion.css';
import { Link } from "react-router-dom";

// Vínculos del menú de navegación (títulos y rutas)
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
    },
    {
        texto: "Varios",
        linkTo: "/varios"
    },
    {
        texto: "Ver todo",
        linkTo: "/vertodo"
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

    // Clases variables según pantalla
    const clases = {
        pantalla: pantalla === 'pantallaChica' ? 'pChica' : '',
        div: pantalla === 'pantallaChica' ? 'dropdown' : '',
        ul: pantalla === 'pantallaChica' ? 'dropdown-menu listaDesplegable' : '',
        li: pantalla === 'pantallaChica' ? 'listaDesplegable-item' : 'navegacion-item'
    };

    // Controles para abrir y cerrar listas desplegables en distintas pantallas
    const [desplegadoMenuGrande, setDesplegadoMenuGrande] = useState(null);
    const [desplegadoMenuChico, setDesplegadoMenuChico] = useState(false);
    
    const ulRef = useRef(null);
    const btnRef = useRef(null);
    const contenidoBtnRef = useRef(null);
    const busquedaRef = useRef(null);

    // Para abrir y cerrar el menú hamburguesa (menuChico)
    useEffect(() => {
        if (desplegadoMenuChico) {
            ulRef.current.classList.add("show");
            ulRef.current.classList.remove("ocultando");
            contenidoBtnRef.current.classList.add("abierto");

        } else if (ulRef.current.classList.contains("show")) {
            ulRef.current.classList.add("ocultando");
            contenidoBtnRef.current.classList.add("cerrado");
            contenidoBtnRef.current.classList.remove("abierto");
            
            setTimeout(() => {
                ulRef.current.classList.remove("ocultando");
                ulRef.current.classList.remove("show");
                contenidoBtnRef.current.classList.remove("cerrado")
            }, 300);
        }
    }, [desplegadoMenuChico]);

    // Para cerrar menú desplegado al hacer click en otro punto de la pantalla
    useEffect(() => {
        const cerrarMenu = (e) => {
            if (desplegadoMenuChico && !btnRef.current.contains(e.target) && !busquedaRef.current.contains(e.target)) {
                setDesplegadoMenuChico(false);
            }
        };

        document.addEventListener("click", cerrarMenu);
        return () => document.removeEventListener("click", cerrarMenu);
    }, [desplegadoMenuChico, setDesplegadoMenuChico]);

    // Componente de navegación
    return (
        <nav>
            <div className={`${clases.div}`}>
                <button
                    className='menuBarras btn d-block d-lg-none text-white'
                    ref={btnRef}
                    type='button'
                    aria-expanded='false'
                    style={{ border: "none" }}
                    onClick={() => { desplegadoMenuChico ? setDesplegadoMenuChico(false) : setDesplegadoMenuChico(true) }}
                >
                        <i
                            ref={contenidoBtnRef}
                            className={`fa-solid ${desplegadoMenuChico ? 'fa-x abierto' : 'fa-bars cerrado'}`}></i>
                </button>

                <ul className={`${clases.ul} ${clases.pantalla} d-lg-flex list-unstyled mb-0`} ref={ulRef}>
                    <li
                        ref={busquedaRef}
                        className='d-block d-md-none p-4 pt-2 pb-2'>
                        <Busqueda />
                    </li>
                    <hr className='division d-block d-md-none'/>
                    <ItemDesplegable
                        titulo={"Productos"}
                        listaVinculos={dataProductos}
                        pantalla={pantalla}
                        desplegado={desplegadoMenuGrande}
                        setDesplegado={setDesplegadoMenuGrande}
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
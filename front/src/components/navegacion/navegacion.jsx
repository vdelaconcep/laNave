import ItemDesplegable from '@/components/navegacion/itemDesplegable';
import Busqueda from '@/components/busqueda/busqueda';
import { useState, useEffect, useRef } from 'react';
import '@/components/navegacion/navegacion.css';
import { Link } from "react-router-dom";

// Vínculos del menú de navegación (títulos y rutas)

const dataProductosAdmin = [
    {
        texto: "Ver lista",
        linkTo: "/productosAdmin"
    },
    {
        texto: "Agregar",
        linkTo: "/alta"
    }
]

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
        texto: "Ofertas",
        linkTo: "/ofertas"
    },
    {
        texto: "Ver todo",
        linkTo: "/productos"
    }
];

const fijosAdmin = [
    {
        texto: "Ventas",
        linkTo: "/ventas"
    },
    {
        texto: "Descuentos",
        linkTo: "/descuentos"
    },
    {
        texto: "Usuarios",
        linkTo: "/usuarios"
    }
]

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

    const usuario = JSON.parse(localStorage.getItem('usuario'));

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
    const contenidoBtnRef = useRef(null);

    const noCerrarRef = useRef({});

    const asignarRef = (referencia) => (a) => {
        if (a) noCerrarRef.current[referencia] = a;
        else delete noCerrarRef.current[referencia];
    };

    // Para abrir y cerrar el menú hamburguesa (menuChico)
    useEffect(() => {
        if (desplegadoMenuChico) {
            ulRef.current.classList.remove("ocultando");
            ulRef.current.classList.add("show");
            contenidoBtnRef.current.classList.add("abierto");
            

        } else if (ulRef.current.classList.contains("show")) {
            ulRef.current.classList.add("ocultando");
            contenidoBtnRef.current.classList.remove("abierto");
            contenidoBtnRef.current.classList.add("cerrado");
            
            
            setTimeout(() => {
                ulRef.current.classList.remove("ocultando");
                ulRef.current.classList.remove("show");
                contenidoBtnRef.current.classList.remove("cerrado");
            }, 300);
        }
    }, [desplegadoMenuChico]);

    // Para cerrar menú desplegado al hacer click en otro punto de la pantalla
    useEffect(() => {

        const cerrarMenu = (e) => {
            const noCerrar = Object.values(noCerrarRef.current).some(el => el && el.contains(e.target))
            
            if (desplegadoMenuChico && !noCerrar) {
                setDesplegadoMenuChico(false);
            }
        };

        document.addEventListener("click", cerrarMenu);
        return () => document.removeEventListener("click", cerrarMenu);
    }, [desplegadoMenuChico, setDesplegadoMenuChico]);

    return (
        <nav>
            <div className={`${clases.div}`}>
                <button
                    className='menuBarras btn d-block d-lg-none ms-1'
                    ref={asignarRef('boton')}
                    type='button'
                    aria-expanded='false'
                    style={{ border: "none" }}
                    onClick={() => { desplegadoMenuChico ? setDesplegadoMenuChico(false) : setDesplegadoMenuChico(true) }}
                >
                        <i
                            ref={contenidoBtnRef}
                            className={`fa-solid ${desplegadoMenuChico ? 'fa-x' : 'fa-bars'}`}></i>
                </button>

                <ul className={`${clases.ul} ${clases.pantalla} d-lg-flex list-unstyled mb-0`} ref={ulRef}>
                    <li className='d-flex
                    justify-content-sm-center d-md-none'>
                        <button
                            className='menuBarras btn ms-1 text-white d-block d-sm-none'
                            type='button'
                            style={{ border: "none" }}
                        >
                            <i className="fa-solid fa-x"></i>
                        </button>
                        <div
                            ref={asignarRef('busqueda')} className='div-busqueda-chico d-flex justify-content-center p-sm-4 pt-2 pb-2 pt-sm-2 pb-sm-2 w-100 ms-2 me-4 ms-sm-0 me-sm-0'>
                            <Busqueda
                                onBuscar={() => setDesplegadoMenuChico(false)} />
                        </div>
                    </li>
                    <hr
                        className='division d-block d-md-none'
                        ref={asignarRef('division')}
                    />
                    {usuario && usuario.rol === 'administrador' ?
                        <>
                            <ItemDesplegable
                                titulo={"Productos"}
                                listaVinculos={dataProductosAdmin}
                                pantalla={pantalla}
                                desplegado={desplegadoMenuGrande}
                                setDesplegado={setDesplegadoMenuGrande}
                                />
                            {fijosAdmin.map((vinculo) => (
                                <li key={vinculo.linkTo} className={`${clases.li}`}><Link to={vinculo.linkTo} className="links">{vinculo.texto}</Link></li>
                            ))}
                        </> :
                        <>
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
                        </>
                    }
                    
                </ul>
            </div>
        </nav>
    );
};

export default Navegacion;
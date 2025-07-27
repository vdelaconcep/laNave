import Navegacion from '@/components/navegacion/navegacion';
import Busqueda from '@/components/busqueda/busqueda';
import BotonLink from '@/components/botones/botonLink';
import BotonSecundario from '@/components/botones/botonSecundario';
import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '@/context/authContext';
import logo from '@/assets/img/logo.jpg';
import banner from '@/assets/img/banner2.png';
import '@/components/header/header.css';

const Header = () => {

    // Si la sesión está iniciada, mostrar el nombre de usuario
    const { sesionIniciada, usuario, logout } = useAuth();

    const nombreUsuario = usuario?.nombreYApellido?.trim().split(" ")[0];
    const textoBtnUsuario = sesionIniciada && nombreUsuario ? nombreUsuario : 'Ingresá'

    // Mostrar/ocultar botón de cerrar sesión
    const [botonCerrarSesion, setBotonCerrarSesion] = useState(false);
    
    // Ocultar botón de cerrar sesión al hacer click en cualquier parte
    const refUsuarioDiv = useRef();
    useEffect(() => {

        const ocultarBoton = (e) => {
            if (botonCerrarSesion && !refUsuarioDiv.current.contains(e.target)) setBotonCerrarSesion(false)
        };

        document.addEventListener("click", ocultarBoton);
        return () => document.removeEventListener("click", ocultarBoton);
    }, [botonCerrarSesion, setBotonCerrarSesion]);

    return (
        <header>
            <section className="barraSuperior hstack">
                <div className='d-block d-lg-none'>
                    <Navegacion pantalla={'pantallaChica'} />   
                </div>
                <div className="ps-3 d-none d-sm-block">
                    <Link to="/" className='links' title="Página principal"><img src={logo} alt="logo" style={{ height: "50px" }} /></Link>
                </div>
                <div className="d-none d-lg-block ps-4 ps-xl-0 ms-md-auto me-md-auto">
                    <Navegacion pantalla={'pantallaGrande'} />
                </div>
                {!(usuario && usuario.rol && usuario.rol === 'administrador') && 
                    <div className="ps-3 pe-3 d-none d-md-block ms-auto me-auto w-25">
                        <Busqueda />
                    </div>
                }
                <div
                    className="header-usuarioDiv pe-2 ms-auto ms-lg-0"
                    ref={refUsuarioDiv}>
                    <BotonLink
                        vinculo={sesionIniciada ? "#" : "/login"}
                        texto={<span>{textoBtnUsuario} <i className="fa-solid fa-user-large"></i></span>}
                        accion={sesionIniciada ? () => setBotonCerrarSesion(!botonCerrarSesion) : null} />
                    <article
                        className={botonCerrarSesion ? 'botonCerrarSesion visible' : 'botonCerrarSesion'}>
                        <BotonSecundario
                            tipo='button'
                            texto='Cerrar sesión'
                            accion={() => {
                                const confirmacion = confirm('¿Salir de la sesión actual?');
                                if (confirmacion) logout();
                                setBotonCerrarSesion(false);
                            }} />
                    </article>
                </div>
                <div className="pe-3">
                    {(usuario && usuario.rol && usuario.rol === 'administrador') ?
                        <BotonLink vinculo={"/mensajes"} texto={<><span className='d-none d-sm-inline'>Mensajes </span><span><i className="fa-solid fa-envelope"></i></span></>} numero={3} /> :
                        <BotonLink vinculo={"/carrito"} texto={<><span className='d-none d-sm-inline'>Carrito</span><span><i className="fa-solid fa-cart-shopping"></i></span></>} numero={3} />}
                </div>
            </section>
            <section className="d-sm-none">
                <Link to="/" className='links'><img className="w-100" src={banner} alt="banner" /></Link>
                <p className="header-leyenda text-end pe-3"><b>REMERAS - BUZOS - MOCHILAS - Y MÁS</b></p>
            </section>
        </header>
    )
};

export default Header;
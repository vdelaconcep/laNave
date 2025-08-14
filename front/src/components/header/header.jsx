import Navegacion from '@/components/navegacion/navegacion';
import Busqueda from '@/components/busqueda/busqueda';
import BotonLink from '@/components/botones/botonLink';
import BotonSecundario from '@/components/botones/botonSecundario';
import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '@/context/authContext';
import { CarritoContext } from '@/context/carritoContext';
import { obtenerMensajesNuevos } from '@/services/mensajeService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import logo from '@/assets/img/logo.jpg';
import banner from '@/assets/img/banner2.png';
import '@/components/header/header.css';

const Header = () => {

    // Si la sesión está iniciada, mostrar el nombre de usuario
    const { sesionIniciada, usuario, logout } = useAuth();

    const nombreUsuario = usuario?.nombreYApellido?.trim().split(" ")[0];
    const textoBtnUsuario = sesionIniciada && nombreUsuario ? nombreUsuario : 'Ingresá'

    // Botón de cerrar sesión
    const [botonCerrarSesion, setBotonCerrarSesion] = useState(false);

    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);
    
    // Ocultar botón de cerrar sesión al hacer click en cualquier parte
    const refUsuarioDiv = useRef();
    useEffect(() => {

        const ocultarBoton = (e) => {
            if (botonCerrarSesion && !refUsuarioDiv.current.contains(e.target)) setBotonCerrarSesion(false)
        };

        document.addEventListener("click", ocultarBoton);
        return () => document.removeEventListener("click", ocultarBoton);
    }, [botonCerrarSesion, setBotonCerrarSesion]);

    // Productos agregados al carrito

    const { carrito, setCarrito } = useContext(CarritoContext);
    const [numeroCarrito, setNumeroCarrito] = useState(0);

    const [nuevosMensajes, setNuevosMensajes] = useState(0);

    useEffect(() => {
        const totalProductos = carrito
            .filter(item => item.hasOwnProperty('cantidad'))
            .reduce((acc, producto) => acc + producto.cantidad, 0);

        setNumeroCarrito(totalProductos);
    }, [carrito]);

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    useEffect(() => {
        if (usuario && usuario.rol === 'administrador') {
            const cargarMensajes = async () => {
                try {
                    const res = await obtenerMensajesNuevos(headers);

                    if (res.status !== 200) return toast.error(`Error al obtener mensajes nuevos: ${res.statusText}`);
                    setNuevosMensajes(res.data.length);
                } catch (err) {
                    return toast.error(`Error al obtener mensajes nuevos: ${err.response.data.error}`);
                }
            };

            cargarMensajes();
        };
    }, [usuario]);

    useEffect(() => {
        if (confirm) {
            logout();
            setBotonCerrarSesion(false);
            setConfirm(false);
        }
    }, [confirm])

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
                            accion={() => setMostrarConfirm(true)} />
                    </article>
                </div>
                <div className="pe-3">
                    {(usuario && usuario.rol && usuario.rol === 'administrador') ?
                        <BotonLink vinculo={"/mensajes"} texto={<><span className='d-none d-sm-inline'>Mensajes </span><span><i className="fa-solid fa-envelope"></i></span></>} numero={nuevosMensajes} /> :
                        <BotonLink vinculo={"/carrito"} texto={<><span className='d-none d-sm-inline'>Carrito</span><span><i className="fa-solid fa-cart-shopping"></i></span></>} numero={numeroCarrito} />}
                </div>
            </section>
            {mostrarConfirm ?
                <Confirm
                    pregunta='¿Salir de la sesión actual?'
                    setConfirm={setConfirm}
                    setMostrarConfirm={setMostrarConfirm}
                /> : ''
            }
        </header>
    )
};

export default Header;
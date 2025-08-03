import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerMensajes, eliminarMensajes } from '@/services/mensajeService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import formatearUTC from '@/utils/formatearUTC.js';
import RespuestaMensaje from '@/components/emergentes/respuestaMensaje';
import BotonSecundario from '@/components/botones/botonSecundario';
import '@/pages/css/mensajes.css'
import { enviarRespuesta } from '@/services/mensajeService';

const Mensajes = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);

    const navigate = useNavigate();

    const [cargando, setCargando] = useState(false);
    const [mensajes, setMensajes] = useState([]);

    const [mensajeMenu, setMensajeMenu] = useState('');

    const [mensajeAEliminar, setMensajeAEliminar] = useState(null);
    const refs = useRef({});

    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const [emailAResponder, setEmailAResponder] = useState(null);
    const [cargandoEnvio, setCargandoEnvio] = useState(false);
    const [respuesta, setRespuesta] = useState('');

    // Para evitar que la petición se ejecute dos veces (se quita la condición a los mensajes nuevos)
    const ejecutado = useRef(false);

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const traerMensajes = async () => {
        try {
            setCargando(true);
            const res = await obtenerMensajes(headers);
        
            if (res.status !== 200) return toast.error(`Error al obtener mensajes: ${res.statusText}`);

            const ordenados = res.data.sort((a, b) => new Date(b.fechaYHora) - new Date(a.fechaYHora));

            return setMensajes(ordenados);
        } catch (err) {
            toast.error(`Error al obtener mensajes: ${err.response.data.error}`);
            return setMensajes([]);
        } finally {
            setCargando(false);
        }
    }

    const responder = async (email, respuesta) => {
        try {
            const res = await enviarRespuesta(email, respuesta, headers);
            if (res.status !== 200) return toast.error(`Error al enviar respuesta: ${res.statusText}`);
            
            return toast.success('Respuesta enviada');

        } catch (err) {
            return toast.error(`Error al enviar respuesta: ${err.response.data.error}`);
        } finally {
            setEmailAResponder(null);
            setRespuesta('');
            setCargandoEnvio(false);
        }
    } 

    useEffect(() => {
        if (ejecutado.current) return;
        ejecutado.current = true;
        traerMensajes();
    }, []);

    // Cerrar menús desplegables al hacer click en cualquier lugar de la página
    useEffect(() => {
        const clickFueraDeMenu = (evento) => {
            if (evento.target.closest('.mensajes-articleBoton')) return;

            const menus = document.querySelectorAll('.mensajes-article-divSuperior-ulDesplegable');
            let clickDentroDeMenu = false;
            
            menus.forEach(menu => {
                if (menu.contains(evento.target)) {
                    clickDentroDeMenu = true;
                };
            });

            if (!clickDentroDeMenu) setMensajeMenu('');
        };
        
        document.addEventListener('click', clickFueraDeMenu);

        return () => {
            document.removeEventListener('click', clickFueraDeMenu);
        };
    }, [])

    useEffect(() => {
        const eliminarMensaje = async (id) => {
            try {
                const res = await eliminarMensajes(id, headers);
                if (res.status !== 204) return toast.error(`Error al eliminar mensaje: ${res.statusText}`);

                if (refs.current[id]) refs.current[id].classList.add('d-none');
            } catch (err) {
                return toast.error(`Error al eliminar mensaje: ${err.response.data.error}`);
            } finally {
                setMensajeAEliminar(null);
                delete refs.current[id];
            }
        };
        if (confirm && mensajeAEliminar) {
            eliminarMensaje(mensajeAEliminar);
            setConfirm(false);
        }
    }, [confirm]);
    
    return (
        <main>
            {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                <>
                    <h1 className="pagina-titulo text-white text-center">Mensajes recibidos</h1>
                    {cargando &&
                        <h2 className='pagina-cargando text-white text-center m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
                    }

                    {!cargando && mensajes.length === 0 &&
                        <article className='mt-5 d-flex flex-column align-items-center'>
                            <h5 className='text-white mb-5'>No hay mensajes</h5>
                            <BotonSecundario
                                tipo='button'
                                texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                                accion={() => navigate('/productosAdmin')} />
                        </article>
                    }

                    <section className='aparecer d-flex justify-content-center text-white mt-4 mb-5'>
                        

                        
                        <div className='mensajes-lista'>
                            {!cargando && mensajes.length !== 0 &&
                                (mensajes.map(mensaje => 
                                    <article
                                        ref={art => refs.current[mensaje.uuid] = art}
                                        className={`mensajes-article mb-3 p-3 pt-2 ${mensaje.nuevo ? 'nuevo' : 'no-nuevo'}`}
                                        key={mensaje.uuid}>
                                        <div className='mensajes-article-divSuperior d-flex justify-content-between align-items-center m-0 mb-1'>
                                            <p className='mb-0 text-end'>{formatearUTC(mensaje.fechaYHora)}</p>
                                            <button
                                                className='mensajes-articleBoton btn text-white p-0 ps-3'
                                                title='Acciones'
                                                onClick={() => setMensajeMenu(mensaje.uuid)}>
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </button>
                                            {mensajeMenu === mensaje.uuid ?
                                                <ul className='mensajes-article-divSuperior-ulDesplegable list-unstyled text-center fw-bold'>
                                                    <li
                                                        className='mensajes-desplegableLi p-2 pe-4 ps-4'
                                                        onClick={() => setEmailAResponder(mensaje.email)}
                                                    >Responder</li>
                                                    <hr className='text-black p-0 m-0'/>
                                                    <li
                                                        className='mensajes-desplegableLi p-2 pe-4 ps-4'
                                                        onClick={() => {
                                                            setMensajeAEliminar(mensaje.uuid);
                                                            setMostrarConfirm(true);
                                                        }}
                                                    >Eliminar</li>
                                                </ul> : ''}
                                            
                                        </div>
                                        
                                        <p className='m-0'>de: {mensaje.nombre}</p>
                                        <p className='text-decoration-underline text-warning m-0'>{mensaje.email}</p>
                                        <p className='mt-2'>Asunto: {mensaje.asunto}</p>
                                        <p className='mensajes-article-mensaje text-black p-2 pt-1'>{mensaje.mensaje}</p>
                                    </article>
                                ))
                            }
                            
                        </div>
                        {emailAResponder ?
                            <RespuestaMensaje
                                alCancelar={() => {
                                    setEmailAResponder(null);
                                    setRespuesta('');
                                }}
                                alEnviar={() => responder(emailAResponder, respuesta)}
                                respuesta={respuesta}
                                setRespuesta={setRespuesta}
                                cargandoEnvio={cargandoEnvio}
                                setCargandoEnvio={setCargandoEnvio} /> : ''
                        }
                        
                    </section>
                </>}
            {mostrarConfirm ?
                <Confirm
                    pregunta='¿Eliminar el mensaje?'
                    setConfirm={setConfirm}
                    setMostrarConfirm={setMostrarConfirm}
                /> : ''
            }
        </main>
    );
};

export default Mensajes;
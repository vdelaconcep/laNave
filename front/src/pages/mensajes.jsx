import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerMensajes, eliminarMensajes } from '@/services/mensajeService';
import { toast } from 'react-toastify';
import useFechaYHora from '@/hooks/useFechaYHora.js';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonEliminar from '@/components/botones/botonEliminar';
import '@/pages/css/mensajes.css'
import { enviarRespuesta } from '../services/mensajeService';

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

    const [mensajeEliminado, setMensajeEliminado] = useState(false);

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

    const eliminarMensaje = async (id) => {
        try {
            const res = await eliminarMensajes(id, headers);
            if (res.status !== 204) return toast.error(`Error al eliminar mensaje: ${res.statusText}`);

            ejecutado.current = false;
            return setMensajeEliminado(true);
        } catch (err) {
            return toast.error(`Error al eliminar mensaje: ${err.response.data.error}`);
        }
    }

    const responder = async (email, textoRespuesta) => {
        try {
            const res = await enviarRespuesta(email, textoRespuesta, headers);
            if (res.status !== 200) return toast.error(`Error al enviar respuesta: ${res.statusText}`);

            return toast.success('Respuesta enviada');

        } catch (err) {
            return toast.error(`Error al enviar respuesta: ${err.response.data.error}`);
        }
    } 

    useEffect(() => {
        if (ejecutado.current) return;
        ejecutado.current = true;
        traerMensajes();
        setMensajeEliminado(false);
    }, [mensajeEliminado]);
    
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
                                        className={`mensajes-article mb-3 p-3 pt-2 ${mensaje.nuevo ? 'nuevo' : 'no-nuevo'}`}
                                        key={mensaje.uuid}>
                                        <p className='m-0 text-end'>{useFechaYHora(mensaje.fechaYHora)}</p>
                                        <p className='m-0'>de: {mensaje.nombre}</p>
                                        <p className='text-decoration-underline m-0'>{mensaje.email}</p>
                                        <p className='mt-2'>Asunto: {mensaje.asunto}</p>
                                        <p className='mensajes-article-mensaje p-2 pt-1'>{mensaje.mensaje}</p>
                                        <div className='text-center'>
                                            <BotonEliminar
                                                tipo='button'
                                                accion={() => eliminarMensaje(mensaje.uuid)}
                                                claseAdicional='me-2'
                                            />
                                            <BotonPrimario
                                                tipo='button'
                                                texto={<><i className="fa-solid fa-share"></i><span> Responder</span></>}
                                                claseAdicional='ms-2'
                                                accion={() => setEmailAResponder(mensaje.email)}
                                            />
                                        </div>
                                    </article>
                                ))
                            }
                            
                        </div>
                        <div>
                            <textarea name="respuesta" id="respuesta"></textarea>
                            <BotonSecundario
                                tipo='button'
                                texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>}
                                accion={cancelarRespuesta} />
                            <BotonPrimario
                                tipo='button'
                                texto={cargandoEnvio ? <><span>Enviando... </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-paper-plane"></i><span> Enviar</span></>}
                                accion={() => {responder(emailAResponder, respuesta)}} />
                        </div>
                    </section>
                </>}
        </main>
    );
};

export default Mensajes;
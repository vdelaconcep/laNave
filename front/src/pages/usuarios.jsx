import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerUsuarios, cambiarRolDeUsuario, eliminarRegistro } from '@/services/usuarioService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import BotonSecundario from '@/components/botones/botonSecundario';
import Info from '@/components/emergentes/info';
import '@/pages/css/usuarios.css';

const Usuarios = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

        // Fondo de pantalla de la sección
        const { setBackground } = useContext(BackgroundContext);

        useEffect(() => {
            setBackground('bg-admin');
            return () => setBackground('');
        }, []);
    
    const navigate = useNavigate();
    
    const [cargando, setCargando] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    const [usuarioMenu, setUsuarioMenu] = useState({});
    const [accion, setAccion] = useState('');
    const [mostrarInfo, setMostrarInfo] = useState(false);

    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [pregunta, setPregunta] = useState('');

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const traerUsuarios = async () => {
        setCargando(true);
        try {
            const res = await obtenerUsuarios(headers);
            if (res.status !== 200) return toast.error(`Error al obtener usuarios: ${res.statusText}`);
            return setUsuarios(res.data);
        } catch (err) {
            return toast.error(`Error al obtener usuarios: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        } finally {
            setCargando(false);
        };
    };

    useEffect(() => {
        traerUsuarios();
    }, []);

    useEffect(() => {
        if (!confirm || !usuarioMenu?.uuid) return;

        const id = usuarioMenu.uuid;
        const eliminarDatosUsuario = async () => {
            
            try {
                const res = await eliminarRegistro(id, headers);
                if (res.status !== 204) return toast.error(`Error al eliminar registro: ${res.statusText}`);
                return toast.warning('El registro ha sido eliminado');
            } catch (err) {
                return toast.error(`Error al obtener usuarios: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
            }
        };

        const cambiarRol = async () => {
            try {
                const res = await cambiarRolDeUsuario(id, headers);
                if (res.status !== 200) return toast.error(`Error al cambiar rol de usuario: ${res.statusText}`);
                const rolNuevo = usuarioMenu.rol === 'cliente' ? 'administrador' : 'cliente';
                return toast.success(`Se ha cambiado el rol del usuario a ${rolNuevo}`);
            } catch (err) {
                return toast.error(`Error al cambiar rol de usuario: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
            }
        };

        const ejecutarAccion = async () => {
            if (accion === 'eliminar') {
                await eliminarDatosUsuario();
            } else if (accion === 'actualizar') {
                await cambiarRol();
            }
            setAccion('');
            setUsuarioMenu({});
            setConfirm(false);
            setPregunta('');
            setMostrarConfirm(false);
            await traerUsuarios();
        }

        if (confirm) {
            ejecutarAccion();
        }

    }, [confirm]);

    useEffect(() => {
            const clickFueraDeMenu = (evento) => {
                if (evento.target.closest('.usuarios-filaBoton')) return;
    
                const menus = document.querySelectorAll('.usuarios-ulDesplegable');
                let clickDentroDeMenu = false;
                
                menus.forEach(menu => {
                    if (menu.contains(evento.target)) {
                        clickDentroDeMenu = true;
                    };
                });
    
                if (!clickDentroDeMenu) setUsuarioMenu({});
            };
            
            document.addEventListener('click', clickFueraDeMenu);
    
            return () => {
                document.removeEventListener('click', clickFueraDeMenu);
            };
        }, [])
    
        
        return (
            <main>
                {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                    <>
                        <h1 className="pagina-titulo text-white text-center">Lista de usuarios</h1>
                        {cargando &&
                            <h2 className='pagina-cargando text-white text-center m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
                        }

                        {!cargando && usuarios.length === 0 &&
                            <article className='mt-5 mb-5 d-flex flex-column align-items-center'>
                                <h5 className='text-white mb-5'>No se encontraron usuarios</h5>
                                <BotonSecundario
                                    tipo='button'
                                    texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                                    accion={() => navigate('/productosAdmin')} />
                            </article>
                        }
                        {!cargando && usuarios.length !== 0 &&
                            <section className='text-white d-flex flex-column align-items-center mt-2 mb-5'>
                                <div className='bg-dark rounded-4'>
                                    {(usuarios.map(usuario => 
                                        <article
                                            key={usuario.uuid}
                                            className='usuarioArticle d-flex justify-content-between pe-3 ps-3'>
                                            <div>
                                                <p className='usuarioEmail mb-0 mt-2'>{usuario.email}</p>
                                                <p className='text-warning'>{usuario.rol}</p>
                                            </div>
                                            <div className='usuario-celdaBotonDiv d-flex justify-content-end align-items-center ms-3'>
                                                <button
                                                    className='usuarios-filaBoton btn text-white ps-1 pe-1'
                                                    title='Acciones'
                                                    onClick={() => setUsuarioMenu(usuario)}>
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                </button>
                                                {usuarioMenu.uuid === usuario.uuid ?
                                                    <ul className='usuarios-ulDesplegable list-unstyled text-center fw-bold'>
                                                        <li
                                                            className='usuarios-desplegableLi p-2 pe-4 ps-4'
                                                            onClick={() => setMostrarInfo(true)}
                                                        >Ver info</li>
                                                        <hr className='text-black p-0 m-0' />
                                                        <li
                                                            className='usuarios-desplegableLi p-2 pe-4 ps-4'
                                                            onClick={() => {
                                                                setPregunta(`¿Cambiar rol de usuario de ${usuario.email} a ${usuario.rol === 'administrador' ? 'cliente' : 'administrador'}?`);
                                                                setAccion('actualizar');
                                                                setMostrarConfirm(true);
                                                            }}
                                                        >Cambiar rol</li>
                                                        <hr className='text-black p-0 m-0' />
                                                        <li
                                                            className='usuarios-desplegableLi p-2 pe-4 ps-4'
                                                            onClick={() => {
                                                                setPregunta(`¿Eliminar al usuario ${usuario.email} de la base de datos?`);
                                                                setAccion('eliminar');
                                                                setMostrarConfirm(true);
                                                            }}
                                                        >Eliminar</li>
                                                    </ul> : ''}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>

                        }
                        
                    </>}
                {mostrarConfirm ?
                    <Confirm
                        pregunta={pregunta}
                        setConfirm={setConfirm}
                        setMostrarConfirm={setMostrarConfirm}
                    /> : ''
                }
                {mostrarInfo && usuarioMenu ?
                    <Info
                        usuario={usuarioMenu}
                        setMostrarInfo={setMostrarInfo} />
                    : ''}
            </main>
        );
};

export default Usuarios;
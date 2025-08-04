import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerUsuarios } from '@/services/usuarioService';
import { toast } from 'react-toastify';
import BotonSecundario from '@/components/botones/botonSecundario';
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
            return toast.error(`Error al obtener usuarios: ${err}`);
        } finally {
            setCargando(false);
        };
    };

    useEffect(() => {
        traerUsuarios();
    }, []);
        
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
                                <h5 className='text-center'>
                                    Hacé click en el rol de usuario para modificar
                                </h5>
                                <div className='usuarios-tableDiv mb-0 pb-0'>
                                <table className='usuarios-table table table-dark table-striped'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Usuario</th>
                                            <th scope='col' className='text-center'>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map(usuario => (
                                            <tr
                                                key={usuario.uuid}
                                                className='usuarios-tableFila'>
                                                <td>
                                                    <p className='usuarios-tableFila-titulo mb-0'>{usuario.email}</p>
                                                    <p className='mb-0'>Rol: {usuario.rol}</p>
                                                </td>
                                                <td className='usuarios-tableFila-celdaBotones'>
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <button className='me-1'>
                                                            <i className="fa-solid fa-circle-info"></i>
                                                        </button>
                                                        <button className='ms-1'>
                                                            X
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>

                            </section>

                        }
                        
                    </>}
            </main>
        );
};

export default Usuarios;
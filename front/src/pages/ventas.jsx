import { useEffect, useContext, useState } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerVentas } from '@/services/ventaService';
import { toast } from 'react-toastify';
import BotonSecundario from '@/components/botones/botonSecundario';
import formatearUTC from '../utils/formatearUTC';

const Ventas = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);

    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');
    
        const headers = {};
    
        if (token) {
            headers.Authorization = `Bearer ${token}`;
    }

    // Obtener registro de ventas desde el backend
    const traerVentas = async () => {
        try {
            const res = await obtenerVentas(headers);

            if (res.status !== 200) return toast.error(`No puedieron obtenerse los registros de venta: ${res.statusText}`);

            setVentas(res.data)
        } catch (err) {
            toast.error(`Error al obtener registros de venta: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
            return setVentas([]);
        }
    }

    useEffect(() => {
        const cargarVentas = async () => {
            setCargando(true);
            await traerVentas();
            setCargando(false)
        };
        cargarVentas();
    }, [])
    
        return (
            <main>
                {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                    <>
                        <h1 className="pagina-titulo text-white text-center">Registro de ventas</h1>
                        {cargando &&
                            <h2 className='pagina-cargando text-white text-center m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
                        }

                        {!cargando && ventas.length === 0 &&
                                                <article className='mt-5 d-flex flex-column align-items-center'>
                                                    <h5 className='text-white mb-5'>Aún no se han registrado ventas</h5>
                                                    <BotonSecundario
                                                        tipo='button'
                                                        texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                                                        accion={() => navigate('/productosAdmin')} />
                                                </article>
                                            }
                        <section className='aparecer text-white mt-2 mb-5'>
                            <div className='listaVenta-div bg-dark p-3 pt-0 rounded-4' style={{ boxShadow: 'rgba(0, 0, 0, 0.4) 3px 3px 5px'}}>
                                {!cargando && ventas.length !== 0 &&
                                    (ventas.map(venta =>
                                        <article
                                            key={venta.id}>
                                            <p className='pt-3 ps-2 mb-0'>{formatearUTC(venta.fecha)}</p>
                                            <div className='p-3 pe-4 ps-4 bg-secondary rounded-4'>
                                            <p className='text-center text-sm-end mb-0 text-decoration-underline'>{`Usuario: ${venta.emailUsuario}`}</p>
                                            <p className='text-warning fw-bold'>Carrito:</p>
                                            <ul>
                                                {venta.carritoProductos.map(item => <li> <span>{item.producto}</span><span className='text-dark'>{` (${item.id})`}</span> <br />
                                                    <span>{`Talle: ${item.talle}; Cantidad: ${item.cantidad}`}</span>
                                                </li>)}
                                            </ul>
                                                <p><span className='text-warning fw-bold'>Entrega: </span>{venta.entrega.formaEntrega}</p>
                                            {venta.entrega.direccion ? <>
                                                    <p><span className='text-warning fw-bold'>Dirección: </span>{`${venta.entrega.direccion.calle} N°${venta.entrega.direccion.numero}${venta.entrega.direccion.pisoDto ? venta.entrega.direccion.pisoDto : ''} ${venta.entrega.direccion.localidad}, ${venta.entrega.direccion.departamento}, ${venta.entrega.direccion.provincia} (CP ${venta.entrega.direccion.cp ? venta.entrega.direccion.cp : ''})`}</p>
                                            </> : ''}
                                                <p><span className='text-warning fw-bold'>Modo de pago: </span>{`${venta.modoDePago}`}</p>
                                                <p><span className='text-warning fw-bold'>Código de descuento: </span>{`${venta.codigoIngresado ? venta.codigoIngresado : 'NO'}`}</p>
                                            <p className='text-warning text-sm-end fw-bold'>{`Total productos: ARS ${venta.totalProductos}`}</p>
                                            <p className='text-sm-end text-warning fw-bold mb-0'>{venta.totalEnvio > 0 ? `Total envío: ARS ${venta.totalEnvio}` : ''}</p>
                                            </div>
                                        </article>
                                    ))}
                            </div>

                        </section>
                    </>}
            </main>
        );
};

export default Ventas;
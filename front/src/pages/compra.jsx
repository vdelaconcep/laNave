import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { CarritoContext } from '@/context/carritoContext';
import { obtenerProducto } from '@/services/productoService';
import { buscarCodigo } from '@/services/codigoService';
import { listarProvincias, listarMunicipios } from '../services/envioService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';
import '@/pages/css/compra.css';


const Compra = () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const { setBackground } = useContext(BackgroundContext);
    
    useEffect(() => {
        setBackground('bg-carrito');
        return () => setBackground('');
    }, []);

    const navigate = useNavigate();

    // Ídem página carrito, se trae una lista con el detalle de los productos
    const { carrito, setCarrito } = useContext(CarritoContext);
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Componentes del total a pagar
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalEnvio, setTotalEnvio] = useState(0);

    // Mostrar u ocultar
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const [entrega, setEntrega] = useState('');
    const [modoPago, setModoPago] = useState('');

    // Para datos de envío
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState('');
    const [cp, setCp] = useState('');

    // Obtiene información completa sobre un producto desde el backend (para armar lista)
    const obtenerPorId = async (id) => {
        try {
            const res = await obtenerProducto('id', id);

            if (res.status !== 200) {
                toast.error(`Error al obtener datos del producto: ${res.statusText}`);
                return null;
            }
            return res.data;
        } catch (err) {
            toast.error(`Error al obtener datos del producto: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
            return null;
        }
    };

    // Arma lista para mostrar detalle de la compra
    const hacerLista = async () => {

        const carritoProductos = carrito.filter(item => item.hasOwnProperty('cantidad'));
        const carritoDescuento = carrito.filter(item => item.hasOwnProperty('codigo'));
        const listaFinal = [];
        let precioSumado = 0;

        for (let producto of carritoProductos) {
            const productoBD = await obtenerPorId(producto.id);
            if (!productoBD) {
                toast.error('No se puede acceder a los datos de los productos en este momento. Intentá más tarde');
                navigate('/');
                return null;
            };
            if (producto.cantidad > productoBD.stock) {
                toast.info('El ítem solicitado no tiene suficiente stock');
                navigate('/carrito');
                return null;
            }

            let porCodigo = 0;
            if (carritoDescuento && carritoDescuento.length > 0) {
                
                try {
                    const res = await buscarCodigo(carritoDescuento[0].codigo);
                    if (res.status === 200) {
                        let aplicaBanda = false;
                        let aplicaTipo = false;

                        if (res.data.tipoProducto === 'todo') {
                            aplicaTipo = true;
                        } else aplicaTipo = res.data.tipoProducto === producto.tipo

                        if ('banda' in res.data &&
                            typeof res.data.banda === 'string' && res.data.banda.trim().length > 0) {
                            aplicaBanda = producto.banda.toLowerCase().includes(res.data.banda.toLowerCase());
                        } else aplicaBanda = true;

                        if (aplicaBanda && aplicaTipo) porCodigo = res.data.descuento;

                    } else toast.error(`No se aplicó el código de descuento: ${res.statusText}`)
                } catch (err) {
                    toast.error(`No se aplicó el código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
                }
            }

            if (producto.cantidad > 0) {
                const aMostrar = {
                    id: producto.id,
                    talle: producto.talle,
                    cantidad: producto.cantidad,
                    stock: producto.talle ? productoBD.stock[producto.talle] : productoBD.stock['U'],
                    tipo: productoBD.tipo,
                    banda: productoBD.banda,
                    modelo: productoBD.modelo,
                    precio: productoBD.precio,
                    descuento: productoBD.descuento,
                    porCodigo: porCodigo
                };
                listaFinal.push(aMostrar);
                precioSumado += aMostrar.precio * aMostrar.cantidad * (1-aMostrar.descuento/100) * (1-aMostrar.porCodigo/100)
            };
        }
        setTotalProductos(precioSumado);
        return listaFinal;
    }

    const obtenerProvincias = async () => {
        try {
            const res = await listarProvincias();
            if (res.status !== 200) return toast.error(`Error al cargar las provincias: ${res.statusText}`);

            const provincias = res.data.provincias
            setProvincias(provincias.sort((a,b) => a.nombre.localeCompare(b.nombre)))
        } catch (err) {
            toast.error(`Error al cargar provincias: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
        }
    }

    useEffect(() => {
        if (entrega === 'correo') obtenerProvincias();
    }, [entrega]);

    useEffect(() => {
        const cargarLista = async () => {
            setCargando(true);
            const listaFinal = await hacerLista();
            if (listaFinal) setLista(listaFinal);
            setCargando(false);
        };
        cargarLista();
    }, []);

    return (<>
        <main>
            <h1 className="pagina-titulo text-white text-center">Finalizá tu compra</h1>
            <section className='compra-section aparecer container mt-2 mb-5 d-flex flex-column align-items-center'>
                <article className='compraArticle p-3'>
                    {cargando ? 
                        <h5 className='text-white text-center'><i className="fa-solid fa-spinner fa-spin"></i></h5> : `${(!lista || lista.length === 0) ? <h6 className='text-white text-center'>No hay productos en el carrito</h6> : ''}`}
                    {(!cargando && lista.length > 0) ?
                        <>
                            
                            <div className='d-flex justify-content-between'>
                                <h6 className='mb-3 text-warning'>Tu pedido: </h6>
                                <h6 className='compraArticle-totalProductos text-warning mb-0'>
                                    {`ARS ${totalProductos}`}
                                </h6>
                            </div>
                            <button
                                className='compraArticle-botonMostrar'
                                type='button'
                                data-bs-toggle="collapse" data-bs-target="#collapseProductos" aria-expanded="false" aria-controls="collapseProductos"
                                onClick={() => setMostrarDetalle(!mostrarDetalle)}>
                                {mostrarDetalle ? <><span>Ocultar detalle </span><i className="fa-solid fa-chevron-up"></i></> : <><span>Ver detalle </span><i className="fa-solid fa-chevron-down"></i></>}
                            </button>
                            <div className='collapse mt-1' id='collapseProductos'>
                                {lista.map((producto) => {
                                    const titulo = `${producto.tipo[0].toUpperCase() + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`;
                                    const porCodigo = producto.porCodigo || 0;
                                    const descuento = producto.descuento || 0;

                                    return (
                                        <div
                                            className='compraArticle-producto text-white ps-3 pb-2'
                                            key={producto.id}>
                                            <div>
                                                <p className='mb-0 text-info'><span className='text-decoration-underline'>{titulo}</span>{` ${producto.talle ? 'talle: ' + producto.talle : ''} (${producto.cantidad})`}</p>
                                            </div>
                                            <div>
                                                <p className='text-end mb-0'>{`ARS ${(producto.precio * producto.cantidad * (1 - descuento / 100) * (1 - porCodigo / 100)).toFixed(0)}`}</p>
                                                {(porCodigo !== 0 || descuento !== 0) ?
                                                    <p className='CompraArticle-precioAnterior text-decoration-line-through text-end mb-0'>{`ARS ${producto.precio * producto.cantidad}`}</p>
                                                    : ''

                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                : ''}
                </article>
                <article className='compraArticle text-white p-3'>
                    <div className='d-flex justify-content-between'>
                        <h6 className='mb-3 text-warning'>Forma de entrega:</h6>
                        
                        <h6 className='compraArticle-totalProductos text-warning mb-0'>
                            {(entrega === 'local' || entrega === 'moto') ? 'GRATIS' : ''}
                        </h6>
                    </div>
                    <div className='mb-2 d-flex'>
                        <input
                            type="radio"
                            name='entrega'
                            id='enLocal'
                            value="local"
                            onChange={(e) => setEntrega(e.target.value)}/>
                        <label className='ms-2' htmlFor="enLocal">Retiro en local de Lomas de Zamora (Gratis)</label>
                    </div>
                    <div className='mb-2 d-flex'>
                        <input
                            type="radio"
                            name='entrega'
                            id='enMoto'
                            value="moto"
                            onChange={(e) => setEntrega(e.target.value)}/>
                        <label className='ms-2' htmlFor="enMoto">Envío en moto zona sur GBA (Gratis)</label>
                    </div>
                    {entrega === 'moto' && <div className='compraArticle-datosEnvio mt-2 mb-2 p-3'>
                        <p className='mb-0'>Dirección:</p>
                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="calle" >Calle: </label>
                        <input
                            className='envioInput form-control'
                            type="text"
                            name='calle' />
                        <div className='d-flex mt-0 mt-sm-3'>
                            <div className='d-sm-flex me-2 me-sm-0'>
                                <label className='form-label mb-0 mt-1 me-2 ps-2 ' htmlFor="numero" >N°</label>
                                <input
                                    className='envioInput form-control me-2' style={{ maxWidth: '110px' }} type="number" name='numero' />
                            </div>
                            <div className='d-sm-flex ms-2 ms-sm-0'>
                                <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="pisoDto" >Piso/dto: </label>
                                <input
                                    className='envioInput form-control' type="text" name='pisoDto' />
                            </div>
                        </div>

                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >Localidad: </label>
                        <input
                            className='envioInput form-control' type="text" name='localidad' />



                    </div>}
                    <div className='d-flex'>
                        <input
                            type="radio"
                            name='entrega'
                            id='porCorreo'
                            value="correo"
                            onChange={(e) => setEntrega(e.target.value)}/>
                        <label className='ms-2' htmlFor="porCorreo">Envío por correo</label>
                    </div>
                    {entrega === 'correo' && <div className='compraArticle-datosEnvio mt-2 p-3'>
                        <p className='mb-0'>Dirección:</p>
                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="calle" >Calle: </label>
                        <input
                        className='envioInput form-control'
                        type="text"
                        name='calle' />
                        <div className='d-flex mt-0 mt-sm-3'>
                            <div className='d-sm-flex me-2 me-sm-0'>
                                <label className='form-label mb-0 mt-1 me-2 ps-2 ' htmlFor="numero" >N°</label>
                                <input
                                    className='envioInput form-control me-2' style={{maxWidth: '110px'}} type="number" name='numero' />
                            </div>
                            <div className='d-sm-flex ms-2 ms-sm-0'>
                                <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="pisoDto" >Piso/dto: </label>
                                <input
                                    className='envioInput form-control' type="text" name='pisoDto' />
                            </div>
                        </div>
                        
                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="provincia" >Provincia: </label>
                        <select className='envioInput form-control pt-1 text-black' name="provincia" id="provincia">
                            <option value="">-Seleccionar-</option>
                            {provincias.map(provincia => 
                                <option
                                    value={provincia.id}
                                    key={provincia.id}>{provincia.nombre}</option>
                            )}
                        </select>
                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >Partido/ departamento: </label>
                        <input
                        className='envioInput form-control' type="text" name='localidad' />
                        <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >Localidad: </label>
                        <input
                        className='envioInput form-control' type="text" name='localidad' />
                        
                        <div className='d-sm-flex justify-content-between mt-sm-3'>
                            <div className='d-sm-flex'>
                                <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="CP">CP: </label>
                                <input
                                    className='envioInput form-control me-2' type="text" name='CP' />
                            </div>
                            <div className='text-end'>
                                <button className='mt-4 mt-sm-0'>
                                    Calcular costo
                                </button>
                            </div>
                        </div>
                        
                        
                    </div>}
                </article>
                <article className='compraArticle text-white p-3'>
                    <div className='d-flex justify-content-between'>
                        <h6 className='mb-3 text-warning'>Forma de pago:</h6>

                        <h6 className='compraArticle-totalProductos text-warning mb-0'>
                            {modoPago === 'transferencia' ? `ARS -${totalProductos*0.2}` : ''}
                        </h6>
                    </div>
                    <div className='mb-2 d-flex'>
                        <input
                            type="radio"
                            name='modoPago'
                            id='transferencia'
                            value="transferencia"
                            onChange={(e) => setModoPago(e.target.value)}/>
                        <label className='ms-2' htmlFor="transferencia">{`${entrega === 'local' ? 'Efectivo o t' : 'T'}ransferencia bancaria (20% off)`}</label>
                    </div>
                    <div className='d-flex'>
                        <input
                            type="radio"
                            name='modoPago'
                            id='conTarjeta'
                            value="conTarjeta"
                            onChange={(e) => setModoPago(e.target.value)}/>
                        <label className='ms-2' htmlFor="conTarjeta">Con tarjeta (hasta 6 cuotas sin interés)</label>
                    </div>
                </article>
                <article className='compraArticle text-white p-3'>
                    <h5 className='text-end text-warning mb-0 fw-bold' style={{textShadow: '0 0 5px gray'}}>{`TOTAL ARS ${modoPago === 'transferencia' ? ((totalProductos*0.8)+totalEnvio) : totalEnvio+totalProductos}`}</h5>
                </article>
                <div className='mt-3 d-flex justify-content-end'>
                    <BotonSecundario
                        texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                        claseAdicional='me-2'
                        accion={()=> navigate('/carrito')} />
                    <BotonPrimario
                        texto='Confirmar compra'
                        claseAdicional='ms-2'/>
                </div>
            </section>
        </main>
    
    </>);
};

export default Compra;
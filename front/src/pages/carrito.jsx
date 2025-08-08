import { useEffect, useContext, useState, useRef } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link, useNavigate } from 'react-router-dom';
import { CarritoContext } from '@/context/carritoContext';
import { obtenerProducto } from '@/services/productoService';
import { buscarCodigo } from '@/services/codigoService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import carritoVacioImagen from '@/assets/img/carritoVacio.jpg';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';
import '@/pages/css/carrito.css';


const Carrito = () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const { setBackground } = useContext(BackgroundContext);
    
    useEffect(() => {
        setBackground('bg-carrito');
        return () => setBackground('');
    }, []);
    
    const navigate = useNavigate();
    // Carrito guardado en localStorage sólo contiene id, talle y cantidad de productos (puede o no tener dos objetos más que indiquen código de descuento y envío)
    const { carrito, setCarrito } = useContext(CarritoContext);

    // Lista tiene detalles de los productos del carrito (foto, precio, descuento, etc.)
    const [lista, setLista] = useState([]);
    const [carritoVacio, setCarritoVacio] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [total, setTotal] = useState(0);

    // Estados para utilizar el confirm
    const [pregunta, setPregunta] = useState('');
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [accion, setAccion] = useState('');

    // Estados para quitar un producto del carrito
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoEliminado, setProductoEliminado] = useState(false);

    // Estados para manejar códigos de descuento
    const [ingresarCodigo, setIngresarCodigo] = useState(false);
    const [codigoIngresado, setCodigoIngresado] = useState('');
    const [codigoAplicado, setCodigoAplicado] = useState({});
    const [codigoAplicadoPorUsuario, setCodigoAplicadoPorUsuario] = useState(false);

    // Para que ciertos useEffect no se ejecuten dos veces
    const ejecutado = useRef(false);
    const ejecutadoOtro = useRef(false);

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

    // Arma copia del carrito con información completa sobre los productos (para después setear lista)
    const carritoProductosCompleto = async () => {
        setCargando(true);
        let carritoActualizado = [];
        let carritoProductosParaMostrar = [];

        const carritoEnvio = carrito.filter(item => item.hasOwnProperty('envio'));
        const carritoDescuento = carrito.filter(item => item.hasOwnProperty('codigo'));
        const carritoProductos = carrito.filter(item => item.hasOwnProperty('cantidad'));

        for (let producto of carritoProductos) {
            const productoBD = await obtenerPorId(producto.id);
            if (!productoBD) {
                toast.error('No se puede actualizar el carrito en este momento');
                setCargando(false);
                return null;
            };
            if (producto.cantidad > productoBD.stock) {
                producto.cantidad = productoBD.stock;
                toast.info('Se modificó el contenido del carrito en base al stock disponible');
            }

            if (producto.cantidad > 0) {
                carritoActualizado.push(producto);
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
                    imagen: productoBD.imagen
                };
                carritoProductosParaMostrar.push(aMostrar);
            };
        }
        carritoActualizado = [...carritoActualizado, ...carritoDescuento, ...carritoEnvio];
        setCarrito(carritoActualizado);
        setCargando(false);
        return carritoProductosParaMostrar;
    };

    // Setea producto a eliminar y llama a confirm
    const quitarProducto = (id, talle, titulo) => {
        const siQuitarProducto = `¿Quitar del carrito ${titulo} ${talle ? `talle ${talle}` : ''}?`;
        setPregunta(siQuitarProducto);
        setProductoAEliminar({ id, talle });
        setAccion('eliminar');
        setMostrarConfirm(true);
    };

    // Modifica cantidad requerida de un producto tanto en carrito como en lista (para botones + y -)
    const modificarCantidad = (id, talle, operacion) => {

        const nuevoCarrito = carrito.map((elemento) => {
            if (
                elemento.hasOwnProperty('cantidad') &&
                elemento.id === id &&
                elemento.talle === talle) {
                const nuevaCantidad = operacion === 'sumar' ? elemento.cantidad + 1 : elemento.cantidad - 1;
                return {
                    ...elemento,
                    cantidad: Math.max(nuevaCantidad, 1)
                };
            }
            return elemento;
        });

        setCarrito(nuevoCarrito);

        const nuevaLista = lista.map((producto) => {
            if (producto.id === id && producto.talle === talle) {
                const nuevaCantidad = operacion === 'sumar' ? producto.cantidad + 1 : producto.cantidad - 1;
                return { ...producto, cantidad: Math.max(nuevaCantidad, 1) };
            }
            return producto;
        });
        setLista(nuevaLista);
    };

    // Evaluar si aplica el código de descuento e implementarlo en los productos que se muestran
    const aplicarCodigo = () => {
        let conDescuentoPorCodigo = [...lista];
        if ('banda' in codigoAplicado &&
            typeof codigoAplicado.banda === 'string' && codigoAplicado.banda.trim().length > 0) {
            const aplicaBanda = conDescuentoPorCodigo.filter(producto => producto.banda.toLowerCase().includes(codigoAplicado.banda.toLowerCase()));
            conDescuentoPorCodigo = aplicaBanda;
        }
        if (codigoAplicado.tipoProducto !== 'todo') {
            const aplicaTipo = conDescuentoPorCodigo.filter(producto => producto.tipo === codigoAplicado.tipoProducto);
            conDescuentoPorCodigo = aplicaTipo;
        }

        const listaArmada = lista.map((producto) => {
            const tieneDescuento = conDescuentoPorCodigo.some(p => p.id === producto.id && p.talle === producto.talle);
            return {
                ...producto,
                porCodigo: tieneDescuento ? codigoAplicado.descuento : 0
            };
        });

        setLista(listaArmada);

        if (!conDescuentoPorCodigo || conDescuentoPorCodigo.length === 0) {
            toast.warning('El descuento por código no aplica a los productos del carrito');
        } else if (codigoAplicadoPorUsuario) toast.success('El código de descuento se aplicó con éxito')
        
        return setCodigoAplicadoPorUsuario(false);
    }

    // Cuando el usuario introduce un código de descuento
    const handleCodigo = async (evento) => {
        evento.preventDefault();
        try {
            const codigoEnMayusculas = codigoIngresado.toUpperCase();
            const res = await buscarCodigo(codigoEnMayusculas);
            if (res.status !== 200 && res.status !== 304) return toast.error(`Error al buscar código: ${res.statusText}`);

            if (carrito.some(item => item.codigo === res.data.codigo)) return toast.info('El código ya fue ingresado');
            
            setCodigoIngresado('');
            setIngresarCodigo(false);

            const carritoSinDescuento = carrito.filter(item => !item.hasOwnProperty('codigo'));
            const nuevoCarrito = [...carritoSinDescuento, { codigo: res.data.codigo }];
            setCarrito(nuevoCarrito);
            setCodigoAplicadoPorUsuario(true);
            return setCodigoAplicado(res.data);

        } catch (err) {
            return toast.error(`Error al buscar código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        }
    };

    // Si hay un código cargado previamente en el carrito, obtener data actualizada
    const actualizarCodigo = async () => {
        if (!ingresarCodigo) {
            const carritoDescuento = carrito.filter(item => item.hasOwnProperty('codigo'));
            if (carritoDescuento.length > 0) {
                try {
                    const res = await buscarCodigo(carritoDescuento[0].codigo);
                    if (res.status !== 200 && res.status !== 304) {
                        const nuevoCarrito = carrito.filter(item => !item.hasOwnProperty('codigo'))
                        setCarrito(nuevoCarrito)
                        return toast.error(`El código de descuento ya no se encuentra disponible: ${res.statusText}`);
                    };
                    
                    toast.info('Se cargó un código de descuento ingresado previamente');
                    return setCodigoAplicado(res.data);
                } catch (err) {
                    const nuevoCarrito = carrito.filter(item => !item.hasOwnProperty('codigo'));
                    setCarrito(nuevoCarrito)
                    return toast.error(`Error al actualizar código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
                }
            }
        }
    };

    const vaciarCarrito = () => {
        const siVaciar = '¿Quitar todos los productos del carrito?';
        setPregunta(siVaciar);
        setAccion('vaciar');
        setMostrarConfirm(true);
    };

    const continuarCompra = () => {
        if (!usuario) {
            toast.info('Ingresá para continuar con la compra');
            return navigate('/login')
        } else return navigate('/compra')
    }

    useEffect(() => {
        const carritoProductos = carrito.filter(item => item.hasOwnProperty('cantidad'));
        const estaVacio = carritoProductos.length === 0;
        if (estaVacio) setCarritoVacio(estaVacio);

    }, [carrito])

    // Crea/resetea lista (array con data detallada de los productos del carrito) al cargar la página o eliminar un producto
    useEffect(() => {
        setConfirm(false);

        if (ejecutadoOtro.current && !productoEliminado) return;

        const cargar = async () => {
            const datos = await carritoProductosCompleto();
            setLista(datos);
        };
        cargar();
        setProductoEliminado(false);
        ejecutadoOtro.current = true;
    }, [productoEliminado]);

    // Actualiza el total a pagar cuando se modifica la lista
    useEffect(() => {
        let subtotal = 0;

        for (let producto of lista) {
            const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100) * (1 - (producto.porCodigo || 0) / 100);
            subtotal += producto.cantidad * precioConDescuento;
        }

        setTotal(subtotal);
    }, [lista]);

    // Elimina el producto del carrito al presionar "aceptar"
    useEffect(() => {
        if (confirm) {
            if (productoAEliminar && accion === 'eliminar') {
                const { id, talle } = productoAEliminar;
                const productoAQuitarIndex = carrito.findIndex(producto => producto.id === id && producto.talle === talle);
                if (productoAQuitarIndex !== -1) {
                    const nuevoCarrito = carrito.filter(item => !(item.id === id && item.talle === talle));
                    setCarrito(nuevoCarrito);
                } else {
                    toast.error('El producto ya no se encuentra en el carrito');
                }
                setProductoEliminado(true);
                setProductoAEliminar(null);
            } else if (accion === 'vaciar') {
                localStorage.removeItem('carrito');
                setCarrito([]);
            }
        }
            
        setAccion('');
        setConfirm(false);

    }, [confirm]);

    // Actualiza código de descuento ingresado previamente (si existe)
    useEffect(() => {
        // (Para que no se ejecute dos veces)
        if (ejecutado.current) return;
        ejecutado.current = true;
        actualizarCodigo();
    }, [])

    useEffect(() => {
        if (Object.keys(codigoAplicado).length > 0 && !cargando) {
            aplicarCodigo();
        }
    }, [codigoAplicado, cargando]);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
            <section className='carrito-section container mt-2 mb-5 d-flex flex-column align-items-center'>
                {carritoVacio ?
                    <div className='carritoVacio-div aparecer d-flex flex-column align-items-center mt-2'>
                            <h5 className='text-center'>Todavía no hay ítems en tu carrito</h5>
                        <div className='carritoVacio-fotoDiv m-2'>
                            <img className='w-100' src={carritoVacioImagen} alt="Intoxicados en Tilcara" />
                        </div>
                        <h5 className='text-center'>¡Te esperamos en la sección <Link to='/productos' className='carritoVacio-link'>productos</Link>!</h5>
                    </div> :
                    
                    (cargando ? 
                        <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2> : 
                        <div className='carritoLleno-div aparecer'>
                    
                            {lista ? 
                                <>
                                {lista.map((producto) => {
                                    const titulo = `${(producto.tipo[0].toUpperCase()) + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`
                                    const porCodigo = producto.porCodigo || 0;
                                    const descuento = producto.descuento || 0;
                                    return (
                                    <article
                                        className='carrito-listaItem d-flex flex-column flex-sm-row justify-content-sm-between'
                                        key={`${producto.id}-${producto.talle}`}>
                                        <div className='d-flex'>
                                            <div className='p-3 d-none d-sm-flex'>
                                                <img className='carrito-listaItem-foto'
                                                    src={producto.imagen ? producto.imagen : sinImagen}
                                                    alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                            </div>

                                            <div className='p-3 w-100 w-sm-auto'>
                                                <h6 className='titulo mb-2 fw-bold'>
                                                    {titulo}</h6>
                                                <p>{producto.talle ? `Talle: ${producto.talle}` : ''}</p>
                                                <div className='carrito-listaItem-cantidad d-flex mt-2 mt-sm-3 justify-content-start'>
                                                    <p>Cantidad: </p>
                                                    <div className='carrito-listaItem-cantidadBotones d-flex ms-2'>
                                                        <button
                                                            type='button'
                                                            onClick={() => modificarCantidad(producto.id, producto.talle, 'restar')}
                                                            disabled={producto.cantidad <= 1}
                                                        >-</button>
                                                        <p className='text-center'>{producto.cantidad}</p>
                                                        <button
                                                            type='button'
                                                            onClick={() => modificarCantidad(producto.id, producto.talle, 'sumar')}
                                                            disabled={producto.cantidad >= producto.stock}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <div className='p-3 pt-0 d-block d-sm-none d-flex align-items-start'>
                                                <img className='carrito-listaItem-foto'
                                                    src={producto.imagen ? producto.imagen : sinImagen} alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                            </div>
                                            <div className='productosAdmin-listaItem-precioDiv p-3 pt-0 pt-sm-3 d-flex flex-column align-items-end justify-content-between'>
                                                    <h6 className='text-end mb-2 fw-bold text-warning'>
                                                        {`ARS ${(producto.precio * (1 - descuento/100) * (1 - porCodigo/100) * producto.cantidad).toFixed(0)}`}</h6>
                                                    <p className='text-end descuentos'>
                                                        {(descuento !== 0) ?
                                                            <>
                                                                <span className='d-block tachado text-decoration-line-through text-white m-0 p-0'>{`ARS ${producto.precio * producto.cantidad}`}
                                                                </span>
                                                                <span className='d-block m-0 p-0'>{`(-${descuento}%)`}</span></> : ''}
                                                        
                                                        {porCodigo !== 0 ?
                                                            <><span className='d-block tachado text-decoration-line-through m-0 p-0 letraVerde' >
                                                                {`ARS ${descuento === 0 ? producto.precio * producto.cantidad : (producto.precio * producto.cantidad * (1 - descuento/100)).toFixed(0) }`}
                                                                </span>
                                                                <span className='d-block letraVerde m-0 p-0'>{`(-${porCodigo}%)`}</span></> : ''}
                                                    </p>
                                                <button
                                                    className='carrito-listaItem-botonEliminar btn text-secondary p-0'
                                                    onClick={() => quitarProducto(producto.id, producto.talle, titulo)}>
                                                    <i className="fa-solid fa-trash-can"></i> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </article>);
                                })}
                                    <div className='carrito-divTotal  mt-2 p-3'>
                                        <div className='d-sm-flex justify-content-between'>
                                            <p className='total d-sm-none text-end text-warning mb-0'>
                                                {`TOTAL ARS ${total}`}
                                            </p>
                                            <article className='text-end text-sm-start'>
                                                <button
                                                    className='letraVerde botonMostrarIngresarCodigo'
                                                    type='button'
                                                    onClick={() => setIngresarCodigo(!ingresarCodigo)}
                                                    >
                                                    {Object.keys(codigoAplicado).length > 0 ? 'Código de descuento aplicado (cambiar)' : 'Ingresar código de descuento'}
                                                </button>
                                                {ingresarCodigo ?
                                                    <form
                                                        onSubmit={handleCodigo}
                                                        className='text-end text-sm-start mt-2'>
                                                        <input
                                                            className='inputIngresarCodigo ps-2 me-2'
                                                            type="text"
                                                            minLength={5}
                                                            maxLength={10}
                                                            value={codigoIngresado}
                                                            onChange={(e) => setCodigoIngresado(e.target.value)} />
                                                        <button
                                                            className='botonIngresarCodigo'
                                                            type='submit'>
                                                            Ingresar
                                                        </button>
                                                    </form> : ''}

                                            </article>
                                            
                                            <p className='total d-none d-sm-block text-end text-warning mb-0'>
                                                {`TOTAL ARS ${total}`}
                                            </p>
                                        </div>
                                        
                                    </div>
                                    <div className='text-center text-sm-end pe-sm-2 mt-3'>
                                        <BotonSecundario
                                            tipo='button'
                                            texto='Vaciar carrito'
                                            claseAdicional='me-2'
                                            accion={vaciarCarrito}
                                        />
                                        <BotonPrimario
                                            tipo='button'
                                            texto='Continuar compra'
                                            claseAdicional='ms-1'
                                            accion={continuarCompra} />

                                    </div>
                                </> : <h5>No es posible visualizar el carrito en este momento. Intentá nuevamente más tarde</h5>}
                        </div>) 
                }
            </section>

            {mostrarConfirm ? 
                <Confirm
                    pregunta={pregunta}
                    setConfirm={setConfirm}
                    setMostrarConfirm={setMostrarConfirm}
                /> : ''
            }
        </main>
    );
};

export default Carrito;
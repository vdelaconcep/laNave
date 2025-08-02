import { useEffect, useContext, useState } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import { CarritoContext } from '@/context/carritoContext';
import { obtenerProducto } from '@/services/productoService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm'
import carritoVacioImagen from '@/assets/img/carritoVacio.jpg';
import '@/pages/css/carrito.css'


const Carrito = () => {
    const { setBackground } = useContext(BackgroundContext);
    
    useEffect(() => {
        setBackground('bg-carrito');
        return () => setBackground('');
    }, []);
    
    // Carrito guardado en localStorage sólo contiene id, talle y cantidad
    const { carrito, setCarrito } = useContext(CarritoContext);

    // Lista tiene detalles de los productos del carrito (foto, precio, descuento, etc.)
    const [lista, setLista] = useState([]);

    const [carritoVacio, setCarritoVacio] = useState(false);

    const [cargando, setCargando] = useState(false);

    const [pregunta, setPregunta] = useState('');
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoEliminado, setProductoEliminado] = useState(false);

    const [total, setTotal] = useState(0)


    useEffect(() => {
        const estaVacio = Array.isArray(carrito) && carrito.length === 0;
        if (estaVacio) setCarritoVacio(estaVacio);

    }, [carrito])

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
            toast.error(`Error al obtener datos del producto: ${err.response.data.error}`);
            return null
        }
    }

    // Arma copia del carrito con información completa sobre los productos (para después setear lista)
    const carritoCompleto = async () => {
        setCargando(true);
        let carritoActualizado = [];
        let carritoParaMostrar = [];
        for (let producto of carrito) {
            const productoBD = await obtenerPorId(producto.id);
            if (!productoBD) {
                toast.error('No se puede actualizar el carrito en este momento');
                setCargando(false);
                return null;
            };
            if (producto.cantidad > productoBD.stock) {
                producto.cantidad = productoBD.stock;
                toast.info('Se modificó el contenido del carrito en base al stock disponible')
            }

            if (producto.cantidad > 0) {
                carritoActualizado.push(producto);
                const aMostrar = {
                    id: producto.id,
                    talle: producto.talle,
                    cantidad: producto.cantidad,
                    stock: producto.talle ? productoBD.stock[producto.talle]: productoBD.stock['U'],
                    tipo: productoBD.tipo,
                    banda: productoBD.banda,
                    modelo: productoBD.modelo,
                    precio: productoBD.precio,
                    descuento: productoBD.descuento,
                    imagen: productoBD.imagen
                };
                carritoParaMostrar.push(aMostrar);
            };
        }
        setCarrito(carritoActualizado);
        setCargando(false);
        return carritoParaMostrar;
    };

    // Setea producto a eliminar y llama a confirm
    const quitarProducto = (id, talle, titulo) => {
        const siQuitarProducto = `¿Quitar del carrito ${titulo} ${talle ? `talle ${talle}` : ''}?`;
        setPregunta(siQuitarProducto);
        setProductoAEliminar({ id, talle });
        setMostrarConfirm(true);
    };

    // Modifica cantidad requerida de un producto tanto en carrito como en lista (para botones + y -)
    const modificarCantidad = (id, talle, operacion) => {
        const nuevoCarrito = carrito.map((producto) => {
            if (producto.id === id && producto.talle === talle) {
                const nuevaCantidad = operacion === 'sumar' ? producto.cantidad + 1 : producto.cantidad - 1;
                return {
                    ...producto,
                    cantidad: Math.max(nuevaCantidad, 1)
                };
            }
            return producto;
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

    // Crea/resetea lista (copia ampliada de carrito) al cargar la página o eliminar un producto
    useEffect(() => {
        setConfirm(false);

        const cargar = async () => {
            const datos = await carritoCompleto();
            setLista(datos);
        };
        cargar();
        
        setProductoEliminado(false);
    }, [productoEliminado]);

    // Actualiza el total a pagar cuando se modifica la lista
    useEffect(() => {
        let subtotal = 0;

        for (let producto of lista) {
            const precioConDescuento = producto.precio * (1 - (producto.descuento || 0) / 100);
            subtotal += producto.cantidad * precioConDescuento;
        }

        setTotal(subtotal);
    }, [lista]);

    // Elimina el producto del carrito al presionar "aceptar"
    useEffect(() => {
        if (confirm && productoAEliminar) {
            const { id, talle } = productoAEliminar;
            const productoAQuitarIndex = carrito.findIndex(producto => producto.id === id && producto.talle === talle);
            if (productoAQuitarIndex === -1) {
                toast.error('El producto ya no se encuentra en el carrito');
            } else {
                carrito.splice(productoAQuitarIndex, 1);
                setCarrito([...carrito]);
            }
            setProductoEliminado(true);
            setProductoAEliminar(null);
            setConfirm(false);
        }
    }, [confirm]);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
            <section className='carrito-section aparecer container mt-2 mb-5 d-flex flex-column align-items-center'>
                {carritoVacio ?
                    <div className='carritoVacio-div d-flex flex-column align-items-center mt-2'>
                            <h5 className='text-center'>Todavía no hay ítems en tu carrito</h5>
                        <div className='carritoVacio-fotoDiv m-2'>
                            <img className='w-100' src={carritoVacioImagen} alt="Intoxicados en Tilcara" />
                        </div>
                        <h5 className='text-center'>¡Te esperamos en la sección <Link to='/productos' className='carritoVacio-link'>productos</Link>!</h5>
                    </div> :
                    
                    (cargando ? 
                        <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2> : 
                        <div className='carritoLleno-div'>
                    
                            {lista ? 
                                <>
                                {lista.map((producto) => {
                                const titulo = `${(producto.tipo[0].toUpperCase()) + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`
                                    return (
                                    <article
                                        className='carrito-listaItem d-flex flex-column flex-sm-row justify-content-sm-between'
                                        key={`${producto.id}-${producto.talle}`}>
                                        <div className='d-flex'>
                                            <div className='p-3 d-none d-sm-flex align-items-center'>
                                                <img className='carrito-listaItem-foto'
                                                    src={producto.imagen ? producto.imagen : sinImagen}
                                                    alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                            </div>

                                            <div className='p-3 w-100 w-sm-auto'>
                                                <h6 className='mb-2 fw-bold text-decoration-underline'>
                                                    {titulo}</h6>
                                                <p>{producto.talle ? `Talle: ${producto.talle}` : ''}</p>
                                                <div className='carrito-listaItem-cantidad d-flex mt-3 justify-content-center justify-content-sm-start'>
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
                                            <div className='p-3 d-block d-sm-none d-flex align-items-start'>
                                                <img className='carrito-listaItem-foto'
                                                    src={producto.imagen ? producto.imagen : sinImagen} alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                            </div>
                                            <div className='productosAdmin-listaItem-precioDiv p-3 d-flex flex-column align-items-end justify-content-between'>
                                                <h6 className='text-end mb-2 fw-bold text-warning'>
                                                    {(!producto.descuento || producto.descuento === 0) ? <span>{`ARS ${producto.precio * producto.cantidad}`}</span> : <span>{`ARS ${(producto.precio * 0.01 * (100 - producto.descuento)) * producto.cantidad}`}</span>}</h6>
                                                {(producto.descuento && producto.descuento !== 0) ?
                                                    <p className='text-end'>
                                                        <span className='text-decoration-line-through'>
                                                            {`ARS ${producto.precio * producto.cantidad}`}
                                                        </span>
                                                        <span>{` (-${producto.descuento}%)`}</span>
                                                    </p> : ''
                                                }
                                                <button
                                                    className='carrito-listaItem-botonEliminar btn text-secondary p-0'
                                                    onClick={() => quitarProducto(producto.id, producto.talle, titulo)}>
                                                    <i className="fa-solid fa-trash-can"></i> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </article>);
                                })}
                                <div className='carrito-divTotal mt-2 p-3'>
                                    <p className='text-end text-warning mb-0'>
                                        {`TOTAL ARS ${total}`}    
                                    </p>
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
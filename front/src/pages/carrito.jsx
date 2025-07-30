import { useEffect, useContext, useState, useRef } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import { CarritoContext } from '@/context/carritoContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import carritoVacioImagen from '@/assets/img/carritoVacio.jpg';
import '@/pages/css/carrito.css'


const Carrito = () => {
    const { setBackground } = useContext(BackgroundContext);
    
    useEffect(() => {
        setBackground('bg-carrito');
        return () => setBackground('');
    }, []);
    
    const { carrito, setCarrito } = useContext(CarritoContext);

    const [carritoVacio, setCarritoVacio] = useState(false);

    const [cargando, setCargando] = useState(false);

    const [lista, setLista] = useState([]);

    const refs = useRef({});


    useEffect(() => {
        const estaVacio = Array.isArray(carrito) && carrito.length === 0;
        if (estaVacio) setCarritoVacio(estaVacio);
    }, [carrito])

    const obtenerPorId = async (id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos?id=${id}`);

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

    useEffect(() => {
        const cargar = async () => {
            const datos = await carritoCompleto();
            setLista(datos);
        };
        cargar();
    }, []);

    useEffect(() => {
        const nuevasRef = {};
        lista.forEach(producto => {
            nuevasRef[producto.id] = refs.current[producto.id] ?? React.createRef();
        });
        refs.current = nuevasRef;
    }, [lista]);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
            <section className='carrito-section aparecer container mt-2 mb-3 d-flex flex-column align-items-center'>
                {carritoVacio ?
                    <div className='carritoVacio-div d-flex flex-column align-items-center mb-4 mt-2'>
                            <h5 className='text-center'>Todavía no hay ítems en tu carrito</h5>
                        <div className='carritoVacio-fotoDiv m-2'>
                            <img className='w-100' src={carritoVacioImagen} alt="Intoxicados en Tilcara" />
                        </div>
                        <h5 className='text-center'>¡Te esperamos en la sección <Link to='/productos' className='carritoVacio-link'>productos</Link>!</h5>
                    </div> :
                    
                    (cargando ? 
                        <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2> : 
                        <div className='carritoLleno-div'>
                    
                        {lista ? (lista.map((producto) => (
                        
                            <article
                                className='carrito-listaItem d-flex flex-column flex-sm-row justify-content-sm-between'
                                key={producto.id}
                                ref={refs.current[producto.id]}>
                                <div className='d-flex'>
                                    <div className='p-3 d-none d-sm-flex align-items-center'>
                                        <img className='carrito-listaItem-foto'
                                            src={producto.imagen ? producto.imagen : sinImagen}
                                            alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                    </div>

                                    <div className='p-3'>
                                        <h6 className='mb-2 fw-bold text-decoration-underline'>
                                            {`${(producto.tipo[0].toUpperCase()) + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`}</h6>
                                        <p>{producto.talle ? `Talle: ${producto.talle}` : ''}</p>
                                        <p>{`Cantidad: ${producto.cantidad}`}</p>
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
                                                {`(anterior: ARS ${producto.precio * producto.cantidad})`}</p> : ''
                                        }
                                        <button
                                            className='carrito-listaItem-botonEliminar btn text-secondary p-0'
                                            >
                                            <i className="fa-solid fa-trash-can"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </article>))) : <h5>No es posible visualizar el carrito en este momento. Intentá nuevamente más tarde</h5>}
                            
                        </div>) 
                }
            </section>
        </main>
    );
};

export default Carrito;
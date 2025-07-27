import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import sinImagen from '@/assets/img/tarjeta-alternativa.jpg';
import '@/pages/css/productosAdmin.css';

const ProductosAdmin = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);

    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const obtenerProductos = async () => {

        try {
            setCargando(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos?tipo=todos`);

            if (res.status !== 200) return alert(`Error al obtener productos: ${res.statusText}`);
            return setDatos(res.data);
        } catch (err) {
            alert(`Error al obtener productos: ${err.response.data ? err.response.data.error : err}`);
            return setDatos([]);
        } finally {
            setCargando(false);
        }
    }

    const formatearFechaYHora = (fechaYHora) => {
        const fecha = new Date(fechaYHora);
        return new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires'
        }).format(fecha);
    };

    const formatearStock = (stock) => {
        let stockFormateado = '[';
        const talles = Object.keys(stock);
        const cantidad = Object.values(stock);
        for (let i = 0; i < talles.length; i++) {
            stockFormateado += `${talles[i]}: ${cantidad[i]}, `;
        };
        stockFormateado = stockFormateado.slice(0, -2)+']';
        return stockFormateado;
    };

    const [aparecer, setAparecer] = useState(false);

    useEffect(() => {
        setAparecer(true);
        obtenerProductos();
        setTimeout(() => setAparecer(false), 800);
    }, []);
    
    return (
        <main>
            {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                <>
                    <h1 className="pagina-titulo text-white text-center">Lista de productos</h1>

                    {cargando &&
                        <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
                    }

                    {!cargando && datos.length === 0 &&
                        <article className='mt-5 d-flex flex-column align-items-center'>
                            <h5 className='text-white mb-5'>Aún no hay ítems en la base de datos</h5>
                            <h5 className='text-center'>Podés empezar a cargar productos <Link to='/productos' className='productosAdmin-vacioLink'>acá</Link>!</h5>
                        </article>
                    }

                    <section className={`${aparecer ? 'aparecer' : ''} productosAdmin-section text-white mt-4 mb-5`}>
                        {datos.map((producto) => (
                            <article
                                className='productosAdmin-listaItem d-flex flex-column flex-sm-row justify-content-sm-between'
                                key={producto.uuid}>
                                <div className='d-flex'>
                                    <div className='p-3 d-none d-sm-block d-flex align-items-center'>
                                        <img className='productosAdmin-listaItem-foto' src={producto.imagen ? producto.imagen : sinImagen} alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                    </div>
                                
                                    <div className='p-3'>
                                        <h6 className='mb-2 fw-bold text-decoration-underline'>{`${(producto.tipo[0].toUpperCase()) + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`}</h6>
                                        <p>{`Ingreso: ${formatearFechaYHora(producto.fechaYHoraAlta)}`}</p>
                                        <p>Modificado: {producto.fechaYHoraModificacion ? <span>{formatearFechaYHora(producto.fechaYHoraModificacion)}</span> : <span>No</span>}</p>
                                        <p>{`Stock: ${formatearStock(producto.stock)}`}</p>
                                        </div>
                                    </div>
                                <div className='d-flex justify-content-between'>
                                    <div className='p-3 d-block d-sm-none d-flex align-items-start'>
                                        <img className='productosAdmin-listaItem-foto' src={producto.imagen ? producto.imagen : sinImagen} alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                    </div>
                                    <div className='productosAdmin-listaItem-precioDiv p-3 d-flex flex-column align-items-end'>
                                        <h6 className='text-end mb-2 fw-bold text-warning'>{(!producto.descuento || producto.descuento === 0) ? <span>{`ARS ${producto.precio}`}</span> : <span>{`ARS ${producto.precio * 0.1 * (100 - producto.descuento)}`}</span>}</h6>
                                        {(producto.descuento && producto.descuento !== 0) ?
                                            <p className='text-end'>{`(anterior: ARS ${producto.precio})`}</p> : ''
                                        }
                                    </div>
                                </div>
                            </article>))}
                        
                    </section>
                </>}
        </main>
    );
};

export default ProductosAdmin;
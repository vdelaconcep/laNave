import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import FormularioProducto from '@/components/formularioProducto/formularioProducto';
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
    const [productoAEditar, setProductoAEditar] = useState(null);

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
                        <article className='mt-5 d-flex flex-column align-items-center text-white'>
                            <h5 className='text-white mb-5'>Aún no hay ítems en la base de datos</h5>
                            <h5 className='text-center'>¡Podés empezar a cargar productos <Link to='/productos' className='productosAdmin-vacioLink'>acá</Link>!</h5>
                        </article>
                    }

                    <section className={`${aparecer ? 'aparecer' : ''} productosAdmin-section text-white mt-4 mb-5`}>
                        {datos.map((producto) => (
                            <div
                                className='productosAdmin-listaItem'
                                key={`div0-${producto.uuid}`}>
                                <article
                                    className='d-flex flex-column flex-sm-row justify-content-sm-between'
                                    key={`article-${producto.uuid}`}>
                                    <div
                                        className='d-flex'
                                        key={`div1-${producto.uuid}`}>
                                        <div
                                            className='p-3 d-none d-sm-flex align-items-center'
                                            key={`divFoto1-${producto.uuid}`}>
                                            <img
                                                className='productosAdmin-listaItem-foto'
                                                key={`foto1-${producto.uuid}`}
                                                src={producto.imagen ? producto.imagen : sinImagen}
                                                alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                        </div>
                                    
                                        <div
                                            className='p-3'
                                            key={`divInfo-${producto.uuid}`}>
                                            <h6
                                                className='mb-2 fw-bold text-decoration-underline'
                                                key={`titulo-${producto.uuid}`}>
                                                {`${(producto.tipo[0].toUpperCase()) + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`}</h6>
                                            <p
                                                className='text-secondary'
                                                key={`id-${producto.uuid}`}>
                                                {(`(id: ${producto.uuid})`)}</p>
                                            <p key={`dateAlta-${producto.uuid}`}>{`Ingreso: ${formatearFechaYHora(producto.fechaYHoraAlta)}`}</p>
                                            <p key={`dateModif-${producto.uuid}`}>Modificado: {producto.fechaYHoraModificacion ? <span>{formatearFechaYHora(producto.fechaYHoraModificacion)}</span> : <span>No</span>}</p>
                                            <p key={`stock-${producto.uuid}`}>{`Stock: ${formatearStock(producto.stock)}`}</p>
                                            </div>
                                    </div>
                                    <div
                                        className='d-flex justify-content-between'
                                        key={`div2-${producto.uuid}`}>
                                        <div
                                            className='p-3 d-block d-sm-none d-flex align-items-start'
                                            key={`divFoto2-${producto.uuid}`}>
                                            <img
                                                className='productosAdmin-listaItem-foto'
                                                key={`foto2-${producto.uuid}`}
                                                src={producto.imagen ? producto.imagen : sinImagen} alt={producto.imagen ? `Imagen de producto ${producto.uuid}` : 'Imagen no disponible'} />
                                        </div>
                                        <div
                                            className='productosAdmin-listaItem-precioDiv p-3 d-flex flex-column align-items-end justify-content-between'
                                            key={`divPrecio-${producto.uuid}`}>
                                            <h6
                                                className='text-end mb-2 fw-bold text-warning'
                                                key={`precio-${producto.uuid}`}>
                                                {(!producto.descuento || producto.descuento === 0) ? <span>{`ARS ${producto.precio}`}</span> : <span>{`ARS ${producto.precio * 0.01 * (100 - producto.descuento)}`}</span>}</h6>
                                            {(producto.descuento && producto.descuento !== 0) ?
                                                <p
                                                    className='text-end'
                                                    key={`descuento-${producto.uuid}`}>
                                                    {`(anterior: ARS ${producto.precio})`}</p> : ''
                                            }
                                            <button
                                                className='productosAdmin-listaItem-botonEditar btn text-secondary p-0'
                                                key={`botonEditar-${producto.uuid}`}
                                                onClick={() => setProductoAEditar(producto)}>
                                                Editar <i className="fa-solid fa-pencil"></i>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                                {productoAEditar?.uuid === producto.uuid &&
                                    <article className='productosAdmin-editarArticle'
                                        key={`editarArticle-${producto.uuid}`}>
                                        <FormularioProducto
                                            key={`formulario-${producto.uuid}`}
                                            producto={productoAEditar}
                                            accion='actualizacion'
                                            setProductoAEditar={setProductoAEditar}
                                            obtenerProductos={obtenerProductos}/>
                                    </article>
                                }
                                    
                            </div>))}
                        
                    </section>
                </>}
        </main>
    );
};

export default ProductosAdmin;
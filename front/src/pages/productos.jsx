import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { obtenerProducto } from '@/services/productoService';
import { toast } from 'react-toastify';
import Tarjeta from '@/components/tarjetas/tarjeta';
import BotonSecundario from '@/components/botones/botonSecundario';

export const Productos = ({filtrarPor, filtro}) => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);

    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const obtenerProductos = async () => {
        
        let filtroAplicado;
        if (filtrarPor === 'banda' && filtro === 'busqueda') {
            const bandaBuscada = searchParams.get('banda') || '';
            filtroAplicado = bandaBuscada.toLowerCase();
        } else if (filtrarPor === 'descuento' && filtro === 'ofertas') {
            filtroAplicado = 'true';
        } else {
            filtroAplicado = filtro === 'todos los productos' ? 'todos' : filtro.toLowerCase();
        }

        try {
            setCargando(true);
            const res = await obtenerProducto(filtrarPor, filtroAplicado);

            if (res.status !== 200) return toast.error(`Error al obtener productos: ${res.statusText}`);
            return setDatos(res.data);
        } catch (err) {
            toast.error(`Error al obtener productos: ${err.response.data.error}`);
            return setDatos([]);
        } finally {
            setCargando(false);
        }
    };

    const [aparecer, setAparecer] = useState(false);

    useEffect(() => {
        setAparecer(true);
        obtenerProductos();
        setTimeout( () => setAparecer(false), 800)
    }, [filtro, searchParams]);

    const filtroMayuscula = (filtrarPor === 'banda' && filtro === 'busqueda')
        ? (`Resultados para "${searchParams.get('banda')}"` || 'Resultados')
        : filtro[0].toUpperCase() + filtro.slice(1);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">{filtroMayuscula}</h1>

            {cargando &&
                <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
            }

            {!cargando && datos.length === 0 &&
                <article className='mt-5 d-flex flex-column align-items-center'>
                    <h5 className='text-white mb-5'>No se encontraron ítems</h5>
                    <BotonSecundario
                        tipo='button'
                        texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                        accion={() => navigate('/')} />
                </article>
            }
            <section className={`${aparecer ? 'aparecer' : ''} d-flex flex-wrap justify-content-center pt-0 pt-sm-2 pb-5`}>
                {datos.map((producto) => (
                    <Tarjeta key={producto.uuid} {...producto} />
                ))}
                
            </section>
        </main>
    );
};

export default Productos;
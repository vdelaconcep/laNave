import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import axios from 'axios';
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
        setCargando(true);
        
        let filtroAplicado;
        if (filtrarPor === 'banda' && filtro === 'busqueda') {
            const bandaBuscada = searchParams.get('banda') || '';
            filtroAplicado = bandaBuscada.toLowerCase();
        } else {
            filtroAplicado = filtro === 'todos los productos' ? 'todos' : filtro.toLowerCase();
        }

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos?${filtrarPor}=${filtroAplicado}`);

            if (res.status !== 200) return alert(`Error al obtener productos: ${res.statusText}`);
            return setDatos(res.data);
        } catch (err) {
            alert(`Error al obtener productos: ${err.response.data.error || err.message}`);
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
        ? (`Resultados para ${searchParams.get('banda')}` || 'Resultados')
        : filtro[0].toUpperCase() + filtro.slice(1);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">{filtroMayuscula}</h1>

            {cargando &&
                <h2 className='text-white'><i className="fa-solid fa-spinner fa-spin"></i></h2>
            }

            {!cargando && datos.length === 0 &&
                <>
                <p>No se encontraron ítems</p>
                <BotonSecundario
                    tipo='button'
                    texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                    accion={() => navigate('/')} />
                </>
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
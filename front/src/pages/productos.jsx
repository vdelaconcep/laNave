import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import axios from 'axios';
import Tarjeta from '@/components/tarjetas/tarjeta';

export const Productos = ({filtrarPor, filtro}) => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);

    const [datos, setDatos] = useState([]);

    const obtenerProductos = async () => {
        const parametro = filtro.toLowerCase();
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos?${filtrarPor}=${filtro}`);

            if (res.status !== 200) return alert(`Error al obtener productos: ${res.statusText}`);
            return setDatos(res.data);
        } catch (err) {
            alert(`Error al obtener productos: ${err.response.data.error || err.message}`);
            return setDatos([]);
        };
    };

    const [aparecer, setAparecer] = useState(false);

    useEffect(() => {
        setAparecer(true);
        obtenerProductos();
        setTimeout( () => setAparecer(false), 800)
    }, [filtro]);

    const filtroMayuscula = filtro[0].toUpperCase() + filtro.slice(1);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">{filtroMayuscula}</h1>
            <section className={`${aparecer ? 'aparecer' : ''} d-flex flex-wrap justify-content-center pt-0 pt-sm-2 pb-5`}>
                {datos.map((producto) => (
                    <Tarjeta key={producto.uuid} {...producto} />
                ))}
                
            </section>
        </main>
    );
};

export default Productos;
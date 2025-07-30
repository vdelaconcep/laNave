import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import banner from '@/assets/img/banner2.png';
import Tarjeta from '@/components/tarjetas/tarjeta'

const Principal = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    const obtenerRecientes = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos?recientes=true`);

            if (res.status !== 200) return toast.error(`Error al obtener productos: ${res.statusText}`);
            return setDatos(res.data);
        } catch (err) {
            toast.error(`Error al obtener productos: ${err.response.data.error}`);
            return setDatos([]);
        };
    };

    const [datos, setDatos] = useState([]);

    useEffect(() => {
        obtenerRecientes();
    }, []);

    return (
        <main>
            <section className='banner d-none d-sm-block'>
                <img
                    src={banner}
                    alt="Banner La Nave Rock"
                    className='w-100'
                    style={{aspectRatio: '1988/454'}}/>
                <p className="text-end pe-3"><b>REMERAS - BUZOS - MOCHILAS - Y MÁS</b></p>
            </section>
            
            <section className="aparecer d-flex flex-wrap justify-content-center pt-0 pt-sm-2 pb-5">
                {datos.map((producto) => (
                    <Tarjeta key={producto.uuid} {...producto} />
                ))}
                
            </section>
        </main>
    );
};

export default Principal;
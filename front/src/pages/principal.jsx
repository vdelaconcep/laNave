import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import banner from '@/assets/img/banner2.png';
import Tarjeta from '@/components/tarjetas/tarjeta'
import carouselUno from '@/assets/img/carousel1.jpg';

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
            <section className='banner d-none d-sm-block mt-sm-4'>
                <img
                    src={banner}
                    alt="Banner La Nave Rock"
                    className='w-100'
                    style={{aspectRatio: '1988/454'}}/>
                <p className="text-end pe-3"><b>REMERAS - BUZOS - MOCHILAS - Y MÁS</b></p>
                
            </section>
            
            <div id="carouselPortada" className="carousel slide mt-1 mb-0 w-100" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselPortada" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselPortada" data-slide-to="1"></li>
                    <li data-target="#carouselPortada" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={carouselUno} alt="Mes de Spinetta" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={carouselUno} alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={carouselUno} alt="Third slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselPortada" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselPortada" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
            <p className='text-center mb-3 ps-2 pe-2'><i className="fa-solid fa-credit-card"></i><span>Hasta 6 cuotas sin interés con tarjeta</span>  - <i className="fa-solid fa-piggy-bank"></i> <span>20% off con transferencia</span></p>

            <p className='fw-bold text-start align-self-start mb-0 ps-sm-5'>Novedades</p>
            
            <section className="aparecer d-flex flex-wrap justify-content-center pt-0 pt-sm-2 pb-5">
                {datos.map((producto) => (
                    <Tarjeta key={producto.uuid} {...producto} />
                ))}
                
            </section>
        </main>
    );
};

export default Principal;
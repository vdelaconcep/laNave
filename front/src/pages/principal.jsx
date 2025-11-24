import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import { obtenerProducto } from '@/services/productoService';
import BotonSecundario from '@/components/botones/botonSecundario';
import banner from '@/assets/img/banner2.png';
import Tarjeta from '@/components/tarjetas/tarjeta';
import carouselUno from '@/assets/img/carousel1.jpg';
import carouselDos from '@/assets/img/carousel2.jpg';
import carouselUnoChico from '@/assets/img/carousel1-chico.jpg';
import carouselDosChico from '@/assets/img/carousel2-chico.jpg';

const Principal = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    const obtenerRecientes = async () => {
        try {
            const res = await obtenerProducto('recientes', 'true');

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
            <section className='banner mt-3 mt-sm-4'>
                <img
                    src={banner}
                    alt="Banner La Nave Rock"
                    className='w-100'
                    style={{aspectRatio: '1988/454'}}/>
                <p className="text-center text-sm-end pe-sm-3"><b>REMERAS - BUZOS - MOCHILAS - Y MÁS</b></p>
                
            </section>

            <div id="carouselChicoPortada" className="carousel slide d-block d-sm-none mt-4 mb-0 w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={carouselUnoChico} alt="Mes de Spinetta" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={carouselDosChico} alt="Envíos gratis a zona sur GBA" />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselChicoPortada" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselChicoPortada" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

            <div id="carouselPortada" className="carousel slide d-none d-sm-block mt-4 mb-0 w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={carouselUno} alt="Mes de Spinetta" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={carouselDos} alt="Envíos gratis a zona sur GBA" />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselPortada" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselPortada" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            
            <p className='text-center mb-4 mb-sm-5 mt-2 ps-2 pe-2'><i className="fa-solid fa-credit-card"></i><span>Hasta 6 cuotas sin interés con tarjeta</span>  - <i className="fa-solid fa-piggy-bank"></i> <span>20% off con transferencia</span> - <i className="fa-solid fa-truck-fast"></i> <span>Envíos a todo el país</span></p>

            <h1 className="pagina-titulo text-white text-center">Novedades</h1>
            
            <section className="aparecer d-flex flex-wrap justify-content-center pt-0 pt-sm-2 pb-4 pb-sm-5">
                {datos.map((producto) => (
                    <Tarjeta key={producto.uuid} {...producto} />
                ))}
                
            </section>
            <BotonSecundario
                texto={<><i className="fa-solid fa-arrow-up"></i><span> ir arriba</span></>}
                claseAdicional='m-3 mb-4'
                tipo='button'
                accion={() => {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                }} />
        </main>
    );
};

export default Principal;
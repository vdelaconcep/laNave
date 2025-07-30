import { useEffect, useContext, useState } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import { CarritoContext } from '@/context/carritoContext';
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

    useEffect(() => {
        const estaVacio = Array.isArray(carrito) && carrito.length === 0;
        if (estaVacio) setCarritoVacio(estaVacio);
    }, [carrito])
    
    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
            <section className='carritoVacio-section aparecer container mt-2 mb-5 d-flex flex-column align-items-center'>
                {carritoVacio &&
                    <>
                    <h5 className='text-center'>Todavía no hay ítems en tu carrito</h5>
                    <div className='d-flex justify-content-center mb-4 mt-2'>
                        <div className='carritoVacio-fotoDiv'>
                            <img className='w-100' src={carritoVacioImagen} alt="Intoxicados en Tilcara" />
                        </div>
                    </div>
                    <h5 className='text-center'>¡Te esperamos en la sección <Link to='/productos' className='carritoVacio-link'>productos</Link>!</h5>
                </>
                }
                
            </section>
        </main>
    );
};

export default Carrito;
import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { Link } from 'react-router-dom';
import carritoVacio from '@/assets/img/carritoVacio.jpg';
import '@/pages/css/carrito.css'


const Carrito = () => {
    const { setBackground } = useContext(BackgroundContext);
    
        useEffect(() => {
            setBackground('bg-carrito');
            return () => setBackground('');
        }, []);
    
    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
            <section className='carritoVacio-section aparecer container mt-4 mb-5 d-flex flex-column align-items-center'>
                <h4 className='text-center'>Todavía no hay ítems en tu carrito</h4>
                <div className='d-flex justify-content-center mb-4 mt-2'>
                    <div className='carritoVacio-fotoDiv'>
                        <img className='w-100' src={carritoVacio} alt="Intoxicados en Tilcara" />
                    </div>
                </div>
                <h4 className='text-center'>¡Te esperamos en la sección <Link to='/verTodo' className='carritoVacio-link'>productos</Link>!</h4>
            </section>
        </main>
    );
};

export default Carrito;
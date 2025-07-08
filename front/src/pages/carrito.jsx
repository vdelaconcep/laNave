import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Carrito = () => {
    const { setBackground } = useContext(BackgroundContext);
    
        useEffect(() => {
            setBackground('bg-carrito');
            return () => setBackground('');
        }, []);
    
    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Carrito</h1>
        </main>
    );
};

export default Carrito;
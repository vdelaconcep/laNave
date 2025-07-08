import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const VerTodo = () => {
    const { setBackground } = useContext(BackgroundContext);
    
        useEffect(() => {
            setBackground('bg-productos');
            return () => setBackground('');
        }, []);
    
    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Todos los productos</h1>
        </main>
    );
};

export default VerTodo;
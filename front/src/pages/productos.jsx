import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

export const Productos = ({filtro}) => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">{filtro}</h1>
        </main>
    );
};

export default Productos;
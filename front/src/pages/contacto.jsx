import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Contacto = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-contacto');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Contacto</h1>
        </main>
    );
};

export default Contacto;
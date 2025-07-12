import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Error = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-contacto');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Página de error</h1>
        </main>
    );
};

export default Error;
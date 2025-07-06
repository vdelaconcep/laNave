import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Nosotros = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-nosotros');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="text-white text-center">Nosotros</h1>
        </main>
    );
};

export default Nosotros;
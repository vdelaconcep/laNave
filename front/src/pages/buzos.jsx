import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Buzos = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    return (
        <main>
            <h1 className="text-white text-center">Buzos</h1>
        </main>
    );
};

export default Buzos;
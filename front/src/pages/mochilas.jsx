import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Mochilas = () => {
    const { setBackground } = useContext(BackgroundContext);
    
        useEffect(() => {
            setBackground('bg-productos');
            return () => setBackground('');
        }, []);
    
    return (
        <main>
            <h1 className="text-white text-center">Mochilas</h1>
        </main>
    );
};

export default Mochilas;
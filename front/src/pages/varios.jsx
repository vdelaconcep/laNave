import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Varios = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    return (
        <main>
            <h1 className="text-white text-center">Varios</h1>
        </main>
    );
};

export default Varios;
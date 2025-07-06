import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Principal = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    return (
        <main>
            <h1 className="text-white text-center">Principal</h1>
        </main>
    );
};

export default Principal;
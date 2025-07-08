import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';


const Remeras = () => {
    const { setBackground } = useContext(BackgroundContext);
    
        useEffect(() => {
            setBackground('bg-productos');
            return () => setBackground('');
        }, []);
    
    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Remeras</h1>
        </main>
    );
};

export default Remeras;
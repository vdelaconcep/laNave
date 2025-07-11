import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import banner from '@/assets/img/banner2.png';
import Tarjeta from '@/components/tarjetas/tarjeta'

const Principal = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-productos');
        return () => setBackground('');
    }, []);
    
    return (
        <main>
            <section className='banner d-none d-sm-block'>
                <img
                    src={banner}
                    alt="Banner La Nave Rock"
                    className='w-100'
                    style={{aspectRatio: '1988/454'}}/>
                <p className="text-end mt-0 pt-0 pe-3"><b>REMERAS - BUZOS - MOCHILAS</b></p>
            </section>
            
            <section className="tarjetas d-flex flex-wrap justify-content-center pt-0 pt-sm-5 pb-5">
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
                <Tarjeta />
            </section>
        </main>
    );
};

export default Principal;
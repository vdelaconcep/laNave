import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Ventas = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);
    
        return (
            <main>
                {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                    <>
                        <h1 className="pagina-titulo text-white text-center">Registro de ventas</h1>
                        <section className='text-white mt-2'>
                        </section>
                    </>}
            </main>
        );
};

export default Ventas;
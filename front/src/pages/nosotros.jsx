import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import nosotros from '@/assets/img/nosotros.jpg';
import '@/pages/css/nosotros.css'

const Nosotros = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-nosotros');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Sobre nosotros</h1>
            <section className='nosotros-section aparecer container mt-4 mb-5 d-flex flex-column align-items-center'>
                <p className='nosotros-texto'>La Nave es un espacio que celebra nuestra identidad. Nació del amor por los artistas que hicieron del rock nacional una forma de vida, y que siguen marcando generaciones con su música.
                <br /><br />
                    Desde acá queremos rendir homenaje a quienes, entre poesía y guitarras, nos enseñaron a sentir orgullo por lo que somos. Porque el rock argentino nos representa.
                </p>
                <div className='d-flex justify-content-center mb-4 mt-2'>
                    <div className='nosotros-fotoDiv'>
                        <img className='w-100' src={nosotros} alt="Nosotros en Rumipal La Renga 2014" />
                    </div>
                </div>
                <h1 className='text-center'>¡El Rock Nacional es orgullo e identidad!</h1>
            </section>
        </main>
    );
};

export default Nosotros;
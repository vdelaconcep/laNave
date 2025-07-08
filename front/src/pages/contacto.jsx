import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import contactoImagen from '@/assets/img/contacto.jpg';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import '@/pages/css/pages.css'
import '@/pages/css/contacto.css'

const Contacto = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-contacto');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Dejanos tu mensaje</h1>
            <div className='contacto-div bg-dark row mt-2 mb-5'>
                <div className='col-6 p-0'>
                    <img className='contacto-foto' src={contactoImagen} alt="Charly hablando por teléfono" />
                </div>
                
                <form className="text-white col-6">
                    <div className="container d-flex flex-column rounded-3 p-3 pb-4">
                        <label for="nombre" className="form-label ps-2 mt-2 mb-0">Nombre:</label>
                        <input className="form-control bg-secondary-subtle" id="input-nombre" type="text" name="nombre" />

                        <label for="email" className="form-label ps-2 mt-2 mb-0">E-mail:</label>
                        <input className="form-control bg-secondary-subtle"id="input-email" type="text" name="email" />

                        <label for="asunto" className="form-label ps-2 mt-2 mb-0">Asunto:</label>
                        <input className="form-control bg-secondary-subtle"id="input-asunto" type="text" name="asunto" />

                        <label for="mensaje" className="form-label ps-2 mt-2 mb-0">Mensaje:</label>
                        <textarea className="form-control bg-secondary-subtle" id="mensaje" name="mensaje"></textarea>
                    </div>
                    <div className="text-center m-1 bg-info">
                        <BotonSecundario tipo='reset' texto={<><span>Cancelar </span><i className="fa-solid fa-xmark"></i></>} />
                        <BotonPrimario tipo='submit' texto={<><span>Enviar </span><i className="fa-solid fa-paper-plane"></i></>} />
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Contacto;
import { useState, useEffect, useContext } from 'react';
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

    const [inputs, setInputs] = useState({});

    const gestionIngreso = (evento) => {
        const name = evento.target.name;
        const value = evento.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const gestionEnvio = (evento) => {
        evento.preventDefault();
        alert(JSON.stringify(inputs));
        setInputs({});
    };

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Dejanos tu mensaje</h1>
            <div className='contacto-div row mt-4 mb-5'>
                <div className='col-6 p-0 d-none d-md-block'>
                    <img className='contacto-foto' src={contactoImagen} alt="Charly hablando por teléfono" />
                </div>
                
                <form onSubmit={gestionEnvio} className="text-white col-md-6">
                    <div className="contacto-formDiv container d-flex flex-column rounded-3 p-3 pb-5 p-md-2 pb-md-4">
                        <label htmlFor="nombre" className="contacto-label form-label ps-2 mt-md-1 mb-0">Nombre:</label>
                        <input 
                            className="contacto-input form-control bg-secondary-subtle"
                            type="text"
                            name="nombre"
                            value={inputs.nombre}
                            onChange={gestionIngreso}
                            required/>

                        <label htmlFor="email" className="contacto-label form-label ps-2 mt-2 mb-0">E-mail:</label>
                        <input
                            className="contacto-input form-control bg-secondary-subtle"
                            type="email"
                            name="email"
                            value={inputs.email}
                            onChange={gestionIngreso}
                            required />

                        <label htmlFor="asunto" className="contacto-label form-label ps-2 mt-2 mb-0">Asunto:</label>
                        <input
                            className="contacto-input form-control bg-secondary-subtle"
                            type="text"
                            name="asunto"
                            value={inputs.asunto}
                            onChange={gestionIngreso}
                            required />

                        <label htmlFor="mensaje" className="contacto-label form-label ps-2 mt-2 mb-0">Mensaje:</label>
                        <textarea
                            className="contacto-textarea form-control" name="mensaje"
                            placeholder='(Hasta 140 caracteres)'
                            maxLength={140}
                            value={inputs.mensaje}
                            onChange={gestionIngreso}
                            required></textarea>
                    </div>
                    <div className="text-center mt-5 m-md-1 mb-2">
                        <BotonPrimario tipo='submit' texto={<><span>Enviar </span><i className="fa-solid fa-paper-plane"></i></>} claseAdicional='me-2' />
                        <BotonSecundario tipo='reset' texto={<><span>Cancelar </span><i className="fa-solid fa-xmark"></i></>} claseAdicional='ms-2' />
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Contacto;
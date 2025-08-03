import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import contactoImagen from '@/assets/img/contacto.jpg';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import useFormulario from '@/hooks/useFormulario';
import axios from 'axios';
import '@/pages/css/pages.css'
import '@/pages/css/formularios.css'

const Contacto = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-contacto');
        return () => setBackground('');
    }, []);

    // Gestión de datos del formulario

    // Valores iniciales
    const estadoInicial = {
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    };

    const [cargando, setCargando] = useState(false);

    const enviarDatos = async (datos) => {

        // Envío de datos al backend
        try {
            setCargando(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/mensajes/mensajeNuevo`, datos);

            if (res.status !== 200) return toast.error(`Error al enviar tu mensaje: ${res.statusText}`);

            setInputs(estadoInicial);
            
            return toast.success('Se envió tu mensaje. Te responderemos a la brevedad');
        } catch (err) {
            return toast.error(`Error al enviar tu mensaje: ${err.response.data.error}`);
        } finally {
            setCargando(false);
        };
    };

    const { inputs, setInputs, gestionIngreso, gestionEnvio } = useFormulario(enviarDatos);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Dejanos tu mensaje</h1>
            <section className='login-section aparecer mt-2'>
                <form onSubmit={gestionEnvio} className='contacto-form d-flex flex-column align-items-center'>
                    <div className='contacto-div row mt-4 mb-3'>
                        <aside className='col-6 p-0 d-none d-md-block'>
                            <img className='contacto-foto' src={contactoImagen} alt="Charly hablando por teléfono" />
                        </aside>
                        
                        <div className="contacto-formDiv container d-flex flex-column rounded-3 p-3 pb-4 p-md-3 pt-md-2 pb-md-2 col-md-6">
                            <label htmlFor="nombre" className="contacto-label form-label ps-2 mt-md-1 mb-0">Nombre:</label>
                            <input 
                                className="contacto-input form-control bg-secondary-subtle"
                                type="text"
                                name="nombre"
                                value={inputs.nombre}
                                onChange={gestionIngreso}
                                autoFocus
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
                                maxLength={30}
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
                    </div>
                    <article className="text-center mt-3 mb-5">
                        <BotonSecundario tipo='reset' texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>} claseAdicional='me-2' />
                        <BotonPrimario tipo='submit' texto={cargando ? <><i className="fa-solid fa-spinner fa-spin"></i><span> Enviando... </span></> : <><i className="fa-solid fa-paper-plane"></i><span> Enviar</span></>} claseAdicional='ms-2' />
                    </article>
                </form>
            </section>
        </main>
    );
};

export default Contacto;
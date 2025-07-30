import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import '@/pages/css/formularios.css';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPassword from '@/components/botones/botonPassword';
import useFormulario from '@/hooks/useFormulario';

const Registro = () => {
    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-login');
        return () => setBackground('');
    }, []);

    
    const navigate = useNavigate();

    // Gestión de envío del formulario
    const [cargando, setCargando] = useState(false);

    const enviarDatos = async (datos) => {

        // Validación de la contraseña
        if (datos.password !== datos.passwordConfirm) return toast.warning("Las contraseñas no coinciden");

        // (El resto de validaciones necesarias se realizan en el backend)

        // Envío de datos al backend
        try {
            setCargando(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/registro`, datos);

            if (res.status !== 200) return toast.error(`Error al registrar el usuario: ${res.statusText}`);

            setInputs({});
            toast.success('El usuario se registró con éxito');
            return navigate('/login');
        } catch (err) {
            return toast.error(`Error al registrar el usuario: ${ err.response.data.error}`);
        } finally {
            setCargando(false);
        };
    };

    const cancelarRegistro = () => {
        setInputs({});
        return navigate('/login');
    }

    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(enviarDatos);

    // Para mostrar/ocultar contraseña
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarPasswordConfirmacion, setMostrarPasswordConfirmacion] = useState(false);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Registrate</h1>
            <section className='aparecer text-white mt-4'>
                <h6 className='text-center'>
                    Completá el formulario con tus datos
                </h6>
                <form onSubmit={gestionEnvio} className='registro-form d-flex flex-column align-items-center'>
                        <div className='registro-formDiv container rounded-3 p-3 pb-4 mt-2 mb-3'>
                            <label htmlFor="nombreYApellido" className="registro-label form-label ps-2 mb-0">Nombre y Apellido:</label>
                            <input
                                className="registro-input form-control"
                                type="text"
                                name="nombreYApellido"
                                minLength={7}
                                maxLength={40}
                                value={inputs.nombreYApellido}
                                onChange={gestionIngreso}
                                autoFocus
                                required />
                            
                            <label htmlFor="nacimiento" className="registro-label form-label ps-2 mb-0 mt-2">Fecha de nacimiento:</label>
                            <input
                                className="registro-input form-control"
                                type="date"
                                name="nacimiento"
                                value={inputs.nacimiento}
                                onChange={gestionIngreso}
                                required />

                            <label htmlFor="email" className="registro-label form-label ps-2 mb-0 mt-2">E-mail:</label>
                            <input
                                className="registro-input form-control"
                                type="email"
                                name="email"
                                maxLength={30}
                                value={inputs.email}
                                onChange={gestionIngreso}
                                required />
                            
                            <label htmlFor="telefono" className="registro-label form-label ps-2 mb-0 mt-2">Teléfono (opcional):</label>
                            <input
                                className="registro-input form-control"
                                type="number"
                                name="telefono"
                                placeholder="(Solo números)"
                                min={11111111}
                                max={999999999999999}
                                value={inputs.telefono}
                                onChange={gestionIngreso}/>
                            <div className='passwordDiv'>
                                <label htmlFor="password" className="registro-label form-label ps-2 mb-0 mt-2">Contraseña:</label>
                                <input
                                    className="registro-input form-control"
                                    type={mostrarPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="8 a 15 (letras y/o números)"
                                    maxLength={15}
                                    minLength={8}
                                    value={inputs.password}
                                    onChange={gestionIngreso}
                                    required />
                                <BotonPassword mostrar={mostrarPassword} setMostrar={setMostrarPassword} />
                            </div>
                            <div className='passwordDiv'>
                                <label htmlFor="passwordConfirm" className="registro-label form-label ps-2 mb-0 mt-2">Confirmar contraseña:</label>
                                <input
                                    className="registro-input form-control"
                                    type={mostrarPasswordConfirmacion ? "text" : "password"}
                                    name="passwordConfirm"
                                    placeholder="Reingresá la contraseña"
                                    maxLength={15}
                                    minLength={8}
                                    value={inputs.passwordConfirm}
                                    onChange={gestionIngreso}
                                    required />
                                <BotonPassword mostrar={mostrarPasswordConfirmacion} setMostrar={setMostrarPasswordConfirmacion} />
                            </div>
                        </div>
                    <article className="text-center mt-3 mb-5">
                        <BotonSecundario tipo='button' texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>} claseAdicional='me-2' accion={cancelarRegistro} />
                        <BotonPrimario tipo='submit' texto={cargando ? <><i className="fa-solid fa-spinner fa-spin"></i><span> Enviando...</span></> : <><i className="fa-solid fa-check"></i><span> Enviar</span></>} claseAdicional='ms-2' />
                    </article>
                </form>
            </section>
        </main>
    );
};

export default Registro;
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import loginImg from '@/assets/img/login.jpg';
import '@/pages/css/formularios.css';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPassword from '@/components/botones/botonPassword';
import useFormulario from '@/hooks/useFormulario';

const Login = () => {

    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-login');
        return () => setBackground('');
    }, []);

    // Inicio de Sesión
    const { sesionIniciada, login, logout, loginGoogle } = useAuth();

    const iniciarSesion = async (datos) => {

        // Si ya hay una sesión iniciada, cerrarla
        if (sesionIniciada) logout();

        // Envío de datos al backend
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/login`, datos);

            if (res.status !== 200) return toast.error(`Error al iniciar sesión: ${res.statusText}`);

            login(res.data.token, res.data.usuario);
            setInputs({});
        } catch (err) {
            return toast.error(`Error al iniciar sesión: ${err.response.data ? err.response.data.error : err}`);
        };
    };

    // Gestión de datos del formulario
    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(iniciarSesion);

    // Mostrar/ocultar contraseña
    const [mostrarPassword, setMostrarPassword] = useState(false);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Iniciá sesión</h1>
            <section className='login-section aparecer mt-2'>
                <form onSubmit={gestionEnvio} className='login-form d-flex flex-column align-items-center'>
                    <div className='login-div row mt-4 mb-3'>
                        <aside className='col-6 p-0 d-none d-md-block'>
                            <img className='login-foto' src={loginImg} alt="Viudas e Hijas de Roque Enroll" />
                        </aside>
                    
                        <div className="login-formDiv container d-flex flex-column rounded-3 p-3 pb-4 col-md-6">
                            <label htmlFor="email" className="login-label form-label ps-2 mt-0 mb-0">
                                E-mail:
                            </label>
                            <input 
                                className="login-input form-control"
                                type="email"
                                name="email"
                                value={inputs.email}
                                onChange={gestionIngreso}
                                autoFocus
                                required/>
                            <div className='passwordDiv'>
                                <label htmlFor="password" className="login-label form-label ps-2 mt-2 mb-0">Contraseña:</label>
                                <input
                                    className="login-input form-control"
                                    type={mostrarPassword ? "text" : "password"}
                                    name="password"
                                    value={inputs.password}
                                    onChange={gestionIngreso}
                                    required />
                                <BotonPassword mostrar={mostrarPassword} setMostrar={setMostrarPassword} />
                            </div>
                            <article className="text-center m-2 mt-4">
                                <BotonPrimario tipo='submit' texto={<><span>Acceder </span><i className="fa-solid fa-right-to-bracket"></i></>}/>
                            </article>
                        

                            <hr className='text-white' />

                            <article className="text-center container mt-3 mb-2">
                                <BotonSecundario
                                    tipo='button'
                                    texto={<><span>Acceder con Google </span><i className="fa-brands fa-google"></i></>}
                                    claseAdicional='w-100'
                                    accion={loginGoogle} />
                            </article>
                        </div>
                    </div>
                </form>
                <h6 className='text-center text-white mb-5'>
                    ¿No tenés cuenta? <Link to='/registro' className='login-registrateLink'>Registrate</Link>
                </h6>
            </section>
        </main>
    )
};

export default Login;
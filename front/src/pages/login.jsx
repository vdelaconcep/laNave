import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { useAuth } from '@/context/authContext';
import axios from 'axios';
import loginImg from '@/assets/img/login.jpg';
import '@/pages/css/login.css';
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

            if (res.status !== 200) return alert(`Error al iniciar sesión: ${res.statusText}`);

            login(res.data.token, res.data.usuario);
            setInputs({});
        } catch (err) {
            return alert(`Error al iniciar sesión: ${err.response.data.error}`);
        };
    };

    // Gestión de datos del formulario
    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(iniciarSesion);

    // Mostrar/ocultar contraseña
    const [mostrarPassword, setMostrarPassword] = useState(false);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Iniciá sesión</h1>
            <section className='login-section aparecer mt-4'>
                <div className='login-div row mb-4'>
                    <aside className='login-fotoAside col-6 p-0 d-none d-md-block'>
                        <img className='w-100' src={loginImg} alt="Viudas e Hijas de Roque Enroll" />
                    </aside>
                    <div className="col-md-6">

                        <form onSubmit={gestionEnvio} className='container mt-3'>
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
                            <div className='inputPassword-div'>
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
                            <article className="text-center m-4">
                                <BotonPrimario tipo='submit' texto={<><span>Acceder </span><i className="fa-solid fa-right-to-bracket"></i></>}/>
                            </article>
                        </form>

                        <hr className='text-white' />

                        <article className="text-center container mt-4 mb-4">
                            <BotonSecundario
                                tipo='button'
                                texto={<><span>Acceder con Google </span><i className="fa-brands fa-google"></i></>}
                                claseAdicional='w-100'
                                accion={loginGoogle} />
                        </article>
                    </div>
                </div>
                <h6 className='text-center text-white mb-5'>
                    ¿No tenés cuenta? <Link to='/registro' className='registrate-Link'>Registrate</Link>
                </h6>
            </section>
        </main>
    )
};

export default Login;
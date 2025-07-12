import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import login from '@/assets/img/login.jpg';
import '@/pages/css/login.css';
import BotonPrimario from '@/components/botones/botonPrimario';
import useFormulario from '@/hooks/useFormulario';

const Login = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-login');
        return () => setBackground('');
    }, []);

    const mostrarDatosEnviados = (datos) => {
        alert(JSON.stringify(datos));
    };

    const { inputs, gestionIngreso, gestionEnvio } = useFormulario(mostrarDatosEnviados);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Iniciá sesión</h1>
            <section className='login-section aparecer mt-4'>
                <div className='login-div row mb-4'>
                    <aside className='login-fotoAside col-6 p-0 d-none d-md-block'>
                        <img className='w-100' src={login} alt="Viudas e Hijas de Roque Enroll" />
                    </aside>
                    <div className="col-md-6">
                        <article className="text-center container mt-4">
                            <BotonPrimario tipo='button' texto={<><span>Acceder con Google </span><i className="fa-brands fa-google"></i></>} claseAdicional='w-100' />
                        </article>

                        <hr className='text-white' />

                        <form onSubmit={gestionEnvio} className='container'>
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

                            <label htmlFor="password" className="login-label form-label ps-2 mt-2 mb-0">Contraseña:</label>
                            <input
                                className="login-input form-control"
                                type="text"
                                name="password"
                                value={inputs.password}
                                onChange={gestionIngreso}
                                required />
                            <article className="text-center m-4">
                                <BotonPrimario tipo='submit' texto={<><span>Acceder </span><i className="fa-solid fa-right-to-bracket"></i></>}/>
                            </article>
                        </form>
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
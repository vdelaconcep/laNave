import { useState, useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import login from '@/assets/img/login.jpg';
import '@/pages/css/login.css';
import BotonPrimario from '@/components/botones/botonPrimario';

const Login = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-login');
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
            <h1 className="pagina-titulo text-white text-center">Iniciar sesión</h1>
            <div className='login-div aparecer row mt-4 mb-5'>
                <div className='col-6 p-0 d-none d-md-block'>
                    <img className='login-foto' src={login} alt="Viudas e Hijas de Roque Enroll" />
                </div>
                
                <form onSubmit={gestionEnvio} className="text-white col-md-6">
                    <div className="login-formDiv container d-flex flex-column rounded-3 p-3 pb-5 p-md-2 pb-md-4">
                        <label htmlFor="email" className="login-label form-label ps-2 mt-md-1 mb-0">E-mail:</label>
                        <input 
                            className="login-input form-control bg-secondary-subtle"
                            type="email"
                            name="email"
                            value={inputs.email}
                            onChange={gestionIngreso}
                            required/>

                        <label htmlFor="password" className="login-label form-label ps-2 mt-2 mb-0">Contraseña:</label>
                        <input
                            className="login-input form-control bg-secondary-subtle"
                            type="text"
                            name="password"
                            value={inputs.password}
                            onChange={gestionIngreso}
                            required />
                    </div>
                    <div className="text-center mt-5 m-md-1 mb-2">
                        <BotonPrimario tipo='submit' texto={<><span>Acceder </span><i className="fa-solid fa-right-to-bracket"></i></>}/>
                    </div>
                </form>
            </div>
        </main>
    )
};

export default Login;
import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';

const Login = () => {
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-login');
        return () => setBackground('');
    }, []);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Login</h1>
        </main>
    );
};

export default Login;
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Context que guarda usuario y token en estado
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // Cargar datos si ya está iniciada la sesión
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');
        if (tokenGuardado && usuarioGuardado) {
            setToken(tokenGuardado);
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    // Para iniciar sesión
    const login = (token, usuario) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setToken(token);
        setUsuario(usuario);
        if (usuario.rol === "administrador") return navigate('/admin');
        return navigate('/');
    };

    // Para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout, sesionIniciada: !!usuario }}>
            {children}
        </AuthContext.Provider>
    );
};
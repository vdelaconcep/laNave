import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/config";

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

    // Para iniciar sesión con google
    // (Para entrar como admin si o si se debe ingresar con contraseña)
    const loginGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const userFirebase = res.user;

            const usuarioGoogle = {
                nombreYApellido: userFirebase.displayName,
                email: userFirebase.email,
                rol: 'cliente'
            };

            login(userFirebase.uid, usuarioGoogle)
        } catch (err) {
            return alert(`Error al iniciar sesión con Google: ${err}`)
        }
    };

    // Para cerrar sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ usuario, token, login, loginGoogle, logout, sesionIniciada: !!usuario }}>
            {children}
        </AuthContext.Provider>
    );
};
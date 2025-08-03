import { Link, useLocation } from "react-router-dom";
import '@/components/botones/botones.css';

const BotonLink = ({ vinculo, texto, numero, accion }) => {
    const location = useLocation();

    return (
        <Link to={vinculo ?? "#"}
            className="links btnLink-Link p-3"
            onClick={accion ? accion : null}>
            <span className="btnLink-texto">{texto}</span> 
            {(numero ?? 0) > 0 && location.pathname !== '/carrito' && location.pathname !== '/mensajes' && (
                <p className="btnLink-notificacion">{numero}</p>
            )}
        </Link>
    );
};

export default BotonLink;

import { Link } from "react-router-dom";
import '@/components/botones/boton-link.css';

const BotonLink = ({ vinculo, texto, numero }) => {
    return (
        <Link to={vinculo ?? "#"} className="btnLink-Link p-3">
            {texto}
            {(numero ?? 0) > 0 && (
                <p className="btnLink-notificacion">{numero}</p>
            )}
        </Link>
    );
};

export default BotonLink;

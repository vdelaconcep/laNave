import './css/boton-superior.css'

const BotonSuperior = ({ href, texto, numero }) => {
    return (
        <button className="btn-superior">
            <a className="btn-superior-a" href={href}>
                {texto}
            </a>
            {(numero ?? 0) && (
                <p className="btn-superior-notificacion">{numero}</p>
            )}
        </button>
    );
};

export default BotonSuperior;
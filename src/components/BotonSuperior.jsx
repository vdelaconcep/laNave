import './css/BotonSuperior.css'

const BotonSuperior = ({ href, texto, icono, numero }) => {
    return (
        <button className="btn-superior">
            <a className="btn-superior-a text-decoration-none text-black" href={href}>
                {texto} <i className={`fa-solid ${icono}`}></i>
            </a>
            {typeof numero === 'number' && numero > 0 && (
                <p className="btn-superior-notificacion text-white text-center fw-bold">{numero}</p>
            )}
        </button>
    );
};

export default BotonSuperior;
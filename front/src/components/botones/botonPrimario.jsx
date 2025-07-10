import '@/components/botones/botones.css';

const BotonPrimario = ({ tipo, texto, claseAdicional, accion }) => {
    return (
        <button
            className={`botonPrimario-btn btn ${claseAdicional && claseAdicional}`}
            type={tipo}
            onClick={accion && accion}>
            {texto}
        </button>
    );
};

export default BotonPrimario;
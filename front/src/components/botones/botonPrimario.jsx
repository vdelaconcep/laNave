import '@/components/botones/botones.css';

const BotonPrimario = ({ tipo, texto, claseAdicional, accion, deshabilitar }) => {
    return (
        <button
            className={`botonPrimario-btn btn ${claseAdicional && claseAdicional}`}
            type={tipo}
            onClick={accion && accion}
            disabled={deshabilitar}>
            {texto}
        </button>
    );
};

export default BotonPrimario;
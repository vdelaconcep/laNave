import '@/components/botones/botones.css';

const BotonSecundario = ({ tipo, texto, claseAdicional, accion }) => {
    return (
        <button
            className={`botonSecundario-btn btn btn-outline-light ${claseAdicional}`}
            type={tipo}
            onClick={accion ? accion : ''}>
            {texto}
        </button>
    );
};

export default BotonSecundario;
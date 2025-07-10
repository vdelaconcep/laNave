import '@/components/botones/botones.css';

const BotonSecundario = ({ tipo, texto, claseAdicional }) => {
    return (
        <button
            className={`botonSecundario-btn btn btn-outline-light ${claseAdicional}`}
            type={tipo}>
            {texto}
        </button>
    );
};

export default BotonSecundario;
import '@/components/botones/botones.css';

const BotonPrimario = ({ tipo, texto }) => {
    return (
        <button
            className='botonPrimario-btn btn'
            type={tipo}>
            {texto}
        </button>
    );
};

export default BotonPrimario;
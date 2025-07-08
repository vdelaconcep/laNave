import '@/components/botones/botones.css';

const BotonSecundario = ({ tipo, texto }) => {
    return (
        <button
            className='botonSecundario-btn btn'
            type={tipo}>
            {texto}
        </button>
    );
};

export default BotonSecundario;
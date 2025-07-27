// Botón para mostrar/ocultar la contraseña

const BotonPassword = ({ mostrar, setMostrar }) => {
    return (
        <button
            type="button"
            title={mostrar ? 'Ocultar contraseña' : 'Mostrar Contraseña'}
            onClick={() => setMostrar(!mostrar)}
            className="botonPassword btn btn-sm"
            tabIndex={-1}>
            {mostrar ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
        </button>
    );
};

export default BotonPassword;
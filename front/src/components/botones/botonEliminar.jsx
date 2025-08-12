import '@/components/botones/botones.css';

const BotonEliminar = ({ tipo, claseAdicional, accion, cargandoEliminacion, textoAdicional}) => {
    return (
        <button
            className={`botonEliminar-btn btn ${claseAdicional && claseAdicional}`}
            type={tipo}
            onClick={accion && accion}>
            {cargandoEliminacion ? <><span>Eliminando </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-trash-can"></i><span> Eliminar {textoAdicional && textoAdicional}</span></>}
        </button>
    );
};

export default BotonEliminar;
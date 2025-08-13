const SelectorTalle = ({
    uuid,
    stock,
    talles,
    talleSeleccionado,
    setTalleSeleccionado,
    talleUnico
}) =>  {
    if (talleUnico) return null;

    return (
        <article>
            <label htmlFor={`talle${uuid}`} className='me-1'>Talle: </label>
            <select
                className='tarjeta-selectTalle'
                name="talle"
                id={`talle${uuid}`}
                value={talleSeleccionado}
                onChange={(e) => setTalleSeleccionado(e.target.value)}
            >
                <option value="" disabled hidden>-</option>
                {talles
                    .filter((talle) => stock[talle] !== 0)
                    .map((talle) => (
                        <option value={talle} key={talle}>{talle}</option>
                    ))}
            </select>
        </article>
    );
};

export default SelectorTalle;
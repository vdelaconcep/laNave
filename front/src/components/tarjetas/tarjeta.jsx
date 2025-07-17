import imagenNoDisponible from '@/assets/img/tarjeta-alternativa.jpg'
import '@/components/tarjetas/tarjetas.css';

const Tarjeta = (props) => {

    const tipoMayus = props.tipo[0].toUpperCase() + props.tipo.slice(1);
    const titulo = `${tipoMayus} ${props.banda} #${props.modelo}`;
    const talles = Object.keys(props.stock);
    const cantidad = Object.values(props.stock);
    const talleUnico = talles.includes('U') && talles.length === 1;
    const hayStock = (talleUnico && props.stock['U'] !== 0) || (cantidad.some((numero) => numero !== 0));

    return (
        hayStock && (
            <article className='tarjeta-article text-white m-3'>
                <div className='tarjeta-div-foto'>
                    <img
                        src={props.imagen ? props.imagen : imagenNoDisponible}
                        alt={titulo}
                        className={`tarjeta-foto ${props.imagen && 'aumentar'}`} />
                </div>
                <h5 className='tarjeta-titulo hstack align-items-center p-2 m-0'>{titulo}</h5>
                <div className='hstack justify-content-around align-items-center p-2'>
                    <p className='tarjeta-precio text-info m-0 fs-4 fw-bold'>ARS {props.precio}</p>
                    {!talleUnico &&
                        <article>
                            <label htmlFor={`talle${props.uuid}`} className='me-1'>Talle: </label>
                            <select className='tarjeta-selectTalle' name="talle" id={`talle${props.uuid}`}>
                                {talles
                                    .filter((talle) => props.stock[talle] !== 0)
                                    .map((talle) => (
                                    <option value={talle} key={talle}>{talle}</option>
                                ))}
                            </select>
                        </article>
                    }
                </div>
                <div className='hstack justify-content-center'>
                    <button className='tarjeta-boton btn w-100 d-flex align-items-center justify-content-center'>
                        <i className="fa-solid fa-plus me-2"></i> Agregar al carrito
                    </button>
                </div>
            </article>
        )
    );
};

export default Tarjeta;
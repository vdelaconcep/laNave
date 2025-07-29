import { useState, useContext } from 'react';
import { CarritoContext } from '@/context/carritoContext';
import { toast } from 'react-toastify';
import imagenNoDisponible from '@/assets/img/tarjeta-alternativa.jpg';
import '@/components/tarjetas/tarjetas.css';

const Tarjeta = (props) => {

    const tipoMayus = props.tipo[0].toUpperCase() + props.tipo.slice(1);
    const titulo = `${tipoMayus} ${props.banda} #${props.modelo}`;
    const talles = Object.keys(props.stock);
    const cantidad = Object.values(props.stock);
    const talleUnico = talles.includes('U') && talles.length === 1;
    const hayStock = (talleUnico && props.stock['U'] !== 0) || (cantidad.some((numero) => numero !== 0));

    const { carrito, setCarrito } = useContext(CarritoContext);

    const [talleSeleccionado, setTalleSeleccionado] = useState('');

    const agregarAlCarrito = (id, talleSeleccionado) => {

        const stockDisponible = talleUnico && talleSeleccionado === '' ? props.stock['U'] : props.stock[talleSeleccionado];

        if (talleSeleccionado === '' && !('U' in props.stock && Object.keys(props.stock).length === 1)) {
            return toast.warning('Por favor, seleccioná un talle.');
        }

        const mismoProducto = carrito.find(producto => producto.id === id && producto.talle === talleSeleccionado);

        let carritoActualizado;

        if (mismoProducto) {
            if (mismoProducto.cantidad < stockDisponible) {
                carritoActualizado = carrito.map(producto => producto.id === id && producto.talle === talleSeleccionado ?
                    { ...producto, cantidad: producto.cantidad + 1 } :
                    producto)
            } else {
                return toast.error(`No hay más stock disponible ${talleSeleccionado !== '' ? `para el talle ${talleSeleccionado}` : ''}`);
            }
        } else {
            const nuevoProducto = {
                id: id,
                talle: talleSeleccionado,
                cantidad: 1
            };
            carritoActualizado = [...carrito, nuevoProducto];
        }

        setCarrito(carritoActualizado);

        return toast.success(`${props.tipo[0].toUpperCase() + props.tipo.slice(1)} ${props.banda} #${props.modelo} se agregó al carrito`);
    };

    return (
        hayStock && (
            <article className='tarjeta-article text-white m-3 d-flex flex-column justify-content-between'>
                <div className='tarjeta-div-foto'>
                    <img
                        src={props.imagen ? props.imagen : imagenNoDisponible}
                        alt={titulo}
                        className={`tarjeta-foto ${props.imagen && 'aumentar'}`} />
                    {props.descuento > 0 &&
                        <div className='tarjeta-divDescuento'>
                            {props.descuento}%
                        </div>
                    }
                </div>
                <h5 className='tarjeta-titulo hstack align-items-center p-2 m-0'>{titulo}</h5>
                <div className='tarjeta-parteInferiorDiv'>
                    <div className='tarjeta-precioDiv d-flex justify-content-around align-items-center'>
                        {props.descuento === 0 ?
                            <p className='tarjeta-precio text-info m-0 fs-4 fw-bold'>ARS {props.precio}</p> :
                            <div>
                                <p className='tarjeta-precio final text-danger m-0 p-0 fs-4 fw-bold'>ARS {(props.precio *(1- (0.01*props.descuento))).toFixed(0)}</p>
                                <p className='tarjeta-precio anterior text-white m-0 p-0'>ARS {props.precio}</p>
                            </div>
                        }
                        
                        {!talleUnico &&
                            <article>
                                <label htmlFor={`talle${props.uuid}`} className='me-1'>Talle: </label>
                                <select
                                    className='tarjeta-selectTalle' name="talle"
                                    id={`talle${props.uuid}`}
                                    value={talleSeleccionado}
                                    onChange={(e) => setTalleSeleccionado(e.target.value)}>
                                    <option value="" disabled hidden>-</option>
                                    {talles
                                        .filter((talle) => props.stock[talle] !== 0)
                                        .map((talle) => (
                                        <option value={talle} key={talle}>{talle}</option>
                                    ))}
                                </select>
                            </article>
                        }
                    </div>
                    <div>
                        <button
                            className='tarjeta-boton btn w-100 d-flex align-items-center justify-content-center'
                            type='button'
                            onClick={() => agregarAlCarrito(props.uuid, talleSeleccionado)}>
                            <i className="fa-solid fa-plus me-2"></i> Agregar al carrito
                        </button>
                    </div>
                </div>
            </article>
        )
    );
};

export default Tarjeta;
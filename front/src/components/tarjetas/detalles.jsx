import { useState, useContext } from 'react';
import { CarritoContext } from '@/context/carritoContext';
import { toast } from 'react-toastify';
import SelectorTalle from '@/components/tarjetas/selectorTalle';
import BotonPrimario from '@/components/botones/botonPrimario';
import imagenNoDisponible from '@/assets/img/tarjeta-alternativa.jpg';
import '@/components/tarjetas/tarjetas.css';

const Detalle = ({ titulo, talleUnico, talles, talleSeleccionado, setTalleSeleccionado, setMostrarDetalles, cantidadSeleccionada, setCantidadSeleccionada, agregarAlCarrito, ...rest }) => {

    return (
        <div className='detalleOverlay d-none d-md-block'>
            <article className='detalleArticle'>
                <div className='text-end w-100'>
                    <button
                        className='detalle-botonCerrar'
                        onClick={() => setMostrarDetalles(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className='detalleDiv d-flex bg-black'>
                    <div className='detalleDivFoto'>
                        <img
                            className='detalle-imagen'
                            src={rest.imagen ? rest.imagen : imagenNoDisponible}
                            alt={titulo} />
                    </div>
                    <div className='detalleDivInfo p-4 pt-3 d-flex flex-column align-items-center'>
                        <h2 className='detalle-titulo text-center'>{titulo}</h2>
                        <h4 className='text-warning text-center fw-bold mt-2'>{(rest.descuento && rest.descuento > 0) ? <><span className='tarjeta-precio anterior text-white fw-light'>{`ARS ${rest.precio}`}</span><span> </span>{`ARS ${rest.precio*(1-rest.descuento/100)}`}</> : `ARS ${rest.precio}`}</h4>
                        <div className='d-flex mt-3'>
                            <div className='d-flex'>
                                <label className='form-label me-2'>Cantidad:</label>
                                <input
                                    className='form-control detalle-cantidad me-2'
                                    type="number"
                                    value={cantidadSeleccionada}
                                    min={1}
                                    onChange={e => setCantidadSeleccionada(parseInt(e.target.value))}/>
                            </div>
                            <SelectorTalle
                                uuid={rest.uuid}
                                stock={rest.stock}
                                talles={talles}
                                talleSeleccionado={talleSeleccionado}
                                setTalleSeleccionado={setTalleSeleccionado}
                                talleUnico={talleUnico} />
                        </div>
                        <BotonPrimario
                            type='button'
                            claseAdicional='m-4'
                            texto='Agregar al carrito'
                            accion={() => agregarAlCarrito(rest.uuid, talleSeleccionado, cantidadSeleccionada)}/>
                    
                    {(rest.tipo === 'remera' || rest.tipo =='buzo') &&
                        <div className='d-flex flex-column align-items-center'>
                            <table className='detalle-tablaTalles table-bordered'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>XS</th>
                                        <th>S</th>
                                        <th>M</th>
                                        <th>L</th>
                                        <th>XL</th>
                                        <th>XXL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>A*</th>
                                        <td>44</td>
                                        <td>48</td>
                                        <td>50</td>
                                        <td>54</td>
                                        <td>58</td>
                                        <td>62</td>
                                    </tr>
                                    <tr>
                                        <th>L*</th>
                                        <td>64</td>
                                        <td>68</td>
                                        <td>72</td>
                                        <td>76</td>
                                        <td>78</td>
                                        <td>80</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className='texto-chico text-warning mb-0'>* A: ancho del pecho, L: largo del frente (en cm)</p>
                        </div>}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default Detalle;
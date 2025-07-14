import { useEffect, useContext } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import axios from 'axios';
import '@/pages/css/alta.css';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import useFormulario from '@/hooks/useFormulario';

const Alta = () => {
    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);

    // Definición de tipos de producto y talles
    const tiposProducto = ['remera', 'buzo', 'mochila', 'otro']
    const talles = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Gestión de datos del formulario
    const enviarDatos = (datos) => {
        console.log(datos);
    }

    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(enviarDatos);

    // Para indicar que el stock es por talle al seleccionar remera o buzo
    useEffect(() => {
        if (inputs.tipo === 'remera' || inputs.tipo === 'buzo') { setInputs((values) => ({ ...values, porTalle: true })); } else setInputs((values) => ({ ...values, porTalle: false }));
    }, [inputs.tipo]);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Alta de producto</h1>
            <section className='text-white mt-4'>
                <form onSubmit={gestionEnvio} className='mt-4 mb-5'>
                    <div className='alta-div pt-4 pb-5'>
                        <article className='alta-article mb-2'>
                        <label htmlFor="banda" className="alta-label form-label ps-2 mb-0 mt-2">Artista / banda:</label>
                        <input
                            className="alta-input form-control"
                            type="text"
                            name="banda"
                            minLength={3}
                            maxLength={50}
                            value={inputs.banda}
                            onChange={gestionIngreso}
                            required />
                        </article>
                        <article className='alta-article mb-3'>
                            <label htmlFor="tipo" className="alta-label form-label ps-2 mb-0">Tipo de producto:</label>
                            <select
                                className='alta-input form-control'
                                name="tipo"
                                id="tipo"
                                defaultValue={""}
                                value={inputs.tipo}
                                onChange={gestionIngreso}
                                required>
                                <option value="" disabled>Seleccionar</option>
                                {tiposProducto.map((tipo) => (
                                    <option value={tipo} key={tipo}>
                                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </article>
                        <article className='alta-article mb-3'>
                            <label htmlFor="stockU" className="alta-label me-2">Stock:</label>
                            <input
                                className="alta-input me-4"
                                type="number"
                                name="stockU"
                                min={0}
                                max={50000}
                                value={inputs.stockU}
                                onChange={gestionIngreso}
                                disabled={inputs.porTalle} />
                            
                            <input
                                className='me-2'
                                type="checkbox"
                                name='porTalle'
                                id='porTalle'
                                checked={inputs.porTalle || false}
                                onChange={(e) => setInputs((values) => ({ ...values, porTalle: e.target.checked }))} />
                            <label htmlFor="porTalle">Stock por talle</label>    
                        </article>
                        {inputs.porTalle && 
                            <div className='alta-stockConTallesDiv'>
                                {talles.map((talle) => (
                                    <article className='alta-article mb-3' key={talle}>
                                        <label htmlFor={`stock${talle}`} className="alta-label form-label me-2">{talle}</label>
                                        <input
                                            className="alta-input me-4"
                                            type="number"
                                            name={`stock${talle}`}
                                            min={0}
                                            max={50000}
                                            value={inputs[`stock${talle}`]}
                                            onChange={gestionIngreso} />
                                    </article>
                                ))}
                            </div>
                        }

                        <div className='alta-precioDiv'>
                            <article className='alta-article mb-3'>
                                <label htmlFor="precio" className="alta-label form-label me-2">Precio: ARS</label>
                                <input
                                    className="alta-input me-4"
                                    type="number"
                                    name="precio"
                                    min={1}
                                    max={100000000}
                                    value={inputs.precio}
                                    onChange={gestionIngreso}
                                    required />
                            </article>
                            <article className='alta-article mb-3'>    
                                <input
                                    className='me-2'
                                    type="checkbox"
                                    name='siDescuento'
                                    id='siDescuento'
                                    onChange={(e) => setInputs((values) => ({ ...values, siDescuento: e.target.checked }))}/>
                                <label htmlFor="siDescuento">Aplicar descuento:
                                </label>
                                <label htmlFor="descuento" className="alta-label form-label">
                                <input
                                        className="alta-input"
                                        type="number"
                                        name="descuento"
                                        min={1}
                                        max={100}
                                        value={inputs.descuento}
                                        onChange={gestionIngreso}
                                        disabled={!inputs.siDescuento} /> %
                                </label>
                            </article>
                        </div>

                        {inputs.descuento && inputs.precio &&
                            <p>
                                (Precio final: <b>ARS {((1 - (inputs.descuento / 100)) * inputs.precio).toFixed(0)})</b>
                            </p>
                        }
                        
                        <article className='alta-article mb-2'>
                            <label htmlFor="imagen" className="alta-label form-label ps-2 mb-0 mt-2">Imagen:</label>
                            <input
                                className="alta-input form-control"
                                type="file"
                                name="imagen"
                                value={inputs.imagen}
                                onChange={gestionIngreso} />
                                <p>(Solo archivos jpg. La proporción de la imagen debe ser cercana a 1:1)</p>
                        </article>

                        <article className='alta-article'>
                            <input type="checkbox" name='destacado' id='destacado' />
                            <label htmlFor="destacado" className="alta-label">Marcar como destacado</label>
                            <p>(Los productos destacados se muestran en la página principal)</p>
                        </article>
                    </div>
                    <article className="text-center mt-5">
                        <BotonPrimario tipo='submit' texto={<><span>Agregar </span><i className="fa-solid fa-plus"></i></>} claseAdicional='me-2' />
                        <BotonSecundario tipo='reset' texto={<><span>Cancelar </span><i className="fa-solid fa-xmark"></i></>} claseAdicional='ms-2' />
                    </article>
                </form>
            </section>
        </main>
    );
};

export default Alta;
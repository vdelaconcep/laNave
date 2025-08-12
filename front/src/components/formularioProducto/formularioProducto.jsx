import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { altaProducto, actualizarProducto, eliminarProducto } from '@/services/productoService';
import useFormulario from '@/hooks/useFormulario';
import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonEliminar from '@/components/botones/botonEliminar';
import '@/components/formularioProducto/formularioProducto.css';

const FormularioProducto = ({ producto, accion, setProductoAEditar, obtenerProductos }) => {

    // Definición de tipos de producto y talles
    const tiposProducto = ['remera', 'buzo', 'mochila', 'varios']
    const talles = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Gestión de datos del formulario

    // Valores iniciales
    let estadoInicial

    if (accion === 'alta') {
        estadoInicial = {
            banda: '',
            tipo: '',
            tipoVarios: '',
            U: '',
            precio: '',
            descuento: '',
            porTalle: false,
            siDescuento: false,
            imagen: null,
            ...talles.reduce((acc, talle) => ({ ...acc, [talle]: '' }), {})
        };
    }

    if (accion === 'actualizacion') {
        let tipoInicial = '';
        let tipoVariosInicial = '';
        let porTalleInicial = false;
        let stockUnicoInicial = '';
        let descuentoInicial = '';
        let siDescuentoInicial = false;

        if (!['remera', 'buzo', 'mochila'].includes(producto.tipo)) {
            tipoInicial = 'varios';
            tipoVariosInicial = producto.tipo
        } else tipoInicial = producto.tipo;

        if ('U' in producto.stock) {
            stockUnicoInicial = producto.stock.U
        } else {
            porTalleInicial = true
        };

        if (!producto.descuento || producto.descuento === 0) {
            descuentoInicial = '';
        } else {
            descuentoInicial = producto.descuento;
            siDescuentoInicial = true;
        };

        const stockPorTalleInicial = talles.reduce((acc, talle) => ({
            ...acc,
            [talle]: talle in producto.stock ? producto.stock[talle] : ''
        }), {});

        estadoInicial = {
            banda: producto.banda,
            tipo: tipoInicial,
            tipoVarios: tipoVariosInicial,
            U: stockUnicoInicial,
            precio: producto.precio,
            descuento: descuentoInicial,
            porTalle: porTalleInicial,
            siDescuento: siDescuentoInicial,
            imagen: null,
            ...stockPorTalleInicial
        } 
    }

    const inputFileRef = useRef();

    const [cargandoEnvio, setCargandoEnvio] = useState(false);

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');

    const headers = { 'Content-Type': 'multipart/form-data' };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const enviarDatos = async (datos) => {

        // Si tipo = 'varios'
        let tipoAEnviar
        if (datos.tipo === 'varios') {
            if (!datos.tipoVarios) {
                return toast.warning('Se debe indicar descripción del producto');
            } else tipoAEnviar = datos.tipoVarios;
        } else tipoAEnviar = datos.tipo

        // Verificación de stock (en talle único o en al menos un talle)
        const stockAEnviar = {};

        if (!datos.porTalle) {
            if (!datos.U) {
                return toast.warning("Se debe indicar el stock");
            } else stockAEnviar.U = Number(datos.U);
        } else {
            if (!talles.some(talle => datos[talle])) {
                return toast.warning("Se debe indicar stock en al menos un talle");
            } else {
                talles.forEach(talle => {
                    if (datos[talle]) stockAEnviar[talle] = Number(datos[talle]);
                });
            };
        };
        
        // Verificación de descuento (si se indica)
        if (datos.siDescuento) {
            if (!datos.descuento) return toast.warning("Se debe indicar descuento")
        } else datos.descuento = 0;
        
        // Armado de datos a enviar al backend
        const formData = new FormData();

        formData.append('banda', datos.banda);
        formData.append('tipo', tipoAEnviar);
        formData.append('stock', JSON.stringify(stockAEnviar));

        formData.append('precio', Number(datos.precio));
        formData.append('descuento', Number(datos.descuento));

        datos.imagen && formData.append('imagen', datos.imagen);
        
        try {
            // Envío de datos
            setCargandoEnvio(true);

            const res = accion === 'alta'
                ? await altaProducto(formData, headers)
                : await actualizarProducto(producto.uuid, formData, headers)

            if (res.status !== 200) return toast.error(`Error al ${accion === 'alta' ? 'ingresar' : 'actualizar'} el producto: ${res.statusText}`);

            // Limpiar formulario
            if (accion === 'alta') {
                setInputs(estadoInicial);
                inputFileRef.current.value = '';
            }
            
            if (accion === 'actualizacion') {
                setProductoAEditar(null);
                obtenerProductos();
            }

            return toast.success(`El producto "${(tipoAEnviar[0].toUpperCase() + tipoAEnviar.slice(1))} ${datos.banda}" ${accion === 'alta' ? 'se ha ingresado' : 'ha sido actualizado'} con éxito`);
        } catch (err) {
            return toast.error(`Error al ${accion === 'alta' ? 'ingresar' : 'actualizar'} el producto: ${err.response.data.error}`);
        } finally {
            setCargandoEnvio(false);
        };
    };

    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(enviarDatos);

    useEffect(() => {
        setInputs(estadoInicial);
    }, []);

    // Para indicar que el stock es por talle al seleccionar remera o buzo
    useEffect(() => {
        if (inputs.tipo === 'remera' || inputs.tipo === 'buzo') setInputs((values) => ({ ...values, porTalle: true }));
    }, [inputs.tipo]);

    // Para eliminar el producto de la base de datos
    const [cargandoEliminacion, setCargandoEliminacion] = useState(false);

    const eliminarProductoPorId = async () => {
        const confirmacion = confirm(`¿Desea eliminar "${producto.tipo[0].toUpperCase() + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}" de la base de datos?`);
        if (!confirmacion) return;

        try {
            setCargandoEliminacion(true);

            const res = await eliminarProducto(producto.uuid, headers)

            if (res.status !== 200 && res.status !== 204) return toast.error(`Error al eliminar el producto: ${res.statusText}`);

            toast.info(`El producto "${producto.tipo[0].toUpperCase() + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}" ha sido eliminado`);
            
            setProductoAEditar(null); 
            return obtenerProductos();
        } catch (err) {
            return toast.error(`Error al eliminar el producto: ${err.response.data.error}`);
        } finally {
            setCargandoEliminacion(false);
        }

    };

    return (
        <form onSubmit={gestionEnvio} className='mt-4 mb-5'>
            <div className={`formProducto-div pt-3 pb-3 m-3 ${location.pathname === '/productosAdmin' && 'borde-claro'} ${location.pathname === '/alta' && 'formulario-alta'}`}>
                <article className='formProducto-article mb-2 ps-4 pe-4'>
                    <label htmlFor="banda" className="formProducto-label form-label ps-2 mb-0 mt-2">Artista / banda:</label>
                    <input
                        className="formProducto-input form-control"
                        type="text"
                        name="banda"
                        minLength={3}
                        maxLength={50}
                        value={inputs.banda}
                        onChange={gestionIngreso}
                        required />
                </article>
                <article className='formProducto-article mb-2 ps-4 pe-4'>
                    <label htmlFor="tipo" className="formProducto-label form-label ps-2 mb-0">Tipo de producto:</label>
                    <select
                        className='formProducto-input form-control'
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
                <article className='formProducto-article mb-4 ps-4 pe-4'>
                    <label htmlFor="tipoVarios" className="formProducto-label form-label ps-2 mb-0">Detalle:</label>
                    <input
                        className='formProducto-input form-control'
                        name="tipoVarios"
                        placeholder='ej: pañuelo, cadena...'
                        value={inputs.tipoVarios}
                        onChange={gestionIngreso}
                        disabled={inputs.tipo !== 'varios'}
                        required />
                </article>
                <article className='formProducto-article stock mb-3 ps-4 pe-4'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <label htmlFor="U" className="formProducto-label p-2">Stock:</label>
                        <input
                            className="formProducto-input text-center w-75"
                            type="number"
                            name="U"
                            placeholder='(Talle único)'
                            min={0}
                            max={50000}
                            value={inputs.U}
                            onChange={gestionIngreso}
                            disabled={inputs.porTalle} />
                    </div>
                    <div className='d-flex align-items-center'>
                        <input
                            className='me-2 ms-3'
                            type="checkbox"
                            name='porTalle'
                            id='porTalle'
                            checked={inputs.porTalle || false}
                            onChange={(e) => setInputs((values) => ({ ...values, porTalle: e.target.checked }))} />
                        <label htmlFor="porTalle">Stock por talle</label>
                    </div>
                </article>
                {inputs.porTalle &&
                    <article className='formProducto-article stockConTalles pt-2 pb-2 ps-0 pe-4 p-sm-2 pe-sm-4 mb-4'>
                        {talles.map((talle) => (
                            <div className='mt-2 mb-2' key={talle}>
                                <label htmlFor={talle} className="formProducto-label form-label me-2 d-block d-sm-inline">{talle}:</label>
                                <input
                                    className="formProducto-input talle text-center me-0 me-sm-4 d-block d-sm-inline"
                                    type="number"
                                    name={talle}
                                    min={0}
                                    max={50000}
                                    value={inputs[talle]}
                                    onChange={gestionIngreso} />
                            </div>
                        ))}
                    </article>
                }

                <article className='formProducto-article precio mb-2 ps-4 pe-4'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <label htmlFor="precio" className="formProducto-label p-2">Precio:</label>
                        <input
                            className="formProducto-input text-center w-75"
                            type="number"
                            name="precio"
                            placeholder='(ARS)'
                            min={1}
                            max={100000000}
                            value={inputs.precio}
                            onChange={gestionIngreso}
                            required />
                    </div>
                    <div className='d-flex align-items-center'>
                        <input
                            className='me-2 ms-3'
                            type="checkbox"
                            name='siDescuento'
                            id='siDescuento'
                            checked={inputs.siDescuento || false}
                            onChange={(e) => setInputs((values) => ({ ...values, siDescuento: e.target.checked }))} />
                        <label htmlFor="siDescuento">Aplicar descuento
                        </label>
                    </div>
                </article>
                {inputs.siDescuento &&
                    <article className='formProducto-article descuento d-flex flex-column flex-sm-row align-items-center  justify-content-start justify-sm-content-between p-2 ps-4 pe-4'>
                        <div>
                            <label htmlFor="descuento" className='p-2'>Descuento:
                            </label>
                            <input
                                className="formProducto-input descuento text-center"
                                type="number"
                                name="descuento"
                                min={1}
                                max={100}
                                value={inputs.descuento}
                                onChange={gestionIngreso}
                                disabled={!inputs.siDescuento} />
                            <span className='ms-1'>%</span>
                        </div>
                        {inputs.descuento && inputs.precio &&
                            <p className='d-inline ms-2 ms-sm-4 me-2 mb-0'>
                                (Precio final: <b>ARS {((1 - (inputs.descuento / 100)) * inputs.precio).toFixed(0)})</b>
                            </p>
                        }
                    </article>
                }
                <article className='formProducto-article mb-2 ps-4 pe-4'>
                    <label htmlFor="imagen" className="formProducto-label form-label ps-2 mb-0 mt-2">Imagen:</label>
                    <input
                        ref={inputFileRef}
                        className="formProducto-input form-control"
                        type="file"
                        name="imagen"
                        accept="image/jpeg"
                        onChange={(e) => {
                            const archivo = e.target.files[0];
                            setInputs((values) => ({ ...values, imagen: archivo }));
                        }} />
                    <p className='formProducto-textoP text-warning mt-1'>{`${accion === 'actualizacion' ? 'Subir nuevo archivo para cambiar la imagen del producto ' : ''}(Solo archivos jpg. La proporción de la imagen debe ser cercana a 1:1)`}</p>
                </article>

            </div>
            
            <div className={`d-flex mt-3 ms-3 me-3 ${accion === 'alta' ? 'justify-content-center' : 'justify-content-between'}`} style={{maxWidth: '600px'}}>
            {accion === 'actualizacion' &&
                    <BotonEliminar
                        textoAdicional='producto'
                        tipo='button'
                        accion={() => eliminarProductoPorId()} />}
            
            <article className="text-center">
                <BotonSecundario
                    tipo={accion === 'alta' ? 'reset' : 'button'}
                        texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>}
                    claseAdicional='me-2'
                    accion={accion === 'actualizacion' ? () => setProductoAEditar(null) : null} />
                <BotonPrimario
                    tipo='submit'
                        texto={accion === 'alta' ? (cargandoEnvio ? <><span> Agregando... </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-plus"></i><span> Agregar</span></>) : (cargandoEnvio ? <><span>Actualizando... </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-check"></i><span> Enviar</span></>)} claseAdicional='ms-2' />
                
            </article>
            </div>
        </form>
    );
};

export default FormularioProducto;
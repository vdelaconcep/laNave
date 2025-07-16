import { useState, useRef, useEffect, useContext } from 'react';
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

    // Valores iniciales
    const estadoInicial = {
        banda: '',
        tipo: '',
        U: '',
        precio: '',
        descuento: '',
        destacado: false,
        porTalle: false,
        siDescuento: false,
        imagen: null,
        ...talles.reduce((acc, talle) => ({ ...acc, [talle]: '' }), {})
    };

    const inputFileRef = useRef();

    const [cargando, setCargando] = useState(false);

    const enviarDatos = async (datos) => {

        // Verificación de stock (en talle único o en al menos un talle)
        const stockAEnviar = {};

        if (!datos.porTalle) {
            if (!datos.U) {
                return alert("Se debe indicar el stock");
            } else stockAEnviar.U = datos.U;
        } else {
            if (!talles.some(talle => datos[talle])) {
                return alert("Se debe indicar stock en al menos un talle");
            } else {
                talles.map((talle) => {
                    if (datos[talle]) stockAEnviar[talle] = datos[talle];
                });
            };
        };
        
        // Verificación de descuento (si se indica)
        if (datos.siDescuento) {
            if (!datos.descuento) return alert("Se debe indicar descuento");
        } else datos.descuento = 0;
        
        // Armado de datos a enviar al backend
        const formData = new FormData();

        formData.append('banda', datos.banda);
        formData.append('tipo', datos.tipo);
        formData.append('stock', JSON.stringify(stockAEnviar));

        formData.append('precio', datos.precio);
        formData.append('descuento', datos.descuento);
        formData.append('destacado', datos.destacado === true);

        datos.imagen && formData.append('image', datos.imagen);
        
        try {
            // Envío de datos (con token para tener permisos de administrador)
            setCargando(true);

            const token = localStorage.getItem('token');

            const headers = { 'Content-Type': 'multipart/form-data' };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/productos/alta`, formData, {headers});

            if (res.status !== 200) return alert(`Error al ingresar el producto: ${res.statusText}`);

            // Limpiar formulario
            setInputs(estadoInicial);
            inputFileRef.current.value = '';

            return alert('El producto se ha ingresado con éxito');
        } catch (err) {
            return alert(`Error al ingresar el producto: ${err.response.data.error}`);
        } finally {
            setCargando(false);
        };
    };

    const { inputs, gestionIngreso, gestionEnvio, setInputs } = useFormulario(enviarDatos);

    useEffect(() => {
        setInputs(estadoInicial);
    }, []);

    // Para indicar que el stock es por talle al seleccionar remera o buzo
    useEffect(() => {
        if (inputs.tipo === 'remera' || inputs.tipo === 'buzo') { setInputs((values) => ({ ...values, porTalle: true })); } else setInputs((values) => ({ ...values, porTalle: false }));
    }, [inputs.tipo]);

    return (
        <main>
            <h1 className="pagina-titulo text-white text-center">Alta de producto</h1>
            <section className='text-white mt-2'>
                <form onSubmit={gestionEnvio} className='mt-4 mb-5'>
                    <div className='alta-div pt-4 pb-4 m-3'>
                        <article className='alta-article mb-2 ps-4 pe-4'>
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
                        <article className='alta-article mb-4 ps-4 pe-4'>
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
                        <article className='alta-article stock mb-3 ps-4 pe-4'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="U" className="alta-label p-2">Stock:</label>
                                <input
                                    className="alta-input text-center w-75"
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
                            <article className='alta-article stockConTalles p-2 ps-0 pe-0 pe-sm-4 mb-4'>
                                {talles.map((talle) => (
                                    <div className='mt-2 mb-2' key={talle}>
                                        <label htmlFor={talle} className="alta-label form-label me-2 d-block d-sm-inline">{talle}:</label>
                                        <input
                                            className="alta-input talle text-center me-0 me-sm-4 d-block d-sm-inline"
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

                        <article className='alta-article precio mb-3 ps-4 pe-4'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="precio" className="alta-label p-2">Precio:</label>
                                <input
                                    className="alta-input text-center w-75"
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
                                    onChange={(e) => setInputs((values) => ({ ...values, siDescuento: e.target.checked }))}/>
                                <label htmlFor="siDescuento">Aplicar descuento
                                </label>
                            </div>
                        </article>
                        {inputs.siDescuento &&
                            <article className='alta-article descuento d-flex flex-column flex-sm-row align-items-center  justify-content-start justify-sm-content-between p-2 ps-4 pe-4'>
                                <div>
                                    <label htmlFor="descuento" className='p-2'>Descuento:
                                    </label>
                                        <input
                                            className="alta-input descuento text-center"
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
                        <article className='alta-article mb-2 ps-4 pe-4'>
                            <label htmlFor="imagen" className="alta-label form-label ps-2 mb-0 mt-2">Imagen:</label>
                            <input
                                ref={inputFileRef}
                                className="alta-input form-control"
                                type="file"
                                name="imagen"
                                accept="image/jpeg"
                                onChange={(e) => {
                                    const archivo = e.target.files[0];
                                    setInputs((values) => ({ ...values, imagen: archivo }));
                                }} />
                            <p className='alta-textoP mt-1'>(Solo archivos jpg. La proporción de la imagen debe ser cercana a 1:1)</p>
                        </article>

                        <article className='alta-article ps-4 pe-4'>
                            <input
                                className='me-2'
                                type="checkbox"
                                name='destacado'
                                id='destacado'
                                checked={inputs.destacado || false}
                                onChange={(e) => setInputs((values) => ({ ...values, destacado: e.target.checked }))}/>
                            <label htmlFor="destacado" className="alta-label">Marcar como destacado</label>
                            <p className='alta-textoP'>(Los productos destacados se muestran en la página principal)</p>
                        </article>
                    </div>
                    <article className="text-center mt-5">
                        <BotonPrimario
                            tipo='submit'
                            texto={cargando ? <><span>Agregando... </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><span>Agregar </span><i className="fa-solid fa-plus"></i></>} claseAdicional='me-2' />
                        <BotonSecundario tipo='reset' texto={<><span>Cancelar </span><i className="fa-solid fa-xmark"></i></>} claseAdicional='ms-2' />
                    </article>
                </form>
            </section>
        </main>
    );
};

export default Alta;
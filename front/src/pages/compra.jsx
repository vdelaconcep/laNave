import { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundContext } from '@/context/backgroundContext';
import { CarritoContext } from '@/context/carritoContext';
import { obtenerProducto } from '@/services/productoService';
import { compra } from '@/services/compraService';
import { buscarCodigo } from '@/services/codigoService';
import { listarProvincias, listarDepartamentos, listarLocalidades } from '../services/envioService';
import { toast } from 'react-toastify';
import Confirm from '@/components/emergentes/confirm';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';
import '@/pages/css/compra.css';


const Compra = () => {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const { setBackground } = useContext(BackgroundContext);
    
    useEffect(() => {
        setBackground('bg-carrito');
        return () => setBackground('');
    }, []);

    const navigate = useNavigate();

    // Ídem página carrito, se trae una lista con el detalle de los productos
    const { carrito, setCarrito } = useContext(CarritoContext);
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Estados para utilizar el confirm
    const [pregunta, setPregunta] = useState('');
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);

    // Componentes del total a pagar
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalEnvio, setTotalEnvio] = useState(0);

    // Mostrar u ocultar
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const [entrega, setEntrega] = useState('');
    const [modoPago, setModoPago] = useState('');

    // Para datos de envío
    const [provincias, setProvincias] = useState([]);
    const [cargandoProvincias, setCargandoProvincias] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [cargandoDepartamentos, setCargandoDepartamentos] = useState(false);
    const [localidades, setLocalidades] = useState([]);
    const [cargandoLocalidades, setCargandoLocalidades] = useState(false);

    const [datosEnvio, setDatosEnvio] = useState({
        calle: '',
        numero: '',
        pisoDto: '',
        provincia: '',
        departamento: '',
        localidad: '',
        cp: ''
    });

    const partidosZonaSur = ['Almirante Brown', 'Avellaneda', 'Berazategui', 'Esteban Echeverría', 'Ezeiza', 'Florencio Varela', 'Lanús', 'Lomas de Zamora', 'Quilmes'];

    // Obtiene información completa sobre un producto desde el backend (para armar lista)
    const obtenerPorId = async (id) => {
        try {
            const res = await obtenerProducto('id', id);

            if (res.status !== 200) {
                toast.error(`Error al obtener datos del producto: ${res.statusText}`);
                return null;
            }
            return res.data;
        } catch (err) {
            toast.error(`Error al obtener datos del producto: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
            return null;
        }
    };

    // Arma lista para mostrar detalle de la compra
    const hacerLista = async () => {

    const carritoProductos = carrito.filter(item => item.hasOwnProperty('cantidad'));
    const carritoDescuento = carrito.filter(item => item.hasOwnProperty('codigo'));
    const listaFinal = [];
    let precioSumado = 0;

    for (let producto of carritoProductos) {
        const productoBD = await obtenerPorId(producto.id);
        if (!productoBD) {
            toast.error('No se puede acceder a los datos de los productos en este momento. Intentá más tarde');
            navigate('/');
            return null;
        };
        const talle = producto.talle === '' ? 'U' : producto.talle;

        if (producto.cantidad > productoBD.stock[talle]) {
            toast.info(`El ítem solicitado no tiene suficiente stock ${talle !== 'U' ? 'en el talle requerido' : ''}`);
            navigate('/carrito');
            return null;
        }

        let porCodigo = 0;
        if (carritoDescuento && carritoDescuento.length > 0) {
            
            try {
                const res = await buscarCodigo(carritoDescuento[0].codigo);
                if (res.status === 200) {
                    let aplicaBanda = false;
                    let aplicaTipo = false;

                    if (res.data.tipoProducto === 'todo') {
                        aplicaTipo = true;
                    } else aplicaTipo = res.data.tipoProducto === productoBD.tipo

                    if ('banda' in res.data &&
                        typeof res.data.banda === 'string' && res.data.banda.trim().length > 0) {
                        aplicaBanda = productoBD.banda.toLowerCase().includes(res.data.banda.toLowerCase());
                    } else aplicaBanda = true;

                    if (aplicaBanda && aplicaTipo) porCodigo = res.data.descuento;

                } else toast.error(`No se aplicó el código de descuento: ${res.statusText}`)
            } catch (err) {
                toast.error(`No se aplicó el código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
            }
        }

        if (producto.cantidad > 0) {
            const aMostrar = {
                id: producto.id,
                talle: producto.talle,
                cantidad: producto.cantidad,
                stock: producto.talle ? productoBD.stock[producto.talle] : productoBD.stock['U'],
                tipo: productoBD.tipo,
                banda: productoBD.banda,
                modelo: productoBD.modelo,
                precio: productoBD.precio,
                descuento: productoBD.descuento,
                porCodigo: porCodigo
            };
            listaFinal.push(aMostrar);
            precioSumado += aMostrar.precio * aMostrar.cantidad * (1-aMostrar.descuento/100) * (1-aMostrar.porCodigo/100)
        };
    }
    setTotalProductos(precioSumado);
    return listaFinal;
    }

    // Devuelve lista de provincias de la API Georef
    const obtenerProvincias = async () => {
        try {
            const res = await listarProvincias();
            if (res.status !== 200) {
                toast.error(`Error al cargar las provincias: ${res.statusText}`);
                return null;
            }

            const provincias = res.data.provincias
            return provincias.sort((a,b) => a.nombre.localeCompare(b.nombre))
        } catch (err) {
            toast.error(`Error al cargar provincias: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
            return null;
        }
    }

    // Devuelve lista de partidos/ departamentos según provincia elegida
    const obtenerDepartamentos = async () => {

        const provinciaElegida = provincias.find(provincia => provincia.nombre === datosEnvio.provincia);
        const idProvincia = provinciaElegida ? provinciaElegida.id : '06';

        try {
            const res = await listarDepartamentos(idProvincia);

            if (res.status !== 200) {
                toast.error(`Error al cargar los departamentos: ${res.statusText}`);
                return null;
            }

            const departamentos = res.data.departamentos.map(dep => ({
                id: dep.id,
                nombre: dep.nombre
            }));

            return departamentos.sort((a,b) => a.nombre.localeCompare(b.nombre))
        } catch (err) {
            toast.error(`Error al cargar departamentos: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
            return null;
        }
    }

    // Devuelve lista de localidades según partido/ departamento y provincia
    const obtenerLocalidades = async () => {
        const provinciaElegida = provincias.find(provincia => provincia.nombre === datosEnvio.provincia);
        const idProvincia = provinciaElegida ? provinciaElegida.id : '06';

        const deptoElegido = departamentos.find(depto => depto.nombre === datosEnvio.departamento);
        const idDepto = deptoElegido ? deptoElegido.id : datosEnvio.departamento

        try {
            const res = await listarLocalidades(idProvincia, idDepto);
            if (res.status !== 200) {
                toast.error(`Error al cargar los localidades: ${res.statusText}`);
                return null;
            }

            const localidades = res.data.localidades.map(loc => ({
                id: loc.id,
                nombre: loc.nombre
            }));

            return localidades.sort((a,b) => a.nombre.localeCompare(b.nombre))
        } catch (err) {
            toast.error(`Error al cargar localidades: ${err.response?.data?.error || err.message || 'Error desconocido'}`)
            return null;
        }
    }

    // Devuelve costo de envío según dirección ingresada
    const calcularEnvio = () => {
        const provinciaElegida = provincias.find(provincia => provincia.nombre === datosEnvio.provincia);
        if (!provinciaElegida || provinciaElegida.length === 0) return null;

        const idProvincia = provinciaElegida.id;
        let costoEnvio;
        if (idProvincia === '06') {
            costoEnvio = 4000;
        } else if (idProvincia === '02') {
            costoEnvio = 5000;
        } else if (['30', '18', '14', '42', '82'].includes(idProvincia)) {
            costoEnvio = 7000;
        } else if (['22', '26', '34', '50', '54', '58', '62', '74', '86', '90'].includes(idProvincia)) {
            costoEnvio = 9000;
        } else costoEnvio = 11000

        return costoEnvio;
    }

    const mostrarCostoEnvio = (e) => {
        e.preventDefault()
        const costoEnvio = calcularEnvio();
        setTotalEnvio(costoEnvio);
    }

    const cargarDepartamentos = async () => {
        setCargandoDepartamentos(true);
        const listaDepartamentos = await obtenerDepartamentos();
        if (listaDepartamentos) setDepartamentos(listaDepartamentos);
        setCargandoDepartamentos(false);
    }

    // Comprueba datos ingresados y prepara carrito para enviar al backend
    const confirmarCompra = () => {
        if (!entrega || entrega.length === 0) return toast.warning('Indicar forma de entrega');
        if (entrega === 'correo') {
            if (!datosEnvio.provincia || datosEnvio.provincia.length === 0 || !datosEnvio.cp || datosEnvio.cp.length === 0) return toast.warning('Completar datos para el envío');
        }
        if (!datosEnvio.calle || datosEnvio.calle.length === 0 || !datosEnvio.numero || datosEnvio.numero.length === 0 || !datosEnvio.departamento || datosEnvio.departamento.length === 0 || !datosEnvio.localidad || datosEnvio.localidad.length === 0) {
            if (entrega === 'moto') return toast.warning('Completar dirección para la entrega');
            if (entrega === 'correo') return toast.warning('Completar datos para el envío');
        }
        if (!modoPago || modoPago.length === 0) return toast.warning('Indicar forma de pago');

        const totalEnvioFinal = calcularEnvio();
        const totalProductosFinal = modoPago === 'transferencia' ? (totalProductos * 0.8) : totalProductos;

        let direccion = {};
        for (const key in datosEnvio) {
            if (datosEnvio.hasOwnProperty(key)) {
                const valor = datosEnvio[key];
                if (valor && valor !== undefined && valor.length > 0) direccion = {...direccion, [key]: valor}
            }
        } 

        let carritoActualizado = [];

        const carritoProductos = carrito
            .filter(item =>
                !item.hasOwnProperty('entrega') &&
                !item.hasOwnProperty('modoPago') &&
                !item.hasOwnProperty('usuario')
            )
            .map(item =>
                item.id
                    ? { ...item, talle: item.talle || 'U' }
                    : item
            );

        const carritoEntrega = [{
            entrega: {
                formaEntrega: entrega,
                direccion: direccion
            }
        }];
        const carritoModoPago = [{ modoPago: modoPago }];
        const carritoUsuario = [{ usuario: usuario.email }];

        carritoActualizado = [...carritoProductos, ...carritoEntrega, ...carritoModoPago, ...carritoUsuario];
        setCarrito(carritoActualizado);

        setPregunta(`Hacé click en "aceptar" para confirmar la compra (total a pagar: ${totalEnvioFinal + totalProductosFinal})`);
        setMostrarConfirm(true);
    }

    const comprar = async () => {
        try {
            const res = await compra(carrito);
            if (res.status !== 200) return toast.error(`Error al realizar la compra: ${res.statusText}`);

            const mail = res.data.venta.emailUsuario

            return toast.success(`Muchas gracias por comprar en La Nave Rockería! Te enviamos un correo a ${mail} con los detalles de tu pedido`);
        } catch (err) {
            return toast.error(`Error al realizar la compra: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        }
    }

    useEffect(() => {
        const cargarProvincias = async () => {
            setCargandoProvincias(true);
            const listaProvincias = await obtenerProvincias();
            if (listaProvincias) setProvincias(listaProvincias);
            setCargandoProvincias(false);
        }
        if (entrega === 'correo') cargarProvincias();
    }, [entrega]);

    useEffect(() => {
        if (entrega === 'correo' && datosEnvio.provincia.length > 0) cargarDepartamentos();
    }, [datosEnvio.provincia]);

    useEffect(() => {
        const cargarLocalidades = async () => {
            setCargandoLocalidades(true);
            const listaLocalidades = await obtenerLocalidades();
            if (listaLocalidades) setLocalidades(listaLocalidades);
            setCargandoLocalidades(false);
        }

        if ((entrega === 'correo' && datosEnvio.provincia.length > 0 && datosEnvio.departamento.length > 0) || (entrega === 'moto' && datosEnvio.departamento.length > 0)) {
            cargarLocalidades();
        }
    }, [datosEnvio.departamento]);

    useEffect(() => {
        const cargarLista = async () => {
            setCargando(true);
            const listaFinal = await hacerLista();
            if (listaFinal) setLista(listaFinal);
            setCargando(false);
        };
        cargarLista();
    }, []);

    useEffect(() => {
        if (confirm) {
            setConfirm(false);
            comprar();
            setCarrito([]);
            navigate('/');
        }
    }, [confirm]);

    // Condición para habilitar el botón "calcular envío"
    const puedeCalcularEnvio =
        datosEnvio.calle.trim() !== '' &&
        datosEnvio.numero.trim() !== '' &&
        datosEnvio.provincia !== '' &&
        datosEnvio.departamento !== '' &&
        datosEnvio.localidad !== '' &&
        datosEnvio.cp.trim() !== '';

    return (<>
        <main>
            {(!usuario) ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás iniciar sesión para acceder</h4> :
                <>
                    <h1 className="pagina-titulo text-white text-center">Finalizá tu compra</h1>
                    <section className='compra-section aparecer container mt-2 mb-5 d-flex flex-column align-items-center'>
                        <article className='compraArticle p-3'>
                            {cargando ?
                                <h5 className='text-white text-center'><i className="fa-solid fa-spinner fa-spin"></i></h5> : `${(!lista || lista.length === 0) ? <h6 className='text-white text-center'>No hay productos en el carrito</h6> : ''}`}
                            {(!cargando && lista.length > 0) ?
                                <>
                            
                                    <div className='d-flex justify-content-between'>
                                        <h6 className='mb-3 text-warning'>Tu pedido: </h6>
                                        <h6 className='compraArticle-totalProductos text-warning mb-0'>
                                            {`ARS ${totalProductos}`}
                                        </h6>
                                    </div>
                                    <button
                                        className='compraArticle-botonMostrar'
                                        type='button'
                                        data-bs-toggle="collapse" data-bs-target="#collapseProductos" aria-expanded="false" aria-controls="collapseProductos"
                                        onClick={() => setMostrarDetalle(!mostrarDetalle)}>
                                        {mostrarDetalle ? <><span>Ocultar detalle </span><i className="fa-solid fa-chevron-up"></i></> : <><span>Ver detalle </span><i className="fa-solid fa-chevron-down"></i></>}
                                    </button>
                                    <div className='collapse mt-1' id='collapseProductos'>
                                        {lista.map((producto) => {
                                            const titulo = `${producto.tipo[0].toUpperCase() + producto.tipo.slice(1)} ${producto.banda} #${producto.modelo}`;
                                            const porCodigo = producto.porCodigo || 0;
                                            const descuento = producto.descuento || 0;

                                            return (
                                                <div
                                                    className='compraArticle-producto text-white pb-2'
                                                    key={producto.id}>
                                                    <div>
                                                        <p className='mb-0 text-info'><span className='text-decoration-underline'>{titulo}</span>{` ${producto.talle ? 'talle: ' + producto.talle : ''} (${producto.cantidad})`}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-end mb-0'>{`ARS ${(producto.precio * producto.cantidad * (1 - descuento / 100) * (1 - porCodigo / 100)).toFixed(0)}`}</p>
                                                        {(porCodigo !== 0 || descuento !== 0) ?
                                                            <p className='CompraArticle-precioAnterior text-decoration-line-through text-end mb-0'>{`ARS ${producto.precio * producto.cantidad}`}</p>
                                                            : ''

                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                                : ''}
                        </article>
                        <article className='compraArticle text-white p-3'>
                            <div className='d-flex justify-content-between'>
                                <h6 className='mb-3 text-warning'>Forma de entrega:</h6>
                        
                                <h6 className='compraArticle-totalProductos text-warning mb-0'>
                                    {(entrega === 'local' || entrega === 'moto') ? 'GRATIS' : ((entrega === 'correo' && totalEnvio > 0) ? `ARS ${totalEnvio}` : '')}
                                </h6>
                            </div>
                            <div className='mb-2 d-flex'>
                                <input
                                    type="radio"
                                    name='entrega'
                                    id='enLocal'
                                    value="local"
                                    onChange={(e) => setEntrega(e.target.value)} />
                                <label className='ms-2' htmlFor="enLocal">Retiro en local de Lomas de Zamora (Gratis)</label>
                            </div>
                            <div className='mb-2 d-flex'>
                                <input
                                    type="radio"
                                    name='entrega'
                                    id='enMoto'
                                    value="moto"
                                    onChange={(e) => setEntrega(e.target.value)} />
                                <label className='ms-2' htmlFor="enMoto">Envío en moto zona sur GBA (Gratis)</label>
                            </div>
                            {entrega === 'moto' && <div className='compraArticle-datosEnvio mt-2 mb-2 p-3'>
                                <p className='mb-0'>Dirección:</p>
                                <label className='form-label mb-0 mt-1 ps-2' htmlFor="calle" >Calle: </label>
                                <input
                                    className='envioInput form-control'
                                    type="text"
                                    maxLength={30}
                                    name='calle'
                                    value={datosEnvio.calle}
                                    onChange={e => setDatosEnvio(prev => ({ ...prev, calle: e.target.value }))} />
                                <div className='d-flex mt-0 mt-sm-3'>
                                    <div className='d-sm-flex me-2 me-sm-0'>
                                        <label className='form-label mb-0 mt-1 me-2 ps-2 ' htmlFor="numero" >N°</label>
                                        <input
                                            className='envioInput form-control me-2'
                                            style={{ maxWidth: '110px' }}
                                            type="number"
                                            maxLength={999999}
                                            name='numero'
                                            value={datosEnvio.numero}
                                            onChange={e => setDatosEnvio(prev => ({ ...prev, numero: e.target.value }))} />
                                    </div>
                                    <div className='d-sm-flex ms-2 ms-sm-0'>
                                        <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="pisoDto" >Piso/dto: </label>
                                        <input
                                            className='envioInput form-control'
                                            type="text"
                                            maxLength={15}
                                            name='pisoDto'
                                            value={datosEnvio.pisoDto}
                                            onChange={e => setDatosEnvio(prev => ({ ...prev, pisoDto: e.target.value }))} />
                                    </div>
                                </div>

                                <label className='form-label mb-0 mt-1 ps-2' htmlFor="partido" >Partido: </label>
                                <select
                                    className='envioInput form-control text-black'
                                    name="departamento"
                                    id="departamento"
                                    value={datosEnvio.departamento}
                                    onChange={e => setDatosEnvio(prev => ({ ...prev, departamento: e.target.value }))}
                                    required>
                                    <option value='' disabled>-Seleccionar-</option>
                                    {partidosZonaSur.map(partido =>
                                        <option
                                            value={partido}
                                            key={partido}>{partido}</option>
                                    )}
                                </select>
                        
                                <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >Localidad: </label>
                                <select
                                    className='envioInput form-control text-black'
                                    name="localidad"
                                    id="localidad"
                                    value={datosEnvio.localidad}
                                    onChange={e => setDatosEnvio(prev => ({ ...prev, localidad: e.target.value }))}
                                    required>
                                    <option value='' disabled>{cargandoLocalidades ? 'Cargando...' : '-Seleccionar-'}</option>
                                    {localidades.map(localidad =>
                                        <option
                                            value={localidad.nombre}
                                            key={localidad.id}>{localidad.nombre}</option>
                                    )}
                                </select>

                            </div>}
                            <div className='d-flex'>
                                <input
                                    type="radio"
                                    name='entrega'
                                    id='porCorreo'
                                    value="correo"
                                    onChange={(e) => setEntrega(e.target.value)} />
                                <label className='ms-2' htmlFor="porCorreo">Envío por correo</label>
                            </div>
                            {entrega === 'correo' && <div className='compraArticle-datosEnvio mt-2 p-3'>
                                <p className='mb-0'>Dirección:</p>
                                <form onSubmit={mostrarCostoEnvio}>
                                    <label className='form-label mb-0 mt-1 ps-2' htmlFor="calle" >Calle: </label>
                                    <input
                                        className='envioInput form-control'
                                        type="text"
                                        maxLength={40}
                                        minLength={1}
                                        name='calle'
                                        value={datosEnvio.calle}
                                        onChange={e => setDatosEnvio(prev => ({ ...prev, calle: e.target.value }))}
                                        required />
                                    <div className='d-flex mt-0 mt-sm-3'>
                                        <div className='d-sm-flex me-2 me-sm-0'>
                                            <label className='form-label mb-0 mt-1 me-2 ps-2 ' htmlFor="numero" >N°</label>
                                            <input
                                                className='envioInput form-control me-2'
                                                style={{ maxWidth: '110px' }}
                                                type="number"
                                                min={1}
                                                max={999999}
                                                name='numero'
                                                value={datosEnvio.numero}
                                                onChange={e => setDatosEnvio(prev => ({ ...prev, numero: e.target.value }))}
                                                required />
                                        </div>
                                        <div className='d-sm-flex ms-2 ms-sm-0'>
                                            <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="pisoDto" >Piso/dto: </label>
                                            <input
                                                className='envioInput form-control'
                                                type="text"
                                                maxLength={15}
                                                name='pisoDto'
                                                value={datosEnvio.pisoDto}
                                                onChange={e => setDatosEnvio(prev => ({ ...prev, pisoDto: e.target.value }))} />
                                        </div>
                                    </div>
                        
                                    <label className='form-label mb-0 mt-1 ps-2' htmlFor="provincia" >{datosEnvio.provincia === 'Ciudad Autónoma de Buenos Aires' ? 'Ciudad:' : 'Provincia: '}</label>
                                    <select
                                        className='envioInput form-control text-black'
                                        name="provincia"
                                        id="provincia"
                                        value={datosEnvio.provincia}
                                        onChange={e => setDatosEnvio(prev => ({ ...prev, provincia: e.target.value }))}
                                        required>
                                        <option value='' disabled>{cargandoProvincias ? 'Cargando...' : '-Seleccionar-'}</option>
                                        {provincias.map(provincia =>
                                            <option
                                                value={provincia.nombre}
                                                key={provincia.id}>{provincia.nombre}</option>
                                        )}
                                    </select>
                                    <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >{datosEnvio.provincia === 'Ciudad Autónoma de Buenos Aires' ? 'Comuna:' : 'Partido/ departamento: '} </label>
                                    <select
                                        className='envioInput form-control text-black'
                                        name="departamento"
                                        id="departamento"
                                        value={datosEnvio.departamento}
                                        onChange={e => setDatosEnvio(prev => ({ ...prev, departamento: e.target.value }))}
                                        required>
                                        <option value='' disabled>{cargandoDepartamentos ? 'Cargando...' : '-Seleccionar-'}</option>
                                        {departamentos.map(departamento =>
                                            <option
                                                value={departamento.nombre}
                                                key={departamento.id}>{departamento.nombre}</option>
                                        )}
                                    </select>
                                    <label className='form-label mb-0 mt-1 ps-2' htmlFor="localidad" >{datosEnvio.provincia === 'Ciudad Autónoma de Buenos Aires' ? 'Barrio:' : 'Localidad: '}</label>
                                    <select
                                        className='envioInput form-control text-black'
                                        name="localidad"
                                        id="localidad"
                                        value={datosEnvio.localidad}
                                        onChange={e => setDatosEnvio(prev => ({ ...prev, localidad: e.target.value }))}
                                        required>
                                        <option value='' disabled>{cargandoLocalidades ? 'Cargando...' : '-Seleccionar-'}</option>
                                        {localidades.map(localidad =>
                                            <option
                                                value={localidad.nombre}
                                                key={localidad.id}>{localidad.nombre}</option>
                                        )}
                                    </select>
                        
                                    <div className='d-sm-flex justify-content-between mt-sm-3'>
                                        <div className='d-sm-flex'>
                                            <label className='form-label mb-0 mt-1 me-2 ps-2' htmlFor="CP">CP: </label>
                                            <input
                                                className='envioInput form-control me-2'
                                                type="text"
                                                minLength={4}
                                                maxLength={10}
                                                name='CP'
                                                value={datosEnvio.cp}
                                                onChange={e => setDatosEnvio(prev => ({ ...prev, cp: e.target.value }))}
                                                required />
                                        </div>
                                        <div className='text-end'>
                                            <button
                                                type='submit'
                                                className='mt-4 mt-sm-0 p-1 rounded-3'
                                                disabled={!puedeCalcularEnvio}>
                                                Calcular costo
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>}
                        </article>
                        <article className='compraArticle text-white p-3'>
                            <div className='d-flex justify-content-between'>
                                <h6 className='mb-3 text-warning'>Forma de pago:</h6>

                                <h6 className='compraArticle-totalProductos text-warning mb-0'>
                                    {modoPago === 'transferencia' ? `ARS -${totalProductos * 0.2}` : ''}
                                </h6>
                            </div>
                            <div className='mb-2 d-flex'>
                                <input
                                    type="radio"
                                    name='modoPago'
                                    id='transferencia'
                                    value="transferencia"
                                    onChange={(e) => setModoPago(e.target.value)} />
                                <label className='ms-2' htmlFor="transferencia">{`${entrega === 'local' ? 'Efectivo o t' : 'T'}ransferencia bancaria (20% off)`}</label>
                            </div>
                            <div className='d-flex'>
                                <input
                                    type="radio"
                                    name='modoPago'
                                    id='conTarjeta'
                                    value="conTarjeta"
                                    onChange={(e) => setModoPago(e.target.value)} />
                                <label className='ms-2' htmlFor="conTarjeta">Con tarjeta (hasta 6 cuotas sin interés)</label>
                            </div>
                        </article>
                        <article className='compraArticle text-white p-3'>
                            <h5 className='text-end text-warning mb-0 fw-bold' style={{ textShadow: '0 0 5px gray' }}>{`TOTAL ARS ${modoPago === 'transferencia' ? ((totalProductos * 0.8) + totalEnvio) : totalEnvio + totalProductos}`}</h5>
                        </article>
                        <div className='mt-3 d-flex justify-content-end'>
                            <BotonSecundario
                                texto={<><i className="fa-solid fa-arrow-left"></i><span> Volver</span></>}
                                claseAdicional='me-2'
                                accion={() => navigate('/carrito')} />
                            <BotonPrimario
                                texto='Confirmar compra'
                                claseAdicional='ms-2'
                                accion={confirmarCompra} />
                        </div>
                    </section>
                    {mostrarConfirm ?
                        <Confirm
                            pregunta={pregunta}
                            setConfirm={setConfirm}
                            setMostrarConfirm={setMostrarConfirm}
                        /> : ''
                    }
                </>}
        </main>
    
    </>);
};

export default Compra;
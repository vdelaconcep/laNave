import { useEffect, useContext, useState } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import { generarCodigo, obtenerCodigos, eliminarCodigo } from '@/services/codigoService';
import Confirm from '@/components/emergentes/confirm';
import useFormulario from '@/hooks/useFormulario';
import formatearUTC from '@/utils/formatearUTC'
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';
import '@/pages/css/descuentos.css'

const Descuentos = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    // Fondo de pantalla de la sección
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        setBackground('bg-admin');
        return () => setBackground('');
    }, []);

    // Para obtener permisos de administrador
    const token = localStorage.getItem('token');

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Gestión de datos del formulario
    
    // Valores iniciales
    const estadoInicial = {
        codigo: '',
        descuento: '',
        tipoProducto: 'todo',
        banda: ''
    };
    
    const [cargando, setCargando] = useState(false);
    const [creando, setCreando] = useState(false);

    const [codigos, setCodigos] = useState([]);

    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [pregunta, setPregunta] = useState(false);
    const [codigoAEliminar, setCodigoAEliminar] = useState(null);

    const crearCodigo = async (datos) => {

        datos.creadoPor = usuario.nombreYApellido
    
        try {
            setCreando(true);
            const res = await generarCodigo(datos, headers);
    
            if (res.status !== 200) return toast.error(`Error al crear el código de descuento: ${res.statusText}`);
    
            setInputs(estadoInicial);
            traerCodigos();
            
            return toast.success('El código de descuento se generó con éxito');
        } catch (err) {
            return toast.error(`Error al crear el código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        } finally {
            setCreando(false);
        };
    };
    
    const { inputs, setInputs, gestionIngreso, gestionEnvio } = useFormulario(crearCodigo);

    const traerCodigos = async () => {
        try {
            setCargando(true);
            const res = await obtenerCodigos(headers);

            if (res.status !== 200) return toast.error(`Error al obtener códigos de descuento: ${res.statusText}`);

            return setCodigos(res.data);
        } catch (err) {
            return toast.error(`Error al obtener códigos de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        } finally {
            setCargando(false);
        };
    }

    const eliminarCodigoPorID = async (id) => {
        try {
            const res = await eliminarCodigo(id, headers);

            if (res.status !== 204) return toast.error(`Error al eliminar el código: ${res.statusText}`);

            traerCodigos();

            return toast.success('El código se ha eliminado con éxito');
        } catch (err) {
            return toast.error(`Error al eliminar código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        }
    }

    useEffect(() => {
        traerCodigos();
        setInputs((prev) => ({
            ...estadoInicial,
            tipoProducto: 'todo'
        }));
    }, []);

    useEffect(() => {
        if (confirm && codigoAEliminar) {
            eliminarCodigoPorID(codigoAEliminar);
            setCodigoAEliminar(null);
            setPregunta('');
            setConfirm(false);
            setMostrarConfirm(false);
        }
    }, [confirm])

    return (
        <main>
            {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                <>
                    <h1 className="pagina-titulo text-white text-center">Códigos de descuento</h1>
                    <section className='aparecer text-white mt-2 mb-5 d-flex flex-wrap'>
                        <article className='ingresarCodigo-Article bg-dark p-4 pt-3 m-2 rounded-4'>
                            <h6 className='text-center text-warning'>Crear código:</h6>
                            <form onSubmit={gestionEnvio}>
                                <div className='d-flex mb-3'>
                                    <div className='me-3'>
                                        <label className='form-label'>Ingresar nuevo código:</label>
                                        <input
                                            className='form-control' type="text"
                                            placeholder='5 a 10 caracteres'
                                            name='codigo'
                                            value={inputs.codigo}
                                            onChange={gestionIngreso}
                                            maxLength={10}
                                            minLength={5}
                                            required/>
                                    </div>
                                    <div className='ms-3'>
                                        <label className='form-label'>Descuento (%):</label>
                                        <input
                                            className='form-control'
                                            type="number"
                                            name='descuento'
                                            value={inputs.descuento}
                                            onChange={gestionIngreso}
                                            min={1}
                                            max={100}
                                            required
                                        />
                                    </div>
                                </div>
                                <p>Aplicado a:</p>
                                <div className='d-flex justify-content-center mb-3'>
                                    <div className='me-4'>
                                        <input
                                            type="radio"
                                            id="remeras" name="tipoProducto"
                                            value='remera'
                                            checked={inputs.tipoProducto === 'remera'}
                                            onChange={gestionIngreso}/>
                                        <label htmlFor="remeras" className='ps-2'>Remeras</label><br />

                                        <input
                                            type="radio"
                                            id="buzos" name="tipoProducto" value='buzo'
                                            checked={inputs.tipoProducto === 'buzo'}
                                            onChange={gestionIngreso}
                                        />
                                        <label htmlFor="buzos" className='ps-2'>Buzos</label><br />
                                    </div>
                                    <div className='ms-4'>
                                        <input
                                            type="radio"
                                            id="mochilas" name="tipoProducto" value='mochila'
                                            checked={inputs.tipoProducto === 'mochila'}
                                            onChange={gestionIngreso}
                                        />
                                        <label htmlFor="mochilas" className='ps-2'>Mochilas</label><br />

                                        <input
                                            type="radio"
                                            id="todos" name="tipoProducto" value='todo'
                                            checked={inputs.tipoProducto === 'todo'}
                                            onChange={gestionIngreso}
                                        />
                                        <label htmlFor="todos" className='ps-2'>Todo</label><br />
                                    </div>
                                </div>
                                <label className='form-label'>De la banda/ artista:</label>
                                <input
                                    className='form-control mb-0'
                                    type="text"
                                    name='banda'
                                    value={inputs.banda}
                                    onChange={gestionIngreso}
                                    maxLength={40} />
                                
                                <p className='aclaracion mt-0 text-warning'>(Dejar en blanco para aplicar a todas las bandas)</p>


                                <div className='mt-5 d-flex justify-content-center'>
                                    <BotonSecundario
                                        tipo='reset'
                                        texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>}
                                        claseAdicional='me-2'
                                    />
                                    <BotonPrimario
                                        tipo='submit'
                                        texto={creando ? <><i className="fa-solid fa-spinner fa-spin"></i><span> Creando... </span></> : <><i className="fa-solid fa-plus"></i><span> Crear</span></>}
                                        claseAdicional='ms-2'
                                    />
                                </div>
                            </form>
                        </article>

                        <article className='listaCodigos-Article d-flex flex-column bg-dark p-4 pt-3 m-2 rounded-4'>
                            { cargando &&
                                <h2 className='pagina-cargando text-white m-5'><i className="fa-solid fa-spinner fa-spin"></i></h2>
                            }
                            {(codigos.length > 0 && !cargando) ?
                                <><h6 className='text-center text-warning'>Códigos existentes:</h6>
                                {codigos.map(codigo => (
                                    <div className='mb-1'>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-0 codigoNombre'>{`${codigo.codigo} (${codigo.descuento} %)`}</p>
                                            <button
                                                className='botonEliminar'
                                                type='button'
                                                title='Eliminar código'
                                                onClick={() => {
                                                    setCodigoAEliminar(codigo.uuid)
                                                    setPregunta(`¿Desea eliminar el código de descuento "${codigo.codigo}"`);
                                                    setMostrarConfirm(true);
                                            }}>X</button>
                                        </div>
                                        <p className='mb-0'>Aplicado a: {codigo.tipoProducto === 'todo' ? codigo.tipoProducto : `${codigo.tipoProducto}s`} {codigo.banda}</p>
                                        <p className='mb-0'>Creado por: {codigo.creadoPor}, {formatearUTC(codigo.fechaYHora)}</p>
                                        <hr />
                                    </div>
                                ))}</> : ''}
                            
                            {(codigos.length === 0 && !cargando) ? <h6 className='text-center text-warning'>Aún no hay códigos ingresados</h6> : ''}

                        </article>
                    </section>
                </>}
            {mostrarConfirm ?
                <Confirm
                    pregunta={pregunta}
                    setConfirm={setConfirm}
                    setMostrarConfirm={setMostrarConfirm}
                /> : ''
            }
        </main>
    );
};

export default Descuentos;
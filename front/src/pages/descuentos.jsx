import { useEffect, useContext, useState } from 'react';
import { BackgroundContext } from '@/context/backgroundContext';
import { toast } from 'react-toastify';
import { generarCodigo } from '@/services/codigoService';
import useFormulario from '@/hooks/useFormulario';
import BotonSecundario from '@/components/botones/botonSecundario';
import BotonPrimario from '@/components/botones/botonPrimario';

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

    const crearCodigo = async (datos) => {

        datos.creadoPor = usuario.nombreYApellido
    
        try {
            setCreando(true);
            const res = await generarCodigo(datos, headers);
    
            if (res.status !== 200) return toast.error(`Error al crear el código de descuento: ${res.statusText}`);
    
            setInputs(estadoInicial);
            
            return toast.success('El código de descuento se generó con éxito');
        } catch (err) {
            return toast.error(`Error al crear el código de descuento: ${err.response?.data?.error || err.message || 'Error desconocido'}`);
        } finally {
            setCreando(false);
        };
    };
    
    const { inputs, setInputs, gestionIngreso, gestionEnvio } = useFormulario(crearCodigo);

    useEffect(() => {
        setInputs((prev) => ({
            ...estadoInicial,
            tipoProducto: 'todo'
        }));
    }, []);

    return (
        <main>
            {(!usuario || !usuario.rol || usuario.rol !== 'administrador') ? <h4 className='text-white text-center p-2 m-2 pt-4 pb-5 mt-5 mb-5'>Necesitás permisos de administrador para acceder</h4> :
                <>
                    <h1 className="pagina-titulo text-white text-center">Códigos de descuento</h1>
                    <section className='text-white mt-2'>
                        <article className='bg-dark p-4 mb-4 rounded-4'>
                            <form onSubmit={gestionEnvio}>
                                <div className='d-flex mb-3'>
                                    <div className='me-3'>
                                        <label        className='form-label'>Ingresar nuevo código:</label>
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
                                
                                <p className='mt-0'>(Dejar en blanco para aplicar a todas las bandas)</p>


                                <div className='mt-3 d-flex justify-content-center'>
                                    <BotonSecundario
                                        tipo='reset'
                                        texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>}
                                        claseAdicional='me-2'
                                    />
                                    <BotonPrimario
                                        tipo='submit'
                                        texto={creando ? <><i className="fa-solid fa-spinner fa-spin"></i><span> Creando... </span></> : <><i className="fa-solid fa-percent"></i><span> Crear</span></>}
                                        claseAdicional='ms-2'
                                    />
                                </div>
                            </form>
                        </article>
                        {codigos.length > 0 ? 
                            <article>
                                <h6>Códigos existentes:</h6>
                                {codigos.map(codigo => (
                                    <div>
                                        <p>{codigo.codigo}</p>
                                        <p>{codigo.tipoProducto}</p>
                                        <p>{codigo.banda}</p>
                                        <p>{codigo.descuento}</p>
                                        <p>{codigo.creadoPor}</p>
                                        <p>{codigo.fechaYHora}</p>
                                        <button>
                                            Eliminar
                                        </button>
                                    </div>
                                ))}

                            </article> : ''
                        }
                        
                    </section>
                </>}
        </main>
    );
};

export default Descuentos;
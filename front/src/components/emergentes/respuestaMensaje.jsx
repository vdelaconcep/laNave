import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import '@/components/emergentes/emergentes.css';

const RespuestaMensaje = ({ alCancelar, alEnviar, respuesta, setRespuesta, cargandoEnvio, setCargandoEnvio }) => {
    

    return (
        <div className='mensaje-respuestaOverlay'>
            <article className='mensaje-respuestaRedactar entrar d-flex flex-column align-items-center p-3'>
                <h5 className='align-self-start mb-3'>Redactar respuesta:</h5>
                <textarea
                className='mensaje-respuestaTextarea p-2'
                name="respuesta"
                id="respuesta"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}></textarea>
                <div className='mt-3'>
                    <BotonSecundario
                        tipo='button'
                        texto={<><i className="fa-solid fa-xmark"></i><span> Cancelar</span></>}
                        accion={alCancelar}
                        claseAdicional='me-2' />
                    <BotonPrimario
                        tipo='button'
                        texto={cargandoEnvio ? <><span>Enviando... </span><i className="fa-solid fa-spinner fa-spin"></i></> : <><i className="fa-solid fa-paper-plane"></i><span> Enviar</span></>}
                        accion={() => {
                            setCargandoEnvio(true);
                            alEnviar();
                        }}
                        claseAdicional='ms-2' />
                </div>
            </article>
        </div>
    );
};

export default RespuestaMensaje;
import BotonPrimario from '@/components/botones/botonPrimario';
import formatearUTC from '@/utils/formatearUTC';
import '@/components/emergentes/emergentes.css';

const Info = ({usuario, setMostrarInfo}) => {
    return (
        <div className='usuarios-mostrarInfoDivOverlay'>
            <article className='usuarios-mostrarInfoArticle entrar p-3'>
                <p><span className='text-warning'>Usuario id: </span><span className='seCorta'>{usuario.uuid}</span></p>
                <p><span className='text-warning'>Nombre y apellido: </span>{usuario.nombreYApellido}</p>
                <p><span className='text-warning'>Rol: </span>{usuario.rol}</p>
                <p><span className='text-warning'>E-mail: </span><span className='seCorta'>{usuario.email}</span></p>
                {usuario.telefono ? <p><span className='text-warning'>Teléfono: </span>{usuario.telefono}</p> : ''}
                <p><span className='text-warning'>Fecha de nacimiento: </span>{formatearUTC(usuario.nacimiento)}</p>
                <p><span className='text-warning'>Registro: </span>{formatearUTC(usuario.fechaYHoraRegistro)}</p>
                <p><span className='text-warning'>Última sesión: </span>{formatearUTC(usuario.ultimaSesion)}</p>
                <div className='text-center p-3'>
                    <BotonPrimario
                        texto='OK'
                        accion={() => setMostrarInfo(false)} />
                </div>
            </article>
        </div>
    )
}

export default Info;
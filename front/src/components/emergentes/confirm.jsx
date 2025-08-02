import BotonPrimario from '@/components/botones/botonPrimario';
import BotonSecundario from '@/components/botones/botonSecundario';
import '@/components/emergentes/emergentes.css'

const Confirm = ({ pregunta, setConfirm, setMostrarConfirm }) => {
    return (
        <div className='confirm-overlay'>
            <article className='confirm-article entrar p-3 m-3 text-center'>
                <p>{pregunta}</p>
                <BotonSecundario
                    tipo='button'
                    texto='Cancelar'
                    claseAdicional='me-2'
                    accion={() => {
                        setConfirm(false);
                        setMostrarConfirm(false);
                    }}
                />
                <BotonPrimario
                    tipo='button'
                    texto='Aceptar'
                    claseAdicional='ms-2'
                    accion={() => {
                        setConfirm(true);
                        setMostrarConfirm(false);
                    }}
                />
            </article>
        </div>
    );
};

export default Confirm;
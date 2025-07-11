import remeraAlmendra from '@/assets/provisorias/remera_almendra.jpg';
import '@/components/tarjetas/tarjetas.css';

const Tarjeta = () => {
    return (
        <article className='tarjeta-article text-white m-3'>
            <div className='tarjeta-div-foto'>
                <img
                    src={remeraAlmendra}
                    alt="Remera Almendra #1"
                    className='tarjeta-foto' />
            </div>
            <h5 className='tarjeta-titulo hstack align-items-center p-2 m-0'>Remera Almendra Spinetta #1</h5>
            <div className='hstack justify-content-around align-items-center p-2'>
                <p className='tarjeta-precio text-info m-0 fs-4 fw-bold'>$18000</p>
                <div>
                    <label htmlFor="talle" className='me-1'>Talle: </label>
                    <select className='tarjeta-selectTalle' name="talle" id="talle">
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>
            </div>
            <div className='hstack justify-content-center'>
                <button className='tarjeta-boton btn w-100 d-flex align-items-center justify-content-center'>
                    <i className="fa-solid fa-plus me-2"></i> Agregar al carrito 
                </button>
            </div>
        </article>
    );
};

export default Tarjeta;
import remeraAlmendra from '@/assets/provisorias/remera_almendra.jpg';
import '@/components/tarjetas/tarjetas.css';

const Tarjeta = () => {
    return (
        <article className='tarjeta-article text-white bg-dark'>
            <div className='tarjeta-div-foto'>
                <img
                    src={remeraAlmendra}
                    alt="Remera Almendra #1"
                    className='tarjeta-foto' />
            </div>
            <h4 className='tarjeta-titulo p-2 m-0 mt-2'>Remera Almendra Spinetta #1</h4>
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
                
                <button className='tarjeta-boton ms-1 w-100' style={{borderRadius: '10px', height: '40px'}}>
                    <i className="fa-solid fa-plus"></i> Agregar al carrito 
                </button>
            </div>
        </article>
    );
};

export default Tarjeta;
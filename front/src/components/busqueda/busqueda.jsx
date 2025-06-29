import '@/components/busqueda/busqueda.css'

const Busqueda = () => {
    return (
        <form className='busqueda-form'>
        <input className="form-control busqueda-input" name="banda" type="text" placeholder="Buscá por banda..." />
            <button type="submit" className="busqueda-btn"><i className="fas fa-search search-icon"></i></button>
        </form>
    );
};

export default Busqueda;
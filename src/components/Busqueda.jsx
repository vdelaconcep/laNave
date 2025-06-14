import './css/Busqueda.css'

const Busqueda = () => {
    return (
        <div className='busqueda-div'>
            <form action="/busqueda" method="POST">
                <input className="busqueda-input form-control" name="banda" type="text" placeholder="Buscá por banda..." />
                <button type="submit" className="busqueda-boton"><i class="fas fa-search search-icon"></i></button>
            </form>
        </div>
    );
};

export default Busqueda;
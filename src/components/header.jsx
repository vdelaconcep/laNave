
import logo from '../assets/img/logo.jpg';
import banner from '../assets/img/banner2.png';
import './css/header.css';
import BotonSuperior from './BotonSuperior.jsx';
import Busqueda from './Busqueda.jsx';
import LinksNavegacion from './LinksNavegacion.jsx';

const Header = () => {
    return (
        <header>
            <div id="div-superior" className="hstack">

                <nav className="dropdown d-lg-none">
                    <button id="boton-hamburguesa" className="btn dropdown-toggle" data-bs-toggle="dropdown">
                        <b>☰</b> <span className="caret"></span>
                    </button>
                    <ul className="menu-chico list-unstyled text-center dropdown-menu">
                        <li className="ps-3 pe-3 pt-2 pb-2 d-md-none">
                            <Busqueda />
                        </li>
                        <LinksNavegacion variante="chico" />
                    </ul>
                </nav>

                <div className="ps-3 d-none d-sm-block">
                        <a href="/" title="Página principal"><img src={logo} alt="logo" style={{ height: "50px" }} /></a>
                </div>

                <nav id="menu-lineal" className="d-none d-lg-block mt-3 ps-4 ps-xl-0 ms-md-auto">
                    <ul className="menu-grande list-unstyled text-center hstack">
                        <LinksNavegacion variante="grande" />
                    </ul>
                </nav>

                <div className="ps-3 pe-3 pt-0 pb-2 d-none d-md-block ms-auto mt-2 w-25">
                    <Busqueda />
                </div>

                <div className="pe-2 ms-auto ms-lg-0">
                    <BotonSuperior href="admin" texto="Admin" icono="fa-user-large" numero={null}/>
                </div>

                <div className="pe-2">
                    <BotonSuperior href="carrito" texto="Carrito" icono="fa-cart-shopping" numero={3}/>
                </div>

            </div>


            <div className="d-sm-none">
                <a href="/"><img className="w-100 mt-0 mb-0 p-0" src={banner} alt="banner" /></a>
                <p className="text-end mt-0 pt-0 pe-3"><b>REMERAS - BUZOS - MOCHILAS</b></p>
            </div>


    </header>
    )
};

export default Header;
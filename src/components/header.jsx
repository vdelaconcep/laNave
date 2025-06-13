import React from 'react';
import Busqueda from './Busqueda.jsx';
import logo from '../assets/img/logo.jpg';
import banner from '../assets/img/banner2.png';
import './css/header.css';

const BotonHeader = () => {
    
}

const Header = () => {
    return (
        <header>
        <div id="div-superior" className="hstack">
            <div id="hamburguesa" className="d-lg-none">
                <nav className="dropdown">
                    <button id="boton-hamburguesa" className="btn dropdown-toggle" data-bs-toggle="dropdown">
                        <b>☰</b> <span className="caret"></span>
                    </button>
                    <ul className="menu-chico list-unstyled text-center dropdown-menu">
                        <div className="search-container ps-3 pe-3 pt-0 pb-2 d-md-none">
                            <Busqueda />
                        </div>
                        <li className="dropdown"><a href="#productos-chico" className="desplegable-chico dropdown-item dropdown-toggle dropdown-chico" data-bs-toggle="collapse">Productos <span className="caret"></span></a>
                            <ul className="sub-menu list-unstyled bg-info-subtle collapse" id="productos-chico">
                                <li><a href="remeras" className="dropdown-item-chico">Remeras</a></li>
                                <li><a href="buzos" className="dropdown-item-chico">Buzos</a></li>
                                <li><a href="mochilas" className="dropdown-item-chico">Mochilas</a></li>
                                <li><a href="productos" className="dropdown-item-chico">Ver todo</a></li>
                            </ul>
                        </li>
                        <li><a href="contacto" className="dropdown-item dropdown-chico">Contacto</a></li>
                        <li><a href="nosotros" className="dropdown-item dropdown-chico">Nosotros</a></li>
                    </ul>
                </nav>
            </div>
            <div className="ps-3 d-none d-sm-block">
                    <a href="/" title="Página principal"><img src={logo} alt="logo" style={{ height: "50px" }} /></a>
            </div>
            <div id="menu-lineal" className="d-none d-lg-block mt-3 ps-4 ps-xl-0 ms-md-auto">
                <nav>
                    <ul className="menu-grande list-unstyled text-center hstack">
                        <li className="dropdown-center menu-grande-li"><a href="#productos" className="dropdown-toggle menu-grande-item" data-bs-toggle="dropdown">Productos <span className="caret"></span></a>
                            <ul className="sub-menu-grande list-unstyled bg-black dropdown-menu text-center" id="productos">
                                <li><a href="remeras" className="dropdown-item dropdown-item-grande">Remeras</a></li>
                                <li><a href="buzos" className="dropdown-item dropdown-item-grande">Buzos</a></li>
                                <li><a href="mochilas" className="dropdown-item dropdown-item-grande">Mochilas</a></li>
                                <li><a href="productos" className="dropdown-item dropdown-item-grande">Ver todo</a></li>
                            </ul>
                        </li>
                        <li className="menu-grande-li"><a href="contacto" className="menu-grande-item">Contacto</a></li>
                        <li className="menu-grande-li"><a href="nosotros" className="menu-grande-item">Nosotros</a></li>
                    </ul>
                </nav>
            </div>
            <div className="search-container ps-3 pe-3 pt-0 pb-2 d-none d-md-block ms-auto mt-2 w-25">
                <Busqueda />
            </div>
            <div className="pe-2 ms-auto ms-lg-0">
                <button id="boton-ingresar" className="btn">
                    <a id="a-ingreso" href="admin">Admin <i className="fa-solid fa-user-large"></i></a>
                </button>
            </div>
            <div className="pe-2">
                <button id="boton-carrito" className="btn">
                    <a id="a-carrito" href="carrito"><i className="fa-solid fa-cart-shopping"></i></a>
                    <p id="notificacion-carrito" className="text-white text-center bg-danger fw-bold rounded-5 ps-2 pe-2" style={{fontSize: "12px"}}></p>
                </button>
                
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
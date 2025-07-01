import Navegacion from '@/components/navegacion/navegacion'
import Busqueda from '@/components/busqueda/busqueda';
import BotonLink from '@/components/botones/boton-link';
import { Link } from "react-router-dom";
import logo from '@/assets/img/logo.jpg';
import banner from '@/assets/img/banner2.png';
import '@/components/headers/headers.css';

const Header = () => {
    return (
        <header>
            <section className="barraSuperior hstack">
                <div className='d-block d-lg-none'>
                    <Navegacion pantalla={'pantallaChica'} />   
                </div>
                <div className="ps-3 d-none d-sm-block">
                    <Link to="/" className='links' title="Página principal"><img src={logo} alt="logo" style={{ height: "50px" }} /></Link>
                </div>
                <div className="d-none d-lg-block ps-4 ps-xl-0 ms-md-auto">
                    <Navegacion pantalla={'pantallaGrande'} />
                </div>
                <div className="ps-3 pe-3 d-none d-md-block ms-auto w-25">
                    <Busqueda />
                </div>
                <div className="pe-2 ms-auto ms-lg-0">
                    <BotonLink vinculo={"/admin"} texto={<span>Ingresá <i className="fa-solid fa-user-large"></i></span>} numero={null} />
                </div>
                <div className="pe-2">
                    <BotonLink vinculo={"/carrito"} texto={<><span className='d-none d-sm-inline'>Carrito</span><span><i className="fa-solid fa-cart-shopping"></i></span></>} numero={3} />
                </div>
            </section>
            <section className="d-sm-none">
                <Link to="/" className='links'><img className="w-100" src={banner} alt="banner" /></Link>
                <p className="text-end pe-3"><b>REMERAS - BUZOS - MOCHILAS</b></p>
            </section>
        </header>
    )
};

export default Header;
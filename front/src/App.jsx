
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundProvider } from '@/context/backgroundContext';
import { AuthProvider } from '@/context/authContext';
import { CarritoProvider } from '@/context/carritoContext';
import { ToastContainer, Slide } from 'react-toastify';
import Layout from "@/pages/layout";
import Principal from "@/pages/principal";
import Productos from "@/pages/productos";
import Nosotros from '@/pages/nosotros';
import Contacto from '@/pages/contacto';
import Login from '@/pages/login';
import Registro from '@/pages/registro';
import Carrito from '@/pages/carrito';
import Alta from '@/pages/alta';
import ProductosAdmin from '@/pages/productosAdmin';
import Ventas from '@/pages/ventas';
import Descuentos from '@/pages/descuentos';
import Usuarios from '@/pages/usuarios';
import Mensajes from '@/pages/mensajes';
import Error from '@/pages/error';

function App() {

  return (
    <>
      <BrowserRouter>
        <BackgroundProvider>
          <AuthProvider>
            <CarritoProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Principal />} />
                  <Route path="/remeras" element={<Productos filtrarPor='tipo' filtro='remeras' />} />
                  <Route path="/buzos" element={<Productos filtrarPor='tipo' filtro='buzos' />} />
                  <Route path="/mochilas" element={<Productos filtrarPor='tipo' filtro='mochilas' />} />
                  <Route path="/varios" element={<Productos filtrarPor='tipo' filtro='varios' />} />
                  <Route path="/ofertas" element={<Productos filtrarPor='descuento' filtro='ofertas' />} />
                  <Route path="/productos" element={<Productos filtrarPor='tipo' filtro='todos los productos' />} />
                  <Route path="/resultados" element={<Productos filtrarPor='banda' filtro='busqueda' />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/alta" element={<Alta />} />
                  <Route path="/productosAdmin" element={<ProductosAdmin />} />
                  <Route path="/ventas" element={<Ventas />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/mensajes" element={<Mensajes />} />
                  <Route path="/descuentos" element={<Descuentos />} />
                  <Route path="/*" element={<Error />} />
                </Route>
              </Routes>
            </CarritoProvider>
          </AuthProvider>
        </BackgroundProvider>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        hideProgressBar={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        transitionDuration={800}
        theme="dark" />
    </>
  );
}

export default App;

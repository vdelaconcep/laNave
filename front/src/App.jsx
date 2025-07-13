
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundProvider } from '@/context/backgroundContext';
import { AuthProvider } from '@/context/authContext';
import Layout from "@/pages/layout";
import Principal from "@/pages/principal";
import Productos from "@/pages/productos";
import Nosotros from '@/pages/nosotros';
import Contacto from '@/pages/contacto';
import Login from '@/pages/login';
import Registro from '@/pages/registro';
import Carrito from '@/pages/carrito';
import Error from '@/pages/error';

function App() {

  return (
    <BrowserRouter>
      <BackgroundProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Principal />} />
              <Route path="/remeras" element={<Productos filtro='Remeras' />} />
              <Route path="/buzos" element={<Productos filtro='Buzos' />} />
              <Route path="/mochilas" element={<Productos filtro='Mochilas' />} />
              <Route path="/varios" element={<Productos filtro='Varios' />} />
              <Route path="/productos" element={<Productos filtro='Todos los productos' />} />
              <Route path="/resultados" element={<Productos filtro='busqueda' />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/*" element={<Error />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BackgroundProvider>
    </BrowserRouter>
  );
}

export default App;

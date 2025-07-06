
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/layout";
import Principal from "@/pages/principal";
import Remeras from '@/pages/remeras';
import Buzos from '@/pages/buzos';
import Mochilas from '@/pages/mochilas';
import Varios from '@/pages/varios';
import VerTodo from '@/pages/verTodo';
import Nosotros from '@/pages/nosotros';
import Contacto from '@/pages/contacto';
import Login from '@/pages/login';
import Carrito from '@/pages/carrito';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Principal />} />
          
          <Route path="/remeras" element={<Remeras />} />
          <Route path="/buzos" element={<Buzos />} />
          <Route path="/mochilas" element={<Mochilas />} />
          <Route path="/varios" element={<Varios />} />
          <Route path="/verTodo" element={<VerTodo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

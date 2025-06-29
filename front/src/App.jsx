
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/layout";
import Principal from "@/pages/principal";
import Nosotros from '@/pages/nosotros';
import Remeras from '@/pages/remeras';
import Buzos from '@/pages/buzos';
import Mochilas from '@/pages/mochilas';
import Contacto from '@/pages/contacto';
import Admin from '@/pages/admin';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Principal />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/remeras" element={<Remeras />} />
          <Route path="/buzos" element={<Buzos />} />
          <Route path="/mochilas" element={<Mochilas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

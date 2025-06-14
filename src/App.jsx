import { Routes } from "react-router-dom";
import BotonSuperior from "./components/BotonSuperior";

function App() {

  return (
    <>
      <Routes>
        <BotonSuperior href="#" texto="mi-boton" numero="3" />
      </Routes>
    </>
  )
}

export default App

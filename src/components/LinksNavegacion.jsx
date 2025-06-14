import SubmenuProductos from "./SubmenuProductos";

const LinksNavegacion = ({ variante }) => {
    const isChico = variante === "chico";

    return (
        <>
            <li className={isChico ? "dropdown" : "dropdown-center menu-grande-li"}>
                <a href={`#productos-${variante}`} className={isChico ? "desplegable-chico dropdown-item dropdown-toggle dropdown-chico" : "dropdown-toggle menu-grande-item"} data-bs-toggle={isChico ? "collapse" : "dropdown"}>
                    Productos <span className="caret"></span>
                </a>
                <SubmenuProductos variante={variante} />
            </li>
            <li className={isChico ? "" : "menu-grande-li"}>
                <a href="contacto" className={isChico ? "dropdown-item dropdown-chico" : "menu-grande-item"}>Contacto</a>
            </li>
            <li className={isChico ? "" : "menu-grande-li"}>
                <a href="nosotros" className={isChico ? "dropdown-item dropdown-chico" : "menu-grande-item"}>Nosotros</a>
            </li>
        </>
    );
};

export default LinksNavegacion;
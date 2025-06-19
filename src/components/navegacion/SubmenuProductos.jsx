const SubmenuProductos = ({ variante }) => {
    const clases = {
        ul: variante === "chico" ? "sub-menu list-unstyled bg-info-subtle collapse" : "sub-menu-grande list-unstyled bg-black dropdown-menu text-center",
        li: variante === "chico" ? "dropdown-item-chico" : "dropdown-item dropdown-item-grande"
    };

    return (
        <ul className={clases.ul} id={`productos-${variante}`}>
            <li><a href="remeras" className={clases.li}>Remeras</a></li>
            <li><a href="buzos" className={clases.li}>Buzos</a></li>
            <li><a href="mochilas" className={clases.li}>Mochilas</a></li>
            <li><a href="productos" className={clases.li}>Ver todo</a></li>
        </ul>
    );
};

export default SubmenuProductos;
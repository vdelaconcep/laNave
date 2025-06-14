import './css/Detalle.css'

const Detalle = ({ titulo, imgSrc }) => {
    return (
    <div className="detalle-overlay">
        <div className="detalle-verProducto d-flex flex-column justify-content-center align-items-center">
                <h2 className="text-center text-white mb-3 pt-2">{titulo}</h2>
            <div className="d-flex justify-content-center">
                <img src={imgSrc} className="detalle-verProducto-imagen rounded"/>
            </div>
        </div>
    </div>
    );
};

export default Detalle;
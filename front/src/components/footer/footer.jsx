import '@/components/footer/footer.css';

const Footer = () => {
    return (
        <footer className="text-white text-center bg-black p-3 mt-0 vstack" style={{ alignItems: 'center'}}>
            <p><b>La Nave Rockería</b> - Laprida 875, Lomas de Zamora (Buenos Aires)</p>
            <p>Buscanos en las redes:</p>
            <div className="hstack mb-5" style={{justifyContent: 'center'}}>
                <a className="a-footer" href="https://www.facebook.com/"><i className="fa-brands fa-square-facebook"></i></a>
                <a className="a-footer" href="https://www.twitter.com"><i className="fa-brands fa-square-twitter"></i></a>
                <a className="a-footer" href="https://www.instagram.com"><i className="fa-brands fa-square-instagram"></i></a>
                <a className="a-footer" href="https://www.tiktok.com"><i className="fa-brands fa-tiktok"></i></a>
            </div>
            <p>Sitio web desarrollado por DLC <i className="fa-solid fa-crow"></i></p>
        </footer>
    );
};

export default Footer;
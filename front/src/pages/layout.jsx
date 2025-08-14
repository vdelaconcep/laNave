import { Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect } from 'react';
import Header from '@/components/header/header';
import { BackgroundContext } from '../context/backgroundContext';
import Footer from '@/components/footer/footer';


function Layout() {
    const { background } = useContext(BackgroundContext);

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto"
        });
    }, [pathname]);


    return (
        <>
            <div className="layout-div">
                <div className={`layout-main ${background}`}>
                    <Header />
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Layout;
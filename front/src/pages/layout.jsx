import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import Header from '@/components/header/header';
import { BackgroundContext } from '../context/backgroundContext';
import Footer from '@/components/footer/footer';


function Layout() {
    const { background } = useContext(BackgroundContext);


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
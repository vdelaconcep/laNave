import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@/pages/pages.css';
import { Outlet } from "react-router-dom";
import Header from '@/components/headers/header';
/* import Footer from '@/components/footer/footer'; */


function Layout() {

    return (
        <>
            <div className="layout-div">
                <div className="layout-main bg-dark">
                    <Header />
                    <Outlet />
                </div>
                {/* <Footer /> */}
            </div>
        </>
    );
}

export default Layout;
//Shared page shell that keeps content scrollable and pins Navigation Bar to bottom
// <Outlet /> renders whichever child route is acive (Home/Players/History)

import {Outlet,} from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";


export default function TabLayout() {
    return (
        <div className="app-shell">
            {/* Scrollable content area. Bottom is papdded in CSS so it never hides behind navigation bar. */}
            <div className="content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <Outlet />
                <Footer />
        </div>
        {/*Persistent bottom tabs shown on all "main" screens */}
        <NavigationBar />
        </div>
    );
}




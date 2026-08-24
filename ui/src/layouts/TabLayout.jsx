//Shared page shell that keeps content scrollable and pins Navigation Bar to bottom
// <Outlet /> renders whichever child route is acive (Home/Players/History)

import {Outlet,} from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import AdBanner from "../components/AdBanner";


export default function TabLayout() {
    return (
        <div className="app-shell">
            {/* Scrollable content area. Bottom is papdded in CSS so it never hides behind navigation bar. */}
            <div className="content">
                <Outlet />
        </div>
        {/*Persistent bottom tabs shown on all "main" screens */}
        <NavigationBar />
        {/*
          One banner for the whole shell. It picks its ad unit from the current
          route, so pages must NOT mount their own <AdBanner /> — AdMob only has
          one global banner and multiple mounts race each other.
        */}
        <AdBanner />
        </div>
    );
}

//This file will be for the Navigation Bar Functionality
//Utilize React Router's Navink so active tab is highlighted automatically
import {NavLink} from "react-router-dom";
import golfBall from "../assets/golf-ball.svg";

export default function NavigationBar(){
    return (
        <nav className="navigationbar" role="navigation" aria-label="Primary">
            {/* NavLink sets aria-current="page" on the active rout*/}
            {/*NavLink for Home Tab*/}
            <NavLink to ="/" end className="navigation">
            <img className="icon" src={golfBall} alt="" aria-hidden />
            <span className="label">Home</span>
            </NavLink>
            

            {/*NavLink for Players Tab*/}
            <NavLink to ="/players" className="navigation">
            <img className="icon" src={golfBall} alt="" aria-hidden />
            <span className="label">Players</span>
            </NavLink>

            {/*NavLink for History Tab*/}
            <NavLink to ="/history" className="navigation">
            <img className="icon" src={golfBall} alt="" aria-hidden />
            <span className="label">History</span>
            </NavLink>
        </nav>
    );
}
import { memo } from "react";
import { NavLink } from "react-router-dom";
import golfBall from "../assets/golf-ball.svg";

function NavigationBar() {
    return (
        <nav className="navigationbar" role="navigation" aria-label="Primary">
            <NavLink to="/" end className="navigation">
                <img className="icon" src={golfBall} alt="" aria-hidden />
                <span className="label">Home</span>
            </NavLink>

            <NavLink to="/players" className="navigation">
                <img className="icon" src={golfBall} alt="" aria-hidden />
                <span className="label">Players</span>
            </NavLink>

            <NavLink to="/history" className="navigation">
                <img className="icon" src={golfBall} alt="" aria-hidden />
                <span className="label">History</span>
            </NavLink>
        </nav>
    );
}

export default memo(NavigationBar);
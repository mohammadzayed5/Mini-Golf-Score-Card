import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from '../lib/api' 
import golfBall from "../assets/golf-ball.svg";
import ball from "../assets/whitegolfball.png"


export default function Home() {
    //useNavigate will allow me to programmatically move to another URL
    const navigate = useNavigate()
    //Local UI state to show loading/errors while creating a game
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')

    const startNewGame = () => {
        navigate('/courses');
    };



    return (
        <main className= "home">
            <h1 className= "home-title">
                <span>Mini Golf</span>
                <span>Score Tracker</span>
                </h1>
            
            {/* Mobile-friendly button*/}
            <img className="hero-ball" src={ball} alt="" aria-hidden />

            <button
                className="cta start-round"
                onClick={startNewGame}
                disabled={creating}
                aria-label="Start a new game"
            >
                {creating ? 'Creating…' : '⛳️Start New Game🏌🏽'}
            </button>

            {/* Show API error if any */}
            {error && <p className="error">{error}</p>}

        </main>
    );
}
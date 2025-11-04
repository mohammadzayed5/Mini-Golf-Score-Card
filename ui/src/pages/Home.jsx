import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from '../lib/api'
import golfBall from "../assets/golf-ball.svg";
import ball from "../assets/Newimage.png"
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import Footer from '../components/Footer'


export default function Home() {
    //useNavigate will allow me to programmatically move to another URL
    const navigate = useNavigate()
    //Local UI state to show loading/errors while creating a game
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')
    const [showAuthPrompt, setShowAuthPrompt] = useState(false)

    // Auth context
    const { isAuthenticated, logout, user } = useAuth()

    const startNewGame = () => {
        if (isAuthenticated) {
            navigate('/courses');
        } else {
            setShowAuthPrompt(true);
        }
    };



    return (
        <main className= "home">
            <h1 className= "home-title">
                <span>Mini Golf</span>
                <span>Score Tracker</span>
                </h1>
            
            {/* Show user info if logged in */}
            {isAuthenticated && (
                <div style={{marginBottom: '16px', color: 'var(--mint)'}}>
                    Welcome back, {user?.username}!
                    <button
                        onClick={logout}
                        style={{marginLeft: '12px', padding: '4px 8px', fontSize: '14px'}}
                        className="cta"
                    >
                        Logout
                    </button>
                </div>
            )}

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

            {/* Auth prompt when needed */}
            {showAuthPrompt && (
                <AuthPrompt
                    onClose={() => setShowAuthPrompt(false)}
                    redirectTo="/courses"
                />
            )}

            <Footer />
        </main>
    );
}
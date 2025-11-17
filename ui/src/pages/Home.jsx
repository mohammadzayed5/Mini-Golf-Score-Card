import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import ball from "../assets/Newimage.png"
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import Footer from '../components/Footer'
import AdBanner from '../components/AdBanner'


export default function Home() {
    //useNavigate will allow me to programmatically move to another URL
    const navigate = useNavigate()
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
                        onClick={() => navigate('/account-settings')}
                        style={{marginLeft: '12px', padding: '4px 8px', fontSize: '14px'}}
                        className="cta"
                    >
                        Settings
                    </button>
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
                aria-label="Start a new game"
            >
                ⛳️Start New Game🏌🏽
            </button>

            {/* Auth prompt when needed */}
            {showAuthPrompt && (
                <AuthPrompt
                    onClose={() => setShowAuthPrompt(false)}
                    redirectTo="/courses"
                />
            )}

            <Footer />

            {/* AdMob Banner Ad - Home Page */}
            <AdBanner adUnitId="ca-app-pub-5108646735858325/3148534405" position="BOTTOM_CENTER" />
        </main>
    );
}
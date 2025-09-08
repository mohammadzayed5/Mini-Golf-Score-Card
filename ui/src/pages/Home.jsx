import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export default function Home() {
    //useNavigate will allow me to programmatically move to another URL
    const navigate = useNavigate()
    //Local UI state to show loading/errors while creating a game
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')

    //Click handler for "Start new Game"
    const startNewGame = async () => {
        setCreating(true) //disable button + output "Creating..."
        setError('') // clear any previous error
        try{
            //Calls Flask API to create new game
            //Due to Vite proxy, /api/games will go to http://127.0.0.1:5001/api/games
            const res = await fetch(`/api/games`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name: 'New Round', holes: 18}),
            })
            //If Flask returns a non-2xx stats (ex: 500), throw an error
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            //Parse JSON body -> {id, name, holes, etc.}
            const game = await res.json()
            //Navigate to Play game page for the created game
            navigate(`/play/${game.id}`)
        }catch (e) {
            console.error(e)
            //Messge is API call fails
            setError('Could not create game. Is the Flask server running on port 5001?')
        } finally {
            setCreating(false) // re-enable button
        }
    }
    return (
        <main className= "home">
            <h1 className= "title">Mini Golf Score Tracker</h1>
            {/* Mobile-friendly button*/}
            <button
                className="cta"
                onClick={startNewGame}
                disabled={creating}
                aria-label="Start a new game"
            >
                {creating ? 'Creating…' : '⛳️Start New Game🏌🏽'}
            </button>

            {/* Show API error if any */}
            {error && <p className="error">{error}</p>}

        </main>
    )
}
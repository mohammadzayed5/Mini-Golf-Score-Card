import { useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'

export default function Play() {
    //Read ":id" param from URL (ex: /play/1 -> id = 1")
    const { id } = useParams()

    //Back navigation helper
    const navigate = useNavigate()

    //Local state to hold loaded game and possible error text
    const [game, setGame] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        //Small check to avoid setting state after unmount
        let stopped = false
        const load = async () => {
            setError('') //clear Errors before trying
            try{
                //Get api/games/:id to fetch the game details from Flask
                const res = await fetch(`/api/games/${id}`)

                if(!res.ok) throw new Error(`HTTP ${res.status}`)

                const data = await res.json()
                if(!stopped) setGame(data)
            } catch(e) {
              console.error(e)
              if(!stopped) setError('Could not load game.')
        
            }
        }
        load()

        //Cleanup: if componenet unmounts, prevent state updates
        return () => { stopped = true }
    } , [id])
    //Render an error view if loading failed
    if (!game && !error) {
        return (
          <main className="page">
            <button className="secondary" onClick={() => navigate(-1)}>← Back</button>
            <p>Loading game...</p>
          </main>
        )
      }
// If there is a game, reder the basic info (Scores will go here later)

      if(error) {
        return (
          <main className="page">
            <button className="secondary" onClick={() => navigate(-1)}>← Back</button>
            <p className="error">{error}</p>
          </main>
        )
      }

return(
    <main className="page">
        <button className="secondary" onClick={() => navigate(-1)}>← Back</button>
        <h2>Game #{game.id}</h2>
        <p><strong>Name:</strong>{game.name}</p>
        <p><strong>Holes:</strong>{game.holes}</p>
        {/* Need to render players & a live score grid here */}
    </main>
)

}
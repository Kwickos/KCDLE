import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import useWordle from './hooks/useWordle'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import LoldleGame from './components/LoldleGame'
import Admin from './pages/Admin'
import Login from './pages/Login'
import SuggestionModal from './components/SuggestionModal'
import { supabase } from './lib/supabase'
import { type KCMember } from './data/members'

type GameMode = 'WORDLE' | 'LOLDLE'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="min-h-screen bg-kc-dark flex items-center justify-center text-white">Chargement...</div>

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function Game() {
  const [mode, setMode] = useState<GameMode>('WORDLE')
  const [members, setMembers] = useState<KCMember[]>([])
  const [loading, setLoading] = useState(true)

  // Wordle State
  const [solution, setSolution] = useState<string | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false)

  // Fetch members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')

      if (error) {
        console.error('Error fetching members:', error)
      } else if (data) {
        // Transform DB data to KCMember (snake_case to camelCase if needed, but we used snake_case in DB)
        // Actually we need to map snake_case DB columns to camelCase TS interface
        const formattedMembers: KCMember[] = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          game: m.game,
          league: m.league,
          nationality: m.nationality,
          yearJoined: m.year_joined,
          status: m.status,
          image: m.image
        }))

        setMembers(formattedMembers)

        // Prepare Wordle data
        const wordList = formattedMembers.map(m =>
          m.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "")
        )
        setWords(wordList)
        setSolution(wordList[Math.floor(Math.random() * wordList.length)])
      }
      setLoading(false)
    }

    fetchMembers()
  }, [])

  const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup, isInvalid } = useWordle(solution || '', words)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (mode === 'WORDLE') {
      if (isCorrect) {
        setTimeout(() => setShowModal(true), 2000)
        window.removeEventListener('keyup', handleKeyup as any)
      }
      if (turn > 5) {
        setTimeout(() => setShowModal(true), 2000)
        window.removeEventListener('keyup', handleKeyup as any)
      }
    }
  }, [isCorrect, turn, handleKeyup, mode])

  if (loading) {
    return <div className="min-h-screen bg-kc-dark flex items-center justify-center text-white">Chargement...</div>
  }



  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-6 border-b border-gray-700 pb-4 w-full max-w-xl flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-wider text-white drop-shadow-[0_0_10px_rgba(12,32,69,0.8)]">KCDLE</h1>

        <div className="flex bg-kc-blue rounded-lg p-1 gap-1">
          <button
            onClick={() => setMode('WORDLE')}
            className={`px-6 py-2 rounded font-bold transition-all ${mode === 'WORDLE' ? 'bg-kc-gold text-kc-dark' : 'text-gray-400 hover:text-white'}`}
          >
            MOT
          </button>
          <button
            onClick={() => setMode('LOLDLE')}
            className={`px-6 py-2 rounded font-bold transition-all ${mode === 'LOLDLE' ? 'bg-kc-gold text-kc-dark' : 'text-gray-400 hover:text-white'}`}
          >
            MEMBRE
          </button>
        </div>
      </header>

      {showModal && mode === 'WORDLE' && (
        <div className="mb-8 p-6 bg-kc-blue border border-kc-gold rounded-xl text-center animate-bounce-short max-w-sm w-full mx-4">
          <h2 className="text-3xl font-bold mb-2 text-kc-gold">{isCorrect ? 'VICTOIRE ! 👑' : 'DOMMAGE... ⬛'}</h2>
          <p className="text-lg mb-6">Le mot était : <span className="text-kc-gold font-bold tracking-widest">{solution}</span></p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                const emojiGrid = guesses
                  .slice(0, isCorrect ? turn : 6)
                  .map((guess) => {
                    return guess?.map((l) => {
                      if (l.color === 'green') return '🟦'
                      if (l.color === 'yellow') return '🟨'
                      return '⬛'
                    }).join('')
                  })
                  .join('\n')

                const text = `J'ai trouvé le #KCDLE du jour en ${turn}/6 essais ! \n\n${emojiGrid}\n\nRejoins le Blue Wall sur kcdle.gg`

                navigator.clipboard.writeText(text)
                alert('Résultat copié dans le presse-papier !')
              }}
              className="bg-kc-gold text-kc-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <span>📋</span> COPIER LE RÉSULTAT
            </button>

            <button
              onClick={() => {
                const emojiGrid = guesses
                  .slice(0, isCorrect ? turn : 6)
                  .map((guess) => {
                    return guess?.map((l) => {
                      if (l.color === 'green') return '🟦'
                      if (l.color === 'yellow') return '🟨'
                      return '⬛'
                    }).join('')
                  })
                  .join('%0A')

                const text = `J'ai trouvé le %23KCDLE du jour en ${turn}/6 essais ! 🟦⬜⬛%0A%0A${emojiGrid}%0A%0ARejoins le Blue Wall sur kcdle.gg`
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
              }}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              PARTAGER SUR X
            </button>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-gray-400 hover:text-white underline text-sm"
            >
              Rejouer une partie
            </button>
          </div>
        </div>
      )}

      {mode === 'WORDLE' && solution && (
        <>
          <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} solutionLength={solution.length} isInvalid={isInvalid} />
          <Keyboard usedKeys={usedKeys} handleKeyup={handleKeyup} />
        </>
      )}

      {mode === 'LOLDLE' && (
        <LoldleGame members={members} />
      )}

      <footer className="mt-12 text-gray-600 text-sm flex flex-col items-center gap-4">
        <button
          onClick={() => setIsSuggestionModalOpen(true)}
          className="text-kc-gold hover:text-white transition-colors underline"
        >
          Suggérer une modification
        </button>
      </footer>
      <SuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        members={members}
      />
    </div>
  )
}

function App() {
  return (
    <div className="App min-h-screen bg-kc-dark text-white flex flex-col items-center">
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>

      <footer className="mt-auto py-6 text-gray-500 text-sm">
        <p>Fait pour les fans de la Karmine Corp 🟦</p>
        <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity">Admin</Link>
      </footer>
    </div>
  )
}

export default App

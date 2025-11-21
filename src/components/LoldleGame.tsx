import { useState, useMemo, useEffect } from 'react'
import { type KCMember } from '../data/members'

interface LoldleGameProps {
    members: KCMember[]
}

export default function LoldleGame({ members }: LoldleGameProps) {
    const [solution, setSolution] = useState<KCMember | null>(null)
    const [guesses, setGuesses] = useState<KCMember[]>([])
    const [currentSearch, setCurrentSearch] = useState('')
    const [isWon, setIsWon] = useState(false)

    useEffect(() => {
        if (members.length > 0 && !solution) {
            setSolution(members[Math.floor(Math.random() * members.length)])
        }
    }, [members, solution])

    const filteredMembers = useMemo(() => {
        if (!currentSearch) return []
        return members.filter(m =>
            m.name.toLowerCase().includes(currentSearch.toLowerCase()) &&
            !guesses.find(g => g.id === m.id)
        )
    }, [currentSearch, guesses, members])

    if (!solution) return <div>Chargement...</div>

    const handleGuess = (member: KCMember) => {
        setGuesses(prev => [member, ...prev])
        setCurrentSearch('')
        if (member.id === solution.id) {
            setIsWon(true)
        }
    }

    const getAttributeColor = (guessValue: any, solutionValue: any) => {
        if (guessValue === solutionValue) return 'bg-green-600'
        return 'bg-red-600'
    }



    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="mb-8 relative">
                <input
                    type="text"
                    placeholder="Tape le nom d'un membre de la KC..."
                    value={currentSearch}
                    onChange={(e) => setCurrentSearch(e.target.value)}
                    disabled={isWon}
                    className="w-full p-4 bg-kc-lightBlue text-white rounded-lg border border-kc-blue focus:border-kc-gold outline-none placeholder-gray-400"
                />
                {currentSearch && filteredMembers.length > 0 && (
                    <div className="absolute w-full bg-kc-dark border border-kc-blue mt-1 rounded-lg z-10 max-h-60 overflow-y-auto">
                        {filteredMembers.map(member => (
                            <div
                                key={member.id}
                                onClick={() => handleGuess(member)}
                                className="p-3 hover:bg-kc-blue cursor-pointer flex items-center gap-3 transition-colors"
                            >
                                <span className="font-bold">{member.name}</span>
                                <span className="text-sm text-gray-400">({member.game} - {member.role})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isWon && (
                <div className="mb-8 p-6 bg-kc-blue border border-kc-gold rounded-xl text-center animate-bounce-short">
                    <h2 className="text-3xl font-bold text-kc-gold mb-2">VICTOIRE ! 👑</h2>
                    <p className="text-xl mb-6">C'était bien <span className="font-bold">{solution.name}</span> !</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                const emojiGrid = guesses
                                    .slice().reverse()
                                    .map((guess) => {
                                        const line = [
                                            guess.role === solution.role ? '🟩' : '🟥',
                                            guess.game === solution.game ? '🟩' : '🟥',
                                            guess.nationality === solution.nationality ? '🟩' : '🟥',
                                            guess.yearJoined === solution.yearJoined ? '🟩' : (guess.yearJoined < solution.yearJoined ? '⬆️' : '⬇️'),
                                            guess.status === solution.status ? '🟩' : '🟥'
                                        ].join('')
                                        return line
                                    })
                                    .join('\n')

                                const text = `J'ai trouvé le #KCDLE (Mode Membre) en ${guesses.length} essais ! \n\n${emojiGrid}\n\nRejoins le Blue Wall sur kcdle.gg`

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
                                    .slice().reverse()
                                    .map((guess) => {
                                        const line = [
                                            guess.role === solution.role ? '🟩' : '🟥',
                                            guess.game === solution.game ? '🟩' : '🟥',
                                            guess.nationality === solution.nationality ? '🟩' : '🟥',
                                            guess.yearJoined === solution.yearJoined ? '🟩' : (guess.yearJoined < solution.yearJoined ? '⬆️' : '⬇️'),
                                            guess.status === solution.status ? '🟩' : '🟥'
                                        ].join('')
                                        return line
                                    })
                                    .join('%0A')

                                const text = `J'ai trouvé le %23KCDLE (Mode Membre) en ${guesses.length} essais ! 👑%0A%0A${emojiGrid}%0A%0ARejoins le Blue Wall sur kcdle.gg`
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

            <div className="space-y-2">
                {/* Header */}
                {guesses.length > 0 && (
                    <div className="grid grid-cols-7 gap-2 min-w-[800px] text-center font-bold text-sm md:text-base mb-4 text-gray-400">
                        <div>Membre</div>
                        <div>Rôle</div>
                        <div>Jeu</div>
                        <div>Ligue</div>
                        <div>Nationalité</div>
                        <div>Année</div>
                        <div>Statut</div>
                    </div>
                )}

                {/* Guesses */}
                {guesses.map((guess, index) => (
                    <div key={index} className="grid grid-cols-7 gap-2 text-center animate-flip">
                        {/* Name (Image placeholder for now) */}
                        <div className="aspect-square flex items-center justify-center bg-kc-lightBlue border-2 border-gray-700 rounded-lg font-bold truncate p-1">
                            {guess.name}
                        </div>

                        {/* Role */}
                        <div className={`aspect-square flex items-center justify-center border-2 border-gray-700 rounded-lg ${getAttributeColor(guess.role, solution.role)}`}>
                            {guess.role}
                        </div>

                        {/* Game */}
                        <div className={`aspect-square flex items-center justify-center border-2 border-gray-700 rounded-lg ${getAttributeColor(guess.game, solution.game)}`}>
                            {guess.game}
                        </div>

                        {/* League */}
                        <div className={`aspect-square flex items-center justify-center border-2 border-gray-700 rounded-lg ${getAttributeColor(guess.league, solution.league)}`}>
                            {guess.league}
                        </div>

                        {/* Nationality */}
                        <div className={`aspect-square flex items-center justify-center border-2 border-gray-700 rounded-lg ${getAttributeColor(guess.nationality, solution.nationality)}`}>
                            {guess.nationality}
                        </div>

                        {/* Year */}
                        <div className={`aspect-square relative flex items-center justify-center border-2 border-gray-700 rounded-lg overflow-hidden ${guess.yearJoined === solution.yearJoined ? 'bg-green-600' : 'bg-red-600'
                            } animate-flip`} style={{ animationDelay: '500ms' }}>
                            {/* Background Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
                                {guess.yearJoined < solution.yearJoined ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" transform="rotate(180 12 12)" />
                                    </svg>
                                ) : guess.yearJoined > solution.yearJoined ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                    </svg>
                                ) : null}
                            </div>
                            <span className="relative z-10 text-lg">{guess.yearJoined}</span>
                        </div>

                        {/* Status */}
                        <div className={`aspect-square flex items-center justify-center border-2 border-gray-700 rounded-lg ${guess.status === solution.status ? 'bg-green-600' : 'bg-red-600'
                            } animate-flip`} style={{ animationDelay: '600ms' }}>
                            {guess.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

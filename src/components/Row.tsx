import { type Guess } from '../hooks/useWordle'

interface RowProps {
    guess?: Guess[] | null
    currentGuess?: string
    solutionLength: number
    isInvalid?: boolean
}

export default function Row({ guess, currentGuess, solutionLength, isInvalid }: RowProps) {

    if (guess) {
        return (
            <div className="flex justify-center gap-1 mb-1">
                {guess.map((l, i) => (
                    <div key={i} className={`block w-14 h-14 border-2 flex items-center justify-center text-3xl font-bold uppercase
            ${l.color === 'green' ? 'bg-kc-blue border-kc-blue' : ''}
            ${l.color === 'yellow' ? 'bg-kc-gold border-kc-gold' : ''}
            ${l.color === 'grey' ? 'bg-gray-500 border-gray-500' : ''}
          `}>
                        {l.key}
                    </div>
                ))}
            </div>
        )
    }

    if (currentGuess) {
        const letters = currentGuess.split('')

        return (
            <div className={`flex justify-center gap-1 mb-1 ${isInvalid ? 'animate-shake' : ''}`}>
                {letters.map((letter, i) => (
                    <div key={i} className="block w-14 h-14 border-2 border-gray-500 flex items-center justify-center text-3xl font-bold uppercase animate-bounce-short">
                        {letter}
                    </div>
                ))}
                {[...Array(solutionLength - letters.length)].map((_, i) => (
                    <div key={i} className="block w-14 h-14 border-2 border-gray-700 flex items-center justify-center"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex justify-center gap-1 mb-1">
            {[...Array(solutionLength)].map((_, i) => (
                <div key={i} className="block w-14 h-14 border-2 border-gray-700 flex items-center justify-center"></div>
            ))}
        </div>
    )
}

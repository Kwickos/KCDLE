import Row from './Row'
import { type Guess } from '../hooks/useWordle'

interface GridProps {
    currentGuess: string
    guesses: (Guess[] | null)[]
    turn: number
    solutionLength: number
    isInvalid: boolean
}

export default function Grid({ currentGuess, guesses, turn, solutionLength, isInvalid }: GridProps) {
    return (
        <div>
            {guesses.map((g, i) => {
                if (turn === i) {
                    return <Row key={i} currentGuess={currentGuess} solutionLength={solutionLength} isInvalid={isInvalid} />
                }
                return <Row key={i} guess={g} solutionLength={solutionLength} />
            })}
        </div>
    )
}

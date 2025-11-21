import { useState } from 'react'

export interface Guess {
    key: string
    color: 'grey' | 'yellow' | 'green'
}

export default function useWordle(solution: string, words: string[]) {
    const [turn, setTurn] = useState(0)
    const [currentGuess, setCurrentGuess] = useState('')
    const [guesses, setGuesses] = useState<(Guess[] | null)[]>([...Array(6)]) // each guess is an array of objects
    const [history, setHistory] = useState<string[]>([]) // each guess is a string
    const [isCorrect, setIsCorrect] = useState(false)
    const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({})
    const [isInvalid, setIsInvalid] = useState(false)

    const formatGuess = () => {
        const solutionArray: (string | null)[] = [...solution]
        const formattedGuess: Guess[] = [...currentGuess].map((l) => {
            return { key: l, color: 'grey' }
        })

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray[i] === l.key) {
                formattedGuess[i].color = 'green'
                solutionArray[i] = null
            }
        })

        // find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow'
                solutionArray[solutionArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    const addNewGuess = (formattedGuess: Guess[]) => {
        if (currentGuess === solution) {
            setIsCorrect(true)
        }

        setGuesses((prevGuesses) => {
            const newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })

        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess]
        })

        setTurn((prevTurn) => {
            return prevTurn + 1
        })

        setUsedKeys((prevUsedKeys) => {
            const newKeys = { ...prevUsedKeys }

            formattedGuess.forEach((l) => {
                const currentColor = newKeys[l.key]

                if (l.color === 'green') {
                    newKeys[l.key] = 'green'
                    return
                }
                if (l.color === 'yellow' && currentColor !== 'green') {
                    newKeys[l.key] = 'yellow'
                    return
                }
                if (l.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
                    newKeys[l.key] = 'grey'
                    return
                }
            })

            return newKeys
        })

        setCurrentGuess('')
    }

    const handleKeyup = ({ key }: { key: string }) => {
        if (key === 'Enter') {
            // only add guess if turn is less than 5
            if (turn > 5) {
                console.log('you used all your guesses')
                return
            }
            // do not allow duplicate words
            if (history.includes(currentGuess)) {
                console.log('you already tried that word')
                setIsInvalid(true)
                setTimeout(() => setIsInvalid(false), 1000)
                return
            }
            // check word is correct length
            if (currentGuess.length !== solution.length) {
                console.log('word must be ' + solution.length + ' chars long')
                setIsInvalid(true)
                setTimeout(() => setIsInvalid(false), 1000)
                return
            }

            // check if word is in list
            if (!words.includes(currentGuess)) {
                console.log('word not in list')
                setIsInvalid(true)
                setTimeout(() => setIsInvalid(false), 600) // Reset after animation
                return
            }

            const formatted = formatGuess()
            addNewGuess(formatted)
        }

        if (key === 'Backspace') {
            setCurrentGuess((prev) => {
                return prev.slice(0, -1)
            })
            return
        }

        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < solution.length) {
                setCurrentGuess((prev) => {
                    return prev + key.toUpperCase()
                })
            }
        }
    }

    return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, isInvalid }
}

import { useEffect } from 'react'

interface KeyboardProps {
    usedKeys: { [key: string]: string }
    handleKeyup: (e: { key: string }) => void
}

export default function Keyboard({ usedKeys, handleKeyup }: KeyboardProps) {
    // AZERTY layout for French users (KC fans are mostly French)
    // Row 1: A Z E R T Y U I O P
    // Row 2: Q S D F G H J K L M
    // Row 3: W X C V B N

    const row1 = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    const row2 = ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M']
    const row3 = ['W', 'X', 'C', 'V', 'B', 'N']

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            handleKeyup({ key: e.key })
        }
        window.addEventListener('keyup', listener)
        return () => window.removeEventListener('keyup', listener)
    }, [handleKeyup])

    const handleScreenKey = (key: string) => {
        handleKeyup({ key: key })
    }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <div className="flex justify-center gap-1 mb-1">
                {row1.map((l) => {
                    const color = usedKeys[l]
                    return (
                        <div
                            key={l}
                            onClick={() => handleScreenKey(l)}
                            className={`h-14 w-10 flex items-center justify-center rounded cursor-pointer font-bold transition-colors duration-300
                ${color === 'green' ? 'bg-kc-blue' : ''}
                ${color === 'yellow' ? 'bg-kc-gold' : ''}
                ${color === 'grey' ? 'bg-gray-600' : ''}
                ${!color ? 'bg-gray-400' : ''}
              `}
                        >
                            {l}
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center gap-1 mb-1">
                {row2.map((l) => {
                    const color = usedKeys[l]
                    return (
                        <div
                            key={l}
                            onClick={() => handleScreenKey(l)}
                            className={`h-14 w-10 flex items-center justify-center rounded cursor-pointer font-bold transition-colors duration-300
                ${color === 'green' ? 'bg-kc-blue' : ''}
                ${color === 'yellow' ? 'bg-kc-gold' : ''}
                ${color === 'grey' ? 'bg-gray-600' : ''}
                ${!color ? 'bg-gray-400' : ''}
              `}
                        >
                            {l}
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-center gap-1 mb-1">
                <div
                    onClick={() => handleScreenKey('Enter')}
                    className="h-14 px-3 flex items-center justify-center rounded cursor-pointer font-bold bg-gray-400 text-xs"
                >
                    ENTER
                </div>
                {row3.map((l) => {
                    const color = usedKeys[l]
                    return (
                        <div
                            key={l}
                            onClick={() => handleScreenKey(l)}
                            className={`h-14 w-10 flex items-center justify-center rounded cursor-pointer font-bold transition-colors duration-300
                ${color === 'green' ? 'bg-kc-blue' : ''}
                ${color === 'yellow' ? 'bg-kc-gold' : ''}
                ${color === 'grey' ? 'bg-gray-600' : ''}
                ${!color ? 'bg-gray-400' : ''}
              `}
                        >
                            {l}
                        </div>
                    )
                })}
                <div
                    onClick={() => handleScreenKey('Backspace')}
                    className="h-14 px-3 flex items-center justify-center rounded cursor-pointer font-bold bg-gray-400 text-xs"
                >
                    DEL
                </div>
            </div>
        </div>
    )
}

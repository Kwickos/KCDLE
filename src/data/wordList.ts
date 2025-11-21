import { MEMBERS } from './members'

const normalizeName = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "")
}

export const WORDS = MEMBERS.map(m => normalizeName(m.name))

// Filtering for strictly 5 letters for now to ensure standard Wordle mechanics first.
export const WORD_LENGTH = 5

export const SOLUTION_LIST = WORDS

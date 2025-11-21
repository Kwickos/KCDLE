export interface KCMember {
    id: string
    name: string
    role: 'Player' | 'Coach' | 'CEO' | 'Streamer' | 'Staff'
    game: 'League of Legends' | 'Valorant' | 'Rocket League' | 'TFT' | 'General'
    league: string
    nationality: string
    yearJoined: number
    status: 'Active' | 'Inactive' | 'Legend'
    image?: string
}

// NOTE: This list is now used as a fallback or type reference.
// The actual data is fetched from Supabase in App.tsx.
export const MEMBERS: KCMember[] = [
    {
        id: "kwick",
        name: "Kwick",
        role: "Player",
        game: "League of Legends",
        league: "LFL",
        nationality: "FR",
        yearJoined: 2025,
        status: "Legend"
    },
    {
        id: "kameto",
        name: "Kameto",
        role: "CEO",
        game: "General",
        league: "General",
        nationality: "FR",
        yearJoined: 2020,
        status: "Active"
    },
    {
        id: "saken",
        name: "Saken",
        role: "Player",
        game: "League of Legends",
        league: "LFL",
        nationality: "FR",
        yearJoined: 2021,
        status: "Legend"
    },
    {
        id: "caliste",
        name: "Caliste",
        role: "Player",
        game: "League of Legends",
        league: "LFL",
        nationality: "FR",
        yearJoined: 2023,
        status: "Active"
    },
    {
        id: "canna",
        name: "Canna",
        role: "Player",
        game: "League of Legends",
        league: "LFL",
        nationality: "KR",
        yearJoined: 2024,
        status: "Active"
    },
    {
        id: "targamas",
        name: "Targamas",
        role: "Player",
        game: "League of Legends",
        league: "LFL",
        nationality: "BE",
        yearJoined: 2021,
        status: "Active"
    },
    {
        id: "vatira",
        name: "Vatira",
        role: "Player",
        game: "Rocket League",
        league: "RLCS",
        nationality: "FR",
        yearJoined: 2022,
        status: "Active"
    },
    {
        id: "shin",
        name: "Shin",
        role: "Player",
        game: "Valorant",
        league: "VCT",
        nationality: "FR",
        yearJoined: 2022,
        status: "Active"
    },
    {
        id: "prime",
        name: "Prime",
        role: "CEO",
        game: "General",
        league: "General",
        nationality: "FR",
        yearJoined: 2020,
        status: "Inactive"
    },
    {
        id: "striker",
        name: "Striker",
        role: "Coach",
        game: "League of Legends",
        league: "LFL",
        nationality: "FR",
        yearJoined: 2021,
        status: "Inactive"
    }
]
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type KCMember } from '../data/members'
import { supabase } from '../lib/supabase'

export default function Admin() {
    const [members, setMembers] = useState<KCMember[]>([])
    const [loading, setLoading] = useState(true)
    const [newMember, setNewMember] = useState<Partial<KCMember>>({
        name: '',
        role: 'Player',
        game: 'League of Legends',
        league: 'LFL',
        nationality: '🇫🇷',
        status: 'Active',
        yearJoined: new Date().getFullYear()
    })
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'MEMBERS' | 'SUGGESTIONS'>('MEMBERS')

    useEffect(() => {
        fetchMembers()
        fetchSuggestions()
    }, [])

    const fetchSuggestions = async () => {
        const { data, error } = await supabase
            .from('suggestions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching suggestions:', error)
        else setSuggestions(data || [])
    }

    const handleSuggestionAction = async (suggestion: any, action: 'APPROVE' | 'REJECT') => {
        if (action === 'REJECT') {
            await supabase.from('suggestions').update({ status: 'REJECTED' }).eq('id', suggestion.id)
            fetchSuggestions()
            return
        }

        // APPROVE
        try {
            if (suggestion.type === 'ADD') {
                const generatedId = suggestion.new_data.name.toLowerCase().replace(/[^a-z0-9]/g, '')
                const { error } = await supabase.from('members').insert({
                    id: generatedId,
                    name: suggestion.new_data.name,
                    role: suggestion.new_data.role,
                    game: suggestion.new_data.game,
                    league: suggestion.new_data.league,
                    nationality: suggestion.new_data.nationality,
                    year_joined: suggestion.new_data.yearJoined,
                    status: suggestion.new_data.status,
                    image: 'https://via.placeholder.com/150'
                })
                if (error) throw error
            } else if (suggestion.type === 'EDIT') {
                const { error } = await supabase.from('members').update({
                    name: suggestion.new_data.name,
                    role: suggestion.new_data.role,
                    game: suggestion.new_data.game,
                    league: suggestion.new_data.league,
                    nationality: suggestion.new_data.nationality,
                    year_joined: suggestion.new_data.yearJoined,
                    status: suggestion.new_data.status
                }).eq('id', suggestion.member_id)
                if (error) throw error
            } else if (suggestion.type === 'DELETE') {
                // First detach any suggestions linked to this member to avoid foreign key constraint errors
                await supabase.from('suggestions').update({ member_id: null }).eq('member_id', suggestion.member_id)

                const { error } = await supabase.from('members').delete().eq('id', suggestion.member_id)
                if (error) throw error
            }

            await supabase.from('suggestions').update({ status: 'APPROVED' }).eq('id', suggestion.id)
            fetchMembers()
            fetchSuggestions()
            alert('Suggestion approuvée et appliquée !')
        } catch (error) {
            console.error('Error approving suggestion:', error)
            alert('Erreur lors de l\'approbation')
        }
    }

    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('name')

        if (error) {
            console.error('Error fetching members:', error)
            return
        }

        const mappedMembers: KCMember[] = (data || []).map(m => ({
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
        setMembers(mappedMembers)
        setLoading(false)
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()

        if (editingMemberId) {
            const { error } = await supabase.from('members').update({
                name: newMember.name,
                role: newMember.role,
                game: newMember.game,
                league: newMember.league,
                nationality: newMember.nationality,
                year_joined: newMember.yearJoined,
                status: newMember.status
            }).eq('id', editingMemberId)

            if (error) {
                console.error('Error updating member:', error)
                alert('Erreur lors de la modification')
            } else {
                resetForm()
                fetchMembers()
            }
        } else {
            const generatedId = newMember.name!.toLowerCase().replace(/[^a-z0-9]/g, '')
            const { error } = await supabase.from('members').insert({
                id: generatedId,
                name: newMember.name,
                role: newMember.role,
                game: newMember.game,
                league: newMember.league,
                nationality: newMember.nationality,
                year_joined: newMember.yearJoined,
                status: newMember.status,
                image: 'https://via.placeholder.com/150'
            })

            if (error) {
                console.error('Error adding member:', error)
                alert('Erreur lors de l\'ajout')
            } else {
                resetForm()
                fetchMembers()
            }
        }
    }

    const resetForm = () => {
        setNewMember({
            name: '',
            role: 'Player',
            game: 'League of Legends',
            league: 'LFL',
            nationality: '🇫🇷',
            yearJoined: new Date().getFullYear(),
            status: 'Active'
        })
        setEditingMemberId(null)
    }

    const handleEdit = (member: KCMember) => {
        setEditingMemberId(member.id)
        setNewMember({
            name: member.name,
            role: member.role,
            game: member.game,
            league: member.league,
            nationality: member.nationality,
            yearJoined: member.yearJoined,
            status: member.status
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return

        const { error } = await supabase.from('members').delete().eq('id', id)

        if (error) {
            console.error('Error deleting member:', error)
            alert('Erreur lors de la suppression')
        } else {
            fetchMembers()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    if (loading) return <div className="p-6 text-white">Chargement...</div>

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-kc-white">Backoffice KCDLE</h1>
                <div className="flex gap-4">
                    <Link to="/" className="text-gray-400 hover:text-white">Retour au jeu</Link>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Déconnexion</button>
                </div>
            </div>

            <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
                <button
                    onClick={() => setActiveTab('MEMBERS')}
                    className={`text-xl font-bold pb-2 ${activeTab === 'MEMBERS' ? 'text-kc-gold border-b-2 border-kc-gold' : 'text-gray-400'}`}
                >
                    Membres
                </button>
                <button
                    onClick={() => setActiveTab('SUGGESTIONS')}
                    className={`text-xl font-bold pb-2 ${activeTab === 'SUGGESTIONS' ? 'text-kc-gold border-b-2 border-kc-gold' : 'text-gray-400'}`}
                >
                    Suggestions ({suggestions.filter(s => s.status === 'PENDING').length})
                </button>
            </div>

            {activeTab === 'MEMBERS' ? (
                <>
                    <div className="bg-kc-blue p-6 rounded-xl border border-kc-gold mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-kc-gold">
                                {editingMemberId ? 'Modifier le membre' : 'Ajouter un membre'}
                            </h2>
                            {editingMemberId && (
                                <button
                                    onClick={resetForm}
                                    className="text-sm text-gray-400 hover:text-white underline"
                                >
                                    Annuler la modification
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                                required
                            />
                            <select
                                value={newMember.role}
                                onChange={e => setNewMember({ ...newMember, role: e.target.value as any })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                            >
                                <option value="Player">Joueur</option>
                                <option value="Coach">Coach</option>
                                <option value="CEO">CEO</option>
                                <option value="Streamer">Streamer</option>
                                <option value="Staff">Staff</option>
                            </select>
                            <select
                                value={newMember.game}
                                onChange={e => setNewMember({ ...newMember, game: e.target.value as any })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                            >
                                <option value="League of Legends">League of Legends</option>
                                <option value="Valorant">Valorant</option>
                                <option value="Rocket League">Rocket League</option>
                                <option value="TFT">TFT</option>
                                <option value="General">General</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Ligue (ex: LFL, VCT...)"
                                value={newMember.league}
                                onChange={e => setNewMember({ ...newMember, league: e.target.value })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nationalité (Emoji)"
                                value={newMember.nationality}
                                onChange={e => setNewMember({ ...newMember, nationality: e.target.value })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Année d'arrivée"
                                value={newMember.yearJoined}
                                onChange={e => setNewMember({ ...newMember, yearJoined: parseInt(e.target.value) })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                                required
                            />
                            <select
                                value={newMember.status}
                                onChange={e => setNewMember({ ...newMember, status: e.target.value as any })}
                                className="p-2 rounded bg-kc-dark border border-gray-600 text-white"
                            >
                                <option value="Active">Actif</option>
                                <option value="Inactive">Inactif</option>
                                <option value="Legend">Légende</option>
                            </select>
                            <button type="submit" className="md:col-span-2 bg-kc-gold text-kc-dark font-bold py-2 rounded hover:bg-white transition-colors">
                                {editingMemberId ? 'MODIFIER' : 'AJOUTER'}
                            </button>
                        </form>
                    </div>

                    <div className="grid gap-4">
                        {members.map(member => (
                            <div key={member.id} className="bg-kc-blue p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-sm text-gray-400">{member.game} - {member.role} ({member.league})</p>
                                    <p className="text-xs text-gray-500">{member.nationality} - {member.yearJoined} - {member.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="text-kc-gold hover:text-white font-bold px-3 py-1 border border-kc-gold rounded hover:bg-kc-gold/10"
                                    >
                                        MODIFIER
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="text-red-500 hover:text-red-400 font-bold px-3 py-1 border border-red-500 rounded hover:bg-red-500/10"
                                    >
                                        SUPPRIMER
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    {suggestions.length === 0 && <p className="text-gray-400 text-center">Aucune suggestion en attente.</p>}
                    {suggestions.map(suggestion => (
                        <div key={suggestion.id} className={`bg-kc-blue p-4 rounded-lg border ${suggestion.status === 'PENDING' ? 'border-kc-gold' : 'border-gray-700 opacity-50'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${suggestion.type === 'ADD' ? 'bg-green-900 text-green-200' :
                                        suggestion.type === 'EDIT' ? 'bg-blue-900 text-blue-200' :
                                            'bg-red-900 text-red-200'
                                        }`}>
                                        {suggestion.type === 'ADD' ? 'AJOUT' : suggestion.type === 'EDIT' ? 'MODIFICATION' : 'SUPPRESSION'}
                                    </span>
                                    <div className="text-sm text-gray-400">
                                        {new Date(suggestion.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {suggestion.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleSuggestionAction(suggestion, 'APPROVE')}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                                            >
                                                Valider
                                            </button>
                                            <button
                                                onClick={() => handleSuggestionAction(suggestion, 'REJECT')}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                                            >
                                                Refuser
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`font-bold ${suggestion.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>
                                            {suggestion.status === 'APPROVED' ? 'VALIDÉ' : 'REFUSÉ'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {suggestion.type === 'DELETE' ? (
                                <p>Demande de suppression pour le membre ID: <span className="font-bold">{suggestion.member_id}</span></p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Nom: <span className="font-bold">{suggestion.new_data.name}</span></div>
                                    <div>Rôle: <span className="font-bold">{suggestion.new_data.role}</span></div>
                                    <div>Jeu: <span className="font-bold">{suggestion.new_data.game}</span></div>
                                    <div>Ligue: <span className="font-bold">{suggestion.new_data.league}</span></div>
                                    <div>Nationalité: <span className="font-bold">{suggestion.new_data.nationality}</span></div>
                                    <div>Année: <span className="font-bold">{suggestion.new_data.yearJoined}</span></div>
                                    <div>Statut: <span className="font-bold">{suggestion.new_data.status}</span></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

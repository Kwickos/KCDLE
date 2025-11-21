import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { type KCMember } from '../data/members'

interface SuggestionModalProps {
    isOpen: boolean
    onClose: () => void
    members: KCMember[]
}

type SuggestionType = 'ADD' | 'EDIT' | 'DELETE'

export default function SuggestionModal({ isOpen, onClose, members }: SuggestionModalProps) {
    const [type, setType] = useState<SuggestionType>('ADD')
    const [selectedMemberId, setSelectedMemberId] = useState<string>('')
    const [formData, setFormData] = useState<Partial<KCMember>>({
        name: '',
        role: 'Player',
        game: 'League of Legends',
        league: 'LFL',
        nationality: '🇫🇷',
        yearJoined: new Date().getFullYear(),
        status: 'Active'
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload: any = {
                type,
                status: 'PENDING'
            }

            if (type === 'ADD') {
                payload.new_data = formData
            } else {
                payload.member_id = selectedMemberId
                if (type === 'EDIT') {
                    payload.new_data = formData
                }
            }

            const { error } = await supabase.from('suggestions').insert(payload)

            if (error) throw error
            setSuccess(true)
            setTimeout(() => {
                onClose()
                setSuccess(false)
                setFormData({
                    name: '',
                    role: 'Player',
                    game: 'League of Legends',
                    league: 'LFL',
                    nationality: '🇫🇷',
                    yearJoined: new Date().getFullYear(),
                    status: 'Active'
                })
                setType('ADD')
            }, 2000)
        } catch (error) {
            console.error('Error submitting suggestion:', error)
            alert('Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    const handleMemberSelect = (id: string) => {
        setSelectedMemberId(id)
        const member = members.find(m => m.id === id)
        if (member) {
            setFormData({
                name: member.name,
                role: member.role,
                game: member.game,
                league: member.league,
                nationality: member.nationality,
                yearJoined: member.yearJoined,
                status: member.status
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-kc-dark border border-kc-gold rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-kc-gold">Suggérer une modification</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">✅</div>
                        <p className="text-xl font-bold text-white">Merci !</p>
                        <p className="text-gray-400">Ta suggestion a été envoyée et sera examinée.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-2 mb-6">
                            {(['ADD', 'EDIT', 'DELETE'] as SuggestionType[]).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex-1 py-2 rounded font-bold text-sm ${type === t ? 'bg-kc-blue text-kc-gold border border-kc-gold' : 'bg-gray-800 text-gray-400'
                                        }`}
                                >
                                    {t === 'ADD' ? 'AJOUTER' : t === 'EDIT' ? 'MODIFIER' : 'SUPPRIMER'}
                                </button>
                            ))}
                        </div>

                        {(type === 'EDIT' || type === 'DELETE') && (
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Membre concerné</label>
                                <select
                                    value={selectedMemberId}
                                    onChange={(e) => handleMemberSelect(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                    required
                                >
                                    <option value="">Choisir un membre...</option>
                                    {members.sort((a, b) => a.name.localeCompare(b.name)).map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(type === 'ADD' || type === 'EDIT') && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Rôle</label>
                                        <select
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                        >
                                            <option value="Player">Joueur</option>
                                            <option value="Coach">Coach</option>
                                            <option value="Streamer">Streamer</option>
                                            <option value="Staff">Staff</option>
                                            <option value="CEO">CEO</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Jeu</label>
                                        <select
                                            value={formData.game}
                                            onChange={e => setFormData({ ...formData, game: e.target.value as any })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                        >
                                            <option value="League of Legends">League of Legends</option>
                                            <option value="Valorant">Valorant</option>
                                            <option value="Rocket League">Rocket League</option>
                                            <option value="TFT">TFT</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Ligue</label>
                                        <input
                                            type="text"
                                            value={formData.league}
                                            onChange={e => setFormData({ ...formData, league: e.target.value })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Nationalité</label>
                                        <input
                                            type="text"
                                            value={formData.nationality}
                                            onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Année</label>
                                        <input
                                            type="number"
                                            value={formData.yearJoined}
                                            onChange={e => setFormData({ ...formData, yearJoined: parseInt(e.target.value) })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-1">Statut</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                                        >
                                            <option value="Active">Actif</option>
                                            <option value="Inactive">Inactif</option>
                                            <option value="Legend">Légende</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (type !== 'ADD' && !selectedMemberId)}
                            className="w-full mt-6 bg-kc-gold text-kc-dark font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : 'ENVOYER LA SUGGESTION'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

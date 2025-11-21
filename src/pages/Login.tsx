import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/admin')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-kc-dark p-4">
            <div className="bg-kc-blue p-8 rounded-xl border border-kc-gold max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-white mb-8">Connexion Admin</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-kc-dark border border-gray-600 text-white focus:border-kc-gold outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-kc-dark border border-gray-600 text-white focus:border-kc-gold outline-none"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-kc-gold text-kc-dark font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'SE CONNECTER'}
                    </button>
                </form>
            </div>
        </div>
    )
}

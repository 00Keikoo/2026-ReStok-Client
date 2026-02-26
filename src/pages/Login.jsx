// src/pages/Login.jsx

import { useState } from 'react'
import api from '../services/api'

const Login = () => {
    // useState = tempat menyimpan data yang bisa berubah
    // kalau data berubah, React otomatis update tampilan
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')


    const handleLogin = async (e) => {
        e.preventDefault() // -> mencegah halaman refresh
        setLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/login', { email, password })
            const { token, user } = response.data.data

            //simpan token dan data user ke localstorage
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            //redirect ke dashboard
            window.location.href = '/dashboard'
        } catch (error) {
            setError(error.response?.data?.message || 'Login gagal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🚗 Showroom Login</h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@gmail.com"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}


const styles = {
    container: {
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        backgroundColor: '#f0f2f5'
    },
    card: {
        backgroundColor: 'white', padding: '2rem',
        borderRadius: '8px', width: '360px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: { textAlign: 'center', marginBottom: '1.5rem' },
    inputGroup: { marginBottom: '1rem' },
    input: {
        width: '100%', padding: '0.6rem',
        marginTop: '0.3rem', borderRadius: '4px',
        border: '1px solid #ccc', boxSizing: 'border-box'
    },
    button: {
        width: '100%', padding: '0.75rem',
        backgroundColor: '#1890ff', color: 'white',
        border: 'none', borderRadius: '4px',
        cursor: 'pointer', fontSize: '1rem',
        marginTop: '0.5rem'
    },
    error: { color: 'red', marginBottom: '1rem', textAlign: 'center' }
}

export default Login
// src/pages/Users.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'SALES' })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const navigate = useNavigate()
    const currentUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        // Redirect kalau bukan admin
        if (currentUser?.role !== 'ADMIN') {
            navigate('/dashboard')
            return
        }
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await api.get('/users')
            setUsers(res.data.data)
        } catch (err) {
            console.error('Gagal ambil data user:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleTambah = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')
        try {
            await api.post('/users', formData)
            setFormData({ name: '', email: '', password: '', role: 'SALES' })
            setShowAddModal(false)
            fetchUsers()
        } catch (err) {
            setFormError(err.response?.data?.message || 'Gagal tambah user')
        } finally {
            setFormLoading(false) }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await api.delete(`/users/${selectedUser.id}`)
            setShowConfirm(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal hapus user!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const roleColor = (role) => role === 'ADMIN' ? '#1890ff' : '#52c41a'

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Dashboard</button>
                    <h2 style={{ margin: 0 }}>👥 Manajemen User</h2>
                </div>
                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                    Login sebagai <strong>{currentUser?.name}</strong>
                </span>
            </div>

            <div style={styles.content}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, color: '#888' }}>Total {users.length} user terdaftar</p>
                    <button onClick={() => setShowAddModal(true)} style={styles.addBtn}>+ Tambah User</button>
                </div>

                {/* Tabel */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Loading...</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.thead}>
                                    <th style={styles.th}>No</th>
                                    <th style={styles.th}>Nama</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Dibuat</th>
                                    <th style={styles.th}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={user.id} style={{
                                        ...styles.tr,
                                        backgroundColor: user.id === currentUser?.id ? '#fffbe6' : 'white'
                                    }}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>
                                            <strong>{user.name}</strong>
                                            {user.id === currentUser?.id && (
                                                <span style={styles.youBadge}>Kamu</span>
                                            )}
                                        </td>
                                        <td style={styles.td}>{user.email}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.roleBadge,
                                                backgroundColor: roleColor(user.role)
                                            }}>{user.role}</span>
                                        </td>
                                        <td style={styles.td}>
                                            {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td style={styles.td}>
                                            {user.id !== currentUser?.id ? (
                                                <button
                                                    onClick={() => { setSelectedUser(user); setShowConfirm(true) }}
                                                    style={styles.deleteBtn}>
                                                    🗑️ Hapus
                                                </button>
                                            ) : (
                                                <span style={{ color: '#ccc', fontSize: '0.8rem' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Tambah User */}
            {showAddModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0 }}>👤 Tambah User Baru</h3>
                            <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}>✕</button>
                        </div>

                        {formError && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{formError}</p>}

                        <form onSubmit={handleTambah}>
                            {[
                                { name: 'name', label: 'Nama Lengkap *', placeholder: 'John Doe', type: 'text' },
                                { name: 'email', label: 'Email *', placeholder: 'john@gmail.com', type: 'email' },
                                { name: 'password', label: 'Password *', placeholder: 'Min 6 karakter', type: 'password' },
                            ].map(f => (
                                <div key={f.name} style={styles.inputGroup}>
                                    <label style={styles.label}>{f.label}</label>
                                    <input
                                        name={f.name}
                                        type={f.type}
                                        value={formData[f.name]}
                                        onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                        placeholder={f.placeholder}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                            ))}

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Role *</label>
                                <select name="role" value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={styles.input} required>
                                    <option value="SALES">SALES</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    style={styles.cancelBtn}>Batal</button>
                                <button type="submit" disabled={formLoading} style={styles.submitBtn}>
                                    {formLoading ? 'Menyimpan...' : 'Simpan User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Hapus */}
            {showConfirm && (
                <div style={styles.overlay}>
                    <div style={{ ...styles.modal, maxWidth: '360px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
                        <h3 style={{ margin: '0 0 0.5rem' }}>Hapus User?</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
                            <strong>{selectedUser?.name}</strong> ({selectedUser?.role}) akan dihapus permanen.
                        </p>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button onClick={() => setShowConfirm(false)} style={styles.cancelBtn}
                                disabled={deleteLoading}>Batal</button>
                            <button onClick={handleDelete} disabled={deleteLoading}
                                style={{ ...styles.submitBtn, backgroundColor: '#ff4d4f' }}>
                                {deleteLoading ? 'Menghapus...' : 'Ya, Hapus!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
    navbar: {
        backgroundColor: 'white', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100
    },
    backBtn: {
        padding: '0.4rem 0.8rem', backgroundColor: '#f0f0f0',
        border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
    },
    content: { padding: '2rem' },
    addBtn: {
        padding: '0.5rem 1.2rem', backgroundColor: '#1890ff',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    tableWrapper: {
        backgroundColor: 'white', borderRadius: '12px',
        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflowX: 'auto'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: '#fafafa' },
    th: {
        padding: '1rem', textAlign: 'left', fontWeight: '600',
        fontSize: '0.85rem', color: '#555', borderBottom: '1px solid #f0f0f0'
    },
    tr: { borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' },
    td: { padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#333' },
    roleBadge: {
        color: 'white', padding: '0.2rem 0.6rem',
        borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'
    },
    youBadge: {
        marginLeft: '0.5rem', backgroundColor: '#fff7e6', color: '#fa8c16',
        padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold'
    },
    deleteBtn: {
        padding: '0.3rem 0.8rem', backgroundColor: '#fff1f0',
        color: '#ff4d4f', border: '1px solid #ffccc7',
        borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
    },
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem'
    },
    modal: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '1.5rem', width: '100%', maxWidth: '440px'
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.2rem'
    },
    closeBtn: {
        background: '#f0f0f0', border: 'none', borderRadius: '50%',
        width: '30px', height: '30px', cursor: 'pointer', fontSize: '0.9rem'
    },
    inputGroup: { marginBottom: '0.8rem' },
    label: { fontSize: '0.82rem', color: '#555', fontWeight: '500', display: 'block', marginBottom: '0.3rem' },
    input: {
        width: '100%', padding: '0.55rem 0.8rem', borderRadius: '6px',
        border: '1px solid #d9d9d9', fontSize: '0.9rem',
        backgroundColor: 'white', color: '#000', boxSizing: 'border-box'
    },
    cancelBtn: {
        flex: 1, padding: '0.7rem', border: '1px solid #d9d9d9',
        borderRadius: '6px', cursor: 'pointer', background: 'white', color: '#555'
    },
    submitBtn: {
        flex: 1, padding: '0.7rem', backgroundColor: '#1890ff',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontWeight: 'bold'
    },
}

export default Users
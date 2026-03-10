// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = () => {
    const [cars, setCars] = useState([])
    const [summary, setSummary] = useState({ total: 0, ready: 0, sold: 0 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        brand: '', model: '', type: '', transmisi: '',
        year: '', color: '', price: '', plateNumber: '',
        description: '', image: null  // ← image ada di sini
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        fetchCars()
    }, [filter])

    const fetchCars = async () => {
        try {
            setLoading(true)
            const url = filter ? `/cars?status=${filter}` : '/cars'
            const response = await api.get(url)
            setCars(response.data.data)
            setSummary(response.data.summary)
        } catch (error) {
            console.error('Gagal ambil data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    const handleStatusChange = async (id, statusBaru) => {
        try {
            await api.patch(`/cars/${id}/status`, { status: statusBaru })
            fetchCars()
        } catch (error) {
            console.log('Full error: ', error)
            alert('Gagal update status!')
        }
    }

    const handleTambahMobil = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')
        try {
            const data = new FormData()
            data.append('brand', formData.brand)
            data.append('model', formData.model)
            data.append('type', formData.type)
            data.append('transmisi', formData.transmisi)
            data.append('year', formData.year)
            data.append('color', formData.color)
            data.append('price', formData.price)
            data.append('plateNumber', formData.plateNumber)
            data.append('description', formData.description)
            if (formData.image) {
                data.append('image', formData.image)
            }
            await api.post('/cars', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setFormData({
                brand: '', model: '', type: '', transmisi: '',
                year: '', color: '', price: '', plateNumber: '',
                description: '', image: null
            })
            setShowModal(false)
            fetchCars()
        } catch (error) {
            setFormError(error.response?.data?.message || 'Gagal tambah mobil')
        } finally {
            setFormLoading(false)
        }
    }

    // ← untuk input teks biasa
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // ← khusus untuk input file
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, image: file })
        }
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={{ margin: 0 }}>🚗 Showroom Dashboard</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Halo, {user?.name} ({user?.role})</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                {/* Summary Cards */}
                <div style={styles.summaryContainer}>
                    <div style={{ ...styles.summaryCard, borderTop: '4px solid #1890ff' }}>
                        <h3>Total Mobil</h3>
                        <p style={styles.summaryNumber}>{summary.total}</p>
                    </div>
                    <div style={{ ...styles.summaryCard, borderTop: '4px solid #52c41a' }}>
                        <h3>Ready</h3>
                        <p style={styles.summaryNumber}>{summary.ready}</p>
                    </div>
                    <div style={{ ...styles.summaryCard, borderTop: '4px solid #ff4d4f' }}>
                        <h3>Sold</h3>
                        <p style={styles.summaryNumber}>{summary.sold}</p>
                    </div>
                </div>

                {/* Filter + Tombol Tambah */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={styles.filterContainer}>
                        <button onClick={() => setFilter('')}
                            style={{ ...styles.filterBtn, backgroundColor: filter === '' ? '#1890ff' : '#fff', color: filter === '' ? '#fff' : '#000' }}>
                            Semua
                        </button>
                        <button onClick={() => setFilter('READY')}
                            style={{ ...styles.filterBtn, backgroundColor: filter === 'READY' ? '#52c41a' : '#fff', color: filter === 'READY' ? '#fff' : '#000' }}>
                            Ready
                        </button>
                        <button onClick={() => setFilter('SOLD')}
                            style={{ ...styles.filterBtn, backgroundColor: filter === 'SOLD' ? '#ff4d4f' : '#fff', color: filter === 'SOLD' ? '#fff' : '#000' }}>
                            Sold
                        </button>
                    </div>
                    {user?.role === 'ADMIN' && (
                        <button onClick={() => setShowModal(true)} style={styles.addBtn}>
                            + Tambah Mobil
                        </button>
                    )}
                </div>

                {/* Tabel Mobil */}
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Foto</th>
                                <th style={styles.th}>Brand</th>
                                <th style={styles.th}>Model</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Tahun</th>
                                <th style={styles.th}>Warna</th>
                                <th style={styles.th}>Harga</th>
                                <th style={styles.th}>Status</th>
                                {user?.role === 'ADMIN' && <th style={styles.th}>Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {cars.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                                        Tidak ada data mobil
                                    </td>
                                </tr>
                            ) : (
                                cars.map((car) => (
                                    <tr key={car.id} style={styles.tableRow}>
                                        <td style={styles.td}>
                                            {car.image ? (
                                                <img
                                                    src={`http://localhost:3000${car.image}`}
                                                    alt={car.model}
                                                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <span style={{ color: '#ccc' }}>No foto</span>
                                            )}
                                        </td>
                                        <td style={styles.td}>{car.brand}</td>
                                        <td style={styles.td}>{car.model}</td>
                                        <td style={styles.td}>{car.type}</td>
                                        <td style={styles.td}>{car.year}</td>
                                        <td style={styles.td}>{car.color}</td>
                                        <td style={styles.td}>Rp {car.price.toLocaleString('id-ID')}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: car.status === 'READY' ? '#f6ffed' : '#fff1f0',
                                                color: car.status === 'READY' ? '#52c41a' : '#ff4d4f',
                                                border: `1px solid ${car.status === 'READY' ? '#b7eb8f' : '#ffa39e'}`
                                            }}>
                                                {car.status}
                                            </span>
                                        </td>
                                        {user?.role === 'ADMIN' && (
                                            <td style={styles.td}>
                                                {car.status === 'READY' ? (
                                                    <button onClick={() => handleStatusChange(car.id, 'SOLD')}
                                                        style={{ ...styles.actionBtn, backgroundColor: '#ff4d4f' }}>
                                                        Mark Sold
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleStatusChange(car.id, 'READY')}
                                                        style={{ ...styles.actionBtn, backgroundColor: '#52c41a' }}>
                                                        Mark Ready
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {/* Modal Tambah Mobil */}
                {showModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Tambah Mobil Baru</h3>
                                <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
                            </div>

                            {formError && <p style={{ color: 'red', marginBottom: '1rem' }}>{formError}</p>}

                            <form onSubmit={handleTambahMobil}>
                                <div style={styles.formGrid}>
                                    <div style={styles.inputGroup}>
                                        <label>Brand *</label>
                                        <input name="brand" value={formData.brand} onChange={handleFormChange}
                                            placeholder="Toyota" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Model *</label>
                                        <input name="model" value={formData.model} onChange={handleFormChange}
                                            placeholder="Avanza" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Type *</label>
                                        <input name="type" value={formData.type} onChange={handleFormChange}
                                            placeholder="MPV" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Transmisi *</label>
                                        <select name="transmisi" value={formData.transmisi} onChange={handleFormChange}
                                            style={styles.input} required>
                                            <option value="">Pilih transmisi</option>
                                            <option value="Manual">Manual</option>
                                            <option value="Automatic">Automatic</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Tahun *</label>
                                        <input name="year" value={formData.year} onChange={handleFormChange}
                                            placeholder="2024" type="number" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Warna *</label>
                                        <input name="color" value={formData.color} onChange={handleFormChange}
                                            placeholder="Putih" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Harga *</label>
                                        <input name="price" value={formData.price} onChange={handleFormChange}
                                            placeholder="250000000" type="number" style={styles.input} required />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label>Nomor Plat</label>
                                        <input name="plateNumber" value={formData.plateNumber} onChange={handleFormChange}
                                            placeholder="B 1234 ABC" style={styles.input} />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label>Deskripsi</label>
                                    <textarea name="description" value={formData.description} onChange={handleFormChange}
                                        placeholder="Deskripsi tambahan..."
                                        style={{ ...styles.input, height: '80px', resize: 'vertical' }} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label>Foto Mobil</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ ...styles.input, padding: '0.4rem' }}
                                    />
                                    {/* Preview foto sebelum submit */}
                                    {formData.image instanceof File && (
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="preview"
                                            style={{ marginTop: '0.5rem', width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setShowModal(false)}
                                        style={{ ...styles.filterBtn, flex: 1 }}>
                                        Batal
                                    </button>
                                    <button type="submit" disabled={formLoading}
                                        style={{ ...styles.addBtn, flex: 1 }}>
                                        {formLoading ? 'Menyimpan...' : 'Simpan Mobil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    input: {
        width: '100%', padding: '0.6rem',
        marginTop: '0.3rem', borderRadius: '4px',
        border: '1px solid #d9d9d9', boxSizing: 'border-box',
        backgroundColor: 'white', color: '#000', fontSize: '0.95rem'
    },
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
    navbar: {
        backgroundColor: 'white', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    logoutBtn: {
        padding: '0.4rem 1rem', backgroundColor: '#ff4d4f',
        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
    },
    content: { padding: '2rem' },
    summaryContainer: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
    summaryCard: {
        backgroundColor: 'white', padding: '1.5rem',
        borderRadius: '8px', flex: 1, textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    summaryNumber: { fontSize: '2rem', fontWeight: 'bold', margin: 0 },
    filterContainer: { marginBottom: '1rem', display: 'flex', gap: '0.5rem' },
    filterBtn: {
        padding: '0.5rem 1.2rem', border: '1px solid #d9d9d9',
        borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff'
    },
    table: { width: '100%', backgroundColor: 'white', borderRadius: '8px', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#fafafa' },
    th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#000' },
    td: { padding: '1rem', borderBottom: '1px solid #f0f0f0', color: '#000' },
    tableRow: { transition: 'background 0.2s' },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' },
    actionBtn: {
        padding: '0.3rem 0.8rem', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    },
    addBtn: {
        padding: '0.5rem 1.2rem', backgroundColor: '#1890ff',
        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
    },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 1000
    },
    modalCard: {
        backgroundColor: 'white', padding: '2rem',
        borderRadius: '8px', width: '600px',
        maxHeight: '90vh', overflowY: 'auto'
    },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    inputGroup: { marginBottom: '1rem' },
    closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
}

export default Dashboard
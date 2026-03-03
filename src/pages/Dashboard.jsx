// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = () => {
    const [cars, setCars] = useState([])
    const [summary, setSummary] = useState({ total: 0, ready: 0, sold: 0 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('') // filter by status
    const [showModel, setShowModel] = useState(false)
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        type: '',
        transmisi: '',
        year: '',
        color: '',
        price: '',
        plateNumber: '',
        description: ''
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    //Ambil data user dari localStorage
    const user = JSON.parse(localStorage.getItem('user'))

    // useEffect = jalankan code ini saat komponen pertama kali muncul 
    useEffect(() => {
        fetchCars()
    }, [filter])

    const fetchCars = async () => {
        try {
            setLoading(true)
            const url = filter ? `/cars?status=${filter}` : '/cars'
            const response = await api.get(url)
            setCars(response.data.data)
            setSummart(response.data.summary)
        } catch (error) {
            console.error('Gagal ambil data:'.error)
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

                {/* Filter */}
                <div style={styles.filterContainer}>
                    <button
                        onClick={() => setFilter('')}
                        style={{ ...styles.filterBtn, backgroundColor: filter === '' ? '#1890ff' : '#fff', color: filter === '' ? '#fff' : '#000' }}
                    >Semua</button>
                    <button
                        onClick={() => setFilter('READY')}
                        style={{ ...styles.filterBtn, backgroundColor: filter === 'READY' ? '#52c41a' : '#fff', color: filter === 'READY' ? '#fff' : '#000' }}
                    >Ready</button>
                    <button
                        onClick={() => setFilter('SOLD')}
                        style={{ ...styles.filterBtn, backgroundColor: filter === 'SOLD' ? '#ff4d4f' : '#fff', color: filter === 'SOLD' ? '#fff' : '#000' }}
                    >Sold</button>
                </div>

                {/* Tabel Mobil */}
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
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
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                        Tidak ada data mobil
                                    </td>
                                </tr>
                            ) : (
                                cars.map((car) => (
                                    <tr key={car.id} style={styles.tableRow}>
                                        <td style={styles.td}>{car.brand}</td>
                                        <td style={styles.td}>{car.model}</td>
                                        <td style={styles.td}>{car.type}</td>
                                        <td style={styles.td}>{car.year}</td>
                                        <td style={styles.td}>{car.color}</td>
                                        <td style={styles.td}>
                                            Rp {car.price.toLocaleString('id-ID')}
                                        </td>
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
                                                    <button
                                                        onClick={() => handleStatusChange(car.id, 'SOLD')}
                                                        style={{ ...styles.actionBtn, backgroundColor: '#ff4d4f' }}
                                                    >
                                                        Mark Sold
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusChange(car.id, 'READY')}
                                                        style={{ ...styles.actionBtn, backgroundColor: '#52c41a' }}
                                                    >
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
            </div>
        </div>
    )
}

const styles = {
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
        borderRadius: '4px', cursor: 'pointer'
    },
    table: { width: '100%', backgroundColor: 'white', borderRadius: '8px', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#fafafa' },
    th: { padding: '1rem', textAlign: 'left', borderBottom: '1px solid #f0f0f0' },
    td: { padding: '1rem', borderBottom: '1px solid #f0f0f0' },
    tableRow: { transition: 'background 0.2s' },
    badge: { padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' },
    actionBtn: {
        padding: '0.3rem 0.8rem', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    }

}

export default Dashboard
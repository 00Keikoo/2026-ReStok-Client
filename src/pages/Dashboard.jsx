// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import api from '../services/api'

const BASE_URL = 'http://localhost:3000'

const cssString = `
  html, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  * { box-sizing: border-box; }

  .dashboard-container { min-height: 100vh; background-color: #f0f2f5; }

  .navbar {
    background-color: white; padding: 1rem 2rem;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100;
  }
  .navbar h2 { font-size: 1.2rem; margin: 0; }
  .navbar-right { display: flex; align-items: center; gap: 1rem; }
  .navbar-right span { color: #555; font-size: 0.9rem; }

  .logout-btn {
    padding: 0.4rem 0.8rem; background-color: #ff4d4f;
    color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
  }

  .content { padding: 1.5rem; }

  .summary-container {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 1.5rem;
  }
  .summary-card {
    background: white; padding: 1.2rem; border-radius: 12px;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .summary-label { color: #888; font-size: 0.85rem; margin: 0 0 0.3rem; }
  .summary-number { font-size: 2rem; font-weight: bold; margin: 0; }

  .toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.8rem;
  }
  .filter-container { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .filter-btn {
    padding: 0.4rem 1rem; border: 1px solid #d9d9d9;
    border-radius: 20px; cursor: pointer; font-size: 0.85rem; background: white;
  }
  .add-btn {
    padding: 0.5rem 1.2rem; background-color: #1890ff;
    color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
  }
  .car-card {
    background: white; border-radius: 12px; overflow: hidden;
    cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .car-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
  .card-thumb { position: relative; height: 160px; background-color: #f5f5f5; }
  .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .card-no-img {
    width: 100%; height: 100%; display: flex;
    align-items: center; justify-content: center; font-size: 3rem;
  }
  .card-badge {
    position: absolute; top: 8px; right: 8px; color: white;
    padding: 0.15rem 0.5rem; border-radius: 20px; font-size: 0.7rem; font-weight: bold;
  }
  .card-body { padding: 0.8rem 1rem 1rem; }
  .card-title { font-size: 0.95rem; font-weight: bold; color: #222; margin: 0 0 0.2rem; }
  .card-sub { font-size: 0.8rem; color: #888; margin: 0.15rem 0; }
  .card-price { font-weight: bold; color: #1890ff; font-size: 0.95rem; margin: 0.4rem 0 0; }
  .card-media-count { font-size: 0.75rem; color: #aaa; margin-top: 0.2rem; }

  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.6); display: flex;
    justify-content: center; align-items: center; z-index: 1000; padding: 1rem;
  }

  .detail-modal {
    background: white; border-radius: 16px; width: 100%;
    max-width: 560px; max-height: 90vh; overflow-y: auto; position: relative;
  }
  .slideshow {
    position: relative; height: 280px; background-color: #111;
    border-radius: 16px 16px 0 0; overflow: hidden;
  }
  .slideshow img, .slideshow video { width: 100%; height: 100%; object-fit: contain; }
  .close-btn {
    position: absolute; top: 0.8rem; right: 0.8rem;
    background: rgba(0,0,0,0.4); border: none; border-radius: 50%;
    width: 30px; height: 30px; color: white; font-size: 1rem;
    cursor: pointer; z-index: 20; display: flex; align-items: center; justify-content: center;
  }
  .slide-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%;
    width: 36px; height: 36px; font-size: 1.4rem; cursor: pointer; z-index: 10;
    display: flex; align-items: center; justify-content: center;
  }
  .dot-container {
    position: absolute; bottom: 8px; left: 50%;
    transform: translateX(-50%); display: flex; gap: 6px;
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; cursor: pointer; }
  .slide-counter {
    position: absolute; top: 8px; right: 8px;
    background: rgba(0,0,0,0.5); color: white;
    padding: 0.15rem 0.5rem; border-radius: 20px; font-size: 0.75rem;
  }
  .no-media-box {
    display: flex; align-items: center; justify-content: center;
    height: 100%; color: #888; font-size: 1.1rem;
  }
  .detail-body { padding: 1.2rem; }
  .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .detail-header h2 { font-size: 1.2rem; margin: 0 0 0.2rem; }
  .detail-header p { color: #888; font-size: 0.85rem; margin: 0; }
  .status-badge {
    color: white; padding: 0.25rem 0.7rem; border-radius: 20px;
    font-size: 0.8rem; font-weight: bold; white-space: nowrap;
  }
  .detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.8rem; margin-top: 1rem;
  }
  .detail-item { display: flex; flex-direction: column; gap: 0.2rem; }
  .detail-label { font-size: 0.75rem; color: #aaa; text-transform: uppercase; }
  .detail-value { font-weight: 500; color: #222; font-size: 0.9rem; }
  .status-btn {
    width: 100%; padding: 0.75rem; color: white; border: none;
    border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.95rem; margin-top: 1rem;
  }
  .action-row {
    display: flex; gap: 0.8rem; margin-top: 0.8rem;
  }
  .action-row .status-btn { margin-top: 0; }

  .add-modal {
    background: white; border-radius: 16px; width: 100%;
    max-width: 620px; max-height: 90vh; overflow-y: auto; padding: 1.5rem;
  }
  .add-modal-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 1.2rem;
  }
  .close-btn-inline {
    background: #f0f0f0; border: none; border-radius: 50%;
    width: 30px; height: 30px; font-size: 0.9rem; cursor: pointer;
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
  .input-group { margin-bottom: 0.8rem; }
  .input-group label { font-size: 0.82rem; color: #555; font-weight: 500; display: block; margin-bottom: 0.3rem; }
  .input-group input, .input-group select, .input-group textarea {
    width: 100%; padding: 0.55rem 0.8rem; border-radius: 6px;
    border: 1px solid #d9d9d9; background-color: white; color: #000; font-size: 0.9rem;
  }
  .input-group textarea { resize: vertical; height: 70px; }
  .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
  .btn-cancel {
    flex: 1; padding: 0.7rem; border: 1px solid #d9d9d9;
    border-radius: 6px; cursor: pointer; background: white; color: #555;
  }
  .btn-submit {
    flex: 1; padding: 0.7rem; background-color: #1890ff;
    color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;
  }
  .preview-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }
  .preview-item { position: relative; width: 75px; height: 75px; border-radius: 6px; overflow: hidden; }
  .preview-item img, .preview-item video { width: 100%; height: 100%; object-fit: cover; }
  .preview-remove {
    position: absolute; top: 2px; right: 2px;
    background: rgba(255,0,0,0.8); color: white; border: none;
    border-radius: 50%; width: 18px; height: 18px; font-size: 0.65rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .preview-type { position: absolute; bottom: 2px; left: 3px; font-size: 0.75rem; }

  /* Confirm Dialog */
  .confirm-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex;
    justify-content: center; align-items: center; z-index: 2000;
  }
  .confirm-box {
    background: white; border-radius: 12px; padding: 2rem;
    width: 100%; max-width: 380px; text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .confirm-box h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
  .confirm-box p { color: #666; font-size: 0.9rem; margin: 0 0 1.5rem; }
  .confirm-actions { display: flex; gap: 0.8rem; }

  @media (max-width: 768px) {
    .navbar { padding: 0.8rem 1rem; }
    .navbar h2 { font-size: 1rem; }
    .navbar-right .user-info { display: none; }
    .content { padding: 0.8rem; }
    .summary-container { gap: 0.6rem; }
    .summary-card { padding: 0.8rem; }
    .summary-number { font-size: 1.5rem; }
    .card-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.8rem; }
    .card-thumb { height: 120px; }
    .form-grid { grid-template-columns: 1fr; }
    .detail-grid { grid-template-columns: 1fr; }
    .slideshow { height: 200px; }
    .action-row { flex-direction: column; }
  }

  @media (max-width: 480px) {
    .card-grid { grid-template-columns: repeat(2, 1fr); }
    .summary-label { font-size: 0.7rem; }
    .summary-number { font-size: 1.2rem; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .add-btn { text-align: center; }
  }
`

if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style')
    styleEl.innerHTML = cssString
    document.head.appendChild(styleEl)
}

const FORM_FIELDS = [
    { name: 'brand', label: 'Brand *', placeholder: 'Toyota' },
    { name: 'model', label: 'Model *', placeholder: 'Avanza' },
    { name: 'type', label: 'Type *', placeholder: 'MPV' },
    { name: 'year', label: 'Tahun *', placeholder: '2024', type: 'number' },
    { name: 'color', label: 'Warna *', placeholder: 'Putih' },
    { name: 'price', label: 'Harga *', placeholder: '250000000', type: 'number' },
    { name: 'plateNumber', label: 'Nomor Plat', placeholder: 'B 1234 ABC' },
]

const EMPTY_FORM = {
    brand: '', model: '', type: '', transmisi: '',
    year: '', color: '', price: '', plateNumber: '', description: ''
}

const CarFormFields = ({ formData, onChange }) => (
    <>
        <div className="form-grid">
            {FORM_FIELDS.map(f => (
                <div key={f.name} className="input-group">
                    <label>{f.label}</label>
                    <input name={f.name} value={formData[f.name]} onChange={onChange}
                        placeholder={f.placeholder} type={f.type || 'text'}
                        required={f.label.includes('*')} />
                </div>
            ))}
            <div className="input-group">
                <label>Transmisi *</label>
                <select name="transmisi" value={formData.transmisi} onChange={onChange} required>
                    <option value="">Pilih transmisi</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                </select>
            </div>
        </div>
        <div className="input-group">
            <label>Deskripsi</label>
            <textarea name="description" value={formData.description}
                onChange={onChange} placeholder="Deskripsi tambahan..." />
        </div>
    </>
)

const Dashboard = () => {
    const [cars, setCars] = useState([])
    const [summary, setSummary] = useState({ total: 0, ready: 0, sold: 0 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [search, setSearch] = useState('')

    // Modal tambah
    const [showAddModal, setShowAddModal] = useState(false)
    const [addForm, setAddForm] = useState(EMPTY_FORM)
    const [mediaFiles, setMediaFiles] = useState([])
    const [addLoading, setAddLoading] = useState(false)
    const [addError, setAddError] = useState('')

    // Modal detail + slideshow
    const [selectedCar, setSelectedCar] = useState(null)
    const [slideIndex, setSlideIndex] = useState(0)

    // Modal edit
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState(EMPTY_FORM)
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState('')
    const [editMediaFiles, setEditMediaFiles] = useState([])
    const [editMediaLoading, setEditMediaLoading] = useState(false)

    // Confirm hapus
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => { fetchCars() }, [filter])

    const fetchCars = async () => {
        try {
            setLoading(true)
            const url = filter ? `/cars?status=${filter}` : '/cars'
            const res = await api.get(url)
            setCars(res.data.data)
            setSummary(res.data.summary)
        } catch (err) {
            console.error('Gagal ambil data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    // ── Status ──────────────────────────────────────
    const handleStatusChange = async (id, statusBaru) => {
        try {
            await api.patch(`/cars/${id}/status`, { status: statusBaru })
            if (selectedCar?.id === id) setSelectedCar(p => ({ ...p, status: statusBaru }))
            fetchCars()
        } catch { alert('Gagal update status!') }
    }

    // ── Tambah ──────────────────────────────────────
    const handleTambah = async (e) => {
        e.preventDefault()
        setAddLoading(true)
        setAddError('')
        try {
            const data = new FormData()
            Object.keys(addForm).forEach(k => data.append(k, addForm[k]))
            mediaFiles.forEach(f => data.append('media', f))
            console.log('Isi form data: ')
            for (let [key, val] of data.entries()) {
                console.log(key, '=', val)
            }
            await api.post('/cars', data)

            setAddForm(EMPTY_FORM)
            setMediaFiles([])
            setShowAddModal(false)
            fetchCars()
        } catch (err) {
            setAddError(err.response?.data?.message || 'Gagal tambah mobil')
        } finally { setAddLoading(false) }
    }

    // ── Edit ─────────────────────────────────────────
    const handleOpenEdit = () => {
        setEditForm({
            brand: selectedCar.brand,
            model: selectedCar.model,
            type: selectedCar.type,
            transmisi: selectedCar.transmisi,
            year: selectedCar.year,
            color: selectedCar.color,
            price: selectedCar.price,
            plateNumber: selectedCar.plateNumber || '',
            description: selectedCar.description || ''
        })
        setEditError('')
        setShowEditModal(true)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setEditLoading(true)
        setEditError('')
        try {
            const res = await api.put(`/cars/${selectedCar.id}`, {
                ...editForm,
                year: parseInt(editForm.year),
                price: parseFloat(editForm.price)
            })
            setSelectedCar(prev => ({ ...prev, ...res.data.data }))
            setShowEditModal(false)
            fetchCars()
        } catch (err) {
            setEditError(err.response?.data?.message || 'Gagal update mobil')
        } finally { setEditLoading(false) }
    }

    const handleDeleteMedia = async (mediaId) => {
        try {
            await api.delete(`/cars/${selectedCar.id}/media/${mediaId}`)
            // Update selectedCar - hapus media yang sudah dihapus
            setSelectedCar(prev => ({
                ...prev,
                media: prev.media.filter(m => m.id !== mediaId)
            }))
            fetchCars()
        } catch {
            alert('Gagal hapus media!')
        }
    }

    const handleAddMedia = async () => {
        if (editMediaFiles.length === 0) return
        setEditMediaLoading(true)
        try {
            const data = new FormData()
            editMediaFiles.forEach(f => data.append('media', f))
            const res = await api.post(`/cars/${selectedCar.id}/media`, data)
            setSelectedCar(prev => ({
                ...prev,
                media: res.data.data.media
            }))
            setEditMediaFiles([])
            fetchCars()
        } catch {
            alert('Gagal  upload media!')
        } finally {
            setEditMediaLoading(false)
        }
    }

    // ── Hapus ────────────────────────────────────────
    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await api.delete(`/cars/${selectedCar.id}`)
            setShowConfirm(false)
            closeDetail()
            fetchCars()
        } catch {
            alert('Gagal hapus mobil!')
        } finally { setDeleteLoading(false) }
    }

    // ── Helpers ──────────────────────────────────────
    const openDetail = (car) => { setSelectedCar(car); setSlideIndex(0) }
    const closeDetail = () => { setSelectedCar(null); setSlideIndex(0) }
    const prevSlide = () => setSlideIndex(p => p === 0 ? selectedCar.media.length - 1 : p - 1)
    const nextSlide = () => setSlideIndex(p => p === selectedCar.media.length - 1 ? 0 : p + 1)

    const filterColors = { '': '#1890ff', 'READY': '#52c41a', 'SOLD': '#ff4d4f' }

    const filteredCars = cars.filter(car => {
        const q = search.toLowerCase()
        return (
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.type.toLowerCase().includes(q) ||
            car.color.toLowerCase().includes(q) ||
            (car.plateNumber && car.plateNumber.toLowerCase().includes(q))
        )
    })

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <div className="navbar">
                <h2>🚗 Showroom</h2>
                <div className="navbar-right">
                    <span className="user-info">Halo, <strong>{user?.name}</strong> ({user?.role})</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="content">
                {/* Summary */}
                <div className="summary-container">
                    {[
                        { label: 'Total', value: summary.total, color: '#1890ff', border: '#1890ff' },
                        { label: 'Ready', value: summary.ready, color: '#52c41a', border: '#52c41a' },
                        { label: 'Sold', value: summary.sold, color: '#ff4d4f', border: '#ff4d4f' },
                    ].map(s => (
                        <div key={s.label} className="summary-card" style={{ borderTop: `4px solid ${s.border}` }}>
                            <p className="summary-label">{s.label}</p>
                            <p className="summary-number" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="filter-container">
                        {['', 'READY', 'SOLD'].map(f => (
                            <button key={f} className="filter-btn" onClick={() => setFilter(f)} style={{
                                backgroundColor: filter === f ? filterColors[f] : 'white',
                                color: filter === f ? 'white' : '#555',
                                fontWeight: filter === f ? 'bold' : 'normal',
                                borderColor: filter === f ? filterColors[f] : '#d9d9d9'
                            }}>
                                {f === '' ? 'Semua' : f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="🔍 Cari brand, model, warna..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '0.4rem 1rem',
                            border: '1px solid #d9d9d9',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            outline: 'none',
                            width: '240px'
                        }}
                    />

                    {user?.role === 'ADMIN' && (
                        <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Tambah Mobil</button>
                    )}
                </div>

                {/* Cards */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Loading...</p>
                ) : filteredCars.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>
                        {search ? `Tidak ada mobil dengan kata kunci "${search}"` : 'Tidak ada data mobil'}
                    </p>
                ) : (
                    <div className="card-grid">
                        {filteredCars.map(car => {
                            const firstImg = car.media?.find(m => m.type === 'image')
                            return (
                                <div key={car.id} className="car-card" onClick={() => openDetail(car)}>
                                    <div className="card-thumb">
                                        {firstImg
                                            ? <img src={`${BASE_URL}${firstImg.url}`} alt={car.model} />
                                            : <div className="card-no-img">🚗</div>
                                        }
                                        <span className="card-badge" style={{
                                            backgroundColor: car.status === 'READY' ? '#52c41a' : '#ff4d4f'
                                        }}>{car.status}</span>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-title">{car.brand} {car.model}</p>
                                        <p className="card-sub">{car.type} • {car.transmisi} • {car.year}</p>
                                        <p className="card-sub">🎨 {car.color}</p>
                                        <p className="card-price">Rp {car.price.toLocaleString('id-ID')}</p>
                                        {car.media?.length > 0 && (
                                            <p className="card-media-count">
                                                📷 {car.media.filter(m => m.type === 'image').length} &nbsp;
                                                🎥 {car.media.filter(m => m.type === 'video').length}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Modal Detail ─────────────────────────── */}
            {selectedCar && (
                <div className="modal-overlay" onClick={closeDetail}>
                    <div className="detail-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeDetail}>✕</button>

                        <div className="slideshow">
                            {selectedCar.media?.length > 0 ? (
                                <>
                                    {selectedCar.media[slideIndex]?.type === 'video'
                                        ? <video src={`${BASE_URL}${selectedCar.media[slideIndex].url}`} controls />
                                        : <img src={`${BASE_URL}${selectedCar.media[slideIndex]?.url}`} alt="" />
                                    }
                                    {selectedCar.media.length > 1 && (
                                        <>
                                            <button className="slide-btn" style={{ left: '10px' }} onClick={prevSlide}>‹</button>
                                            <button className="slide-btn" style={{ right: '10px' }} onClick={nextSlide}>›</button>
                                        </>
                                    )}
                                    <div className="dot-container">
                                        {selectedCar.media.map((_, i) => (
                                            <span key={i} className="dot" onClick={() => setSlideIndex(i)} style={{
                                                backgroundColor: i === slideIndex ? '#fff' : 'rgba(255,255,255,0.4)'
                                            }} />
                                        ))}
                                    </div>
                                    <div className="slide-counter">{slideIndex + 1} / {selectedCar.media.length}</div>
                                </>
                            ) : (
                                <div className="no-media-box">🚗 Tidak ada foto/video</div>
                            )}
                        </div>

                        <div className="detail-body">
                            <div className="detail-header">
                                <div>
                                    <h2>{selectedCar.brand} {selectedCar.model}</h2>
                                    <p>{selectedCar.type} • {selectedCar.transmisi} • {selectedCar.year}</p>
                                </div>
                                <span className="status-badge" style={{
                                    backgroundColor: selectedCar.status === 'READY' ? '#52c41a' : '#ff4d4f'
                                }}>{selectedCar.status}</span>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Warna</span>
                                    <span className="detail-value">{selectedCar.color}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Harga</span>
                                    <span className="detail-value" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                        Rp {selectedCar.price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {selectedCar.plateNumber && (
                                    <div className="detail-item">
                                        <span className="detail-label">Nomor Plat</span>
                                        <span className="detail-value">{selectedCar.plateNumber}</span>
                                    </div>
                                )}
                            </div>

                            {selectedCar.description && (
                                <div style={{ marginTop: '1rem' }}>
                                    <span className="detail-label">Deskripsi</span>
                                    <p style={{ color: '#444', lineHeight: 1.6, marginTop: '0.3rem', fontSize: '0.9rem' }}>
                                        {selectedCar.description}
                                    </p>
                                </div>
                            )}

                            {/* Tombol Admin */}
                            {user?.role === 'ADMIN' && (
                                <>
                                    {selectedCar.status === 'READY' ? (
                                        <button className="status-btn" style={{ backgroundColor: '#ff4d4f' }}
                                            onClick={() => handleStatusChange(selectedCar.id, 'SOLD')}>
                                            🔴 Mark as SOLD
                                        </button>
                                    ) : (
                                        <button className="status-btn" style={{ backgroundColor: '#52c41a' }}
                                            onClick={() => handleStatusChange(selectedCar.id, 'READY')}>
                                            🟢 Mark as READY
                                        </button>
                                    )}

                                    <div className="action-row">
                                        <button className="status-btn" style={{ backgroundColor: '#1890ff', marginTop: 0 }}
                                            onClick={handleOpenEdit}>
                                            ✏️ Edit Data
                                        </button>
                                        <button className="status-btn" style={{ backgroundColor: '#ff4d4f', marginTop: 0 }}
                                            onClick={() => setShowConfirm(true)}>
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Hapus ────────────────────────── */}
            {showConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
                        <h3>Hapus Mobil?</h3>
                        <p>
                            <strong>{selectedCar?.brand} {selectedCar?.model}</strong> akan dihapus permanen
                            beserta semua foto & videonya. Aksi ini tidak bisa dibatalkan!
                        </p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setShowConfirm(false)}
                                disabled={deleteLoading}>
                                Batal
                            </button>
                            <button onClick={handleDelete} disabled={deleteLoading}
                                style={{ flex: 1, padding: '0.7rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {deleteLoading ? 'Menghapus...' : 'Ya, Hapus!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="add-modal">
                        <div className="add-modal-header">
                            <h3 style={{ margin: 0 }}>✏️ Edit — {selectedCar?.brand} {selectedCar?.model}</h3>
                            <button className="close-btn-inline" onClick={() => setShowEditModal(false)}>✕</button>
                        </div>

                        {editError && <p style={{ color: 'red', marginBottom: '1rem' }}>{editError}</p>}

                        {/* Form data mobil */}
                        <form onSubmit={handleEdit}>
                            <CarFormFields
                                formData={editForm}
                                onChange={e => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                            />
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Batal</button>
                                <button type="submit" className="btn-submit" disabled={editLoading}>
                                    {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />

                        {/* Foto & video existing */}
                        <div>
                            <p style={{ fontWeight: '600', marginBottom: '0.8rem' }}>
                                📁 Foto & Video ({selectedCar?.media?.length || 0})
                            </p>
                            {selectedCar?.media?.length > 0 ? (
                                <div className="preview-grid">
                                    {selectedCar.media.map(m => (
                                        <div key={m.id} className="preview-item">
                                            {m.type === 'video'
                                                ? <video src={`${BASE_URL}${m.url}`} />
                                                : <img src={`${BASE_URL}${m.url}`} alt="" />
                                            }
                                            <button type="button" className="preview-remove"
                                                onClick={() => handleDeleteMedia(m.id)}>✕</button>
                                            <span className="preview-type">{m.type === 'video' ? '🎥' : '📷'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Belum ada foto/video</p>
                            )}
                        </div>

                        {/* Upload foto/video baru */}
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>➕ Tambah Foto/Video</p>
                            <input type="file" accept="image/*,video/*" multiple
                                onChange={e => setEditMediaFiles(p => [...p, ...Array.from(e.target.files)])} />

                            {editMediaFiles.length > 0 && (
                                <>
                                    <div className="preview-grid" style={{ marginTop: '0.5rem' }}>
                                        {editMediaFiles.map((file, i) => (
                                            <div key={i} className="preview-item">
                                                {file.type.startsWith('video')
                                                    ? <video src={URL.createObjectURL(file)} />
                                                    : <img src={URL.createObjectURL(file)} alt="" />
                                                }
                                                <button type="button" className="preview-remove"
                                                    onClick={() => setEditMediaFiles(p => p.filter((_, idx) => idx !== i))}>✕</button>
                                                <span className="preview-type">{file.type.startsWith('video') ? '🎥' : '📷'}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={handleAddMedia} disabled={editMediaLoading}
                                        style={{
                                            marginTop: '0.8rem', padding: '0.6rem 1.2rem',
                                            backgroundColor: '#52c41a', color: 'white',
                                            border: 'none', borderRadius: '6px',
                                            cursor: 'pointer', fontWeight: 'bold'
                                        }}>
                                        {editMediaLoading ? 'Mengupload...' : `⬆️ Upload ${editMediaFiles.length} file`}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Tambah ─────────────────────────── */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="add-modal">
                        <div className="add-modal-header">
                            <h3 style={{ margin: 0 }}>🚗 Tambah Mobil Baru</h3>
                            <button className="close-btn-inline" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        {addError && <p style={{ color: 'red', marginBottom: '1rem' }}>{addError}</p>}

                        <form onSubmit={handleTambah}>
                            <CarFormFields formData={addForm} onChange={e => setAddForm({ ...addForm, [e.target.name]: e.target.value })} />

                            <div className="input-group">
                                <label>Foto & Video (bisa lebih dari 1)</label>
                                <input type="file" accept="image/*,video/*" multiple
                                    onChange={e => setMediaFiles(p => [...p, ...Array.from(e.target.files)])} />
                                {mediaFiles.length > 0 && (
                                    <div className="preview-grid">
                                        {mediaFiles.map((file, i) => (
                                            <div key={i} className="preview-item">
                                                {file.type.startsWith('video')
                                                    ? <video src={URL.createObjectURL(file)} />
                                                    : <img src={URL.createObjectURL(file)} alt="" />
                                                }
                                                <button type="button" className="preview-remove"
                                                    onClick={() => setMediaFiles(p => p.filter((_, idx) => idx !== i))}>✕</button>
                                                <span className="preview-type">{file.type.startsWith('video') ? '🎥' : '📷'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Batal</button>
                                <button type="submit" className="btn-submit" disabled={addLoading}>
                                    {addLoading ? 'Menyimpan...' : 'Simpan Mobil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
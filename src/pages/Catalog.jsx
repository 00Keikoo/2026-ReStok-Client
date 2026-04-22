// src/pages/Catalog.jsx
import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const BASE_URL = 'https://restock-back-production.up.railway.app'
const WS_URL = 'wss://restock-back-production.up.railway.app'
const NOMOR_WA = '62895384677026'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }
  * { box-sizing: border-box; }

  :root {
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #1a1a24;
    --card: #14141e;
    --card-hover: #1e1e2a;
    --border: rgba(255,255,255,0.07);
    --border-light: rgba(255,255,255,0.12);
    --gold: #c9a84c;
    --gold2: #f0cc72;
    --green: #2ecc71;
    --red: #e74c3c;
    --text: #f0f0f0;
    --text2: #9999aa;
    --text3: #666677;
    --radius: 14px;
  }

  .cat { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  /* Navbar */
  .cat-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 80px;
  }
  .cat-nav-brand { display: flex; align-items: center; gap: 0.75rem; }
  .cat-nav-brand img { height: 52px; border-radius: 8px; }
  .cat-nav-brand span {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; color: var(--gold2); letter-spacing: 0.02em;
  }
  .ws-pill {
    display: flex; align-items: center; gap: 0.4rem;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    padding: 0.3rem 0.8rem; border-radius: 20px;
    font-size: 0.75rem; color: var(--text2);
  }
  .ws-dot { width: 7px; height: 7px; border-radius: 50%; }
  .ws-dot.on { background: var(--green); box-shadow: 0 0 6px var(--green); animation: glow 2s infinite; }
  .ws-dot.off { background: var(--red); }
  @keyframes glow { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  /* Hero */
  .cat-hero {
    background: linear-gradient(135deg, #0d0d18 0%, #141428 50%, #0d0d18 100%);
    border-bottom: 1px solid var(--border);
    padding: 3rem 2rem 2.5rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .cat-hero::before {
    content: '';
    position: absolute; top: -60%; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .cat-hero h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 700; margin: 0 0 0.5rem;
    background: linear-gradient(135deg, var(--gold), var(--gold2), #fff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cat-hero p { color: var(--text2); font-size: 1rem; margin: 0; font-weight: 300; letter-spacing: 0.05em; }
  .cat-stats {
    display: flex; justify-content: center;
    border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    max-width: 400px; margin: 2rem auto 0;
  }
  .cat-stat {
    flex: 1; padding: 0.8rem 1.2rem; text-align: center;
    border-right: 1px solid var(--border); background: rgba(255,255,255,0.02);
  }
  .cat-stat:last-child { border-right: none; }
  .cat-stat-val { font-size: 1.6rem; font-weight: 700; font-family: 'Playfair Display', serif; }
  .cat-stat-lbl { font-size: 0.7rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.1rem; }

    /* Lightbox */
.lightbox {
    position: fixed; inset: 0; background: rgba(0,0,0,0.95);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000; cursor: zoom-out; padding: 1rem;
    animation: fadeIn 0.2s ease;
}
.lightbox img {
    max-width: 100%; max-height: 90vh;
    object-fit: contain; border-radius: 8px;
    cursor: default;
    animation: slideUp 0.2s ease;
}
.lightbox-close {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%; width: 38px; height: 38px;
    color: white; font-size: 1.1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.2); }
.lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: white; border-radius: 50%; width: 44px; height: 44px;
    font-size: 1.4rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
}
.lightbox-nav:hover { background: rgba(201,168,76,0.3); border-color: var(--gold); }

  /* Toolbar */
  .cat-toolbar {
    padding: 1.2rem 2rem;
    display: flex; align-items: center; flex-wrap: wrap; gap: 0.7rem;
    border-bottom: 1px solid var(--border);
  }
  .cat-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .cat-filter-btn {
    padding: 0.45rem 1.1rem; border-radius: 20px; border: 1px solid var(--border);
    background: transparent; color: var(--text2);
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em;
  }
  .cat-filter-btn:hover { border-color: var(--gold); color: var(--gold); }
  .cat-filter-btn.active-all { background: var(--gold); border-color: var(--gold); color: #000; font-weight: 600; }
  .cat-filter-btn.active-ready { background: var(--green); border-color: var(--green); color: #000; font-weight: 600; }
  .cat-filter-btn.active-sold { background: rgba(231,76,60,0.2); border-color: var(--red); color: var(--red); font-weight: 600; }

  .cat-budget-select {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 20px; padding: 0.45rem 1rem;
    color: var(--text2); font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .cat-budget-select:focus { border-color: var(--gold); }
  .cat-budget-select.active { border-color: var(--gold); color: var(--gold2); }

  .cat-search-wrap { position: relative; margin-left: auto; }
  .cat-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.4; }
  .cat-search {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 24px; padding: 0.5rem 1rem 0.5rem 2.4rem;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; width: 220px; transition: border-color 0.2s;
  }
  .cat-search::placeholder { color: var(--text3); }
  .cat-search:focus { border-color: var(--gold); }

  /* Grid */
  .cat-content { padding: 2rem; }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.4rem; }

  /* Card */
  .cat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.2s;
    position: relative;
  }
  .cat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.2);
    border-color: rgba(201,168,76,0.3); background: var(--card-hover);
  }
  .cat-card.is-sold { opacity: 0.75; }
  .cat-card.is-sold:hover { transform: translateY(-3px); }

  .cat-card-img { position: relative; height: 190px; background: var(--bg3); overflow: hidden; }
  .cat-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .cat-card:hover .cat-card-img img { transform: scale(1.05); }
  .cat-card-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; opacity: 0.2; }

  .sold-ov { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
  .sold-stamp {
    border: 3px solid var(--red); color: var(--red);
    padding: 0.25rem 1rem; border-radius: 4px;
    font-size: 1.6rem; font-weight: 900; letter-spacing: 6px;
    font-family: 'Playfair Display', serif; transform: rotate(-12deg);
    text-shadow: 0 0 20px rgba(231,76,60,0.6);
    box-shadow: 0 0 20px rgba(231,76,60,0.2) inset;
  }
  .cat-card-badge {
    position: absolute; top: 10px; left: 10px;
    padding: 0.2rem 0.6rem; border-radius: 20px;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.05em; z-index: 2;
  }
  .badge-ready { background: rgba(46,204,113,0.2); border: 1px solid rgba(46,204,113,0.4); color: var(--green); }
  .badge-sold { background: rgba(231,76,60,0.2); border: 1px solid rgba(231,76,60,0.4); color: var(--red); }

  .cat-card-body { padding: 1rem 1.1rem 1.2rem; }
  .cat-card-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--text); margin: 0 0 0.3rem; }
  .cat-card-sub { font-size: 0.78rem; color: var(--text3); margin: 0.15rem 0; }
  .cat-card-divider { height: 1px; background: var(--border); margin: 0.7rem 0; }
  .cat-card-price { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; color: #f0cc72; letter-spacing: 0.01em; }
  .cat-card-price.sold-price { color: var(--text3); text-decoration: line-through; font-size: 0.88rem; }
  .cat-card-media { font-size: 0.72rem; color: var(--text3); margin-top: 0.3rem; }

  /* Modal */
  .cat-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 1rem; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .cat-modal {
    background: var(--bg2); border: 1px solid var(--border-light);
    border-radius: 20px; width: 100%; max-width: 580px;
    max-height: 90vh; overflow-y: auto; position: relative;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); scrollbar-width: none;
  }
  .cat-modal::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(30px); opacity:0; } to { transform: translateY(0); opacity:1; } }

  .cat-modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(255,255,255,0.08); border: 1px solid var(--border);
    border-radius: 50%; width: 32px; height: 32px;
    color: var(--text2); font-size: 0.9rem; cursor: pointer; z-index: 20;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .cat-modal-close:hover { background: rgba(255,255,255,0.15); color: var(--text); }

  .cat-slides { position: relative; height: 300px; background: var(--bg); border-radius: 20px 20px 0 0; overflow: hidden; }
  .cat-slides img, .cat-slides video { width: 100%; height: 100%; object-fit: contain; }
  .cat-slide-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,0.6); border: 1px solid var(--border);
    color: white; border-radius: 50%; width: 38px; height: 38px;
    font-size: 1.2rem; cursor: pointer; z-index: 10;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .cat-slide-btn:hover { background: rgba(201,168,76,0.3); border-color: var(--gold); }
  .cat-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; }
  .cat-dot { width: 6px; height: 6px; border-radius: 50%; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.3); }
  .cat-dot.active { background: var(--gold); width: 18px; border-radius: 3px; }
  .cat-counter {
    position: absolute; top: 10px; right: 10px;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    color: white; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.72rem;
  }
  .no-media { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text3); font-size: 1.1rem; }

  .cat-modal-body { padding: 1.4rem; }
  .cat-modal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.2rem; }
  .cat-modal-header h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin: 0 0 0.3rem; color: var(--text); }
  .cat-modal-header p { color: var(--text3); font-size: 0.85rem; margin: 0; }
  .modal-status { padding: 0.3rem 0.9rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; letter-spacing: 0.04em; }

  .cat-modal-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem; }
  .cat-spec { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 0.7rem 0.9rem; }
  .cat-spec-lbl { font-size: 0.68rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
  .cat-spec-val { font-size: 0.9rem; font-weight: 500; color: var(--text); }
  .cat-spec-val.price-val { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 700; color: #f5f5f5; letter-spacing: 0.01em; }
  .cat-spec-val.sold-price { color: var(--text3); text-decoration: line-through; }

  .cat-desc { margin-bottom: 1.2rem; }
  .cat-desc-lbl { font-size: 0.68rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
.cat-desc p { color: var(--text2); font-size: 0.88rem; line-height: 1.7; margin: 0; white-space: pre-wrap; }
  .wa-btn {
    width: 100%; padding: 1rem;
    background: linear-gradient(135deg, #1fad57, #128c7e);f
    border: none; border-radius: 12px; color: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    transition: all 0.2s; letter-spacing: 0.02em;
    box-shadow: 0 4px 20px rgba(31,173,87,0.3);
  }
  .wa-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(31,173,87,0.4); }
  .wa-btn-alt {
    width: 100%; padding: 1rem; margin-top: 0.6rem;
    background: rgba(31,173,87,0.08); border: 1px solid rgba(31,173,87,0.3);
    border-radius: 12px; color: #2ecc71;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    transition: all 0.2s;
  }
  .wa-btn-alt:hover { background: rgba(31,173,87,0.15); }
  .sold-notice {
    background: rgba(231,76,60,0.08); border: 1px solid rgba(231,76,60,0.2);
    border-radius: 10px; padding: 0.8rem 1rem; text-align: center;
    color: #e74c3c; font-size: 0.88rem; margin-bottom: 0.8rem;
  }

  .empty-state { text-align: center; padding: 5rem 2rem; color: var(--text3); }
  .empty-state div { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }

  @media (max-width: 768px) {
    .cat-nav { padding: 0 1rem; height: 68px; }
    .cat-nav-brand img { height: 40px; }
    .cat-nav-brand span { display: none; }
    .cat-hero { padding: 2rem 1rem 1.5rem; }
    .cat-toolbar { padding: 1rem; }
    .cat-content { padding: 1rem; }
    .cat-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.8rem; }
    .cat-card-img { height: 130px; }
    .cat-modal-specs { grid-template-columns: 1fr; }
    .cat-slides { height: 220px; }
    .cat-search { width: 160px; }
    .cat-search-wrap { margin-left: 0; }
  }
  @media (max-width: 480px) {
    .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .cat-toolbar { flex-direction: column; align-items: stretch; }
    .cat-search-wrap { margin-left: 0; }
    .cat-search { width: 100%; }
  }
`

if (typeof document !== 'undefined') {
    const id = 'zafka-catalog-css'
    if (!document.getElementById(id)) {
        const el = document.createElement('style')
        el.id = id; el.innerHTML = css
        document.head.appendChild(el)
    }
}

const WA_ICON = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
)

const Catalog = () => {
    const [cars, setCars] = useState([])
    const [summary, setSummary] = useState({ total: 0, ready: 0, sold: 0 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [search, setSearch] = useState('')
    const [budgetFilter, setBudgetFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')
    const [selected, setSelected] = useState(null)
    const [slideIdx, setSlideIdx] = useState(0)
    const [lightbox, setLightbox] = useState(null) // url foto yang sedang dibuka
    const [wsOn, setWsOn] = useState(false)
    const wsRef = useRef(null)

    useEffect(() => { fetchCars(); connectWS(); return () => wsRef.current?.close() }, [])
    useEffect(() => { fetchCars() }, [filter])

    const fetchCars = async () => {
        try {
            setLoading(true)
            const url = filter ? `/catalog?status=${filter}` : '/catalog'
            const res = await api.get(url)
            setCars(res.data.data)
            setSummary(res.data.summary)
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const connectWS = () => {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws
        ws.onopen = () => setWsOn(true)
        ws.onclose = () => { setWsOn(false); setTimeout(connectWS, 3000) }
        ws.onmessage = (e) => {
            const d = JSON.parse(e.data)
            if (d.type === 'STATUS_UPDATED') {
                setCars(p => p.map(c => c.id === d.carId ? { ...c, status: d.status } : c))
                setSelected(p => p?.id === d.carId ? { ...p, status: d.status } : p)
                fetchCars()
            }
        }
    }

    const openDetail = (car) => { setSelected(car); setSlideIdx(0) }
    const closeDetail = () => { setSelected(null); setSlideIdx(0) }
    const prevSlide = () => setSlideIdx(p => p === 0 ? selected.media.length - 1 : p - 1)
    const nextSlide = () => setSlideIdx(p => p === selected.media.length - 1 ? 0 : p + 1)

    const handleWA = (car, isSimilar = false) => {
        const harga = `Rp ${car.price.toLocaleString('id-ID')}`
        const pesan = isSimilar
            ? `Halo kak, mobil *${car.brand} ${car.model} ${car.year}* sudah terjual. Apakah ada mobil serupa yang tersedia? Terima kasih`
            : `Halo kak ZafkaCars!\n\nSaya tertarik dengan mobil ini:\n\n*${car.brand} ${car.model}*\nTipe: ${car.type}\nTransmisi: ${car.transmisi}\nTahun: ${car.year}\nWarna: ${car.color}\nHarga: ${harga}${car.plateNumber ? `\nPlat: ${car.plateNumber}` : ''}\n\nApakah masih tersedia? Saya ingin info lebih lanjut, terima kasih!`
        window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`, '_blank')
    }

    const filtered = cars.filter(car => {
        const q = search.toLowerCase()
        const matchSearch = (
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.type.toLowerCase().includes(q) ||
            car.color.toLowerCase().includes(q) ||
            (car.plateNumber?.toLowerCase().includes(q))
        )
        let matchBudget = true
        if (budgetFilter) {
            const p = car.price
            if (budgetFilter === '0-50') matchBudget = p < 50_000_000
            else if (budgetFilter === '50-100') matchBudget = p >= 50_000_000 && p < 100_000_000
            else if (budgetFilter === '100-200') matchBudget = p >= 100_000_000 && p < 200_000_000
            else if (budgetFilter === '200-350') matchBudget = p >= 200_000_000 && p < 350_000_000
            else if (budgetFilter === '350-500') matchBudget = p >= 350_000_000 && p < 500_000_000
            else if (budgetFilter === '500+') matchBudget = p >= 500_000_000
        }
        const matchBrand = brandFilter
            ? car.brand.toLowerCase() === brandFilter.toLowerCase()
            : true

        return matchSearch && matchBudget && matchBrand
    })

    return (
        <div className="cat">
            {/* Navbar */}
            <nav className="cat-nav">
                <div className="cat-nav-brand">
                    <img src="/logo2.png" alt="ZafkaCars" />
                    <span>ZafkaCars</span>
                </div>
                <div className="ws-pill">
                    <div className={`ws-dot ${wsOn ? 'on' : 'off'}`} />
                    {wsOn ? 'Live' : 'Connecting...'}
                </div>
            </nav>

            {/* Hero */}
            <div className="cat-hero">
                <h2>Temukan Mobil Impianmu</h2>
                <p>Koleksi terpilih, kualitas terjamin</p>
                {/* <div className="cat-stats">
                    <div className="cat-stat">
                        <div className="cat-stat-val" style={{ color: '#c9a84c' }}>{summary.total}</div>
                        <div className="cat-stat-lbl">Total</div>
                    </div>
                    <div className="cat-stat">
                        <div className="cat-stat-val" style={{ color: '#2ecc71' }}>{summary.ready}</div>
                        <div className="cat-stat-lbl">Tersedia</div>
                    </div>
                    <div className="cat-stat">
                        <div className="cat-stat-val" style={{ color: '#e74c3c' }}>{summary.sold}</div>
                        <div className="cat-stat-lbl">Terjual</div>
                    </div>
                </div> */}
            </div>

            {/* Toolbar */}
            <div className="cat-toolbar">
                <div className="cat-filters">
                    {[
                        { val: '', label: 'Semua', cls: 'active-all' },
                        { val: 'READY', label: '✦ Tersedia', cls: 'active-ready' },
                        { val: 'SOLD', label: '✦ Terjual', cls: 'active-sold' },
                    ].map(f => (
                        <button key={f.val} className={`cat-filter-btn ${filter === f.val ? f.cls : ''}`}
                            onClick={() => setFilter(f.val)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <select
                    className={`cat-budget-select ${brandFilter ? 'active' : ''}`}
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}>
                    <option value="">🚗 Semua Brand</option>
                    {[...new Set(cars.map(c => c.brand))].sort().map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>

                <select
                    className={`cat-budget-select ${budgetFilter ? 'active' : ''}`}
                    value={budgetFilter}
                    onChange={e => setBudgetFilter(e.target.value)}>
                    <option value="">💰 Semua Harga</option>
                    <option value="0-50">Di bawah 50 juta</option>
                    <option value="50-100">50 - 100 juta</option>
                    <option value="100-200">100 - 200 juta</option>
                    <option value="200-350">200 - 350 juta</option>
                    <option value="350-500">350 - 500 juta</option>
                    <option value="500+">Di atas 500 juta</option>
                </select>

                <div className="cat-search-wrap">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input className="cat-search" placeholder="Cari mobil..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Grid */}
            <div className="cat-content">
                {loading ? (
                    <div className="empty-state"><div>⏳</div><p>Memuat koleksi...</p></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div>🔍</div>
                        <p>{search ? `Tidak ada mobil "${search}"` : 'Belum ada mobil'}</p>
                    </div>
                ) : (
                    <div className="cat-grid">
                        {filtered.map(car => {
                            const img = car.media?.find(m => m.type === 'image')
                            const sold = car.status === 'SOLD'
                            return (
                                <div key={car.id} className={`cat-card ${sold ? 'is-sold' : ''}`} onClick={() => openDetail(car)}>
                                    <div className="cat-card-img">
                                        {img
                                            ? <img src={`${BASE_URL}${img.url}`} alt={car.model} />
                                            : <div className="cat-card-no-img">🚗</div>
                                        }
                                        {sold && <div className="sold-ov"><div className="sold-stamp">SOLD</div></div>}
                                        <span className={`cat-card-badge ${sold ? 'badge-sold' : 'badge-ready'}`}>
                                            {sold ? 'Terjual' : 'Tersedia'}
                                        </span>
                                    </div>
                                    <div className="cat-card-body">
                                        <p className="cat-card-title">{car.brand} {car.model}</p>
                                        <p className="cat-card-sub">{car.type} · {car.transmisi} · {car.year}</p>
                                        <p className="cat-card-sub">🎨 {car.color}</p>
                                        <div className="cat-card-divider" />
                                        <p className={`cat-card-price ${sold ? 'sold-price' : ''}`}>
                                            Rp {car.price.toLocaleString('id-ID')}
                                        </p>
                                        {car.media?.length > 0 && (
                                            <p className="cat-card-media">
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

            {/* Modal Detail */}
            {selected && (
                <div className="cat-overlay" onClick={closeDetail}>
                    <div className="cat-modal" onClick={e => e.stopPropagation()}>
                        <button className="cat-modal-close" onClick={closeDetail}>✕</button>

                        <div className="cat-slides">
                            {selected.media?.length > 0 ? (
                                <>
                                    {selected.media[slideIdx]?.type === 'video'
                                        ? <video src={`${BASE_URL}${selected.media[slideIdx].url}`} controls />
                                        : <img
                                            src={`${BASE_URL}${selected.media[slideIdx]?.url}`} alt=""
                                            style={{ cursor: 'zoom-in' }}
                                            onClick={(e) => { e.stopPropagation(); setLightbox(`${BASE_URL}${selected.media[slideIdx]?.url}`) }}
                                        />
                                    }
                                    {selected.status === 'SOLD' && (
                                        <div className="sold-ov"><div className="sold-stamp">SOLD</div></div>
                                    )}
                                    {selected.media.length > 1 && (
                                        <>
                                            <button className="cat-slide-btn" style={{ left: '10px' }} onClick={prevSlide}>‹</button>
                                            <button className="cat-slide-btn" style={{ right: '10px' }} onClick={nextSlide}>›</button>
                                        </>
                                    )}
                                    <div className="cat-dots">
                                        {selected.media.map((_, i) => (
                                            <div key={i} className={`cat-dot ${i === slideIdx ? 'active' : ''}`}
                                                onClick={() => setSlideIdx(i)} />
                                        ))}
                                    </div>
                                    <div className="cat-counter">{slideIdx + 1} / {selected.media.length}</div>
                                </>
                            ) : (
                                <div className="no-media">🚗 Tidak ada foto</div>
                            )}
                        </div>

                        <div className="cat-modal-body">
                            <div className="cat-modal-header">
                                <div>
                                    <h2>{selected.brand} {selected.model}</h2>
                                    <p>{selected.type} · {selected.transmisi} · {selected.year}</p>
                                </div>
                                <span className="modal-status" style={{
                                    background: selected.status === 'READY' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                                    border: `1px solid ${selected.status === 'READY' ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.4)'}`,
                                    color: selected.status === 'READY' ? '#2ecc71' : '#e74c3c'
                                }}>
                                    {selected.status === 'READY' ? '✦ Tersedia' : '✦ Terjual'}
                                </span>
                            </div>

                            <div className="cat-modal-specs">
                                <div className="cat-spec">
                                    <div className="cat-spec-lbl">Warna</div>
                                    <div className="cat-spec-val">🎨 {selected.color}</div>
                                </div>
                                <div className="cat-spec">
                                    <div className="cat-spec-lbl">Harga</div>
                                    <div className={`cat-spec-val price-val ${selected.status === 'SOLD' ? 'sold-price' : ''}`}>
                                        Rp {selected.price.toLocaleString('id-ID')}
                                    </div>
                                </div>
                                {selected.plateNumber && (
                                    <div className="cat-spec">
                                        <div className="cat-spec-lbl">Nomor Plat</div>
                                        <div className="cat-spec-val">{selected.plateNumber}</div>
                                    </div>
                                )}
                                <div className="cat-spec">
                                    <div className="cat-spec-lbl">Tahun</div>
                                    <div className="cat-spec-val">{selected.year}</div>
                                </div>
                            </div>

                            {selected.description && (
                                <div className="cat-desc">
                                    <div className="cat-desc-lbl">Deskripsi</div>
                                    <p>{selected.description}</p>
                                </div>
                            )}

                            {selected.status === 'READY' ? (
                                <button className="wa-btn" onClick={() => handleWA(selected)}>
                                    {WA_ICON} Hubungi via WhatsApp
                                </button>
                            ) : (
                                <>
                                    <div className="sold-notice">😔 Mobil ini sudah terjual</div>
                                    <button className="wa-btn-alt" onClick={() => handleWA(selected, true)}>
                                        {WA_ICON} Tanya Mobil Serupa
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Lightbox */}
            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    )
}

export default Catalog
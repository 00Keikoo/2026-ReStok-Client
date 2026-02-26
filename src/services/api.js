// src/services/app.js

import axios from 'axios'

//Base url backend
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// interceptor - otomatis sisipkan token di setiap request
// Jadi tidak perlu manual tambahkan header Authorization di setiap request

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
})

export default api
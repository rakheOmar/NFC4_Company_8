// lib/axios.js
import axios from 'axios';

// Your hosted backend URL
const backendUrl = 'https://nfc4-company-8.onrender.com';

const instance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
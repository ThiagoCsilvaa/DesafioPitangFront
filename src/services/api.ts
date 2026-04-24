import axios from  'axios';

export const api = axios.create({
     baseURL: 'https://localhost:7010/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
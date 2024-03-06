import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// カスタムクライアントの設定
const apiClient = axios.create({
  baseURL: process.env.BACKEND_URL + '/'
});

export default apiClient;

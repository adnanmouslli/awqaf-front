import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://awqaf-aleppo.sy/api';

// إنشاء instance من axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// إضافة interceptor لإرفاق التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// دالة تسجيل الدخول
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// دالة الحصول على قائمة الموظفين
export const getEmployeesList = async () => {
  try {
    const response = await api.get('/employees/list');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// دالة الحصول على الوجه الأمامي للبطاقة
export const getCardFront = async (employeeId) => {
  try {
    const response = await api.get(`/employees/${employeeId}/id-card/front`, {
      responseType: 'text',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// دالة الحصول على الوجه الخلفي للبطاقة
export const getCardBack = async (employeeId) => {
  try {
    const response = await api.get(`/employees/${employeeId}/id-card/back`, {
      responseType: 'text',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// دالة الحصول على معلومات الموظف العامة (بدون token)
export const getPublicEmployeeInfo = async (employeeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeesList, getCardFront, getCardBack } from '../services/api';
import './CardGenerator.css';

const CardGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من وجود التوكن
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // جلب قائمة الموظفين
    fetchEmployees();
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployeesList();
      setEmployees(data);
    } catch (err) {
      setError('فشل في جلب قائمة الموظفين');
      console.error('Error fetching employees:', err);
      
      // إذا كان الخطأ 401 (غير مصرح)، إعادة التوجيه لتسجيل الدخول
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const openCardInNewTab = (htmlContent) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // إضافة زر طباعة في النافذة الجديدة
    //   setTimeout(() => {
    //     const printButton = newWindow.document.createElement('button');
    //     printButton.textContent = 'طباعة / حفظ كـ PDF';
    //     printButton.style.cssText = `
    //       position: fixed;
    //       top: 20px;
    //       right: 20px;
    //       padding: 15px 30px;
    //       background: linear-gradient(135deg, #022423 0%, #034544 100%);
    //       color: white;
    //       border: none;
    //       border-radius: 8px;
    //       font-size: 16px;
    //       font-weight: 700;
    //       cursor: pointer;
    //       z-index: 9999;
    //       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    //       font-family: 'Cairo', Arial, sans-serif;
    //     `;
    //     printButton.onclick = () => newWindow.print();
    //     newWindow.document.body.appendChild(printButton);
    //   }, 500);
    } else {
      alert('الرجاء السماح بفتح النوافذ المنبثقة لعرض البطاقة');
    }
  };

  const handleGenerateFront = async () => {
    if (!selectedEmployee) {
      setError('الرجاء اختيار موظف');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const htmlContent = await getCardFront(selectedEmployee);
      openCardInNewTab(htmlContent);
    } catch (err) {
      setError('فشل في توليد الوجه الأمامي للبطاقة');
      console.error('Error generating front card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBack = async () => {
    if (!selectedEmployee) {
      setError('الرجاء اختيار موظف');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const htmlContent = await getCardBack(selectedEmployee);
      openCardInNewTab(htmlContent);
    } catch (err) {
      setError('فشل في توليد الوجه الخلفي للبطاقة');
      console.error('Error generating back card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBoth = async () => {
    if (!selectedEmployee) {
      setError('الرجاء اختيار موظف');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [frontHtml, backHtml] = await Promise.all([
        getCardFront(selectedEmployee),
        getCardBack(selectedEmployee)
      ]);

      // فتح الوجه الأمامي
      openCardInNewTab(frontHtml);
      
      // انتظار قليلاً ثم فتح الوجه الخلفي
      setTimeout(() => {
        openCardInNewTab(backHtml);
      }, 500);
    } catch (err) {
      setError('فشل في توليد البطاقات');
      console.error('Error generating cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="generator-container">
      <div className="generator-header">
        <div className="header-content">
          <h1>نظام توليد البطاقات التعريفية</h1>
          <div className="user-info">
            <span>مرحباً، {user.username}</span>
            <button onClick={handleLogout} className="logout-button">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="generator-box">
        <div className="generator-title">
          <h2>توليد بطاقة موظف</h2>
          <p>اختر الموظف لتوليد البطاقة التعريفية الخاصة به</p>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="employee">اختر الموظف</label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="employee-select"
            >
              <option value="">-- اختر موظف --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="buttons-group">
            <button
              onClick={handleGenerateFront}
              disabled={loading || !selectedEmployee}
              className="generate-button front-button"
            >
              {loading ? 'جاري التوليد...' : 'توليد الوجه الأمامي'}
            </button>

            <button
              onClick={handleGenerateBack}
              disabled={loading || !selectedEmployee}
              className="generate-button back-button"
            >
              {loading ? 'جاري التوليد...' : 'توليد الوجه الخلفي'}
            </button>
          </div>
        </div>

        <div className="instructions">
          <h3>ملاحظات:</h3>
          <ul>
            <li>سيتم فتح البطاقة في نافذة جديدة</li>
            <li>يمكنك طباعة البطاقة مباشرة أو حفظها كملف PDF</li>
            <li>للحفظ كـ PDF: اختر "طباعة" ثم اختر "حفظ كـ PDF" من خيارات الطابعة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;
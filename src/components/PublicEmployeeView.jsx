import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicEmployeeInfo } from '../services/api';
import './PublicEmployeeView.css';

const PublicEmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await getPublicEmployeeInfo(id);
      setEmployee(data);
      setError('');
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError('عذراً، لم نتمكن من العثور على بيانات الموظف');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="public-view-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="public-view-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>{error || 'حدث خطأ غير متوقع'}</h2>
          <p>الرجاء التحقق من صحة الرابط أو المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  const baseUrl = 'https://awqaf-aleppo.sy';

  return (
    <div className="public-view-container">
      <div className="content-wrapper">
        {/* الهيدر */}
        <header className="public-header">
          <div className="header-logos">
            <img 
              src={`${baseUrl}/uploads/Syrian_Arab_Republic.png`} 
              alt="شعار الجمهورية العربية السورية" 
              className="republic-logo"
            />
            <img 
              src={`${baseUrl}/uploads/logo.png`} 
              alt="شعار وزارة الأوقاف" 
              className="ministry-logo"
            />
          </div>
          <div className="header-titles">
            <h1 className="sub-title">وزارة الأوقاف - مديرية أوقاف حلب</h1>
          </div>
        </header>

        {/* بطاقة الموظف */}
        <div className="employee-card">
        {/* قسم الصورة والمعلومات الأساسية */}
        <div className="card-header-section">
          <div className="photo-container">
            {employee.photo_path ? (
              <img 
                src={`${baseUrl}${employee.photo_path}`} 
                alt={employee.full_name}
                className="employee-photo"
              />
            ) : (
              <div className="photo-placeholder">
                <span>لا توجد صورة</span>
              </div>
            )}
          </div>
          <div className="basic-info">
            <h2 className="employee-name">{employee.full_name}</h2>
          </div>
        </div>

        {/* المعلومات الوظيفية */}
        <section className="info-section">
          <h3 className="section-title">
            المعلومات الوظيفية
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">المسمى الوظيفي</span>
              <span className="info-value">{employee.position || 'غير محدد'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">مكان العمل</span>
              <span className="info-value">{employee.work_location || 'غير محدد'}</span>
            </div>
            {employee.division_section && (
              <div className="info-item">
                <span className="info-label">الدائرة/الشعبة</span>
                <span className="info-value">{employee.division_section}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">تاريخ التعيين</span>
              <span className="info-value">{formatDate(employee.date_of_joining)}</span>
            </div>
          </div>
        </section>

        {/* المعلومات الشخصية */}
        <section className="info-section">
          <h3 className="section-title">
            المعلومات الشخصية
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">تاريخ الميلاد</span>
              <span className="info-value">{formatDate(employee.date_of_birth)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">مكان الميلاد</span>
              <span className="info-value">{employee.place_of_birth || 'غير محدد'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">فصيلة الدم</span>
              <span className="info-value blood-type">{employee.blood_type || 'غير محدد'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">رقم الموظف</span>
              <span className="info-value">{employee.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">رقم الهاتف</span>
              <span className="info-value">{employee.mobile_1}</span>
            </div>
            {employee.fingerprint_id && (
              <div className="info-item">
                <span className="info-label">رقم البصمة</span>
                <span className="info-value">{employee.fingerprint_id}</span>
              </div>
            )}
          </div>
        </section>

        {/* الباركود */}
        {employee.barcode_image_path && (
          <section className="barcode-section">
            <img 
              src={`${baseUrl}${employee.barcode_image_path}`} 
              alt="QR Code"
              className="qr-code"
            />
            {employee.barcode && (
              <p className="barcode-text">{employee.barcode}</p>
            )}
          </section>
        )}
      </div>

      {/* الفوتر */}
      <footer className="public-footer">
        <p>© {new Date().getFullYear()} وزارة الأوقاف - الجمهورية العربية السورية</p>
        <p className="footer-note">هذه البيانات للاستخدام الرسمي فقط</p>
      </footer>
      </div>
    </div>
  );
};

export default PublicEmployeeView;
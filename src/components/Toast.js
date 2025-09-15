import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ 
  isVisible, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderColor: '#f59e0b'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderColor: '#3b82f6'
        };
      default:
        return {
          icon: '✅',
          bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className="toast-overlay">
      <div 
        className="toast-container"
        style={{
          background: config.bgColor,
          borderColor: config.borderColor
        }}
      >
        <div className="toast-header">
          <div className="toast-icon">
            {config.icon}
          </div>
          <div className="toast-content">
            <h4 className="toast-title">{title}</h4>
            <p className="toast-message">{message}</p>
          </div>
          <button 
            className="toast-close"
            onClick={onClose}
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

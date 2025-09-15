import React, { useEffect } from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '❓';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'danger':
        return {
          primary: '#ef4444',
          secondary: '#fecaca',
          light: '#fef2f2'
        };
      case 'warning':
        return {
          primary: '#f59e0b',
          secondary: '#fed7aa',
          light: '#fffbeb'
        };
      case 'info':
        return {
          primary: '#3b82f6',
          secondary: '#bfdbfe',
          light: '#eff6ff'
        };
      default:
        return {
          primary: '#f59e0b',
          secondary: '#fed7aa',
          light: '#fffbeb'
        };
    }
  };

  const colors = getTypeColor();

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header" style={{ backgroundColor: colors.light }}>
          <div className="confirm-modal-icon" style={{ color: colors.primary }}>
            {getTypeIcon()}
          </div>
          <h3 className="confirm-modal-title" style={{ color: colors.primary }}>
            {title}
          </h3>
        </div>
        
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="confirm-modal-btn cancel-btn"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-modal-btn confirm-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ 
              backgroundColor: colors.primary,
              borderColor: colors.primary 
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

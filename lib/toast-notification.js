/**
 * Toast Notification Utility
 * 
 * Provides client-side toast notifications for user feedback
 */

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 */
export function showToast({ message, type = 'info', duration = 5000 }) {
  // Check if we're in the browser
  if (typeof window === 'undefined') return;

  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Set colors based on type
  let bgColor, borderColor, icon;
  switch (type) {
    case 'success':
      bgColor = '#10b981';
      borderColor = '#059669';
      icon = '✓';
      break;
    case 'error':
      bgColor = '#ef4444';
      borderColor = '#dc2626';
      icon = '✕';
      break;
    case 'warning':
      bgColor = '#f59e0b';
      borderColor = '#d97706';
      icon = '⚠';
      break;
    case 'info':
    default:
      bgColor = '#3b82f6';
      borderColor = '#2563eb';
      icon = 'ℹ';
  }

  toast.style.cssText = `
    background: ${bgColor};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid ${borderColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    min-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  `;

  // Create toast content safely without innerHTML to prevent XSS
  const iconSpan = document.createElement('span');
  iconSpan.style.cssText = 'font-size: 20px; font-weight: bold;';
  iconSpan.textContent = icon;

  const messageSpan = document.createElement('span');
  messageSpan.style.cssText = 'flex: 1;';
  
  // Check if message contains HTML structure (for legacy compatibility)
  // If it does, we need to sanitize or restructure it
  if (typeof message === 'string' && message.includes('<')) {
    // For security, we'll parse and extract text content only
    const tempDiv = document.createElement('div');
    tempDiv.textContent = message; // This safely escapes any HTML
    messageSpan.appendChild(tempDiv);
  } else {
    messageSpan.textContent = message;
  }

  const closeButton = document.createElement('button');
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s;
  `;
  closeButton.textContent = '×';
  closeButton.onmouseover = function() { this.style.opacity = '1'; };
  closeButton.onmouseout = function() { this.style.opacity = '0.8'; };

  toast.appendChild(iconSpan);
  toast.appendChild(messageSpan);
  toast.appendChild(closeButton);

  // Add animation styles if not already present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add close button handler
  closeButton.addEventListener('click', () => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  });

  // Add toast to container
  container.appendChild(toast);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  return toast;
}

/**
 * Show success toast
 */
export function showSuccessToast(message, duration) {
  return showToast({ message, type: 'success', duration });
}

/**
 * Show error toast
 */
export function showErrorToast(message, duration) {
  return showToast({ message, type: 'error', duration });
}

/**
 * Show warning toast
 */
export function showWarningToast(message, duration) {
  return showToast({ message, type: 'warning', duration });
}

/**
 * Show info toast
 */
export function showInfoToast(message, duration) {
  return showToast({ message, type: 'info', duration });
}

/**
 * Show rejection notification with detailed reason
 */
export function showRejectionNotification(reason, details = {}) {
  const { operationType, domain } = details;
  
  // Build message parts safely
  const messageParts = ['🚫 عملية مرفوضة'];
  
  if (operationType) {
    messageParts.push(`- ${operationType}`);
  }
  
  if (domain) {
    messageParts.push(`(${domain})`);
  }
  
  // Create safe message without HTML to prevent XSS
  const headerText = messageParts.join(' ');
  const message = `${headerText}\n\nالسبب: ${reason}`;
  
  return showToast({
    message,
    type: 'error',
    duration: 8000, // Longer duration for rejections
  });
}

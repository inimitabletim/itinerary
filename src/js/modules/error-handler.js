/**
 * Error Handler Module
 * Centralized error handling and user feedback
 */

/**
 * Error code to user-friendly message mapping
 */
const ERROR_MESSAGES = {
    'NETWORK_ERROR': '網路連線異常，部分功能可能無法使用',
    'WEATHER_ERROR': '無法取得天氣資訊',
    'LOCATION_ERROR': '無法取得位置資訊',
    'UNHANDLED_PROMISE': '發生未預期的錯誤'
};

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 */
function showErrorToast(message) {
    const toast = document.getElementById('error-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 5000);
}

/**
 * Handle application errors
 * @param {Object} error - Error object with code and message
 */
export function handleError(error) {
    const errorCode = error.code || 'UNKNOWN';
    const message = ERROR_MESSAGES[errorCode] || error.message || '發生未知錯誤';

    // Log to console for debugging
    console.error('[App Error]', errorCode, error);

    // Show user-friendly message
    showErrorToast(message);
}

/**
 * Initialize global error handlers
 */
export function initErrorHandler() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault();
        handleError({
            code: 'UNHANDLED_PROMISE',
            message: event.reason?.message || String(event.reason)
        });
    });

    // Handle custom app errors
    window.addEventListener('app-error', (event) => {
        handleError(event.detail);
    });

    // Handle network status changes
    window.addEventListener('offline', () => {
        handleError({
            code: 'NETWORK_ERROR',
            message: '網路連線已中斷'
        });
    });

    window.addEventListener('online', () => {
        showErrorToast('網路連線已恢復');
    });
}

/**
 * Dispatch a custom error event
 * @param {string} code - Error code
 * @param {string} message - Error message
 */
export function dispatchError(code, message) {
    window.dispatchEvent(new CustomEvent('app-error', {
        detail: { code, message }
    }));
}

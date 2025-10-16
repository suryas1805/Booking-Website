
const Toast = ({ toast, onClose }) => {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    }[toast.type];

    return (
        <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center justify-between min-w-[300px] max-w-md`}>
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => onClose(toast.id)}
                className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
            >
                ×
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts?.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
            {toasts?.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
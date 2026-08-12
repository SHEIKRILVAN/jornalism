function CustomAlert({ isOpen, title, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-name="alert" data-file="components/Alert.js">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <div className="icon-circle-alert text-indigo-600 text-xl"></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title || 'Notice'}</h3>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <button onClick={onClose} className="btn-primary w-full">
                    Got it
                </button>
            </div>
        </div>
    );
}
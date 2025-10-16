import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item, type }) => {
    if (!isOpen || !item) return null;

    const getItemName = () => {
        if (type === 'product') return item.name;
        if (type === 'category') return item.name;
        return 'this item';
    };

    const getTitle = () => {
        if (type === 'product') return 'Delete Product';
        if (type === 'category') return 'Delete Category';
        return 'Delete Item';
    };

    const getDescription = () => {
        if (type === 'product') {
            return 'Are you sure you want to delete this product? This action cannot be undone and all associated data will be permanently removed.';
        }
        if (type === 'category') {
            return 'Are you sure you want to delete this category? Products in this category will not be deleted but will lose their category association.';
        }
        return 'Are you sure you want to delete this item? This action cannot be undone.';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                        Delete "{getItemName()}"?
                    </h3>

                    <p className="text-gray-600 text-center mb-6">
                        {getDescription()}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { updateBooking } from '../../features/Booking/services';
import { getImageUrl } from '../../utils/imageUtils';

const BookingDetailsModal = ({ isOpen, onClose, booking, isAdmin, onRefresh }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('products');
    const [confirmModal, setConfirmModal] = useState({ open: false, type: '', trackingId: '' });

    if (!isOpen || !booking) return null;

    // Status Utilities
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'pending': return 'Pending';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    // Update Booking Status
    const updateBookingStatus = async (bookingId, newStatus, trackingIdValue) => {
        try {
            const response = await updateBooking(
                { bookingId },
                { status: newStatus, trackingId: trackingIdValue || '' }
            );
            if (response) {
                addToast(`Booking status updated to ${newStatus}`, 'success');
                onRefresh();
                closeConfirmModal();
                handleClose();
            } else {
                addToast('Failed to update booking status', 'error');
            }
        } catch (error) {
            addToast('Failed to update booking status', 'error');
        }
    };

    // Tracking Steps
    const trackingSteps =
        booking?.status === 'cancelled'
            ? [
                { status: 'ordered', label: 'Order Placed', active: true },
                { status: 'cancelled', label: 'Cancelled', active: true }
            ]
            : [
                { status: 'ordered', label: 'Order Placed', active: true },
                { status: 'confirmed', label: 'Confirmed', active: booking?.status !== 'pending' },
                { status: 'shipped', label: 'Shipped', active: booking?.tracking?.id },
                { status: 'delivered', label: 'Delivered', active: booking?.status === 'completed' }
            ];

    const handleClose = () => {
        setActiveTab('products');
        onClose();
    };

    const calculateTotalAmount = (bookingProducts) => {
        return bookingProducts?.reduce((acc, p) => acc + (p?.subtotal || 0), 0);
    };

    const handleDownloadInvoice = () => {
        addToast('Invoice downloaded successfully!', 'success');
    };

    // Confirm Modal Handlers
    const openConfirmModal = (type) => {
        setConfirmModal({
            open: true,
            type,
            trackingId: type === 'completed' ? '' : '',
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ open: false, type: '', trackingId: '' });
    };

    return (
        <>
            {/* 🔹 Booking Details Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                            <p className="text-gray-600">{booking?.bookingId}</p>
                        </div>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px px-6">
                            {[
                                { id: 'products', name: 'Products' },
                                { id: 'tracking', name: 'Order Tracking' },
                                { id: 'shipping', name: 'Shipping Info' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking?.status)}`}>
                                            {getStatusText(booking?.status)}
                                        </span>
                                        <p className="text-gray-600 mt-1">
                                            Ordered on {new Date(booking?.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {booking?.status === 'completed' && (
                                        <button
                                            onClick={handleDownloadInvoice}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                        >
                                            Download Invoice
                                        </button>
                                    )}
                                </div>

                                {/* Products List */}
                                <div className="space-y-4">
                                    {booking?.products?.map((product, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-center">
                                                <img src={product?.product?.image && getImageUrl(product?.product?.image)} className='w-16 h-16 object-contain rounded' />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{product?.product?.name}</h4>
                                                <p className="text-sm text-gray-600">Quantity: {product?.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">₹{product?.product?.price}</p>
                                                <p className="text-sm text-gray-600">
                                                    Total: ₹{(product?.product?.price * product?.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Total Amount:</span>
                                        <span>₹{calculateTotalAmount(booking?.products)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tracking Tab */}
                        {activeTab === 'tracking' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Tracking</h3>
                                {booking?.tracking?.id && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-blue-900">Tracking Number</p>
                                                <p className="text-blue-700">{booking?.tracking?.id}</p>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Track Package
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {trackingSteps.map((step, index) => (
                                        <div key={step.status} className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                {step.active ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span>{index + 1}</span>
                                                )}
                                            </div>
                                            <div className={`flex-1 pb-4 ${index < trackingSteps.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <p className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Shipping Tab */}
                        {activeTab === 'shipping' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h3>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                                            <div className="text-gray-600 space-y-1">
                                                <p>{booking?.user?.name}</p>
                                                <p>{booking?.user?.contact?.address}</p>
                                                <p>{booking?.user?.contact?.city}, {booking?.user?.contact?.state} {booking?.user?.contact?.postal_code}</p>
                                                <p>{booking?.user?.contact?.country || 'India'}</p>
                                                <p>Phone Number: {booking?.user?.contact?.phone_number}</p>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                                                <div className="text-gray-600 space-y-1">
                                                    <p><strong>Name:</strong> {booking?.user?.name}</p>
                                                    <p><strong>Email:</strong> {booking?.user?.email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                {isAdmin && booking?.status === 'pending' && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <h4 className="font-medium text-yellow-800 mb-3">Admin Actions</h4>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => openConfirmModal('completed')}
                                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                            >
                                                Complete Order
                                            </button>
                                            <button
                                                onClick={() => openConfirmModal('cancelled')}
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔹 Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                {confirmModal.type === 'completed' ? 'Complete Booking' : 'Cancel Booking'}
                            </h2>

                            {confirmModal.type === 'completed' && (
                                <div>
                                    <label className="block text-gray-700 mb-1">Tracking ID</label>
                                    <input
                                        type="text"
                                        value={confirmModal.trackingId}
                                        onChange={(e) => setConfirmModal((prev) => ({ ...prev, trackingId: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={closeConfirmModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateBookingStatus(booking._id, confirmModal.type, confirmModal.trackingId)}
                                    className={`px-4 py-2 text-white rounded-md ${confirmModal.type === 'completed'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BookingDetailsModal;

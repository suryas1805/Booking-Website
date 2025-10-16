import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { updateBooking } from '../../features/Booking/services';

const AdminBookings = React.memo(({ onViewDetails, BookingsData, onRefresh }) => {
    const { addToast } = useToast();
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionType, setActionType] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (booking, type) => {
        setSelectedBooking(booking);
        setActionType(type);
        setTrackingId('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
        setActionType('');
        setTrackingId('');
    };

    const updateBookingStatus = async (bookingId, newStatus, trackingIdValue) => {
        try {
            const response = await updateBooking(
                { bookingId },
                { status: newStatus, trackingId: trackingIdValue }
            );
            if (response) {
                addToast(`Booking status updated to ${newStatus}`, 'success');
                closeModal();
                onRefresh();
            } else {
                addToast('Failed to update booking status', 'error');
            }
        } catch (error) {
            addToast('Failed to update booking status', 'error');
        }
    };

    const filteredBookings = BookingsData?.filter(
        (booking) => filter === 'all' || booking?.status === filter
    );

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

    const calculateTotalAmount = (bookingProducts) =>
        bookingProducts?.reduce((acc, p) => acc + (p?.subtotal || 0), 0);

    return (
        <div>
            {/* STATUS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Total */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{BookingsData?.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> </svg>
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {BookingsData?.filter(b => b.status === 'pending').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                                {BookingsData?.filter(b => b.status === 'completed').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Cancelled */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">
                                {BookingsData?.filter(b => b.status === 'cancelled').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER TABS + TABLE */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {[
                            { id: 'all', name: 'All Bookings', count: BookingsData?.length },
                            { id: 'pending', name: 'Pending', count: BookingsData?.filter(b => b.status === 'pending').length },
                            { id: 'completed', name: 'Completed', count: BookingsData?.filter(b => b.status === 'completed').length },
                            { id: 'cancelled', name: 'Cancelled', count: BookingsData?.filter(b => b.status === 'cancelled').length }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.name}
                                <span className={`px-2 py-1 text-xs rounded-full ${filter === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Bookings Table */}
            {filteredBookings?.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                    No {filter} bookings found.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Booking ID', 'Customer', 'Date', 'Products', 'Total', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.bookingId}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>{booking?.user?.name}</div>
                                            <div className="text-gray-500">{booking?.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{new Date(booking?.bookingDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm">{booking?.products?.length} items</td>
                                        <td className="px-6 py-4 text-sm font-medium">₹{calculateTotalAmount(booking?.products)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button onClick={() => onViewDetails(booking)} className="text-blue-600 hover:text-blue-900">
                                                    View
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => openModal(booking, 'completed')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => openModal(booking, 'cancelled')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL (Complete / Cancel confirmation) */}
            <AnimatePresence>
                {isModalOpen && selectedBooking && (
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
                                {actionType === 'completed' ? 'Complete Booking' : 'Cancel Booking'}
                            </h2>

                            <div className="space-y-2 text-sm">
                                <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                                <p><strong>Customer:</strong> {selectedBooking.user?.name}</p>
                                <p><strong>Email:</strong> {selectedBooking.user?.email}</p>
                                <p><strong>Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleString()}</p>
                                <p><strong>Products:</strong> {selectedBooking.products?.length}</p>
                                <p><strong>Total:</strong> ₹{calculateTotalAmount(selectedBooking.products)}</p>
                                <p><strong>Status:</strong> {actionType === 'completed' ? 'Completed' : 'Cancelled'}</p>

                                {actionType === 'completed' && (
                                    <div className="mt-3">
                                        <label className="block text-gray-700 mb-1">Tracking ID</label>
                                        <input
                                            type="text"
                                            value={trackingId}
                                            onChange={(e) => setTrackingId(e.target.value)}
                                            placeholder="Enter tracking ID"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() =>
                                        updateBookingStatus(selectedBooking._id, actionType, trackingId)
                                    }
                                    className={`px-4 py-2 text-white rounded-md ${actionType === 'completed'
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
        </div>
    );
});

export default AdminBookings;

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const UserBookings = ({ onViewDetails, BookingsData }) => {
    const { addToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Mock data - replace with API call
        const mockBookings = [
            {
                id: 'BK-001',
                date: '2024-01-15',
                products: [
                    { id: 1, name: 'Wireless Headphones', quantity: 2, price: 199.99 },
                    { id: 2, name: 'Phone Case', quantity: 1, price: 29.99 }
                ],
                total: 429.97,
                status: 'completed',
                trackingNumber: 'TRK123456789',
                shippingAddress: {
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            },
            {
                id: 'BK-002',
                date: '2024-01-12',
                products: [
                    { id: 3, name: 'Running Shoes', quantity: 1, price: 89.99 }
                ],
                total: 89.99,
                status: 'pending',
                trackingNumber: 'TRK987654321',
                shippingAddress: {
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            },
            {
                id: 'BK-003',
                date: '2024-01-10',
                products: [
                    { id: 4, name: 'Coffee Maker', quantity: 1, price: 149.99 },
                    { id: 5, name: 'Coffee Beans', quantity: 2, price: 19.99 }
                ],
                total: 189.97,
                status: 'cancelled',
                shippingAddress: {
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            }
        ];

        setBookings(mockBookings);
        setLoading(false);
    }, []);

    const filteredBookings = BookingsData?.filter(booking =>
        filter === 'all' || booking?.status === filter
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const calculateTotalAmount = (bookingProducts) => {
        let totalAmount = 0;
        for (let product of bookingProducts) {
            totalAmount += product?.subtotal || 0
        }
        return totalAmount
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {[
                            { id: 'all', name: 'All Bookings', count: BookingsData?.length },
                            { id: 'pending', name: 'Pending', count: BookingsData?.filter(b => b?.status === 'pending')?.length },
                            { id: 'completed', name: 'Completed', count: BookingsData?.filter(b => b?.status === 'completed')?.length },
                            { id: 'cancelled', name: 'Cancelled', count: BookingsData?.filter(b => b.status === 'cancelled')?.length }
                        ]?.map(tab => (
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

            {/* Bookings List */}
            {filteredBookings?.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? "You haven't made any bookings yet."
                            : `No ${filter} bookings found.`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings?.map((booking) => (
                        <div key={booking?._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Booking Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {booking?.bookingId}
                                            </h3>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking?.status)}`}>
                                                {getStatusText(booking?.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="font-medium">Products:</span> {booking?.products?.length} {booking?.products?.length === 1 ? 'item' : 'items'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Total:</span> ₹{calculateTotalAmount(booking?.products)}
                                            </div>
                                        </div>

                                        {booking?.tracking?.id && (
                                            <div className="mt-2 text-sm">
                                                <span className="font-medium text-gray-600">Tracking:</span>{' '}
                                                <span className="text-blue-600">{booking?.tracking?.id}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onViewDetails(booking)}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;
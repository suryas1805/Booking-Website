import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import UserBookings from '../../components/Bookings/UserBookings';
import AdminBookings from '../../components/Bookings/AdminBookings';
import BookingDetailsModal from '../../components/Bookings/BookingDetailsModal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookingsByUserIdThunks, getAllBookingsThunks } from '../../features/Booking/reducer/thunks';
import { selectAllBookingByUser, selectAllBookings } from '../../features/Booking/reducer/selector';

const Bookings = () => {
    const { user } = useAuth();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const AllBookingsData = useSelector(selectAllBookings)
    const AllUserBookingsData = useSelector(selectAllBookingByUser)
    const dispatch = useDispatch()

    const fetchAllBookings = useCallback(async () => {
        try {
            dispatch(getAllBookingsThunks())
        } catch (error) {
            console.log(error)
        }
    }, [])

    const fetchUserBookings = async () => {
        try {
            dispatch(getAllBookingsByUserIdThunks({ userId: user?._id }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllBookings()
        }
        else if (user?.role === 'user') {
            fetchUserBookings()
        }
    }, [dispatch])

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setSelectedBooking(null);
        setShowDetailsModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-600 mt-2">
                        {user?.role === 'admin'
                            ? 'Manage all customer bookings and orders'
                            : 'View your booking history and order details'
                        }
                    </p>
                </div>

                {user?.role === 'admin' ? (
                    <AdminBookings onViewDetails={handleViewDetails} BookingsData={AllBookingsData} onRefresh={fetchAllBookings} />
                ) : (
                    <UserBookings onViewDetails={handleViewDetails} BookingsData={AllUserBookingsData} />
                )}

                {/* Booking Details Modal */}
                <BookingDetailsModal
                    isOpen={showDetailsModal}
                    onClose={handleCloseDetails}
                    booking={selectedBooking}
                    onRefresh={fetchAllBookings}
                    isAdmin={user?.role === 'admin'}
                />
            </main>
        </div>
    );
};

export default Bookings;
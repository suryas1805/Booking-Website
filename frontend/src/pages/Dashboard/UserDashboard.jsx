import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, HelpCircle, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserReportsThunk } from '../../features/Dashboard/reducers/thunks';
import { useAuth } from '../../context/AuthContext';
import { selectUserReports } from '../../features/Dashboard/reducers/selectors';
import { formatDateTime } from '../../utils/formatter';
import { addToCartService } from '../../features/Carts/services';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUtils';

const UserDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user } = useAuth();
    const userReport = useSelector(selectUserReports)
    const { addToast } = useToast()

    const fetchUserReports = async () => {
        try {
            dispatch(getUserReportsThunk({ userId: user?._id }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user?.role === 'user') {
            fetchUserReports()
        }
    }, [dispatch])

    const handleAddToCart = async (product, quantity = 1) => {
        try {
            const data = { productId: product?._id, quantity }
            const response = await addToCartService({ userId: user?._id }, data)
            if (response) {
                addToast(`${product.name} added to cart!`, 'success');
            } else {
                addToast(`${product.name} failed to add to cart!`, 'error');
            }
        } catch (error) {
            addToast(`${product.name} failed to add to cart!`, 'error');
            console.log(error)
        }
    };

    const specialOffers = [
        { id: 1, name: 'Festival Sale', description: 'Grab amazing discounts on top brands.', validUntil: '2025-10-31' },
        { id: 2, name: 'Buy 2 Get 1 Free', description: 'Applicable on select accessories.', validUntil: '2025-11-10' },
    ];

    const calculateTotalAmount = (bookingProducts) => {
        let totalAmount = 0;
        for (let product of bookingProducts) {
            totalAmount += product?.subtotal || 0
        }
        return totalAmount
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your orders, explore new products, and get support easily.</p>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View All →
                    </button>
                </div>
                <div className="space-y-4">
                    {userReport?.bookings?.length ? userReport?.bookings?.map((booking, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div>
                                <h3 className="font-medium text-gray-900">{booking?.bookingId}</h3>
                                <p className="text-sm text-gray-500">Ordered on {formatDateTime(booking?.bookingDate)}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${booking?.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : booking?.status !== 'pending'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {booking?.status}
                                </span>
                                <span className="font-semibold text-gray-900">₹{calculateTotalAmount(booking?.products)}</span>
                            </div>
                        </div>
                    )) : <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-500">
                            You haven't made any bookings yet.
                        </p>
                    </div>}
                </div>
            </div>

            {/* Newly Added Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Newly Added Products</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Explore →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {userReport?.newProducts?.map((product, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                        >
                            <img
                                src={product?.image && getImageUrl(product?.image)}
                                alt={product.name}
                                className="w-full h-40 object-contain rounded-md mb-4"
                            />
                            {/* <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500 text-lg">IMG</span>
                            </div> */}
                            <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
                            <div className='flex justify-between'>
                                <p className="text-gray-900 mt-2 font-medium text-lg">₹{product.price}</p>
                                <span className={`text-sm mt-2 font-medium ${product?.stock > 10 ? 'text-green-600' :
                                    product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {product?.stock > 0 ? `${product?.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>
                            <button
                                disabled={product?.stock === 0}
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Offers */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Special Offers</h2>
                    <button
                        onClick={() => navigate('/offers')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Learn More →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {specialOffers.map((offer) => (
                        <div
                            key={offer.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                        >
                            <h3 className="font-semibold text-gray-900 mb-2">{offer.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                            <p className="text-gray-500 text-sm mb-4">Valid until {offer.validUntil}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Support & Help Center</h2>
                <p className="text-gray-600 mb-6">
                    Need assistance with your order or product? Our support team is here to help you 24/7.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <Phone className="text-blue-600 mb-2" size={32} />
                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                        <p className="text-gray-600 text-sm">+1 (800) 555-0123</p>
                    </div>
                    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <Mail className="text-blue-600 mb-2" size={32} />
                        <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-gray-600 text-sm">support@shopnow.com</p>
                    </div>
                    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                        <MessageSquare className="text-blue-600 mb-2" size={32} />
                        <h3 className="font-semibold text-gray-900 mb-1">Submit a Ticket</h3>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                            Open Form →
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/help')}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        <HelpCircle className="mr-2" size={20} />
                        Visit Help Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

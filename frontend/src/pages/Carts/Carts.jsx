import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Layout/Navbar';
import CartItem from '../../components/Carts/CartItem';
import CartSummary from '../../components/Carts/CartSummary';
import EmptyCart from '../../components/Carts/EmptyCart';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCartThunk } from '../../features/Carts/reducer/thunks';
import { selectUserCart } from '../../features/Carts/reducer/selector'
import { RemoveFromCartService, updateAddToCartService } from '../../features/Carts/services';
import { createBooking } from '../../features/Booking/services';

const Carts = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const dispatch = useDispatch()
    const userCartData = useSelector(selectUserCart)

    const fetchUserCart = async () => {
        try {
            dispatch(getUserCartThunk({ userId: user?._id }))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserCart()
    }, [dispatch])

    // Update quantity
    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await updateAddToCartService({ userId: user?._id }, { productId, quantity: newQuantity, type: 'update quantity' })
            if (response) {
                fetchUserCart()
            } else {
                addToast(`Failed to update the quantity!`, 'error');
            }
        } catch (error) {
            addToast(`Failed to update the quantity!`, 'error');
            console.log(error)
        }
    };

    // Remove item from cart
    const removeFromCart = async (product) => {
        try {
            const response = await RemoveFromCartService({
                userId: user?._id,
                productId: product?._id
            })
            if (response) {
                addToast(`${product?.name} removed from cart!`, 'success');
                fetchUserCart()
            } else {
                addToast(`${product?.name} failed to removed from cart!`, 'error');
            }
        } catch (error) {
            addToast(`${product?.name} failed to removed from cart!`, 'error');
            console.log(error)
        }
    };

    // Confirm booking
    const handleConfirmBooking = async () => {
        setConfirming(true);

        try {
            const response = await createBooking({ userId: user?._id })
            if (response) {
                addToast('Booking confirmed successfully! You will receive a confirmation email shortly.', 'success');
                fetchUserCart()
            } else {
                addToast('Failed to confirm booking. Please try again.', 'error');
            }
        } catch (error) {
            addToast('Failed to confirm booking. Please try again.', 'error');
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userCartData?.products || userCartData?.products?.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">Review your items and proceed to booking</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Cart Items ({userCartData?.products?.length || 0})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {userCartData?.products?.map((item) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6">
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium" onClick={() => navigate('/products')}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Continue Shopping
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            totals={userCartData?.cartsummary}
                            itemCount={userCartData?.cartsummary?.totalItems}
                            onConfirmBooking={handleConfirmBooking}
                            confirming={confirming}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Carts;
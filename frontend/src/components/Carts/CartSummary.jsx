
const CartSummary = ({ totals, itemCount, onConfirmBooking, confirming }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-16">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

                {/* Order Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items ({itemCount})</span>
                        <span className="text-gray-900">₹{totals?.subtotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className={parseFloat(totals?.shippingcharge) === 0 ? 'text-green-600' : 'text-gray-900'}>
                            {parseFloat(totals?.shippingcharge) === 0 ? 'FREE' : `$${totals?.shippingcharge}`}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-red-900">- ₹{totals?.discount}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">₹{totals?.tax || 0}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-base font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">₹{totals?.grandtotal}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Info */}
                {parseFloat(totals?.subtotal) < 100 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center text-sm text-blue-700">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Add ₹{(100 - parseFloat(totals.subtotal)).toFixed(2)} more for free shipping!
                        </div>
                    </div>
                )}

                {/* Confirm Booking Button */}
                <button
                    onClick={onConfirmBooking}
                    disabled={confirming}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                    {confirming ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        `Confirm Booking - ₹${totals?.grandtotal}`
                    )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure checkout
                </div>

                {/* Additional Info */}
                <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <p>• You will be able to review your booking before final confirmation</p>
                    <p>• Prices include all applicable taxes</p>
                    <p>• Free cancellation within 24 hours</p>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
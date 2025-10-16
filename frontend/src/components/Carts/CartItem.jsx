import { getImageUrl } from "../../utils/imageUtils";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <img
                        src={item?.product?.image && getImageUrl(item?.product?.image)}
                        alt={item?.product?.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item?.product?.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {item?.product?.description}
                            </p>

                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="capitalize">{item.category}</span>
                                <span>•</span>
                                <span className={
                                    item?.product?.stock > 10 ? 'text-green-600' :
                                        item?.product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                }>
                                    {item?.product?.stock > 0 ? `${item?.product?.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(item?.product)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => onUpdateQuantity(item?.product?._id, item?.quantity - 1)}
                                    disabled={item?.quantity <= 1}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-gray-900 min-w-[40px] text-center">
                                    {item?.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item?.product?._id, item.quantity + 1)}
                                    disabled={item?.quantity >= item?.product?.stock}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            {/* Price per item */}
                            <div className="text-sm text-gray-600">
                                ₹{item?.product?.price} each
                            </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                                ₹{item?.subtotal}
                            </div>
                            <div className="text-sm text-gray-500">
                                {item?.quantity} × ₹{item?.product?.price}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
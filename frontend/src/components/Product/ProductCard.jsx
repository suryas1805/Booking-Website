import React, { useState } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product?.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setQuantity(1);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="aspect-w-16 aspect-h-12 mt-2">
                <img
                    src={product?.image && getImageUrl(product?.image)}
                    alt={product?.name}
                    className="w-full h-48 object-contain"
                />
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{product?.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product?.description}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 capitalize">{product?.category?.name}</span>
                    <span className={`text-sm font-medium ${product?.stock > 10 ? 'text-green-600' :
                        product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {product?.stock > 0 ? `${product?.stock} in stock` : 'Out of stock'}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900">₹{product?.price}</span>
                </div>

                {/* Quantity Control and Add to Cart */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <span className="px-3 py-1 text-gray-900">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product?.stock}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product?.stock === 0}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
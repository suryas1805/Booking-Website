import React, { useState, useRef, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const AdminProductCard = ({ product, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = () => {
        onEdit(product);
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete(product, 'product');
        setShowMenu(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image and Menu */}
            <div className="relative">
                <div className="aspect-w-16 aspect-h-12 mt-2">
                    <img
                        src={product?.image && getImageUrl(product?.image)}
                        alt={product?.name}
                        className="w-full h-48 object-contain"
                    />
                </div>

                {/* Three-dot Menu */}
                <div className="absolute top-2 right-2" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{product?.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product?.description}</p>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Category:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{product?.category?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="text-lg font-bold text-gray-900">₹{product?.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <span className={`text-sm font-medium ${product?.stock > 10 ? 'text-green-600' :
                            product?.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {product?.stock} units
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCard;
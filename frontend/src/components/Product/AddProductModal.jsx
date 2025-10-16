import { useState } from 'react';

const AddProductModal = ({ isOpen, onClose, onSubmit, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadedImage(file);
        if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 10)
            newErrors.description = 'Description must be at least 10 characters long';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.price || parseFloat(formData.price) <= 0)
            newErrors.price = 'Price must be greater than 0';
        if (!formData.stock || parseInt(formData.stock) < 0)
            newErrors.stock = 'Stock must be 0 or greater';
        if (!uploadedImage) newErrors.image = 'Product image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('stock', parseInt(formData.stock));
            formDataToSend.append('image', uploadedImage);

            await onSubmit(formDataToSend);
            setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                stock: '',
            });
            setUploadedImage(null);
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error submitting product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            stock: '',
        });
        setUploadedImage(null);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Fields */}
                        {[
                            { id: 'name', label: 'Product Name', type: 'text', required: true },
                            { id: 'description', label: 'Description', type: 'textarea', required: true },
                            { id: 'category', label: 'Category', type: 'select', required: true },
                            { id: 'price', label: 'Price (₹)', type: 'number', required: true },
                            { id: 'stock', label: 'Stock', type: 'number', required: true },
                        ].map((field) => (
                            <div key={field.id} className={field.id === 'description' ? 'md:col-span-2' : ''}>
                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label} {field.required && '*'}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.id}
                                        name={field.id}
                                        rows={3}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[field.id] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        min={field.type === 'number' ? '0' : undefined}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[field.id] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                )}

                                {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
                            </div>
                        ))}

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={`w-full border p-2 rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {uploadedImage && (
                                <img
                                    src={URL.createObjectURL(uploadedImage)}
                                    alt="Preview"
                                    className="mt-3 w-32 h-32 object-cover rounded-lg border"
                                />
                            )}
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;

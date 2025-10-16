import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useToast } from '../../context/ToastContext'
import { useNavigate } from 'react-router-dom';
import { changePasswordService } from '../../features/Auth/services';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';

        if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
        else if (formData.newPassword.length < 6)
            newErrors.newPassword = 'Password must be at least 6 characters long';

        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
        else if (formData.newPassword !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {

            const response = await changePasswordService(formData);
            if (response) {
                addToast('Password changed successfully!', 'success');
                setFormData({ email: '', newPassword: '', confirmPassword: '' });
                navigate('/login')
            }
            else {
                addToast('Invalid email. Please try again.', 'error');
            }
        } catch (error) {
            console.log(error)
            addToast('Network error. Please check your connection.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Change Password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <label className="block text-gray-700 font-medium mb-1">New Password</label>
                        <input
                            type={showPassword.new ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                        >
                            {showPassword.new ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Re-enter new password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        >
                            {showPassword.confirm ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;

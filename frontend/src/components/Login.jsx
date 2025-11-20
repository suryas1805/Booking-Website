import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authLogin } from '../features/Auth/services';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useToast } from '../context/ToastContext'
import { initOneSignalSDK, setExternalUser } from '../onesignal';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     initOneSignalSDK();
    // }, []);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await authLogin(formData);
                if (response?.status === 200) {
                    // const userId = response.data.user._id.toString();
                    // setExternalUser(userId);
                    login(response.data.token, response.data.user);
                    addToast('Login successful! Welcome back.', 'success');
                    navigate('/dashboard');
                } else {
                    addToast(response?.msg || 'Invalid email or password. Please try again.', 'error');
                }
            } catch (error) {
                console.error(error);
                addToast('Invalid email or password. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleLogin = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/google/url`);
        window.location.href = res.data.url;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-2.5 text-xl"
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition`}
                        disabled={loading}
                    >
                        {loading ? "Sign In..." : "Sign In"}
                    </button>
                </form>

                <div className='mt-4 flex justify-end'>
                    <button onClick={() => navigate('/email-verify')}>
                        <p className='text-red-500 text-sm hover:underline'>Forgot Password</p>
                    </button>
                </div>

                <p className="text-center text-gray-600 text-sm mt-3">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
                <p className='text-center text-gray-900 text-sm mt-2'>or</p>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white 
               py-2.5 mt-4 rounded-xl border border-gray-300 shadow-sm
               hover:shadow-md transition-all duration-300
               hover:bg-gray-50 active:scale-[0.98]"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium">
                        Continue with Google
                    </span>
                </button>
            </div>

        </div>
    );
};

export default Login;

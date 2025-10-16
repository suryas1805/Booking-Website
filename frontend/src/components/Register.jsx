import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRegister } from "../features/Auth/services";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useToast } from '../context/ToastContext'
import { setExternalUser } from "../onesignal";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password =
                "Password must contain at least one uppercase, one lowercase, and one number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true)
            const { confirmPassword, ...userData } = formData;
            try {
                const response = await authRegister(userData);
                if (response) {
                    addToast('Registered successful!', 'success');
                    setExternalUser(response?.data?.data?.newUser?._id);
                    navigate("/login")
                } else {
                    addToast('Failed to register. Please try again.', 'error');
                }
            } catch (error) {
                console.error(error);
                addToast('Network error. Please check your connection.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Full Name*
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name
                                ? "border-red-500 focus:ring-red-300"
                                : "border-gray-300 focus:ring-indigo-300"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Email Address*
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email
                                ? "border-red-500 focus:ring-red-300"
                                : "border-gray-300 focus:ring-indigo-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Role*
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.role
                                ? "border-red-500 focus:ring-red-300"
                                : "border-gray-300 focus:ring-indigo-300"
                                }`}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Password*
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-indigo-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-2.5 text-xl"
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Confirm Password*
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-indigo-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-2.5 text-xl"
                            >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

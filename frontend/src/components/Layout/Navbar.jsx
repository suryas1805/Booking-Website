import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authLogout } from '../../features/Auth/services';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // modal state

    const handleLogout = async () => {
        try {
            await authLogout();
            logout();
            addToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            addToast('Logout failed', 'error');
        } finally {
            setIsModalOpen(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navItems = user?.role === 'admin'
        ? [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/products', label: 'Products' },
            { path: '/bookings', label: 'Bookings' },
            { path: '/users', label: 'Users' },
            { path: '/profile', label: 'Profile' }
        ]
        : [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/products', label: 'Products' },
            { path: '/carts', label: 'Carts' },
            { path: '/bookings', label: 'My Bookings' },
            { path: '/profile', label: 'Profile' }
        ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">BookingApp</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Info & Logout */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Welcome, {`${user?.name.charAt(0).toUpperCase()}${user?.name.slice(1)}`}
                        </span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="px-3 py-2 border-t mt-2 pt-3">
                                <span className="block text-sm text-gray-700 mb-2">
                                    Welcome, {user?.name}
                                </span>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Logout Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

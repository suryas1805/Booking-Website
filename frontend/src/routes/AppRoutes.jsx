import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Products from '../pages/Products/Products';
import Bookings from '../pages/Bookings/Bookings';
import Profile from '../pages/Profile/Profile';
import Carts from '../pages/Carts/Carts';
import ChangePassword from '../components/Auth/ChangePassword';
import Users from '../pages/Users/Users'
import HelpCenter from '../pages/HelpCenter/HelpCenter'
import OffersPage from '../pages/Offers/OffersPage'
import NotFoundPage from '../components/NotFoundPage';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
            <Route
                path="/change-password"
                element={
                    <PublicRoute>
                        <ChangePassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <Products />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <Bookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/carts"
                element={
                    <ProtectedRoute>
                        <Carts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/help"
                element={
                    <ProtectedRoute>
                        <HelpCenter />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/offers"
                element={
                    <ProtectedRoute>
                        <OffersPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default AppRoutes;
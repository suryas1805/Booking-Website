import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import Navbar from '../../components/Layout/Navbar';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
            </main>
        </div>
    );
};

export default Dashboard;
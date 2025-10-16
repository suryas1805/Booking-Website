import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminReportsThunk } from '../../features/Dashboard/reducers/thunks';
import { useAuth } from '../../context/AuthContext';
import { selectAdminReports } from '../../features/Dashboard/reducers/selectors';
import { formatDateTime } from '../../utils/formatter';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user } = useAuth();
    const adminReport = useSelector(selectAdminReports)

    const fetchAdminReports = async () => {
        try {
            dispatch(getAdminReportsThunk({ adminId: user?._id }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminReports()
        }
    }, [dispatch])

    const statsData = {
        totalUsers: adminReport?.totalUsers,
        totalProducts: adminReport?.totalProducts,
        totalBookings: adminReport?.totalBookings,
        revenue: adminReport?.totalRevenue
    };

    const barChartData = {
        labels: adminReport?.monthWise?.labels,
        datasets: [
            {
                label: 'Users',
                data: adminReport?.monthWise?.users,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Bookings',
                data: adminReport?.monthWise?.bookings,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
            },
        ],
    };

    const lineChartData = {
        labels: adminReport?.monthWise?.labels,
        datasets: [
            {
                label: 'Revenue',
                data: adminReport?.monthWise?.revenue,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
            },
        ],
    };

    const pieChartData = {
        labels: adminReport?.bookingsStatus?.labels,
        datasets: [
            {
                data: adminReport?.bookingsStatus?.data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const StatCard = ({ title, value, onClick, color = 'blue' }) => {
        const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            yellow: 'bg-yellow-100 text-yellow-600'
        };

        return (
            <div
                className={`hide-scrollbar bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${onClick ? 'hover:scale-105 transform transition-transform' : ''
                    }`}
                onClick={onClick}
            >
                <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color]}`}>
                        <div className="w-6 h-6 bg-current rounded"></div>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your administration panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={statsData.totalUsers}
                    onClick={() => navigate('/users')}
                    color="blue"
                />
                <StatCard
                    title="Total Products"
                    value={statsData.totalProducts}
                    onClick={() => navigate('/products')}
                    color="green"
                />
                <StatCard
                    title="Total Bookings"
                    value={statsData.totalBookings}
                    onClick={() => navigate('/bookings')}
                    color="purple"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${statsData.revenue}`}
                    color="yellow"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Users vs Bookings</h3>
                    </div>
                    <div className="h-80">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                    </div>
                    <div className="h-80">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1 h-[85%]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Booking Status</h3>
                    </div>
                    <div className="h-64">
                        <Pie data={pieChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 h-[85%] overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                        {adminReport?.recentActivities?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 text-sm font-semibold">{item?.action?.charAt(0)}</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{item?.action}</p>
                                        <p className="text-sm text-gray-900">{item?.description}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 text-xs text-gray-500">
                                    {formatDateTime(item?.createdAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
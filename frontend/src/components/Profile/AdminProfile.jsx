import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfileDetails } from '../../features/Profile/services';
import { formatDate, formatDateTime } from '../../utils/formatter';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import dummyImage from '../../assets/images/dummy-image.jpg'

const AdminProfile = React.memo(({ profileData, activityData, onRefresh }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate()
    const [previewImage, setPreviewImage] = useState(profileData?.image || null);
    const [formData, setFormData] = useState({
        name: profileData?.name || '',
        email: profileData?.email || '',
        phone: profileData?.contact?.phone_number || '',
        department: profileData?.role || 'Admin',
        address: profileData?.contact?.address || '',
        city: profileData?.contact?.city || '',
        state: profileData?.contact?.state || '',
        pincode: profileData?.contact?.postal_code || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            phone: profileData?.contact?.phone_number || '',
            department: profileData?.role || 'Admin',
            address: profileData?.contact?.address || '',
            city: profileData?.contact?.city || '',
            state: profileData?.contact?.state || '',
            pincode: profileData?.contact?.postal_code || ''
        })
        setPreviewImage(getImageUrl(profileData?.image))
    }, [profileData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditing) return;
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('role', formData.department);
            payload.append('contact[phone_number]', formData.phone);
            payload.append('contact[address]', formData.address);
            payload.append('contact[city]', formData.city);
            payload.append('contact[state]', formData.state);
            payload.append('contact[postal_code]', formData.pincode);

            if (formData.image instanceof File) {
                payload.append('image', formData.image);
            }

            const response = await updateProfileDetails({ userId: user?._id }, payload);

            if (response) {
                addToast('Profile updated successfully!', 'success');
                setIsEditing(false);
                onRefresh();
            } else {
                addToast('Failed to update profile. Please try again.', 'error');
            }
        } catch (error) {
            addToast('Failed to update profile. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            phone: profileData?.contact?.phone_number || '',
            department: profileData?.role || 'Admin',
            address: profileData?.contact?.address || '',
            city: profileData?.contact?.city || '',
            state: profileData?.contact?.state || '',
            pincode: profileData?.contact?.postal_code || ''
        });
        setIsEditing(false);
    };

    const systemStats = [
        { label: 'Total Users', value: '1,245', change: '+12%' },
        { label: 'Total Products', value: '89', change: '+5%' },
        { label: 'Total Bookings', value: '567', change: '+23%' },
        { label: 'Revenue', value: '$125,430', change: '+18%' }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {[
                                { id: 'profile', name: 'Profile Settings' },
                                { id: 'stats', name: 'System Statistics' },
                                { id: 'activity', name: 'Recent Activity' },
                                { id: 'security', name: 'Security' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative">
                                        <img
                                            src={
                                                previewImage
                                                    ? previewImage.startsWith('blob:')
                                                        ? previewImage
                                                        : `${previewImage}`
                                                    : dummyImage
                                            }
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pin Code
                                        </label>
                                        <input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'stats' && (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                    {systemStats.map((stat, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                            <div className="flex items-baseline justify-between">
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    {stat.change}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex">
                                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">System Maintenance</h4>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Scheduled maintenance window: Sunday, 2:00 AM - 4:00 AM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Activity Tab */}
                        {activeTab === 'activity' && (
                            <div className="space-y-4 h-[500px] overflow-y-auto scrollbar-hide">
                                {activityData?.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'product' ? 'bg-green-100 text-green-600' :
                                                    activity.type === 'booking' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-sm text-gray-500">{activity.description}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{formatDateTime(activity.createdAt)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Two-Factor Authentication</h4>
                                    <p className="text-sm text-blue-700 mb-3">
                                        Add an extra layer of security to your account by enabling two-factor authentication.
                                    </p>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Enable 2FA
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Login History</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Chrome • Windows</p>
                                                <p className="text-xs text-gray-500">New York, USA</p>
                                            </div>
                                            <span className="text-sm text-gray-500">Just now</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Safari • macOS</p>
                                                <p className="text-xs text-gray-500">California, USA</p>
                                            </div>
                                            <span className="text-sm text-gray-500">2 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Admin Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        {profileData?.image ?
                            <div className='flex items-center justify-center'>
                                <img src={getImageUrl(profileData?.image)} className='w-16 h-16 rounded-full object-cover' />
                            </div>
                            :
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <p className='text-2xl font-semibold text-white'>{profileData?.name?.charAt(0)}</p>
                            </div>
                        }
                        <h3 className="text-lg font-semibold text-gray-900">{profileData?.name}</h3>
                        <p className="text-gray-600">{profileData?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                            {`${profileData?.role?.charAt(0).toUpperCase()}${profileData?.role?.slice(1)}`}
                        </span>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Admin since</span>
                            <span className="font-medium">{formatDate(profileData?.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Update</span>
                            <span className="font-medium">{formatDate(profileData?.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">System role</span>
                            <span className="font-medium">{`${profileData?.role?.charAt(0).toUpperCase()}${profileData?.role?.slice(1)}`}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Manage Users</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate('/users')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">System Settings</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">View Reports</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                    <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-green-800">System Online</span>
                    </div>
                    <p className="text-green-700 text-sm">
                        All systems are operating normally. No issues reported.
                    </p>
                </div>
            </div>
        </div>
    );
});

export default AdminProfile;
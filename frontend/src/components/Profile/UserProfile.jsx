import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfileDetails } from '../../features/Profile/services';
import { formatDate, formatDateTime } from '../../utils/formatter';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import dummyImage from '../../assets/images/dummy-image.jpg'

const UserProfile = React.memo(({ profileData, bookingsData, activityData, onRefresh }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [previewImage, setPreviewImage] = useState(profileData?.image || null);
    const [formData, setFormData] = useState({
        name: profileData?.name || '',
        email: profileData?.email || '',
        phone: profileData?.contact?.phone_number || '',
        address: profileData?.contact?.address || '',
        city: profileData?.contact?.city || '',
        state: profileData?.contact?.state || '',
        postalCode: profileData?.contact?.postal_code || '',
        image: null
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
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            phone: profileData?.contact?.phone_number || '',
            address: profileData?.contact?.address || '',
            city: profileData?.contact?.city || '',
            state: profileData?.contact?.state || '',
            postalCode: profileData?.contact?.postal_code || '',
            image: null
        })
        setPreviewImage(getImageUrl(profileData?.image));
    }, [profileData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('contact[phone_number]', formData.phone);
            payload.append('contact[address]', formData.address);
            payload.append('contact[city]', formData.city);
            payload.append('contact[state]', formData.state);
            payload.append('contact[postal_code]', formData.postalCode);

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
            address: profileData?.contact?.address || '',
            city: profileData?.contact?.city || '',
            state: profileData?.contact?.state || '',
            postalCode: profileData?.contact?.postal_code || '',
            image: null
        });
        setPreviewImage(getImageUrl(profileData?.image));
        setIsEditing(false);
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Image Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    src={previewImage || dummyImage}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
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
                            {/* Name */}
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

                            {/* Email */}
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

                            {/* Phone */}
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

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Pin Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pin Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Save / Cancel */}
                        {isEditing && (
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
                        )}
                    </form>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 h-[40%] overflow-y-auto scrollbar-hide">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {activityData?.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-3 h-3 rounded-full ${activity.status === 'confirmed' ? 'bg-green-500' :
                                            activity?.type === 'user' ? 'bg-blue-500' : 'bg-red-500'
                                            }`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{activity?.action}</p>
                                            <p className="text-sm text-gray-500">{activity?.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{formatDateTime(activity?.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Profile Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        {profileData?.image ?
                            <div className='flex items-center justify-center'>
                                <img src={getImageUrl(profileData?.image)} className='w-16 h-16 rounded-full object-cover' />
                            </div>
                            :
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {profileData?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>}
                        <h3 className="text-lg font-semibold text-gray-900">{profileData?.name}</h3>
                        <p className="text-gray-600">{profileData?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {`${profileData?.role?.charAt(0).toUpperCase()}${profileData?.role?.slice(1)}`}
                        </span>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Member since</span>
                            <span className="font-medium">{formatDate(profileData?.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Bookings</span>
                            <span className="font-medium">{bookingsData?.length}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">View My Bookings</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate('/bookings')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Payment Methods</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Notification Settings</span>
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <div className="text-center">
                        <svg className="w-8 h-8 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
                        <p className="text-blue-700 text-sm mb-4">
                            Our support team is here to help you with any questions.
                        </p>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default UserProfile;
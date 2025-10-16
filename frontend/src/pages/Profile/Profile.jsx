import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import UserProfile from '../../components/Profile/UserProfile'
import AdminProfile from '../../components/Profile/AdminProfile'
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileDetailsThunks } from '../../features/Profile/reducer/thunks';
import { selectProfile } from '../../features/Profile/reducer/selector';
import { getAllActivitiesThunk, getAllUserActivitiesThunk } from '../../features/Activity/reducer/thunks';
import { selectAllActivities, selectAllUserActivities } from '../../features/Activity/reducer/selectors';

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch()
    const profileData = useSelector(selectProfile)?.data
    const bookingsData = useSelector(selectProfile)?.bookings
    const userActivitiesData = useSelector(selectAllUserActivities)
    const allActivitiesData = useSelector(selectAllActivities)

    const fetchProfileData = useCallback(async () => {
        try {
            dispatch(getProfileDetailsThunks({ userId: user?._id }))
        } catch (error) {
            console.log(error)
        }
    }, [])

    const fetchAllUserActivities = useCallback(async () => {
        try {
            dispatch(getAllUserActivitiesThunk({ userId: user?._id }))
        } catch (error) {
            console.log(error)
        }
    }, [])

    const fetchAllActivities = useCallback(async () => {
        try {
            dispatch(getAllActivitiesThunk())
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        fetchProfileData()
        if (user?.role === 'user') {
            fetchAllUserActivities()
        }
        else if (user?.role === 'admin') {
            fetchAllActivities()
        }
    }, [dispatch])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-2">
                        {user?.role === 'admin'
                            ? 'Manage your administrator profile and system settings'
                            : 'Manage your personal information and preferences'
                        }
                    </p>
                </div>

                {user?.role === 'admin' ?
                    <AdminProfile
                        profileData={profileData}
                        activityData={allActivitiesData}
                        onRefresh={() => {
                            fetchProfileData()
                            fetchAllActivities()
                        }}
                    />
                    :
                    <UserProfile
                        profileData={profileData}
                        bookingsData={bookingsData}
                        activityData={userActivitiesData}
                        onRefresh={() => {
                            fetchProfileData()
                            fetchAllUserActivities()
                        }}
                    />}
            </main>
        </div>
    );
};

export default Profile;
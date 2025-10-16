import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Dialog } from '@headlessui/react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers } from '../../features/Users/reducer/selector';
import { getAllUsersThunk } from '../../features/Users/reducer/thunk';
import { deleteUserService } from '../../features/Users/services';
import { useToast } from '../../context/ToastContext'
import { authRegister } from '../../features/Auth/services';
import { updateProfileDetails } from '../../features/Profile/services'
import { getImageUrl } from '../../utils/imageUtils';

const Users = () => {
    const { user } = useAuth();
    const dispatch = useDispatch()
    const users = useSelector(selectUsers)
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'user', password: '' });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)

    const fetchAllUsers = async () => {
        try {
            dispatch(getAllUsersThunk())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [dispatch])

    const openModal = (u) => {
        if (u) {
            setEditingUser(u);
            setFormData(u);
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'user', password: '' });
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditingUser(null);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setUserToDelete(null);
        setIsDeleteOpen(false);
    };

    const handleDelete = async (id) => {
        setLoading(true)
        try {
            const response = await deleteUserService({
                userId: id
            })
            if (response) {
                addToast('User selected successfully!', 'success');
                fetchAllUsers()
                closeDeleteModal();
            } else {
                addToast('Failed to delete the user', 'error');
            }
        } catch (error) {
            console.log(error)
            addToast('Failed to delete the user', 'error');
        } finally {
            closeDeleteModal();
            setLoading(false)
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            addToast('Name and Email are required.', 'error');
            return;
        }

        if (editingUser) {
            setLoading(true)
            try {
                const response = await updateProfileDetails({ userId: editingUser?._id }, formData)
                if (response) {
                    addToast('User updated successfully!', 'success');
                    fetchAllUsers()
                } else {
                    addToast('Failed to update the user', 'error');
                }
            } catch (error) {
                console.log(error)
                addToast('Failed to update the user', 'error');
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(true)
            try {
                const response = await authRegister(formData)
                if (response) {
                    addToast('User added successfully!', 'success');
                    fetchAllUsers()
                } else {
                    addToast('Failed to add the user', 'error');
                }
            } catch (error) {
                console.log(error)
                addToast('Failed to add the user', 'error');
            } finally {
                setLoading(false)
            }
        }

        closeModal();
    };

    const filteredUsers = users?.filter(
        (u) =>
            u?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                        <p className="text-gray-600 mt-1">Manage users & admins</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border px-3 py-2 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Plus size={18} /> Add
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredUsers?.map((u) => (
                                    <motion.tr
                                        key={u._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <td className="px-6 py-4 text-gray-900 font-medium flex items-center gap-2">
                                            {u?.image ? <div>
                                                <img src={u?.image && getImageUrl(u?.image)} className='w-12 h-12 object-cover rounded-full' />
                                            </div>
                                                :
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <p className='text-md font-semibold text-white'>{u?.name?.charAt(0)}</p>
                                                </div>
                                            }
                                            <div>
                                                {u.name}
                                                {user?.name?.toLowerCase() === u.name.toLowerCase() && (
                                                    <span className="text-blue-600 text-sm ml-1">(You)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {`${u.role.charAt(0).toUpperCase()}${u.role.slice(1)}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                                            <button
                                                onClick={() => openModal(u)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(u)}
                                                disabled={user?.name?.toLowerCase() === u.name.toLowerCase()}
                                                className={`${user?.name?.toLowerCase() === u.name.toLowerCase()
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-800'
                                                    }`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}

                                {filteredUsers?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal */}
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <Dialog.Title className="text-lg font-semibold mb-4">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </Dialog.Title>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {!editingUser &&
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            }
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end mt-6 gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {editingUser ? loading ? 'Updating...' : 'Update' : loading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onClose={closeDeleteModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                        <Dialog.Title className="text-lg font-semibold mb-4">Confirm Delete</Dialog.Title>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-medium">{userToDelete?.name}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(userToDelete?._id);
                                }}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default Users;

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Layout/Navbar';
import SearchBox from '../../components/Product/SearchBox';
import CategoryFilter from '../../components/Product/CategoryFilter';
import AdminActions from '../../components/Product/AdminActions'
import AdminProductCard from '../../components/Product/AdminProductCard'
import ProductCard from '../../components/Product/ProductCard'
import AddCategoryModal from '../../components/Product/AddCategoryModal'
import AddProductModal from '../../components/Product/AddProductModal'
import EditCategoryModal from '../../components/Product/EditCategoryModal'
import EditProductModal from '../../components/Product/EditProductModal'
import CategoryList from '../../components/Product/CategoryList'
import DeleteConfirmationModal from '../../components/Product/DeleteConfirmationModal'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesThunk } from '../../features/Category/reducer/thunks';
import { getAllProductsThunk } from '../../features/Product/reducer/thunks';
import { selectAllProducts } from '../../features/Product/reducer/selector'
import { selectCategories } from '../../features/Category/reducer/selector';
import { createCategory, deleteCategory, updateCategory } from '../../features/Category/services';
import { createProduct, deleteProduct, updateProduct } from '../../features/Product/services';
import { addToCartService } from '../../features/Carts/services';

const Products = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const dispatch = useDispatch()
    const productsData = useSelector(selectAllProducts)
    const categoriesData = useSelector(selectCategories)

    const fetchAllCategories = async () => {
        try {
            dispatch(getAllCategoriesThunk())
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllProducts = async () => {
        try {
            dispatch(getAllProductsThunk())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        try {
            fetchAllCategories()
            fetchAllProducts()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }, [dispatch])


    // Filter products based on search and category
    useEffect(() => {
        let filtered = productsData;

        // Filter by search term
        if (searchTerm) {
            filtered = productsData?.filter(product =>
                product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product?.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered?.filter(product => product?.category?._id === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, productsData]);

    // Search handlers
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // User actions
    const handleAddToCart = async (product, quantity) => {
        try {
            const data = { productId: product?._id, quantity }
            const response = await addToCartService({ userId: user?._id }, data)
            if (response) {
                addToast(`${product.name} added to cart!`, 'success');
            } else {
                addToast(`${product.name} failed to add to cart!`, 'error');
            }
        } catch (error) {
            addToast(`${product.name} failed to add to cart!`, 'error');
            console.log(error)
        }
    };

    // Admin actions
    const handleAddCategory = () => {
        setShowAddCategory(true);
    };

    const handleAddProduct = () => {
        setShowAddProduct(true);
    };

    const handleEditCategory = (category) => {
        setSelectedItem(category);
        setModalType('category');
        setShowEditCategory(true);
    };

    const handleEditProduct = (product) => {
        setSelectedItem(product);
        setModalType('product');
        setShowEditProduct(true);
    };

    const handleDelete = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (modalType === 'product') {
            try {
                const response = await deleteProduct({ productId: selectedItem?._id })
                if (response) {
                    addToast('Product deleted successfully!', 'success');
                    fetchAllProducts()
                } else {
                    addToast('Failed to delete product', 'error');
                }
            } catch (error) {
                addToast('Failed to delete product', 'error');
                console.log(error)
            }
        } else if (modalType === 'category') {
            try {
                const response = await deleteCategory({ categoryId: selectedItem?._id })
                if (response) {
                    addToast('Category deleted successfully!', 'success');
                    fetchAllCategories()
                    fetchAllProducts()
                } else {
                    addToast('Failed to delete category', 'error');
                }
            } catch (error) {
                addToast('Failed to delete category', 'error');
                console.log(error)
            }
        }
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const handleAddCategorySubmit = async (categoryData) => {
        try {
            const response = await createCategory(categoryData)
            if (response) {
                addToast('Category added successfully!', 'success');
                fetchAllCategories()
            } else {
                addToast('Failed to add category', 'error');
            }
        } catch (error) {
            addToast('Failed to add category', 'error');
            console.log(error)
        } finally {
            setShowAddCategory(false);
        }
    };

    const handleAddProductSubmit = async (productData) => {
        try {
            const response = await createProduct(productData)
            if (response) {
                addToast('Product added successfully!', 'success');
                fetchAllProducts()
            } else {
                addToast('Failed to add product', 'error');
            }
        } catch (error) {
            addToast('Failed to add product', 'error');
            console.log(error)
        } finally {
            setShowAddProduct(false);
        }
    };

    const handleEditCategorySubmit = async (categoryData) => {
        try {
            const response = await updateCategory({ categoryId: selectedItem?._id }, categoryData)
            if (response) {
                addToast('Category updated successfully!', 'success');
                fetchAllCategories()
                fetchAllProducts()
            } else {
                addToast('Failed to update category', 'error');
            }
        } catch (error) {
            addToast('Failed to update category', 'error');
            console.log(error)
        } finally {
            setShowEditCategory(false);
            setSelectedItem(null);
        }
    };

    const handleEditProductSubmit = async (productData) => {
        try {
            const response = await updateProduct({ productId: selectedItem?._id }, productData)
            if (response) {
                addToast('Product updated successfully!', 'success');
                fetchAllProducts()
            } else {
                addToast('Failed to update product', 'error');
            }
        } catch (error) {
            addToast('Failed to update product', 'error');
            console.log(error)
        } finally {
            setShowEditProduct(false);
            setSelectedItem(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">
                        {user?.role === 'admin' ? 'Manage your products and categories' : 'Browse our amazing products'}
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <SearchBox
                                searchTerm={searchTerm}
                                onSearch={handleSearch}
                                onClear={handleClearSearch}
                            />
                        </div>
                        <div className="w-full lg:w-64">
                            <CategoryFilter
                                categories={categoriesData}
                                selectedCategory={selectedCategory}
                                onCategoryChange={handleCategoryChange}
                                onEditCategory={handleEditCategory}
                                onDeleteCategory={handleDelete}
                                user={user}
                            />
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {user?.role === 'admin' && (
                        <AdminActions
                            onAddCategory={handleAddCategory}
                            onAddProduct={handleAddProduct}
                        />
                    )}
                    {user?.role === 'admin' && (
                        <CategoryList
                            onCategorySelect={handleCategoryChange}
                            selectedCategory={selectedCategory}
                            categories={categoriesData}
                            onEdit={handleEditCategory}
                            onDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Products Grid */}
                {filteredProducts?.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts?.map((product) =>
                            user?.role === 'admin' ? (
                                <AdminProductCard
                                    key={product?._id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <ProductCard
                                    key={product?._id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            )
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-6 text-sm text-gray-500">
                    Showing {filteredProducts.length} of {productsData.length} products
                </div>
            </main>

            {/* Modals */}
            <AddCategoryModal
                isOpen={showAddCategory}
                onClose={() => setShowAddCategory(false)}
                onSubmit={handleAddCategorySubmit}
            />

            <AddProductModal
                isOpen={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                onSubmit={handleAddProductSubmit}
                categories={categoriesData}
            />

            <EditCategoryModal
                isOpen={showEditCategory}
                onClose={() => setShowEditCategory(false)}
                onSubmit={handleEditCategorySubmit}
                category={selectedItem}
            />

            <EditProductModal
                isOpen={showEditProduct}
                onClose={() => setShowEditProduct(false)}
                onSubmit={handleEditProductSubmit}
                product={selectedItem}
                categories={categoriesData}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                item={selectedItem}
                type={modalType}
            />
        </div>
    );
};

export default Products;
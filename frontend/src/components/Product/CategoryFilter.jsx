
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="all">All Categories</option>
            {categories?.map((category) => (
                <option key={category?._id} value={category?._id}>
                    {category?.name}
                </option>
            ))}
        </select>
    );
};

export default CategoryFilter;
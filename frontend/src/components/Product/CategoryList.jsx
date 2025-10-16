import { Pencil, Trash2 } from "lucide-react";

const CategoryList = ({ categories = [], onEdit, onDelete, onCategorySelect, selectedCategory }) => {
    if (!categories?.length) {
        return (
            <div className="text-gray-500 text-sm italic py-3">
                No categories available
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Categories
            </h2>

            {/* Scrollable Category Row */}
            <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                <div
                    className={`flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-all duration-200 ${selectedCategory == 'all' && '!bg-blue-100'}`}
                    onClick={() => onCategorySelect('all')}
                >
                    <span className="font-medium text-gray-700">All Categories</span>
                </div>
                {categories?.map((category) => (
                    <div
                        key={category?._id}
                        className={`flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-all duration-200 ${selectedCategory == category?._id && '!bg-blue-100'}`}
                        onClick={() => onCategorySelect(category?._id)}
                    >
                        <span className="font-medium text-gray-700">{category?.name}</span>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => onEdit(category)}
                                className="p-1 rounded hover:bg-blue-100"
                                title="Edit"
                            >
                                <Pencil size={14} className="text-blue-600" />
                            </button>
                            <button
                                onClick={() => onDelete(category, "category")}
                                className="p-1 rounded hover:bg-red-100"
                                title="Delete"
                            >
                                <Trash2 size={14} className="text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { fetchCategories } from "@/lib/categoryApi";

interface Category {
  id: number;
  category_name: string;
  status?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  categoryTotalPages: number;
  categoryPage: number;
  setCategoryPage: (page: number) => void;
  setEditingCategory: (category: Category | undefined) => void;
  setCategoryModalOpen: (open: boolean) => void;
  handleEditCategory: (category: Category) => void;
  handleDeleteCategory: (category: Category) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  categoryTotalPages,
  categoryPage,
  setCategoryPage,
  setEditingCategory,
  setCategoryModalOpen,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchAndSetCategories = async (search?: string) => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      const data = await fetchCategories(1, 10, token, search ?? searchTerm);
      // setCategories(data.categories || []); // This line was removed
    } catch (err) {
      // setCategories([]); // This line was removed
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAndSetCategories();
  }, []);

  React.useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchAndSetCategories(searchTerm);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  return (
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1c1b1f] text-lg capitalize">categories</CardTitle>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={() => { setEditingCategory(undefined); setCategoryModalOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
        <div className="flex items-center mt-2 mb-2 gap-2">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-xs border border-red-200 focus:ring-2 focus:ring-red-200 rounded-lg shadow-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-red-200 text-sm">Loading categories...</div>
              <div className="w-12 h-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 border-opacity-30"></div>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d9d9d9]">
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Category Name</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={2} className="py-8 text-center text-red-300">No data found.</td></tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="border-b border-[#d9d9d9]">
                  <td className="py-3 px-4 text-sm">{category.category_name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditCategory(category)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* The pagination logic was removed from the props, so it's removed here. */}
      </CardContent>
    </Card>
  );
};

export default CategoriesSection; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

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
}) => (
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
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Category Name</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Status</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : categories.map((category) => (
              <tr key={category.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{category.category_name}</td>
                <td className="py-3 px-4 text-sm">{category.status || ""}</td>
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
      {categoryTotalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button size="sm" variant="outline" disabled={categoryPage === 1} onClick={() => setCategoryPage(categoryPage - 1)}>
            Previous
          </Button>
          <span className="text-sm">Page {categoryPage} of {categoryTotalPages}</span>
          <Button size="sm" variant="outline" disabled={categoryPage === categoryTotalPages} onClick={() => setCategoryPage(categoryPage + 1)}>
            Next
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default CategoriesSection; 
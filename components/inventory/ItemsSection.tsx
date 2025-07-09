import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface Item {
  id: number;
  pname: string;
  serialno: string;
  model: string;
  category: string;
  county: string;
}

interface ItemsSectionProps {
  items: Item[];
  setEditingItem: (item: Item | undefined) => void;
  setItemModalOpen: (open: boolean) => void;
  handleEdit: (item: Item) => void;
  openDeleteModal: (item: Item) => void;
  openDetailModal: (item: Item) => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  setEditingItem,
  setItemModalOpen,
  handleEdit,
  openDeleteModal,
  openDetailModal,
}) => (
  <Card className="bg-white border border-[#d9d9d9]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[#1c1b1f] text-lg capitalize">items</CardTitle>
        <Button
          size="sm"
          className="bg-[#0a9b21] hover:bg-[#0a9b21]/90"
          onClick={() => { setEditingItem(undefined); setItemModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Name</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Serial No</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Model</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Category</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">County</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{item.pname}</td>
                <td className="py-3 px-4 text-sm">{item.serialno}</td>
                <td className="py-3 px-4 text-sm">{item.model}</td>
                <td className="py-3 px-4 text-sm">{item.category}</td>
                <td className="py-3 px-4 text-sm">{item.county}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDetailModal(item)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                      onClick={() => openDeleteModal(item)}
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
    </CardContent>
  </Card>
);

export default ItemsSection; 
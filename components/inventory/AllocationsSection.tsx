import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface Allocation {
  id: number;
  Member_Name: string;
  Item_Name: string;
  Item_Serial_No: string;
  Department: string;
  Date_Allocated: string;
}

interface AllocationsSectionProps {
  allocations: Allocation[];
  setEditingAllocation: (allocation: Allocation | undefined) => void;
  setAllocationModalOpen: (open: boolean) => void;
  handleEdit: (type: string, item: any) => void;
  openDeleteModal: (type: string, id: number, name: string) => void;
}

const AllocationsSection: React.FC<AllocationsSectionProps> = ({
  allocations,
  setEditingAllocation,
  setAllocationModalOpen,
  handleEdit,
  openDeleteModal,
}) => (
  <Card className="bg-white border border-[#d9d9d9]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[#1c1b1f] text-lg capitalize">allocations</CardTitle>
        {/* Removed New Allocation button */}
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Item</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Serial No</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Office Location</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">County</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Category</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Model</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Date Allocated</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Message</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.length === 0 ? (
              <tr><td colSpan={11} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : allocations.map((allocation) => (
              <tr key={allocation.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{allocation.Member_Name}</td>
                <td className="py-3 px-4 text-sm">{allocation.Item_Name}</td>
                <td className="py-3 px-4 text-sm">{allocation.Item_Serial_No}</td>
                <td className="py-3 px-4 text-sm">{allocation.Department}</td>
                <td className="py-3 px-4 text-sm">{allocation.Office_Location}</td>
                <td className="py-3 px-4 text-sm">{allocation.County}</td>
                <td className="py-3 px-4 text-sm">{allocation.Category}</td>
                <td className="py-3 px-4 text-sm">{allocation.Model}</td>
                <td className="py-3 px-4 text-sm">{allocation.Date_Allocated}</td>
                <td className="py-3 px-4 text-sm">{allocation.Message}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit("allocations", allocation)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                      onClick={() => openDeleteModal("allocations", allocation.id, allocation.Member_Name)}
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

export default AllocationsSection; 
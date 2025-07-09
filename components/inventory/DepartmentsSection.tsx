import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface Department {
  id: number;
  Dep_ID: number;
  Dep_name: string;
}

interface DepartmentsSectionProps {
  departments: Department[];
  setEditingDepartment: (department: Department | undefined) => void;
  setDepartmentModalOpen: (open: boolean) => void;
  handleEdit: (department: Department) => void;
  openDeleteModal: (department: Department) => void;
}

const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  departments,
  setEditingDepartment,
  setDepartmentModalOpen,
  handleEdit,
  openDeleteModal,
}) => (
  <Card className="bg-white border border-[#d9d9d9]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[#1c1b1f] text-lg capitalize">departments</CardTitle>
        <Button
          size="sm"
          className="bg-[#0a9b21] hover:bg-[#0a9b21]/90"
          onClick={() => { setEditingDepartment(undefined); setDepartmentModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department ID</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department Name</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : departments.map((department) => (
              <tr key={department.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{department.Dep_ID}</td>
                <td className="py-3 px-4 text-sm">{department.Dep_name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(department)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                      onClick={() => openDeleteModal(department)}
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

export default DepartmentsSection; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { apiFetchDepartments } from "@/lib/departmentApi";

interface Department {
  id: number;
  Dep_ID: number;
  Dep_name: string;
}

interface DepartmentsSectionProps {
  setEditingDepartment: (department: Department | undefined) => void;
  setDepartmentModalOpen: (open: boolean) => void;
  handleEdit: (department: Department) => void;
  openDeleteModal: (department: Department) => void;
}

const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  setEditingDepartment,
  setDepartmentModalOpen,
  handleEdit,
  openDeleteModal,
}) => {
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchAndSetDepartments = async (search?: string) => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      const data = await apiFetchDepartments(1, 10, token, search ?? searchTerm);
      setDepartments(data.departments || []);
    } catch (err) {
      setDepartments([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAndSetDepartments();
  }, []);

  React.useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchAndSetDepartments(searchTerm);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  return (
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
        <div className="flex items-center mt-2 mb-2 gap-2">
          <Input
            type="text"
            placeholder="Search departments..."
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
              <div className="mb-2 text-red-200 text-sm">Loading departments...</div>
              <div className="w-12 h-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0a9b21] border-opacity-30"></div>
              </div>
            </div>
          </div>
        )}
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
};

export default DepartmentsSection; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import MemberModal from "../modals/MemberModal";
import { useToast } from "@/hooks/use-toast";
import { apiAdminAddUser, apiFetchAllUsers } from "@/lib/userApi";

interface Member {
  id: number;
  payroll_no: string;
  member_name: string;
  department: string;
}

interface Department {
  id: number;
  Dep_name: string;
}
interface County {
  id: number;
  county_name: string;
}

interface MembersSectionProps {
  members: Member[];
  setEditingMember: (member: Member | undefined) => void;
  setMemberModalOpen: (open: boolean) => void;
  handleEdit: (type: string, item: any) => void;
  openDeleteModal: (type: string, id: number, name: string) => void;
  loading?: boolean;
  departments: Department[];
  counties: County[];
  refreshMembers: () => void;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  setEditingMember,
  setMemberModalOpen,
  handleEdit,
  openDeleteModal,
  loading = false,
  departments,
  counties,
  refreshMembers,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateMember = async (data: any) => {
    setCreating(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      // Map modal data to API fields
      const userData = {
        name: data.member_name,
        email: `${data.payroll_no}@placeholder.com`, // Placeholder, adjust as needed
        password: data.payroll_no + "_pass", // Placeholder, adjust as needed
        phone: data.payroll_no,
        isAdmin: false,
        departmentId: departments.find(d => d.Dep_name === data.department)?.id,
        county: data.county,
      };
      await apiAdminAddUser(token, userData);
      toast({ title: "Success", description: "Member created successfully!", variant: "success" });
      setModalOpen(false);
      refreshMembers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create member", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-[#1c1b1f] text-lg capitalize">members</CardTitle>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#0a9b21] hover:bg-[#0c1cab] text-white shadow-md px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" />
            New Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-red-200 text-sm">Loading members...</div>
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
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member Name</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan={3} className="py-8 text-center text-red-300">No data found.</td></tr>
              ) : members.map((member) => (
                <tr key={member.id} className="border-b border-[#d9d9d9]">
                  <td className="py-3 px-4 text-sm">{member.member_name}</td>
                  <td className="py-3 px-4 text-sm">{
                    typeof member.department === 'object' && member.department !== null
                      ? member.department.Dep_name
                      : member.department || "-"
                  }</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit("members", member)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                        onClick={() => openDeleteModal("members", member.id, member.member_name)}
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
      <MemberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateMember}
        onUpdate={() => {}}
        departments={departments}
        counties={counties}
        member={undefined}
      />
      {creating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="w-24 h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#0a9b21] border-opacity-30"></div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MembersSection; 
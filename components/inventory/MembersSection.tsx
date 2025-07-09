import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface Member {
  id: number;
  payroll_no: string;
  member_name: string;
  department: string;
  office_location: string;
}

interface MembersSectionProps {
  members: Member[];
  setEditingMember: (member: Member | undefined) => void;
  setMemberModalOpen: (open: boolean) => void;
  handleEdit: (type: string, item: any) => void;
  openDeleteModal: (type: string, id: number, name: string) => void;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  setEditingMember,
  setMemberModalOpen,
  handleEdit,
  openDeleteModal,
}) => (
  <Card className="bg-white border border-[#d9d9d9]">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-[#1c1b1f] text-lg capitalize">members</CardTitle>
        <Button
          size="sm"
          className="bg-[#0a9b21] hover:bg-[#0a9b21]/90"
          onClick={() => { setEditingMember(undefined); setMemberModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d9d9d9]">
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Payroll No</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member Name</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Office Location</th>
              <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-red-300">No data found.</td></tr>
            ) : members.map((member) => (
              <tr key={member.id} className="border-b border-[#d9d9d9]">
                <td className="py-3 px-4 text-sm">{member.payroll_no}</td>
                <td className="py-3 px-4 text-sm">{member.member_name}</td>
                <td className="py-3 px-4 text-sm">{member.department}</td>
                <td className="py-3 px-4 text-sm">{member.office_location}</td>
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
  </Card>
);

export default MembersSection; 
import { Search, Plus, Users, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface Allocation {
  Item_Name: string;
  Member_Name: string;
  Date_Allocated: string;
}

interface RightSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  allocations: Allocation[];
  handleAdd: (type: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ searchTerm, setSearchTerm, allocations, handleAdd }) => (
  <div className="h-full p-6 overflow-y-auto">
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-200" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-red-700 border-red-700 text-white placeholder-[#8b8989]"
        />
      </div>
    </div>
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Quick Actions</h3>
      </div>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-red-700"
          onClick={() => handleAdd("item")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-red-700"
          onClick={() => handleAdd("member")}
        >
          <Users className="w-4 h-4 mr-2" />
          Add Member
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-red-700"
          onClick={() => handleAdd("allocation")}
        >
          <FileText className="w-4 h-4 mr-2" />
          New Allocation
        </Button>
      </div>
    </div>
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {allocations
          .slice(-5)
          .reverse()
          .map((allocation, index) => (
            <div key={index} className="text-sm">
              <p className="font-medium text-white">{allocation.Item_Name}</p>
              <p className="text-red-200">Allocated to {allocation.Member_Name}</p>
              <p className="text-xs text-red-200">{allocation.Date_Allocated}</p>
            </div>
          ))}
      </div>
    </div>
  </div>
);

export default RightSidebar; 
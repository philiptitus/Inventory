import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Package, Users, FileText, Tag, Plus, Eye } from "lucide-react";
import React from "react";

interface Item {
  id: number;
  pname: string;
  serialno: string;
  model: string;
  category: string;
  county: string;
}

interface Member {
  id: number;
  member_name: string;
  payroll_no: string;
}

interface Allocation {
  id: number;
  Member_Name: string;
  Item_Name: string;
  Item_Serial_No: string;
  Department: string;
  Date_Allocated: string;
  ID_PF_No: string;
  Model: string;
}

interface Category {
  id: number;
  category_name: string;
}

interface County {
  id: number;
  county_name: string;
}

interface DashboardSectionProps {
  items: Item[];
  members: Member[];
  allocations: Allocation[];
  categories: Category[];
  counties: County[];
  handleAdd: (type: string) => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  items,
  members,
  allocations,
  categories,
  counties,
  handleAdd,
}) => (
  <>
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
      <Card className="bg-white border border-[#d9d9d9]">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-[#0a9b21]">{items.length}</p>
              <p className="text-red-200 font-medium text-sm lg:text-base">Total Items</p>
            </div>
            <Package className="w-8 h-8 text-[#0a9b21]" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white border border-[#d9d9d9]">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-[#0c1cab]">{members.length}</p>
              <p className="text-red-200 font-medium text-sm lg:text-base">Total Members</p>
            </div>
            <Users className="w-8 h-8 text-[#0c1cab]" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white border border-[#d9d9d9]">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-[#be0606]">{allocations.length}</p>
              <p className="text-red-200 font-medium text-sm lg:text-base">Active Allocations</p>
            </div>
            <FileText className="w-8 h-8 text-[#be0606]" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white border border-[#d9d9d9]">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-[#41b219]">{categories.length}</p>
              <p className="text-red-200 font-medium text-sm lg:text-base">Categories</p>
            </div>
            <Tag className="w-8 h-8 text-[#41b219]" />
          </div>
        </CardContent>
      </Card>
    </div>
    {/* Charts Section */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
      <Card className="bg-white border border-[#d9d9d9]">
        <CardHeader>
          <CardTitle className="text-[#1c1b1f] text-lg">Items by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const count = items.filter((item) => item.category === category.category_name).length;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.category_name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0a9b21] rounded-full"
                        style={{ width: `${items.length > 0 ? (count / items.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#0a9b21]">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white border border-[#d9d9d9]">
        <CardHeader>
          <CardTitle className="text-[#1c1b1f] text-lg">Items by County</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {counties.map((county) => {
              const count = items.filter((item) => item.county === county.county_name).length;
              return (
                <div key={county.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{county.county_name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0c1cab] rounded-full"
                        style={{ width: `${items.length > 0 ? (count / items.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#0c1cab]">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    {/* Recent Allocations Table */}
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1c1b1f] text-lg">Recent Allocations</CardTitle>
          <Button size="sm" className="bg-[#0a9b21] hover:bg-[#0a9b21]/90" onClick={() => handleAdd("allocation")}> 
            <Plus className="w-4 h-4 mr-2" />
            New Allocation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d9d9d9]">
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Item</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Serial No</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Department</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Date Allocated</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.slice(0, 5).map((allocation) => (
                <tr key={allocation.id} className="border-b border-[#d9d9d9]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 lg:w-8 lg:h-8">
                        <AvatarFallback className="text-xs">
                          {allocation.Member_Name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{allocation.Member_Name}</p>
                        <p className="text-xs text-red-200">{allocation.ID_PF_No}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-sm">{allocation.Item_Name}</p>
                      <p className="text-xs text-red-200">{allocation.Model}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{allocation.Item_Serial_No}</td>
                  <td className="py-3 px-4 text-sm">{allocation.Department}</td>
                  <td className="py-3 px-4 text-sm">{allocation.Date_Allocated}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="bg-[#0a9b21]/10 text-[#0a9b21] text-xs">
                      Active
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </>
);

export default DashboardSection; 
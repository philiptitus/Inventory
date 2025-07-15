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
  models: any[];
  departments: any[];
  handleAdd: (type: string) => void;
  handleOpenAllocationDetail?: (allocationId: number) => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  items,
  members,
  allocations,
  categories,
  counties,
  models,
  departments,
  handleAdd,
  handleOpenAllocationDetail,
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
          <CardTitle className="text-[#1c1b1f] text-lg">Items by Model</CardTitle>
      </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models && models.length > 0 ? models.map((model) => {
              const count = items.filter((item) => item.model === model.model_name).length;
              return (
                <div key={model.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{model.model_name}</span>
                    <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#be0606] rounded-full"
                        style={{ width: `${items.length > 0 ? (count / items.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#be0606]">{count}</span>
                  </div>
                </div>
              );
            }) : <div className="text-sm text-gray-400">No models found.</div>}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white border border-[#d9d9d9]">
        <CardHeader>
          <CardTitle className="text-[#1c1b1f] text-lg">Items by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments && departments.length > 0 ? departments.map((department) => {
              const count = items.filter((item) => (item.department || '-') === department.Dep_name).length;
              return (
                <div key={department.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{department.Dep_name}</span>
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
            }) : <div className="text-sm text-gray-400">No departments found.</div>}
        </div>
      </CardContent>
    </Card>
    </div>
  </>
);

export default DashboardSection; 
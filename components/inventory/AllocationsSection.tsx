import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Undo2, Wrench } from "lucide-react";
import React, { useState } from "react";
import AllocationEditModal from "@/components/modals/AllocationEditModal";
import AllocationDeleteModal from "@/components/modals/AllocationDeleteModal";
import { ReturnRequestModal } from "@/components/modals/ReturnRequestModal";
import RepairRequestModal from "@/components/modals/RepairRequestModal";
import { Input } from "@/components/ui/input";
import { apiFetchAllocations } from "@/lib/allocationApi";
import { createRepairRequest } from "@/lib/repairRequestApi";
import { formatDate } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";

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
  openDetailModal: (allocation: Allocation) => void;
  loading: boolean;
  onSearchResults?: (results: any[]) => void;
  isAdmin?: boolean;
}

const AllocationsSection: React.FC<AllocationsSectionProps> = ({
  allocations,
  setEditingAllocation,
  setAllocationModalOpen,
  handleEdit,
  openDeleteModal,
  openDetailModal,
  loading,
  onSearchResults,
  isAdmin = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchAllocations = async (search?: string) => {
    setLocalLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      if (!token) throw new Error("No token found");
      const data = await apiFetchAllocations(token, { search: search ?? searchTerm });
      // Call the parent's onSearch callback if it exists
      if (onSearchResults) {
        onSearchResults(data.allocations || []);
      }
    } catch (err) {
      console.error('Error fetching allocations:', err);
      if (onSearchResults) {
        onSearchResults([]);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllocations();
  }, []);

  React.useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchAllocations(searchTerm);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  const flatAllocations = allocations.map((allocation: any) => ({
    id: allocation.id,
    Member_Name: allocation.user?.name || allocation.Member_Name || "-",
    Item_Name: allocation.item?.pname || allocation.Item_Name || "-",
    Item_Serial_No: allocation.item?.serialno || allocation.Item_Serial_No || "-",
    Department: allocation.user?.department || allocation.Department || "-",
    Date_Allocated: allocation.Date_Allocated || "-",
    status: allocation.status, // <-- Add this line
  }));

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAllocationId, setEditAllocationId] = useState<number | null>(null);

  const handleEditClick = (allocation: any) => {
    // Use the parent's handleEdit function to set the editing allocation
    handleEdit('allocation', allocation);
  };

  const onSaved = () => {
    // The parent component will handle the refresh
    fetchAllocations(searchTerm);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAllocation, setDeleteAllocation] = useState<any>(null);
  const [returnRequestModalOpen, setReturnRequestModalOpen] = useState(false);
  const [repairRequestModalOpen, setRepairRequestModalOpen] = useState(false);
  const [isSubmittingRepair, setIsSubmittingRepair] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const { toast } = useToast();

  const handleDeleteClick = (allocation: any) => {
    // Use the parent's openDeleteModal function
    openDeleteModal('allocation', allocation.id, `Allocation #${allocation.id}`);
  };

  const handleReturnRequestClick = (allocation: any) => {
    setSelectedAllocation(allocation);
    setReturnRequestModalOpen(true);
  };

  const handleRepairRequestClick = (allocation: any) => {
    setSelectedAllocation(allocation);
    setRepairRequestModalOpen(true);
  };

  const handleRepairSubmit = async (data: { issue: string; additionalNotes: string }) => {
    if (!selectedAllocation) return;
    
    setIsSubmittingRepair(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || '') : '';
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await createRepairRequest(
        {
          allocationId: selectedAllocation.id,
          issue: data.issue,
          additionalNotes: data.additionalNotes
        },
        token
      );

      toast({
        title: "Success",
        description: "Repair request submitted successfully!",
        variant: "default",
      });
      setRepairRequestModalOpen(false);
      // Refresh the allocations to show the updated status
      fetchAllocations(searchTerm);
    } catch (error: any) {
      console.error("Error submitting repair request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit repair request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRepair(false);
    }
  };

  const handleReturnRequestSuccess = () => {
    // Refresh the allocations list
    fetchAllocations(searchTerm);
    setReturnRequestModalOpen(false);
  };

  const handleDeleted = () => {
    // The parent component will handle the refresh
    fetchAllocations(searchTerm);
  };

  return (
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1c1b1f] text-lg capitalize">allocations</CardTitle>
        </div>
        <div className="flex items-center mt-2 mb-2 gap-2">
          <Input
            type="text"
            placeholder="Search allocations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-xs border border-red-200 focus:ring-2 focus:ring-red-200 rounded-lg shadow-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {localLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#0a9b21] border-opacity-30"></div>
            <span className="ml-2 text-gray-500">Loading allocations...</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d9d9d9]">
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Member</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Item</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Date Allocated</th>
                <th className="text-left py-3 px-4 font-medium text-red-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flatAllocations.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-red-300">No data found.</td></tr>
              ) : flatAllocations.map((allocation) => (
                <tr key={allocation.id} className="border-b border-[#d9d9d9]">
                  <td className="py-3 px-4 text-sm">{allocation.Member_Name}</td>
                  <td className="py-3 px-4 text-sm">{allocation.Item_Name}</td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">{formatDate(allocation.Date_Allocated)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => openDetailModal(allocation)}
                        title="View details"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      {/* Status icon next to Eye icon */}
                      <span 
                        title={allocation.status === 'returned' ? 'Returned' : 'Active'} 
                        className="ml-1"
                      >
                        {allocation.status === 'returned' ? '✅' : '❌'}
                      </span>
                      
                      {isAdmin && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleEditClick(allocation)}
                            title="Edit allocation"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#be0606] hover:text-[#be0606]"
                            onClick={() => handleDeleteClick(allocation)}
                            title="Delete allocation"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      
                      {allocation.status !== 'returned' && (
                        <>
                          {!isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#0a9b21] hover:text-[#08851a]"
                              onClick={() => handleRepairRequestClick(allocation)}
                              title="Request repair"
                            >
                              <Wrench className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#0a9b21] hover:text-[#08851a]"
                            onClick={() => handleReturnRequestClick(allocation)}
                            title="Request return"
                          >
                            <Undo2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      
      {/* Return Request Modal */}
      {selectedAllocation && (
        <>
          <ReturnRequestModal
            isOpen={returnRequestModalOpen}
            onClose={() => setReturnRequestModalOpen(false)}
            allocationId={selectedAllocation.id}
            onSuccess={handleReturnRequestSuccess}
          />
          <RepairRequestModal
            isOpen={repairRequestModalOpen}
            onClose={() => !isSubmittingRepair && setRepairRequestModalOpen(false)}
            allocationId={selectedAllocation.id}
            itemName={selectedAllocation.Item_Name}
            itemSerial={selectedAllocation.Item_Serial_No}
            onSubmit={handleRepairSubmit}
            isLoading={isSubmittingRepair}
          />
        </>
      )}
      
      {/* Edit functionality is now handled by the parent component's modal */}
      {/* Delete functionality is now handled by the parent component's modal */}
    </Card>
  );
};

export default AllocationsSection; 
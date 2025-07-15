import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { apiFetchAllocationById, apiDeleteAllocation } from "@/lib/allocationApi";

interface AllocationDetailModalProps {
  isOpen: boolean;
  allocationId: number | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function AllocationDetailModal({ isOpen, allocationId, onClose, onDeleted }: AllocationDetailModalProps) {
  const [allocation, setAllocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !allocationId) return;
    setLoading(true);
    setError(null);
    setAllocation(null);
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
        const data = await apiFetchAllocationById(allocationId, token || "");
        let allocationObj = data;
        if (data.allocations && Array.isArray(data.allocations)) {
          allocationObj = data.allocations[0];
        }
        if (allocationObj) {
          setAllocation({
            Member_Name: allocationObj.user?.name || "-",
            Member_Email: allocationObj.user?.email || "-",
            Member_Phone: allocationObj.user?.phone || "-",
            ID_PF_No: allocationObj.user?.payroll_no || allocationObj.ID_PF_No || "-",
            Department: allocationObj.user?.department || allocationObj.Department || "-",
            Office_Location: allocationObj.user?.office_location || allocationObj.Office_Location || "-",
            County: allocationObj.user?.county || allocationObj.County || allocationObj.item?.county || "-",
            Item_Name: allocationObj.item?.pname || allocationObj.Item_Name || "-",
            Item_Serial_No: allocationObj.item?.serialno || allocationObj.Item_Serial_No || "-",
            Category: allocationObj.item?.category || allocationObj.Category || "-",
            Model: allocationObj.item?.model || allocationObj.Model || "-",
            Item_County: allocationObj.item?.county || "-",
            Date_Allocated: allocationObj.Date_Allocated || "-",
            Date_Returned: allocationObj.Date_Returned || "-",
            status: allocationObj.status || "-",
            Message: allocationObj.Message || "-",
          });
        } else {
          setError("Allocation not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch allocation details");
      }
      setLoading(false);
    })();
  }, [isOpen, allocationId]);

  const handleDelete = async () => {
    if (!allocation) return;
    setDeleteLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteAllocation(allocation.id, token || "");
      setDeleteOpen(false);
      onClose();
      if (onDeleted) onDeleted();
    } catch (err: any) {
      setError(err.message || "Failed to delete allocation");
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Allocation Details</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <span className="text-blue-600 font-medium">Loading allocation details...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : allocation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-semibold">Member:</span> {allocation.Member_Name}</div>
                <div><span className="font-semibold">Member Email:</span> {allocation.Member_Email}</div>
                <div><span className="font-semibold">Member Phone:</span> {allocation.Member_Phone}</div>
                <div><span className="font-semibold">Payroll/ID No:</span> {allocation.ID_PF_No}</div>
                <div><span className="font-semibold">Department:</span> {allocation.Department}</div>
                <div><span className="font-semibold">Office Location:</span> {allocation.Office_Location}</div>
                <div><span className="font-semibold">County:</span> {allocation.County}</div>
                <div><span className="font-semibold">Item Name:</span> {allocation.Item_Name}</div>
                <div><span className="font-semibold">Serial No:</span> {allocation.Item_Serial_No}</div>
                <div><span className="font-semibold">Category:</span> {allocation.Category}</div>
                <div><span className="font-semibold">Model:</span> {allocation.Model}</div>
                <div><span className="font-semibold">Item County:</span> {allocation.Item_County}</div>
                <div><span className="font-semibold">Date Allocated:</span> {allocation.Date_Allocated}</div>
                <div><span className="font-semibold">Date Returned:</span> {allocation.Date_Returned}</div>
                <div><span className="font-semibold">Status:</span> {allocation.status}</div>
                <div className="col-span-2"><span className="font-semibold">Message:</span> {allocation.Message}</div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="destructive" onClick={() => setDeleteOpen(true)} disabled={deleteLoading}>
                  {deleteLoading ? (
                    <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-red-500 rounded-full"></span>Deleting...</span>
                  ) : "Delete Allocation"}
                </Button>
                <Button variant="outline" onClick={onClose}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-red-500">No allocation selected for details.</div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Allocation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this allocation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteLoading} onClick={handleDelete}>
              {deleteLoading ? (
                <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-red-500 rounded-full"></span>Deleting...</span>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 
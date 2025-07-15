import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { apiDeleteAllocation } from "@/lib/allocationApi";
import { toast } from "@/hooks/use-toast";

interface AllocationDeleteModalProps {
  isOpen: boolean;
  allocation: { id: number; Member_Name?: string } | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function AllocationDeleteModal({ isOpen, allocation, onClose, onDeleted }: AllocationDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!allocation) return;
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiDeleteAllocation(allocation.id, token || "");
      toast({ title: "Allocation deleted!", description: `Allocation for ${allocation.Member_Name || "member"} deleted successfully.`, variant: "default" });
      setLoading(false);
      onClose();
      onDeleted();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message || "Failed to delete allocation", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle>Confirm Deletion</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete the allocation for <strong>{allocation?.Member_Name || "this member"}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-red-500 rounded-full"></span>
                Deleting...
              </span>
            ) : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
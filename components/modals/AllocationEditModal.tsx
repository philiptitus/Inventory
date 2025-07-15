import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetchAllocationById, apiUpdateAllocation } from "@/lib/allocationApi";

interface AllocationEditModalProps {
  isOpen: boolean;
  allocationId: number | null;
  onClose: () => void;
  onSaved?: () => void;
}

export default function AllocationEditModal({ isOpen, allocationId, onClose, onSaved }: AllocationEditModalProps) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !allocationId) return;
    setLoading(true);
    setError(null);
    setFormData(null);
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
        const data = await apiFetchAllocationById(allocationId, token || "");
        let allocationObj = data;
        if (data.allocations && Array.isArray(data.allocations)) {
          allocationObj = data.allocations[0];
        }
        if (allocationObj) {
          setFormData({
            Message: allocationObj.Message || "",
            status: allocationObj.status || "active",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationId) return;
    setSaving(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || undefined) : undefined;
      await apiUpdateAllocation(allocationId, formData, token || "");
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update allocation");
    }
    setSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Allocation</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <span className="text-blue-600 font-medium">Loading allocation...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : formData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                name="Message"
                value={formData.Message}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2"
                disabled={saving}
              >
                <option value="active">Active</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <span className="flex items-center"><span className="animate-spin mr-2 w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full"></span>Saving...</span>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench } from "lucide-react";

interface RepairRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocationId: number;
  itemName: string;
  itemSerial: string;
  onSubmit: (data: { issue: string; additionalNotes: string }) => void;
  isLoading?: boolean;
}

export default function RepairRequestModal({
  isOpen,
  onClose,
  allocationId,
  itemName,
  itemSerial,
  onSubmit,
  isLoading = false,
}: RepairRequestModalProps) {
  const [issue, setIssue] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setIssue("");
      setAdditionalNotes("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      issue: issue.trim(),
      additionalNotes: additionalNotes.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#0a9b21]" />
            <DialogTitle>Request Repair</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Submit a repair request for <span className="font-medium text-gray-900">{itemName}</span> (SN: {itemSerial})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue" className="text-sm font-medium text-gray-700">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the issue you're experiencing..."
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              Please provide a detailed description of the problem.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
              Additional Notes
            </Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional information that might help with the repair..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!issue.trim() || isLoading}
              className="bg-[#0a9b21] hover:bg-[#0a9b21]/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/hooks/use-toast";
import { apiCreateReturnRequest } from '@/lib/allocationApi';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocationId: number;
  onSuccess: () => void;
}

export function ReturnRequestModal({ isOpen, onClose, allocationId, onSuccess }: ReturnRequestModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Toast is now imported directly

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({ 
        title: "Error", 
        description: "Please provide a reason for the return request.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      await apiCreateReturnRequest({
        allocationId,
        message,
      }, token);

      toast({ 
        title: "Success", 
        description: "Return request submitted successfully!", 
        variant: "default" 
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating return request:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to submit return request. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Item Return</DialogTitle>
          <DialogDescription>
            Please provide a reason for returning this item. Your request will be reviewed by an administrator.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="returnMessage" className="text-sm font-medium">
              Reason for Return
            </label>
            <Textarea
              id="returnMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reason for returning this item..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#0a9b21] hover:bg-[#08851a]"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

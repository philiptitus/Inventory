import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Clock, CheckCircle2, XCircle, Wrench, AlertCircle, User, Package, Calendar, MessageSquare, FileText } from "lucide-react";

interface RepairRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairRequest: {
    id: number;
    status: string;
    issue: string;
    adminNotes?: string;
    requestedAt: string;
    updatedAt?: string;
    completedAt?: string;
    item: {
      id: number;
      pname: string;
      serialno: string;
    };
    requestedBy: {
      id: number;
      name: string;
      email: string;
    };
    completedBy?: {
      id: number;
      name: string;
      email: string;
    };
    allocation: {
      id: number;
      status: string;
      Date_Allocated: string;
      user: {
        id: number;
        name: string;
        email: string;
        department: any;
      };
    };
  } | null;
}

const statusIcons = {
  pending: <Clock className="h-4 w-4 mr-2" />,
  in_progress: <Wrench className="h-4 w-4 mr-2" />,
  completed: <CheckCircle2 className="h-4 w-4 mr-2" />,
  rejected: <XCircle className="h-4 w-4 mr-2" />
};

const statusVariant = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100"
};

export function RepairRequestDetailsModal({ isOpen, onClose, repairRequest }: RepairRequestDetailsModalProps) {
  if (!repairRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl">Repair Request Details</DialogTitle>
            <Badge 
              className={`${statusVariant[repairRequest.status as keyof typeof statusVariant]} text-sm font-medium`}
            >
              {statusIcons[repairRequest.status as keyof typeof statusIcons]}
              {repairRequest.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Package className="h-4 w-4 mr-2" />
              <span className="font-medium">Item Details</span>
            </div>
            <div className="pl-6 space-y-1">
              <p><span className="font-medium">Name:</span> {repairRequest.item.pname}</p>
              <p><span className="font-medium">Serial Number:</span> {repairRequest.item.serialno}</p>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium">Request Details</span>
            </div>
            <div className="pl-6 space-y-1">
              <p><span className="font-medium">Issue:</span> {repairRequest.issue}</p>
              {repairRequest.adminNotes && (
                <p><span className="font-medium">Admin Notes:</span> {repairRequest.adminNotes}</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Timeline</span>
            </div>
            <div className="pl-6 space-y-1">
              <p><span className="font-medium">Requested:</span> {format(new Date(repairRequest.requestedAt), 'PPpp')}</p>
              {repairRequest.updatedAt && (
                <p><span className="font-medium">Last Updated:</span> {format(new Date(repairRequest.updatedAt), 'PPpp')}</p>
              )}
              {repairRequest.completedAt && (
                <p><span className="font-medium">Completed:</span> {format(new Date(repairRequest.completedAt), 'PPpp')}</p>
              )}
            </div>
          </div>

          {/* People */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">People</span>
            </div>
            <div className="pl-6 space-y-1">
              <p><span className="font-medium">Requested By:</span> {repairRequest.requestedBy.name} ({repairRequest.requestedBy.email})</p>
              {repairRequest.completedBy && (
                <p><span className="font-medium">Completed By:</span> {repairRequest.completedBy.name} ({repairRequest.completedBy.email})</p>
              )}
            </div>
          </div>

          {/* Allocation Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="font-medium">Allocation Details</span>
            </div>
            <div className="pl-6 space-y-1">
              <p><span className="font-medium">Allocated To:</span> {repairRequest.allocation.user.name}</p>
              <p><span className="font-medium">Allocation Status:</span> {repairRequest.allocation.status}</p>
              <p><span className="font-medium">Date Allocated:</span> {format(new Date(repairRequest.allocation.Date_Allocated), 'PP')}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

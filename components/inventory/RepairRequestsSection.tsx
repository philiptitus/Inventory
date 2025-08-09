import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle, Wrench, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { fetchRepairRequests, updateRepairRequest, RepairRequestStatus } from "@/lib/repairRequestApi";
import React, { useEffect, useState } from "react";
import { RepairRequestDetailsModal } from "@/components/modals/RepairRequestDetailsModal";

interface RepairRequestsSectionProps {
  isAdmin?: boolean;
}

const ITEMS_PER_PAGE = 10;

const RepairRequestsSection: React.FC<RepairRequestsSectionProps> = ({ isAdmin = false }) => {
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    status: 'all' as 'all' | RepairRequestStatus,
    search: '',
    sortBy: 'requestedAt' as 'requestedAt' | 'updatedAt' | 'completedAt' | 'status' | 'issue',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const fetchRepairRequestsList = async (page = 1, filtersOverride = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const currentFilters = { ...filters, ...filtersOverride };

      const response = await fetchRepairRequests(
        {
          page,
          limit: ITEMS_PER_PAGE,
          status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
          search: currentFilters.search || undefined,
          sortBy: currentFilters.sortBy,
          sortOrder: currentFilters.sortOrder,
        },
        token
      );

      setRepairRequests(response.data || []);
      setPagination({
        page,
        total: response.pagination.total,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching repair requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch repair requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairRequestsList(1);
  }, [filters.status, filters.sortBy, filters.sortOrder]);

  const [showAdminNotesModal, setShowAdminNotesModal] = useState<{open: boolean, requestId: number | null, newStatus: RepairRequestStatus | null}>({open: false, requestId: null, newStatus: null});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async (id: number, newStatus: RepairRequestStatus, notes = '') => {
    try {
      setUpdatingId(id);
      setIsSubmitting(true);
      const token = localStorage.getItem('token') || '';

      const response = await updateRepairRequest(
        id,
        {
          status: newStatus,
          adminNotes: notes,
          isItemFixed: newStatus === 'completed'  // Only set isItemFixed when completing
        },
        token
      );

      if (response.success) {
        // Optimistically update the UI
        setRepairRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === id
              ? {
                  ...request,
                  status: newStatus,
                  adminNotes: notes || request.adminNotes,
                  updatedAt: new Date().toISOString()
                }
              : request
          )
        );

        toast({
          title: 'Success',
          description: `Repair request marked as ${newStatus.replace('_', ' ')} successfully.`,
          variant: 'default',
        });
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating repair request status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update repair request status. Please try again.',
        variant: 'destructive',
      });

      // Revert optimistic update by refreshing data
      fetchRepairRequestsList(pagination.page);
    } finally {
      setUpdatingId(null);
      setIsSubmitting(false);
      setShowAdminNotesModal({open: false, requestId: null, newStatus: null});
      setAdminNotes('');
    }
  };

  const handleStatusButtonClick = (requestId: number, newStatus: RepairRequestStatus) => {
    setShowAdminNotesModal({
      open: true,
      requestId,
      newStatus
    });
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAdminNotesSubmit = () => {
    if (showAdminNotesModal.requestId && showAdminNotesModal.newStatus) {
      handleStatusUpdate(
        showAdminNotesModal.requestId,
        showAdminNotesModal.newStatus,
        adminNotes
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      'pending': <Clock className="w-4 h-4 mr-1" />,
      'in_progress': <Wrench className="w-4 h-4 mr-1" />,
      'completed': <CheckCircle2 className="w-4 h-4 mr-1" />,
      'rejected': <XCircle className="w-4 h-4 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepairRequestsList(1);
  };

  const handleSort = (field: typeof filters.sortBy) => {
    const newSortOrder =
      field === filters.sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';

    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder,
    }));
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between px-6 py-3">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
        <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>{' '}
        of <span className="font-medium">{pagination.total}</span> results
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRepairRequestsList(1)}
          disabled={pagination.page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRepairRequestsList(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRepairRequestsList(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRepairRequestsList(pagination.totalPages)}
          disabled={pagination.page >= pagination.totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="bg-white border border-[#d9d9d9]">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-[#1c1b1f] text-lg capitalize">Repair Requests</CardTitle>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="pl-8 w-full sm:w-64"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </form>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value as any})}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchRepairRequestsList(pagination.page)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2">Loading repair requests...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('item.pname')}>
                    <div className="flex items-center">
                      Item
                      {filters.sortBy === 'item.pname' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Serial No.</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('issue')}>
                    <div className="flex items-center">
                      Issue
                      {filters.sortBy === 'issue' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {filters.sortBy === 'status' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('requestedAt')}>
                    <div className="flex items-center">
                      Date
                      {filters.sortBy === 'requestedAt' && (
                        <span className="ml-1">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairRequests.length > 0 ? (
                  repairRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.item?.pname || 'N/A'}
                      </TableCell>
                      <TableCell>{request.item?.serialno || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.issue}</TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{request.requestedBy?.name || 'N/A'}</span>
                          <span className="text-xs text-gray-500">{request.requestedBy?.email || ''}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => handleViewDetails(request)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <>
                              {request.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => handleStatusButtonClick(request.id, 'in_progress')}
                                  disabled={updatingId === request.id}
                                  title="Mark as In Progress"
                                >
                                  {updatingId === request.id && showAdminNotesModal.newStatus === 'in_progress' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Wrench className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              {['pending', 'in_progress'].includes(request.status) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => handleStatusButtonClick(request.id, 'completed')}
                                  disabled={updatingId === request.id}
                                  title="Mark as Completed"
                                >
                                  {updatingId === request.id && showAdminNotesModal.newStatus === 'completed' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              {request.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleStatusButtonClick(request.id, 'rejected')}
                                  disabled={updatingId === request.id}
                                  title="Reject Request"
                                >
                                  {updatingId === request.id && showAdminNotesModal.newStatus === 'rejected' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Wrench className="h-12 w-12 text-gray-400" />
                        <h3 className="text-sm font-medium text-gray-900">No repair requests found</h3>
                        <p className="text-sm text-gray-500">
                          {filters.status !== 'all' || filters.search
                            ? 'Try adjusting your filters'
                            : 'Get started by submitting a repair request'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {pagination.total > 0 && renderPagination()}
          </div>
        )}
      </CardContent>
      {!loading && repairRequests.length === 0 && (
        <CardFooter className="justify-center border-t p-6">
          <div className="text-center">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No repair requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.status !== 'all' || filters.search
                ? 'Try adjusting your search or filters'
                : 'Get started by submitting a repair request'}
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    search: '',
                    status: 'all',
                    sortBy: 'requestedAt',
                    sortOrder: 'desc',
                  });
                  fetchRepairRequestsList(1);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset filters
              </Button>
            </div>
          </div>
        </CardFooter>
      )}

      {/* Admin Notes Modal */}
      <Dialog open={showAdminNotesModal.open} onOpenChange={(open) => {
        if (!isSubmitting) {
          setShowAdminNotesModal({open, requestId: null, newStatus: null});
          setAdminNotes('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Repair Request</DialogTitle>
            <DialogDescription>
              Add notes for this status update
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Notes</Label>
              <Textarea
                id="adminNotes"
                placeholder="Enter any additional notes or instructions..."
                className="min-h-[100px]"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                These notes will be visible to the requester.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAdminNotesModal({open: false, requestId: null, newStatus: null});
                setAdminNotes('');
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdminNotesSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repair Request Details Modal */}
      <RepairRequestDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        repairRequest={selectedRequest}
      />
    </Card>
  );
};

export default RepairRequestsSection;

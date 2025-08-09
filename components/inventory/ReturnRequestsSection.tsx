import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle, Info } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { apiFetchReturnRequests, apiUpdateReturnRequestStatus } from "@/lib/allocationApi";
import React, { useEffect, useState } from "react";

interface ReturnRequest {
  id: number;
  allocation: {
    id: number;
    item: {
      id: number;
      pname: string;
      serialno: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
    };
    Date_Allocated: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: {
    id: number;
    name: string;
  };
}

const ITEMS_PER_PAGE = 10;

interface ReturnRequestsSectionProps {
  isAdmin?: boolean;
}

function ReturnRequestsSection({ isAdmin = false }: ReturnRequestsSectionProps) {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasMore: false,
  });

  const fetchReturnRequests = async (page = 1, status = filters.status, search = filters.search) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const response = await apiFetchReturnRequests(token, {
        status: status !== 'all' ? status as 'pending' | 'approved' | 'rejected' : undefined,
        search: search || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });
      
      setReturnRequests(response.data || []);
      setPagination({
        page,
        total: response.total || 0,
        hasMore: response.hasMore || false,
      });
    } catch (error) {
      console.error('Error fetching return requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch return requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests(1, filters.status, filters.search);
  }, [filters.status]);

  const handleStatusChange = async (requestId: number, newStatus: 'approved' | 'rejected', adminNotes = '') => {
    try {
      setUpdatingId(requestId);
      const token = localStorage.getItem('token') || '';
      await apiUpdateReturnRequestStatus(requestId, { status: newStatus, adminNotes }, token);
      
      // Refresh the list
      await fetchReturnRequests(pagination.page, filters.status, filters.search);
      
      toast({
        title: 'Success',
        description: `Return request ${newStatus} successfully.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating return request status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update return request status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReturnRequests(1, filters.status, filters.search);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      approved: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-4 w-4" /> },
      rejected: { bg: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
    } as const;

    const statusInfo = statusMap[status as keyof typeof statusMap] || { bg: 'bg-gray-100 text-gray-800', icon: null };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Return Requests</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage and process item return requests
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReturnRequests(pagination.page, filters.status, filters.search)}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by item name, serial number, or member..."
                  className="w-full pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="ml-2" 
                  disabled={loading || !filters.search.trim()}
                >
                  Search
                </Button>
              </div>
            </form>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by status:</span>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
                disabled={loading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading return requests...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && returnRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No return requests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filters.status !== 'all' || filters.search 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'All return requests will appear here.'}
              </p>
            </div>
          )}

          {/* Return Requests Table */}
          {!loading && returnRequests.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Serial No.</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnRequests.map((request) => {
                    // Skip rendering if allocation data is missing
                    if (!request.allocation) {
                      console.warn(`Missing allocation data for return request ${request.id}`);
                      return null;
                    }
                    
                    const itemName = request.allocation?.item?.pname || 'Unknown Item';
                    const serialNo = request.allocation?.item?.serialno || 'N/A';
                    const userName = request.allocation?.user?.name || 'Unknown User';
                    const userEmail = request.allocation?.user?.email || '';
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{itemName}</span>
                            {request.message && (
                              <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {request.message}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{serialNo}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{userName}</span>
                            {userEmail && (
                              <span className="text-xs text-muted-foreground">
                                {userEmail}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{request.requestedAt ? format(new Date(request.requestedAt), 'MMM d, yyyy') : 'N/A'}</span>
                            {request.requestedAt && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(request.requestedAt), 'h:mm a')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === 'pending' ? (
                              isAdmin ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => handleStatusChange(request.id, 'approved')}
                                    disabled={updatingId === request.id}
                                  >
                                    {updatingId === request.id ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      'Approve'
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                      const notes = prompt('Please provide a reason for rejection:');
                                      if (notes !== null) {
                                        handleStatusChange(request.id, 'rejected', notes);
                                      }
                                    }}
                                    disabled={updatingId === request.id}
                                  >
                                    {updatingId === request.id ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      'Reject'
                                    )}
                                  </Button>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">Pending admin review</span>
                              )
                            ) : request.processedAt ? (
                              <div className="text-xs text-muted-foreground text-right">
                                <div>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</div>
                                <div>{format(new Date(request.processedAt), 'MMM d, yyyy')}</div>
                                {request.processedBy && (
                                  <div className="text-muted-foreground/70">by {request.processedBy.name}</div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {!loading && returnRequests.length > 0 && (
          <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(pagination.page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * ITEMS_PER_PAGE, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> requests
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchReturnRequests(pagination.page - 1, filters.status, filters.search)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchReturnRequests(pagination.page + 1, filters.status, filters.search)}
                disabled={!pagination.hasMore || loading}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default ReturnRequestsSection;

"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Home, Package, ShoppingCart, CreditCard, BarChart3, Truck, Users, Settings, LogOut, Menu, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#483f3f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#292929] font-bold text-lg">Y</span>
          </div>
          <span className="text-xl font-bold">YouthFund</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#483f3f] text-white">
            <Home className="w-5 h-5" />
            <span>Home</span>
            <div className="w-2 h-2 bg-[#0a9b21] rounded-full ml-auto"></div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <Package className="w-5 h-5" />
            <span>Product</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            <span>Order</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <CreditCard className="w-5 h-5" />
            <span>Payment</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <BarChart3 className="w-5 h-5" />
            <span>Statistics</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <Truck className="w-5 h-5" />
            <span>Shipping</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <Users className="w-5 h-5" />
            <span>Manage User</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <Settings className="w-5 h-5" />
            <span>Setting</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8b8989] hover:bg-[#483f3f] hover:text-white cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({ name: "", phone: "", county: "" });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) return;
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setForm({ name: data.name || "", phone: data.phone || "", county: data.county || "" });
      } else {
        toast({ title: "Failed to load profile", description: "Please try again.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchUser();
  }, [toast]);

  const handleEdit = () => {
    setEditError(null);
    setEditSuccess(false);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditError(null);
    setEditSuccess(false);
    setForm({ name: user?.name || "", phone: user?.phone || "", county: user?.county || "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      setEditError("Not authenticated");
      setEditLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setEditSuccess(true);
        setEditMode(false);
        toast({ title: "Profile updated!", description: "Your changes have been saved.", variant: "default" });
      } else {
        const err = await res.json();
        setEditError(err.error || "Failed to update profile");
        toast({ title: "Update failed", description: err.error || "Failed to update profile", variant: "destructive" });
      }
    } catch (err: any) {
      setEditError("Network error");
      toast({ title: "Network error", description: "Could not update profile.", variant: "destructive" });
    }
    setEditLoading(false);
  };

  const handleDelete = async () => {
    setEditLoading(true);
    setEditError(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      setEditError("Not authenticated");
      setEditLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        toast({ title: "Account deleted", description: "Your account has been deleted.", variant: "default" });
        setTimeout(() => router.replace("/"), 1200);
      } else {
        const err = await res.json();
        setEditError(err.error || "Failed to delete account");
        toast({ title: "Delete failed", description: err.error || "Failed to delete account", variant: "destructive" });
      }
    } catch (err: any) {
      setEditError("Network error");
      toast({ title: "Network error", description: "Could not delete account.", variant: "destructive" });
    }
    setEditLoading(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex h-screen bg-[#fffcfc] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#292929] text-white flex-col">
        <SidebarContent />
      </div>
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-[#292929] text-white p-0 border-r-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white p-4 lg:p-6 border-b border-[#d9d9d9] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-[#1c1b1f]">Profile</h1>
              <p className="text-red-200 text-sm lg:text-base">Your account details</p>
            </div>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 flex justify-center items-center p-4 lg:p-6">
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-lg rounded-3xl p-0">
            <div className="flex flex-col items-center py-8 px-6">
              {loading ? (
                <div className="w-full flex flex-col gap-4">
                  <Skeleton className="h-24 w-24 mx-auto" />
                  <Skeleton className="h-8 w-2/3 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
              ) : editMode ? (
                <form onSubmit={handleSave} className="flex flex-col items-center gap-4 w-full">
                  <Avatar className="w-24 h-24 mb-2 shadow-lg ring-4 ring-red-100">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-3xl">{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full rounded-lg border px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full rounded-lg border px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                  <input
                    type="text"
                    name="county"
                    value={form.county}
                    onChange={handleChange}
                    placeholder="County"
                    className="w-full rounded-lg border px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                  <div className="flex gap-2 w-full justify-center mt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                      disabled={editLoading}
                    >
                      {editLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                  {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
                  {editSuccess && <div className="text-green-600 text-sm mt-2">Profile updated!</div>}
                </form>
              ) : (
                <>
                  <Avatar className="w-24 h-24 mb-4 shadow-lg ring-4 ring-red-100">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-3xl">{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-3xl font-extrabold mb-1 text-[#1c1b1f]">{user?.name}</h2>
                  <Badge className={`mb-4 px-4 py-1 rounded-full text-sm ${user?.isAdmin ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-700"}`}>
                    {user?.isAdmin ? "Admin" : "User"}
                  </Badge>
                  <div className="w-full flex flex-col gap-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{user?.county}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="mt-6 px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                  >
                    Edit Profile
                  </button>
                  <div className="w-full flex flex-col items-center mt-8">
                    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                      <AlertDialogTrigger asChild>
                        <button
                          className="px-6 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition shadow flex items-center gap-2"
                          disabled={editLoading}
                        >
                          <AlertTriangle className="w-5 h-5" /> Delete Account
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-6 h-6 text-red-500" /> Confirm Account Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your account and all associated data will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={editLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleDelete}
                            disabled={editLoading}
                          >
                            {editLoading ? "Deleting..." : "Yes, Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        <Toaster />
      </div>
    </div>
  );
} 
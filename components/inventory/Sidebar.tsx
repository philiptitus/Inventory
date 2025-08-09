import { Home, Package, Users, FileText, Tag, Car, MapPin, Building, Settings, LogOut, Wrench } from "lucide-react";
import React from "react";

type ActivePage =
  | "dashboard"
  | "items"
  | "members"
  | "allocations"
  | "return-requests"
  | "repair-requests"
  | "categories"
  | "models"
  | "counties"
  | "departments";

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onLogout?: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, isAdmin }) => (
  <div className="flex flex-col h-full">
    <div className="p-6 border-b border-red-700 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img src="https://www.youthfund.go.ke/wp-content/uploads/2016/08/logo2.jpg" alt="YouthFund Logo" className="w-full h-full" />
        </div>
        <span className="text-base font-bold leading-tight">Inventory System</span>
      </div>
    </div>
    <nav className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {isAdmin && (
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "dashboard"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
            {activePage === "dashboard" && <div className="w-2 h-2 bg-[#0a9b21] rounded-full ml-auto"></div>}
          </div>
        )}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
            activePage === "items" ? "bg-red-700 text-white" : "text-red-200 hover:bg-red-700 hover:text-white"
          }`}
          onClick={() => setActivePage("items")}
        >
          <Package className="w-5 h-5" />
          <span>Items</span>
        </div>
        {isAdmin && (
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
              activePage === "members"
                ? "bg-red-700 text-white"
                : "text-red-200 hover:bg-red-700 hover:text-white"
            }`}
            onClick={() => setActivePage("members")}
          >
            <Users className="w-5 h-5" />
            <span>Members</span>
          </div>
        )}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
            activePage === "allocations"
              ? "bg-red-700 text-white"
              : "text-red-200 hover:bg-red-700 hover:text-white"
          }`}
          onClick={() => setActivePage("allocations")}
        >
          <FileText className="w-5 h-5" />
          <span>Allocations</span>
        </div>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
            activePage === "return-requests"
              ? "bg-red-700 text-white"
              : "text-red-200 hover:bg-red-700 hover:text-white"
          }`}
          onClick={() => setActivePage("return-requests")}
        >
          <FileText className="w-5 h-5" />
          <span>Return Requests</span>
          {activePage === "return-requests" && <div className="w-2 h-2 bg-[#0a9b21] rounded-full ml-auto"></div>}
        </div>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
            activePage === "repair-requests"
              ? "bg-red-700 text-white"
              : "text-red-200 hover:bg-red-700 hover:text-white"
          }`}
          onClick={() => setActivePage("repair-requests")}
        >
          <Wrench className="w-5 h-5" />
          <span>Repair Requests</span>
          {activePage === "repair-requests" && <div className="w-2 h-2 bg-[#0a9b21] rounded-full ml-auto"></div>}
        </div>
        {isAdmin && (
          <>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                activePage === "categories"
                  ? "bg-red-700 text-white"
                  : "text-red-200 hover:bg-red-700 hover:text-white"
              }`}
              onClick={() => setActivePage("categories")}
            >
              <Tag className="w-5 h-5" />
              <span>Categories</span>
            </div>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                activePage === "models" ? "bg-red-700 text-white" : "text-red-200 hover:bg-red-700 hover:text-white"
              }`}
              onClick={() => setActivePage("models")}
            >
              <Car className="w-5 h-5" />
              <span>Models</span>
            </div>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                activePage === "counties"
                  ? "bg-red-700 text-white"
                  : "text-red-200 hover:bg-red-700 hover:text-white"
              }`}
              onClick={() => setActivePage("counties")}
            >
              <MapPin className="w-5 h-5" />
              <span>Counties</span>
            </div>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                activePage === "departments"
                  ? "bg-red-700 text-white"
                  : "text-red-200 hover:bg-red-700 hover:text-white"
              }`}
              onClick={() => setActivePage("departments")}
            >
              <Building className="w-5 h-5" />
              <span>Departments</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </div>
      </div>
    </nav>
    <div className="p-4 border-t border-red-700 flex-shrink-0">
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-700 hover:text-white cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar; 
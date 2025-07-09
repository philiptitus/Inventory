"use client"

import { useState } from "react"
import Login from "./login"
import InventoryDashboard from "./inventory-dashboard"
import type { ActivePage } from "./inventory-dashboard"

export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Add state for initialPage
  const [initialPage, setInitialPage] = useState<ActivePage>("dashboard")

  const handleLogin = (page?: string) => {
    setInitialPage((page as ActivePage) || "dashboard")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return <InventoryDashboard onLogout={handleLogout} initialPage={initialPage} />
  }

  return <Login onLogin={handleLogin} />
}

"use client"

import { useState } from "react"
import Login from "./login"
import InventoryDashboard from "./inventory-dashboard"

export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return <InventoryDashboard onLogout={handleLogout} />
  }

  return <Login onLogin={handleLogin} />
}

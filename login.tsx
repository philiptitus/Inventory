"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock, Phone, MapPin } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"

interface LoginProps {
  onLogin: (initialPage?: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Registration state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [county, setCounty] = useState("")
  const [countySearch, setCountySearch] = useState("")
  const [countyResults, setCountyResults] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [countyError, setCountyError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch counties for search
  const searchCounties = debounce(async (query: string) => {
    if (!query.trim()) {
      setCountyResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/county?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        const countyNames = data.counties.map((c: any) => c.county_name);
        setCountyResults(countyNames);
      } else {
        setCountyResults([]);
      }
    } catch (error) {
      console.error('Error searching counties:', error);
      setCountyResults([]);
    }
  }, 300);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const res = await fetch("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            onLogin('dashboard'); // go to dashboard section
            return;
          }
        } catch {}
      }
    };
    checkToken();
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      localStorage.setItem("token", data.token)
      toast({ title: "Login successful!", description: "Welcome back!", variant: "default" })
      setTimeout(() => onLogin('dashboard'), 1000)
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Accepts formats: 07XXXXXXXX, +2547XXXXXXXX, or 2547XXXXXXXX (10-13 digits total)
    const phoneRegex = /^(\+?254|0)?[17]\d{8}$/
    return phoneRegex.test(phone)
  }

  const validateCounty = (): boolean => {
    if (!county.trim()) {
      setCountyError("Please select a county from the dropdown")
      return false
    }
    setCountyError("")
    return true
  }

  const validateForm = (): boolean => {
    let isValid = true
    
    if (!validateCounty()) {
      isValid = false
    }
    
    if (!phone.trim()) {
      setPhoneError("Phone number is required")
      isValid = false
    } else if (!validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid phone number (e.g., 0712345678 or +254712345678)")
      isValid = false
    } else {
      setPhoneError("")
    }
    
    return isValid
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name,
          email,
          password,
          phone,
          county,
          isAdmin: isAdmin
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      localStorage.setItem("token", data.token)
      toast({ title: "Registration successful!", description: "Welcome! You are now logged in.", variant: "default" })
      setTimeout(() => onLogin('dashboard'), 1000)
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 border-4 border-white/10 rounded-full"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 border-4 border-white/5 rounded-full"></div>
        <div className="absolute top-1/4 -right-20 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 border-4 border-white/10 rounded-full"></div>
        <div className="absolute top-1/3 -right-10 w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 border-4 border-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 border-4 border-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-36 h-36 md:w-52 md:h-52 lg:w-72 lg:h-72 border-4 border-white/10 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 border-4 border-white/5 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYX-2s8xRlUvUApWiNgetnZrqEeCKHj_wf8g&s" 
              alt="YouthFund Logo" 
              className="h-24 w-auto"
              onError={(e) => {
                // Fallback in case the image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo-placeholder.png';
              }}
            />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wider">YouthFund</h1>
        </div>

        {/* Login/Registration Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <h2 className="text-center text-xl font-semibold text-[#1c1b1f] mb-8">
              {isRegister ? "USER REGISTRATION" : "USER LOGIN"}
            </h2>

            <Toaster />
            {loading && <div className="flex justify-center my-4"><Skeleton className="h-8 w-8 bg-gray-400" /></div>}

            {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* Password Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* Phone Field */}
                <div className="relative mb-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone (e.g., 0712345678 or +254712345678)"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow only numbers and + at the start
                      if (/^\+?\d*$/.test(value) && value.length <= 13) {
                        setPhone(value)
                        // Clear error when user starts typing
                        if (phoneError) setPhoneError("")
                      }
                    }}
                    className={`pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc] ${phoneError ? 'border-red-500' : ''}`}
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>
                  )}
                </div>
                {/* County Field with Searchable Dropdown */}
                <div className="relative mb-1" ref={dropdownRef}>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <MapPin className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search and select your county"
                    value={countySearch}
                    onChange={(e) => {
                      setCountySearch(e.target.value);
                      searchCounties(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc] pr-10"
                    required
                  />
                  {countyError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{countyError}</p>
                  )}
                  {county && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCounty("");
                        setCountySearch("");
                        setCountyResults([]);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                  {showDropdown && countyResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {countyResults.map((countyName, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setCounty(countyName);
                            setCountySearch(countyName);
                            setShowDropdown(false);
                            setCountyError(""); // Clear error when county is selected
                          }}
                        >
                          {countyName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Registration - For testing only */}
                <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="adminCheckbox"
                      checked={isAdmin}
                      onCheckedChange={(checked) => setIsAdmin(checked === true)}
                      className="border-[#4a4a4a] data-[state=checked]:bg-[#4a4a4a]"
                    />
                    <label 
                      htmlFor="adminCheckbox" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Register as Admin
                    </label>
                  </div>
                  <p className="text-xs text-amber-700">
                    Note: This option is only available during testing. In the live system, admin access is granted by system administrators.
                  </p>
                </div>
                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4a4a4a] hover:bg-[#3a3a3a] text-white font-medium rounded-md transition-colors"
                  disabled={loading}
                >
                  Register
                </Button>
                {/* Back to Login Link */}
                <p className="text-center text-sm text-[#1c1b1f] mt-6">
                  Already have an account?{' '}
                  <button type="button" className="text-[#0c1cab] hover:underline font-medium" onClick={() => setIsRegister(false)}>
                    Login here.
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* Password Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-[#8b8989] data-[state=checked]:bg-[#4a4a4a] data-[state=checked]:border-[#4a4a4a]"
                    />
                    <label htmlFor="remember" className="text-sm text-[#1c1b1f] cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="text-sm text-[#1c1b1f] hover:text-[#4a4a4a] transition-colors">
                    Forgot password?
                  </button>
                </div>
                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4a4a4a] hover:bg-[#3a3a3a] text-white font-medium rounded-md transition-colors"
                  disabled={loading}
                >
                  Login
                </Button>
                {/* Registration Link */}
                <p className="text-center text-sm text-[#1c1b1f] mt-6">
                  Don't have an account?{' '}
                  <button type="button" className="text-[#0c1cab] hover:underline font-medium" onClick={() => setIsRegister(true)}>
                    Sign up here.
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

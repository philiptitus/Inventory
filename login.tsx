"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
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
          county
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-[#4a4a4a] font-bold text-2xl">Y</span>
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
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
                </div>
                {/* County Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-[#8b8989]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="County"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="pl-12 h-12 border-[#d9d9d9] focus:border-[#4a4a4a] focus:ring-[#4a4a4a] bg-[#fffcfc]"
                    required
                  />
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

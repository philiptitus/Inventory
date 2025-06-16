"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock } from "lucide-react"
import { useState } from "react"

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - redirect to dashboard with any credentials
    onLogin()
  }

  const handleGoogleLogin = () => {
    // Simulate Google login - redirect to dashboard
    onLogin()
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

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <h2 className="text-center text-xl font-semibold text-[#1c1b1f] mb-8">USER LOGIN</h2>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-[#8b8989]" />
                </div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[#d9d9d9]"></div>
              <span className="px-4 text-sm text-[#8b8989]">OR</span>
              <div className="flex-1 border-t border-[#d9d9d9]"></div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 border-[#d9d9d9] hover:bg-[#fffcfc] text-[#1c1b1f] font-medium rounded-md transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with google
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#1c1b1f] mt-6">
              Don't have an account?{" "}
              <button className="text-[#0c1cab] hover:underline font-medium">Sign up here.</button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

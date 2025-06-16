"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Home,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Truck,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Eye,
  MoreHorizontal,
  Menu,
} from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  const SidebarContent = () => (
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
  )

  const RightSidebarContent = () => (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8b8989]" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-[#483f3f] border-[#483f3f] text-white placeholder-[#8b8989]"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Inbox</h3>
          <div className="w-6 h-6 bg-[#483f3f] rounded-full flex items-center justify-center">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">Mike Thomson</p>
                <span className="text-xs text-[#8b8989] flex-shrink-0 ml-2">10.32 am</span>
              </div>
              <p className="text-sm text-[#8b8989] truncate">Tell me later</p>
            </div>
            <div className="w-5 h-5 bg-[#0a9b21] rounded-full flex items-center justify-center text-xs flex-shrink-0">
              4
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>GD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">George Dose</p>
                <span className="text-xs text-[#8b8989] flex-shrink-0 ml-2">09.17 am</span>
              </div>
              <p className="text-sm text-[#8b8989] truncate">Okey then. Tha...</p>
            </div>
            <div className="w-5 h-5 bg-[#0a9b21] rounded-full flex items-center justify-center text-xs flex-shrink-0">
              1
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">Lisa Moren</p>
                <span className="text-xs text-[#8b8989] flex-shrink-0 ml-2">Yesterday</span>
              </div>
              <p className="text-sm text-[#8b8989] truncate">How long the p...</p>
            </div>
            <div className="w-5 h-5 bg-[#0a9b21] rounded-full flex items-center justify-center text-xs flex-shrink-0">
              2
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Top Selling Product</h3>
          <Badge variant="secondary" className="bg-[#483f3f] text-white">
            1W
          </Badge>
        </div>

        <div className="space-y-3">
          {[
            { name: "Dolan watch", value: 365, trend: "down" },
            { name: "Sisy bag", value: 135, trend: "up" },
            { name: "Path shoes", value: 65, trend: "up" },
            { name: "Eagle bag", value: 83, trend: "down" },
            { name: "Norlin pin", value: 114, trend: "up" },
            { name: "Kiska tie", value: 75, trend: "up" },
            { name: "Nora Bag", value: 53, trend: "up" },
          ].map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {product.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-[#0a9b21] flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-[#be0606] flex-shrink-0" />
                )}
                <span className="text-sm truncate">{product.name}</span>
              </div>
              <span className="font-medium flex-shrink-0 ml-2">{product.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

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
              <h1 className="text-xl lg:text-2xl font-semibold text-[#1c1b1f]">Welcome, Jack</h1>
              <p className="text-[#8b8989] text-sm lg:text-base">1 April 2023</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium text-[#1c1b1f] text-sm lg:text-base">Jackson Murouse</p>
                <p className="text-xs lg:text-sm text-[#8b8989]">Sale Manager</p>
              </div>
            </div>
            <Bell className="w-5 h-5 text-[#8b8989]" />
            <Button variant="ghost" size="sm" className="xl:hidden" onClick={() => setRightSidebarOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
              <Card className="bg-white border border-[#d9d9d9]">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#8b8989] font-medium text-sm lg:text-base">Total Sales</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl lg:text-3xl font-bold text-[#0a9b21]">$30,412</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-[#0a9b21]" />
                      <span className="text-[#0a9b21]">1.5 % vs last Month</span>
                    </div>
                    <div className="h-12 lg:h-16 bg-gradient-to-r from-[#41b219]/20 to-[#0a9b21]/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-[#d9d9d9]">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#8b8989] font-medium text-sm lg:text-base">Total Order</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl lg:text-3xl font-bold text-[#be0606]">12,980</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="w-4 h-4 text-[#be0606]" />
                      <span className="text-[#be0606]">0.7 % vs last Month</span>
                    </div>
                    <div className="h-12 lg:h-16 bg-gradient-to-r from-[#ed4c4c]/20 to-[#be0606]/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-[#d9d9d9] md:col-span-2 xl:col-span-1">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#8b8989] font-medium text-sm lg:text-base">Total Customer</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl lg:text-3xl font-bold text-[#0a9b21]">2,753</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-[#0a9b21]" />
                      <span className="text-[#0a9b21]">114 new customer vs last Month</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#d9d9d9] flex items-center justify-center">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white"></div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#8b8989] rounded-full"></div>
                          <span className="text-[#8b8989]">new customer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#1c1b1f] rounded-full"></div>
                          <span className="text-[#8b8989]">loyal customer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
              <Card className="bg-white border border-[#d9d9d9]">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-[#1c1b1f] text-lg">Overall Sales</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-[#0a9b21]" />
                      <span className="text-[#0a9b21]">1.1 % vs last Year</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#0a9b21] rounded-full"></div>
                      <span>Last Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#0c1cab] rounded-full"></div>
                      <span>Running Year</span>
                    </div>
                    <select className="ml-auto bg-[#292929] text-white px-2 py-1 rounded text-xs">
                      <option>1Y</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 lg:h-64 bg-gradient-to-t from-[#d9d9d9]/20 to-transparent rounded relative">
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div className="text-sm font-medium bg-white px-2 py-1 rounded shadow">$24,843</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-[#d9d9d9]">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-[#1c1b1f] text-lg">Order Report</CardTitle>
                    <select className="bg-[#292929] text-white px-2 py-1 rounded text-xs w-fit">
                      <option>1Y</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl lg:text-3xl font-bold text-[#be0606]">190,567</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="w-4 h-4 text-[#be0606]" />
                      <span className="text-[#be0606]">0.2 % vs last Year</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                      <div className="w-full h-full rounded-full bg-[#483f3f] flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-xl lg:text-2xl font-bold">67%</div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 lg:top-4 lg:right-4 w-6 h-6 lg:w-8 lg:h-8 bg-[#d9d9d9] rounded-full flex items-center justify-center text-xs font-bold">
                        23%
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#1c1b1f] rounded-full"></div>
                        <span>E-commerce</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#8b8989] rounded-full"></div>
                        <span>YouthFund website</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#d9d9d9] rounded-full"></div>
                        <span>Offline store</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="bg-white border border-[#d9d9d9]">
              <CardHeader>
                <CardTitle className="text-[#1c1b1f] text-lg">Recent Order</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#d9d9d9]">
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Order Number</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Total Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-[#8b8989] text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#d9d9d9]">
                        <td className="py-3 px-4 text-sm">1256398756</td>
                        <td className="py-3 px-4 text-sm">18/7/2023</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">Dolan watch</p>
                            <p className="text-xs text-[#8b8989]">See more</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 lg:w-8 lg:h-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">AW</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Allan wood</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">$ 1,349</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-[#fffafa] text-[#8b8989] text-xs">
                            on process
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Printer className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-[#d9d9d9]">
                        <td className="py-3 px-4 text-sm">1254796635</td>
                        <td className="py-3 px-4 text-sm">18/7/2023</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">Hollan Bag</p>
                            <p className="text-xs text-[#8b8989]">See more</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 lg:w-8 lg:h-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">DS</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Damian simons</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">$ 649</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-[#fffafa] text-[#8b8989] text-xs">
                            Waiting payment
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Printer className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Right Sidebar */}
          <div className="hidden xl:flex w-80 bg-[#292929] text-white">
            <RightSidebarContent />
          </div>

          {/* Mobile Right Sidebar */}
          <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <SheetContent side="right" className="w-80 bg-[#292929] text-white p-0 border-l-0">
              <RightSidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

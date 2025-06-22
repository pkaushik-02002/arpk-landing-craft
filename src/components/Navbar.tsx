
import { Home, User, Briefcase, FileText, LogIn, UserPlus } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const Navbar = () => {
  const navItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'Services', url: '#services', icon: Briefcase },
    { name: 'About', url: '#about', icon: User },
    { name: 'Contact', url: '#contact', icon: FileText },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            ARPK
          </span>
        </div>

        {/* Center Navigation */}
        <NavBar items={navItems} className="relative" />

        {/* Right side - Theme toggle and Auth buttons */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button size="sm" className="hidden sm:flex">
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </Button>
          {/* Mobile auth buttons */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <LogIn className="w-4 h-4" />
          </Button>
          <Button size="icon" className="sm:hidden">
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Navbar


import { Home, User, Briefcase, FileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

const Navbar = () => {
  const navItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'Services', url: '#services', icon: Briefcase },
    { name: 'About', url: '#about', icon: User },
    { name: 'Contact', url: '#contact', icon: FileText },
  ]

  return <NavBar items={navItems} />
}

export default Navbar

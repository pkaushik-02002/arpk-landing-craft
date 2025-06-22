
import { home, user, briefcase, fileText } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

const Navbar = () => {
  const navItems = [
    { name: 'Home', url: '#home', icon: home },
    { name: 'Services', url: '#services', icon: briefcase },
    { name: 'About', url: '#about', icon: user },
    { name: 'Contact', url: '#contact', icon: fileText },
  ]

  return <NavBar items={navItems} />
}

export default Navbar


import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Briefcase, Search, ClipboardList, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userEmail, userFullName, userId, logout } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const navLinks = [
    { text: "หน้าหลัก", path: "/" },
    { text: "บริการ", path: "/services" },
    { text: "งานของฉัน", path: "/my-jobs", icon: <ClipboardList size={16} />, requireAuth: true },
    { text: "เกี่ยวกับเรา", path: "/about" },
    { text: "ติดต่อ", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
  };

  // Create links with conditional redirects to login page
  const renderNavLink = (link, index) => {
    if (link.requireAuth && !userEmail) {
      // If auth required but user not logged in, link to login
      return (
        <Link 
          key={index} 
          to="/login" 
          state={{ from: link.path }} // Pass intended destination
          className="text-gray-600 hover:text-fastlabor-600 font-medium flex items-center gap-1.5"
        >
          {link.icon && link.icon}
          {link.text}
        </Link>
      );
    } else {
      // Regular link
      return (
        <Link 
          key={index} 
          to={link.path} 
          className="text-gray-600 hover:text-fastlabor-600 font-medium flex items-center gap-1.5"
        >
          {link.icon && link.icon}
          {link.text}
        </Link>
      );
    }
  };

  // Display name formatting function
  const displayName = () => {
    if (userFullName) {
      return userFullName;
    }
    return userEmail;
  };

  return (
    <header className="py-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/365674fc-1bea-4770-b4cb-f2f99ec0e841.png" 
            alt="FastLabor Logo" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-fastlabor-700">Fast<span className="text-fastlabor-500">Labor</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => renderNavLink(link, index))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-fastlabor-700 px-3">
                    <div className="h-8 w-8 rounded-full bg-fastlabor-100 flex items-center justify-center">
                      <User size={18} className="text-fastlabor-600" />
                    </div>
                    <span className="font-medium">{displayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile/edit">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>แก้ไขโปรไฟล์</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-fastlabor-700 hover:text-fastlabor-800 hover:bg-fastlabor-50">เข้าสู่ระบบ</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white">สมัครสมาชิก</Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 py-4 shadow-lg animate-fade-in">
          <div className="container flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <div key={index} className="py-2">
                {link.requireAuth && !userEmail ? (
                  <Link 
                    to="/login" 
                    state={{ from: link.path }}
                    className="text-gray-700 hover:text-fastlabor-600 font-medium flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && link.icon}
                    {link.text}
                  </Link>
                ) : (
                  <Link 
                    to={link.path} 
                    className="text-gray-700 hover:text-fastlabor-600 font-medium flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && link.icon}
                    {link.text}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
              {userEmail ? (
                <>
                  <div className="flex items-center gap-2 text-fastlabor-700 py-2">
                    <User size={18} />
                    <span className="font-medium">{displayName()}</span>
                  </div>
                  <Link to="/profile/edit" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="border-fastlabor-600 text-fastlabor-600 hover:bg-fastlabor-50 justify-center w-full flex items-center gap-2"
                    >
                      <Settings size={16} />
                      แก้ไขโปรไฟล์
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-fastlabor-600 text-fastlabor-600 hover:bg-fastlabor-50 justify-center w-full flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="text-fastlabor-700 hover:text-fastlabor-800 justify-center w-full">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white justify-center w-full">สมัครสมาชิก</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { text: "หน้าหลัก", path: "/" },
    { text: "บริการ", path: "/services" },
    { text: "ค้นหาแรงงาน", path: "/find-worker" 
    { text: "สมัครเป็นแรงงาน"},
    { text: "เกี่ยวกับเรา", path: "/about" },
    { text: "ติดต่อ", path: "/contact" },
  ];

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
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              className="text-gray-600 hover:text-fastlabor-600 font-medium"
            >
              {link.text}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-fastlabor-700 hover:text-fastlabor-800 hover:bg-fastlabor-50">เข้าสู่ระบบ</Button>
          <Button className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white">สมัครสมาชิก</Button>
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
              <Link 
                key={index} 
                to={link.path} 
                className="text-gray-700 hover:text-fastlabor-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
              <Button variant="ghost" className="text-fastlabor-700 hover:text-fastlabor-800 justify-center">เข้าสู่ระบบ</Button>
              <Button className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white justify-center">สมัครสมาชิก</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

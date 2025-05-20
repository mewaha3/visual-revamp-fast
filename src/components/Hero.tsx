
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      {/* Background gradient - making it more vibrant */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent pointer-events-none"></div>
      
      {/* Decorative elements - increased opacity for more vibrant appearance */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-fastlabor-200 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-70 -z-10"></div>
      
      <div className="container flex flex-col lg:flex-row items-center">
        <div className="flex-1 space-y-8 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-800">
            จัดหาแรงงานที่เชื่อถือได้<br/>
            <span className="bg-gradient-to-r from-fastlabor-600 to-fastlabor-400 bg-clip-text text-transparent">อย่างรวดเร็ว</span>
          </h1>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0">
            แพลตฟอร์มที่เชื่อมโยงผู้ว่าจ้างกับแรงงานฝีมือที่เชื่อถือได้ ผ่านระบบที่สะดวกและรวดเร็ว
          </p>
          
          <div className="pt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-fastlabor-600 to-fastlabor-500 bg-clip-text text-transparent">1000+</p>
              <p className="text-gray-700 font-medium">แรงงาน</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-fastlabor-600 to-fastlabor-500 bg-clip-text text-transparent">500+</p>
              <p className="text-gray-700 font-medium">ลูกค้า</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-fastlabor-600 to-fastlabor-500 bg-clip-text text-transparent">5,000+</p>
              <p className="text-gray-700 font-medium">งานสำเร็จ</p>
            </div>
          </div>
        </div>
        
        {/* Hero image - improved styling */}
        <div className="flex-1 relative">
          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
            <img 
              src="/worker.svg" 
              alt="FastLabor worker illustration" 
              className="max-w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://img.freepik.com/free-vector/construction-workers-different-activities_23-2148652328.jpg?w=826&t=st=1716053732~exp=1716054332~hmac=f5cde8c82b77084e119eb46230ec9c9aa86f2c7280891c36e6b367e8d023af5a";
              }}
            />
          </div>
          
          {/* Floating elements - improved styling */}
          <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg border border-fastlabor-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-800">แรงงานพร้อมทำงาน 50+</p>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg border border-fastlabor-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-fastlabor-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-800">จัดหาแรงงานภายใน 24 ชม.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

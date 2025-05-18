
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-fastlabor-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
      
      <div className="container flex flex-col lg:flex-row items-center">
        <div className="flex-1 space-y-8 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            จัดหาแรงงานที่เชื่อถือได้<br/>
            <span className="gradient-text">อย่างรวดเร็ว</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            แพลตฟอร์มที่เชื่อมโยงผู้ว่าจ้างกับแรงงานฝีมือที่เชื่อถือได้ ผ่านระบบที่สะดวกและรวดเร็ว
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white px-8 py-6 text-lg">
              ค้นหาแรงงาน
            </Button>
            <Button size="lg" variant="outline" className="border-fastlabor-600 text-fastlabor-600 hover:bg-fastlabor-50 px-8 py-6 text-lg">
              สมัครเป็นแรงงาน
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
          
          <div className="pt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-fastlabor-600">1000+</p>
              <p className="text-gray-600">แรงงาน</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-fastlabor-600">500+</p>
              <p className="text-gray-600">ลูกค้า</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-fastlabor-600">5,000+</p>
              <p className="text-gray-600">งานสำเร็จ</p>
            </div>
          </div>
        </div>
        
        {/* Hero image */}
        <div className="flex-1 relative">
          <div className="bg-white p-2 rounded-xl shadow-xl">
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
          
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-sm font-semibold">แรงงานพร้อมทำงาน 50+</p>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-fastlabor-500 rounded-full"></div>
              <p className="text-sm font-semibold">จัดหาแรงงานภายใน 24 ชม.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

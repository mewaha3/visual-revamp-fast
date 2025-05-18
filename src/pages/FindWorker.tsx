
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const FindWorker = () => {
  const categories = [
    { name: "ก่อสร้าง", count: 245 },
    { name: "แม่บ้าน", count: 189 },
    { name: "ขนส่ง", count: 167 },
    { name: "เกษตร", count: 129 },
    { name: "ผู้ช่วยร้านอาหาร", count: 215 },
    { name: "ช่างฝีมือ", count: 98 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">ค้นหาแรงงาน</h1>
          <p className="text-lg text-gray-600 mb-8">
            ค้นหาแรงงานที่มีคุณภาพและตรงกับความต้องการของคุณ
          </p>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="ค้นหาจากทักษะหรือตำแหน่งงาน" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" 
                />
              </div>
              <div className="w-full md:w-48">
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500">
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <Button className="bg-fastlabor-600 hover:bg-fastlabor-700 text-white">
                <Search size={18} />
                ค้นหา
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">ชื่อแรงงาน {item}</h3>
                    <p className="text-sm text-gray-500">ประเภท: {categories[item % categories.length].name}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < 4 ? "#FFD700" : "none"} stroke="currentColor" strokeWidth="2" className="text-gray-300">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  ประสบการณ์ทำงาน {2 + item} ปี มีทักษะในการทำงาน {categories[item % categories.length].name} และงานที่เกี่ยวข้อง
                </p>
                <Button className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white">
                  ดูรายละเอียด
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindWorker;

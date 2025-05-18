
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">ติดต่อเรา</h1>
          <p className="text-lg text-gray-600 mb-8">
            มีคำถาม ข้อเสนอแนะ หรือต้องการความช่วยเหลือ? ติดต่อทีมงานของเราได้ที่นี่
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">ส่งข้อความถึงเรา</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">ชื่อ</label>
                  <input 
                    type="text" 
                    id="name"
                    placeholder="กรุณาระบุชื่อของคุณ" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">อีเมล</label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder="example@email.com" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" 
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-1 font-medium">หัวข้อ</label>
                  <input 
                    type="text" 
                    id="subject"
                    placeholder="หัวข้อของคุณ" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1 font-medium">ข้อความ</label>
                  <textarea 
                    id="message"
                    rows={5}
                    placeholder="กรุณาระบุรายละเอียด" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" 
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white">
                  ส่งข้อความ
                </Button>
              </form>
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-2xl font-semibold mb-6">ข้อมูลติดต่อ</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-fastlabor-100 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">โทรศัพท์</h3>
                      <p className="text-gray-600">+66 2 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-fastlabor-100 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">อีเมล</h3>
                      <p className="text-gray-600">contact@fastlabor.co.th</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-fastlabor-100 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">ที่อยู่</h3>
                      <p className="text-gray-600">123 อาคารเอบีซี ชั้น 10 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">เวลาทำการ</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">จันทร์ - ศุกร์:</span>
                    <span className="text-gray-800 font-medium">9:00 - 18:00 น.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เสาร์:</span>
                    <span className="text-gray-800 font-medium">9:00 - 15:00 น.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">อาทิตย์:</span>
                    <span className="text-gray-800 font-medium">ปิดทำการ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;


import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">บริการของเรา</h1>
          <p className="text-lg text-gray-600 mb-8">
            FastLabor มีบริการหลากหลายเพื่อตอบโจทย์ความต้องการของคุณ ไม่ว่าจะเป็นการจัดหาแรงงาน
            การตรวจสอบประวัติ หรือการจัดการระบบการจ่ายค่าจ้าง
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">บริการจัดหาแรงงาน</h3>
              <p className="text-gray-600">เราช่วยคุณค้นหาและจัดหาแรงงานที่มีคุณภาพตรงตามความต้องการของธุรกิจคุณ</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">บริการตรวจสอบประวัติ</h3>
              <p className="text-gray-600">แรงงานทุกคนผ่านการตรวจสอบประวัติอย่างละเอียด เพื่อความปลอดภัยและความมั่นใจของคุณ</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">บริการจัดการการจ่ายค่าจ้าง</h3>
              <p className="text-gray-600">ระบบการชำระเงินที่ปลอดภัย โปร่งใส และตรวจสอบได้</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">บริการติดตามและประเมินผล</h3>
              <p className="text-gray-600">ติดตามและประเมินผลงานแบบเรียลไทม์ผ่านแพลตฟอร์มออนไลน์</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

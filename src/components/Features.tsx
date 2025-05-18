
import { CheckCircle } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "แรงงานคุณภาพ",
      description: "แรงงานทุกคนผ่านการตรวจสอบประวัติอย่างละเอียด พร้อมรับประกันคุณภาพการทำงาน",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
      </div>
    },
    {
      title: "รวดเร็วทันใจ",
      description: "ค้นหาและจัดหาแรงงานได้ภายใน 24 ชั่วโมง ไม่ต้องเสียเวลารอนาน",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
    },
    {
      title: "ราคายุติธรรม",
      description: "ราคาที่เป็นธรรมทั้งกับผู้ว่าจ้างและแรงงาน ไม่มีค่าใช้จ่ายแอบแฝง",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="14.5" y1="12" y2="14.5"/><path d="M16.51 17.35 12 12"/></svg>
      </div>
    },
    {
      title: "ระบบประเมินคุณภาพ",
      description: "ระบบการให้คะแนนและรีวิวเพื่อการันตีคุณภาพของแรงงานและผู้ว่าจ้าง",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
    },
    {
      title: "การจ่ายเงินปลอดภัย",
      description: "ระบบการชำระเงินที่ปลอดภัย ได้รับการรับรองและมีความน่าเชื่อถือ",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      </div>
    },
    {
      title: "ติดตามงานตลอดเวลา",
      description: "ติดตามสถานะงานแบบเรียลไทม์ผ่านแพลตฟอร์มได้ตลอดเวลา",
      icon: <div className="bg-fastlabor-100 p-3 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fastlabor-600"><path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6 0 0 0 0 0 0z"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
      </div>
    }
  ];
  
  const categories = [
    { name: "ก่อสร้าง", count: 245 },
    { name: "แม่บ้าน", count: 189 },
    { name: "ขนส่ง", count: 167 },
    { name: "เกษตร", count: 129 },
    { name: "ผู้ช่วยร้านอาหาร", count: 215 },
    { name: "ช่างฝีมือ", count: 98 },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">บริการของเรา</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FastLabor มุ่งมั่นให้บริการจัดหาแรงงานที่มีคุณภาพและรวดเร็ว เพื่อตอบโจทย์ความต้องการของธุรกิจของคุณ
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Categories section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">หมวดหมู่แรงงาน</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              เรามีแรงงานคุณภาพในหลากหลายหมวดหมู่ที่พร้อมตอบสนองความต้องการของคุณ
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 text-center">
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-fastlabor-600 font-medium">{category.count} คน</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Highlight callout */}
        <div className="mt-24 bg-gradient-to-r from-fastlabor-600 to-fastlabor-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มใช้บริการกับเรา?</h2>
              <p className="text-lg text-white/90">สมัครสมาชิกและเริ่มใช้งาน FastLabor ได้ทันที</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-2 text-white" />
                  <span>แรงงานคุณภาพ ผ่านการตรวจสอบ</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-2 text-white" />
                  <span>ไม่มีค่าแรกเข้า เริ่มใช้งานฟรี</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-2 text-white" />
                  <span>การันตีความพึงพอใจ 100%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg w-full md:w-auto">
              <h3 className="text-fastlabor-700 font-semibold mb-4 text-lg">ลงทะเบียนเลย!</h3>
              <form className="space-y-4">
                <input type="text" placeholder="ชื่อของคุณ" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" />
                <input type="email" placeholder="อีเมล์" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" />
                <input type="tel" placeholder="เบอร์โทรศัพท์" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fastlabor-500" />
                <button type="submit" className="w-full bg-fastlabor-600 hover:bg-fastlabor-700 text-white py-2 rounded-lg font-medium transition-colors">สมัครสมาชิก</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

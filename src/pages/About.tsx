import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const team = [
    { name: "Narissara Suwatthee",        role: "CEO",                             image: "/lovable-uploads/1.png" },
    { name: "Intouch Pattananupong",      role: "CTO",                             image: "/lovable-uploads/2.png" },
    { name: "Pratsara Chukkhuchun",       role: "CFO",                             image: "/lovable-uploads/3.png" },
    { name: "Panjai Bennarong",           role: "Strategic Partnership/Marketing", image: "/lovable-uploads/4.png" },
    { name: "Pasinee Yingyongdumrongrit", role: "Head of Product",                 image: "/lovable-uploads/5.png" },
    { name: "Wiritphon Yusamran",         role: "Technical Developer",             image: "/lovable-uploads/6.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">เกี่ยวกับเรา</h1>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-12">
            <h2 className="text-2xl font-semibold mb-4">วิสัยทัศน์ของเรา</h2>
            <p className="text-gray-600 mb-6">
              FastLabor มุ่งมั่นที่จะเป็นแพลตฟอร์มชั้นนำในการจัดหาแรงงานที่มีคุณภาพ รวดเร็ว และน่าเชื่อถือ
              เราต้องการสร้างระบบนิเวศที่ทั้งผู้ว่าจ้างและแรงงานได้รับประโยชน์สูงสุด ด้วยเทคโนโลยีที่ทันสมัย
              และการบริการที่ใส่ใจในทุกรายละเอียด
            </p>

            <h2 className="text-2xl font-semibold mb-4">เรื่องราวของเรา</h2>
            <p className="text-gray-600 mb-6">
              FastLabor ก่อตั้งขึ้นในปี 2023 จากความตั้งใจที่จะแก้ไขปัญหาการจัดหาแรงงานในประเทศไทย
              ด้วยประสบการณ์กว่า 10 ปีในวงการธุรกิจและการบริหารทรัพยากรบุคคล ทีมผู้ก่อตั้งของเราเล็งเห็นถึงความท้าทาย
              ในการจับคู่ระหว่างแรงงานที่มีคุณภาพกับธุรกิจที่ต้องการแรงงาน
            </p>
            <p className="text-gray-600 mb-6">
              ด้วยเทคโนโลยีและแพลตฟอร์มที่พัฒนาขึ้น FastLabor ช่วยให้การจัดหาแรงงานเป็นเรื่องง่าย รวดเร็ว และมีประสิทธิภาพ
              โดยยังคงรักษามาตรฐานคุณภาพและความน่าเชื่อถือ
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-6">ทีมของเรา</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

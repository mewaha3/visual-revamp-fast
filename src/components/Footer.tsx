
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = {
    company: [
      { name: "เกี่ยวกับเรา", href: "/about" },
      { name: "บล็อก", href: "#" },
      { name: "ข่าวสาร", href: "#" },
      { name: "ร่วมงานกับเรา", href: "#" },
    ],
    services: [
      { name: "ลงประกาศงาน", href: "/post-job" },
      { name: "ค้นหางาน", href: "/find-job" },
      { name: "ค่าบริการ", href: "/services" },
      { name: "วิธีการทำงาน", href: "#" },
    ],
    support: [
      { name: "คำถามที่พบบ่อย", href: "#" },
      { name: "ติดต่อเรา", href: "/contact" },
      { name: "นโยบายความเป็นส่วนตัว", href: "#" },
      { name: "เงื่อนไขการใช้งาน", href: "#" },
    ],
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-fastlabor-700">Fast<span className="text-fastlabor-500">Labor</span></span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              แพลตฟอร์มจัดหาแรงงานที่มีคุณภาพ รวดเร็ว และน่าเชื่อถือ เรามุ่งมั่นเชื่อมโยงธุรกิจกับแรงงานที่เหมาะสมที่สุด
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-200 hover:bg-fastlabor-100 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="bg-gray-200 hover:bg-fastlabor-100 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="bg-gray-200 hover:bg-fastlabor-100 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="bg-gray-200 hover:bg-fastlabor-100 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">บริษัท</h3>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">บริการ</h3>
            <ul className="space-y-3">
              {links.services.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-3">
              {links.support.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-600 hover:text-fastlabor-600 transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FastLabor. สงวนลิขสิทธิ์ทั้งหมด.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-fastlabor-600 text-sm">นโยบายความเป็นส่วนตัว</a>
              <a href="#" className="text-gray-500 hover:text-fastlabor-600 text-sm">เงื่อนไขการใช้งาน</a>
              <a href="#" className="text-gray-500 hover:text-fastlabor-600 text-sm">คุกกี้</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

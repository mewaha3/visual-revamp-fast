
// User data previously fetched from Google Sheets
export interface User {
  first_name: string;
  last_name: string;
  national_id?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  zip_code?: string;
  email: string;
  password: string;
  certificate?: string;
  passport?: string;
  visa?: string;
  work_permit?: string;
  fullName?: string; // Computed field for convenience
}

// Data from the spreadsheet image
export const users: User[] = [
  {
    first_name: "สมชาย",
    last_name: "สมบัติดี",
    national_id: "1100100234567",
    dob: "1985-03-12",
    gender: "Male",
    nationality: "Thai",
    address: "100/1 ถ.สุขุมวิท 21",
    province: "กรุงเทพ",
    district: "เขต1",
    subdistrict: "แขวง1",
    zip_code: "10100",
    email: "somchai@example.com",
    password: "P@ssw0rd1",
    certificate: "Yes",
    passport: "Yes",
    visa: "No",
    work_permit: "Yes",
    fullName: "สมชาย สมบัติดี"
  },
  {
    first_name: "สมศรี",
    last_name: "มีเงิน",
    national_id: "1200200345678",
    dob: "1980-07-25",
    gender: "Female",
    nationality: "Thai",
    address: "200/5 ถ.พหลโยธิน 10",
    province: "เชียงใหม่",
    district: "เมืองเชียงใหม่",
    subdistrict: "ศรีภูมิ",
    zip_code: "50200",
    email: "somsri@example.com",
    password: "Th@iland22",
    certificate: "Yes",
    passport: "No",
    visa: "No",
    work_permit: "Yes",
    fullName: "สมศรี มีเงิน"
  },
  {
    first_name: "วิชาญ",
    last_name: "ใจบุญ",
    national_id: "1500300456789",
    dob: "1978-11-03",
    gender: "Male",
    nationality: "Thai",
    address: "300 ถ.สายไหม 5",
    province: "ขอนแก่น",
    district: "เมืองขอนแก่น",
    subdistrict: "ตำบล2",
    zip_code: "40000",
    email: "wichan@example.com",
    password: "Qu@rTy45",
    certificate: "No",
    passport: "Yes",
    visa: "Yes",
    work_permit: "No",
    fullName: "วิชาญ ใจบุญ"
  },
  {
    first_name: "วิไล",
    last_name: "จะรวยดี",
    national_id: "1600405467890",
    dob: "1982-02-18",
    gender: "Female",
    nationality: "Thai",
    address: "400 ถ.ราชดำเนิน 2",
    province: "ลำปาง",
    district: "เมืองลำปาง",
    subdistrict: "ตำบล3",
    zip_code: "20000",
    email: "wilai@example.com",
    password: "D@g123!",
    certificate: "Yes",
    passport: "No",
    visa: "No",
    work_permit: "Yes",
    fullName: "วิไล จะรวยดี"
  },
  {
    first_name: "สมคิด",
    last_name: "ประเสริฐ",
    national_id: "1700500678901",
    dob: "1987-05-30",
    gender: "Male",
    nationality: "Thai",
    address: "500 ถ.พหลโยธิน 27",
    province: "นครราชสีมา",
    district: "เมืองนครราชสีมา",
    subdistrict: "ตำบล4",
    zip_code: "30000",
    email: "thanaporn@example.com",
    password: "C@t4br678",
    certificate: "No",
    passport: "No",
    visa: "No",
    work_permit: "No",
    fullName: "สมคิด ประเสริฐ"
  },
  // Adding more users from the spreadsheet image
  {
    first_name: "พิศาล",
    last_name: "แก้วใจ",
    national_id: "1800600789012",
    dob: "1982-09-14",
    gender: "Female",
    nationality: "Thai",
    address: "600 ถ.ราชดำเนิน 14",
    province: "ชลบุรี",
    district: "เมืองชลบุรี",
    subdistrict: "ตำบล5",
    zip_code: "90000",
    email: "kitty@example.com",
    password: "L0CK_Me!",
    certificate: "Yes",
    passport: "Yes",
    visa: "Yes",
    work_permit: "No",
    fullName: "พิศาล แก้วใจ"
  },
  // Adding a few more users for completeness
  {
    first_name: "ประสิทธิ์",
    last_name: "บูรณาการ",
    email: "admin@example.com",
    password: "Admin123!",
    fullName: "ประสิทธิ์ บูรณาการ"
  },
  {
    first_name: "Pratsara",
    last_name: "Chukkhuchun",
    national_id: "1234567890123",
    dob: "2015-05-18",
    gender: "Female",
    nationality: "Thai",
    address: "472 Sanawaddi Rd.",
    province: "ลำพูน",
    district: "เมืองลำพูน",
    subdistrict: "ลำพูน",
    zip_code: "22120",
    email: "noline.js.one@gmail.com",
    password: "FastLabor1234",
    certificate: "Coway 3.png",
    passport: "Yes",
    visa: "No",
    work_permit: "No",
    fullName: "Pratsara Chukkhuchun"
  }
];

// Helper function to find a user by email and password
export function findUserByCredentials(email: string, password: string): User | undefined {
  return users.find(user => user.email === email && user.password === password);
}

// Helper function to add a new user to the array
export function addUser(user: User): void {
  // In a real application, we would save this to a database
  // For this demo, we'll just log it, but in a real app, we would push to the array
  users.push({
    ...user,
    fullName: `${user.first_name} ${user.last_name}`
  });
  console.log("New user added:", user);
}

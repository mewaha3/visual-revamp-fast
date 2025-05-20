
import { JobDetail, Employer } from "@/types/types";

// Updated to match the JobDetail interface
export const jobDetailsMock: JobDetail[] = [
  {
    id: "job-1",
    job_id: "job-1",
    job_type: "housekeeping",
    job_detail: "Looking for a housekeeper for routine cleaning, laundry, and light meal preparation.",
    job_date: "2023-05-30",
    start_time: "09:00",
    end_time: "17:00",
    job_address: "123 Main St, Bangkok",
    salary: 15000,
    province: "Bangkok",
    district: "Watthana",
    subdistrict: "Khlong Toei Nuea",
    name: "House Cleaning Job" // Added name to fix type error
  },
  {
    id: "job-2",
    job_id: "job-2",
    job_type: "cooking",
    job_detail: "Need a skilled cook for a family of four. Must be able to prepare Thai and international cuisine.",
    job_date: "2023-06-15",
    start_time: "08:00",
    end_time: "16:00",
    job_address: "456 Park Ave, Bangkok",
    salary: 18000,
    province: "Bangkok",
    district: "Pathum Wan",
    subdistrict: "Lumphini",
    name: "Family Cook Position" // Added name to fix type error
  },
  {
    id: "job-3",
    job_id: "job-3",
    job_type: "eldercare",
    job_detail: "Seeking a caregiver for an elderly woman. Duties include assistance with daily activities, medication management.",
    job_date: "2023-06-01",
    start_time: "07:00",
    end_time: "19:00",
    job_address: "789 Sukhumvit Rd, Bangkok",
    salary: 22000,
    province: "Bangkok",
    district: "Khlong Toei",
    subdistrict: "Khlong Toei",
    name: "Elderly Care Provider" // Added name to fix type error
  },
  {
    id: "job-4",
    job_id: "job-4",
    job_type: "childcare",
    job_detail: "Looking for a nanny for two children (ages 3 and 5). Must be patient and energetic.",
    job_date: "2023-07-01",
    start_time: "10:00",
    end_time: "18:00",
    job_address: "101 Silom Rd, Bangkok",
    salary: 20000,
    province: "Bangkok",
    district: "Bang Rak",
    subdistrict: "Silom",
    name: "Nanny for Two Children" // Added name to fix type error
  },
  {
    id: "job-5",
    job_id: "job-5",
    job_type: "gardening",
    job_detail: "Need a gardener for a large property. Must have experience with tropical plants and landscaping.",
    job_date: "2023-06-20",
    start_time: "08:00",
    end_time: "16:00",
    job_address: "222 Asoke Rd, Bangkok",
    salary: 16000,
    province: "Bangkok",
    district: "Watthana",
    subdistrict: "Khlong Toei Nuea",
    name: "Property Gardener" // Added name to fix type error
  },
  {
    id: "job-6",
    job_id: "job-6",
    job_type: "driver",
    job_detail: "Seeking a personal driver. Must have a clean driving record and knowledge of Bangkok streets.",
    job_date: "2023-06-10",
    start_time: "07:00",
    end_time: "19:00",
    job_address: "333 Ratchadamri Rd, Bangkok",
    salary: 19000,
    province: "Bangkok",
    district: "Pathum Wan",
    subdistrict: "Lumphini",
    name: "Personal Driver Position" // Added name to fix type error
  }
];

// Updated to match the Employer interface
export const employerDetailsMock: Employer[] = [
  {
    id: "job-1",
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@example.com",
    phone: "081-234-5678",
    rating: 4.8,
    reviews: 15,
    name: "John Smith" // Optional
  },
  {
    id: "job-2",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "082-345-6789",
    rating: 4.5,
    reviews: 8,
    name: "Sarah Johnson" // Optional
  },
  {
    id: "job-3",
    first_name: "Michael",
    last_name: "Lee",
    email: "michael.lee@example.com",
    phone: "083-456-7890",
    rating: 4.9,
    reviews: 22,
    name: "Michael Lee" // Optional
  },
  {
    id: "job-4",
    first_name: "Lisa",
    last_name: "Wong",
    email: "lisa.wong@example.com",
    phone: "084-567-8901",
    rating: 4.7,
    reviews: 13,
    name: "Lisa Wong" // Optional
  },
  {
    id: "job-5",
    first_name: "David",
    last_name: "Chen",
    email: "david.chen@example.com",
    phone: "085-678-9012",
    rating: 4.6,
    reviews: 10,
    name: "David Chen" // Optional
  },
  {
    id: "job-6",
    first_name: "Emma",
    last_name: "Thompson",
    email: "emma.thompson@example.com",
    phone: "086-789-0123",
    rating: 5.0,
    reviews: 19,
    name: "Emma Thompson" // Optional
  }
];

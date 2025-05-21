
import { User } from "@/data/users";

// Function to add a new user to the Google Sheet
export async function addUserToSheet(user: User): Promise<boolean> {
  try {
    // Format user data as an array for the sheet - match the column headers exactly
    const userData = [
      user.first_name,
      user.last_name,
      user.national_id || "",
      user.dob || "",
      user.gender || "",
      user.nationality || "",
      user.address || "",
      user.province || "",
      user.district || "",
      user.subdistrict || "",
      user.zip_code || "",
      user.email,
      user.password,
      user.certificate || "No",   // ID Card column
      user.passport || "No",      // passport column
      user.visa || "No",          // visa column
      user.work_permit || "No"    // work_permit column
    ];

    console.log('Sending user data to sheet:', userData);

    // Call the API route to add user to the sheet
    const response = await fetch('/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    });

    if (!response.ok) {
      throw new Error('Failed to add user to sheet');
    }

    return true;
  } catch (error) {
    console.error('Error adding user to sheet:', error);
    return false;
  }
}

// Function to retrieve users from Google Sheet
export async function getUsersFromSheet(): Promise<User[]> {
  try {
    console.log('Fetching users from sheet API');
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users from sheet');
    }
    
    const data = await response.json();
    console.log('Received user data from API:', data);
    
    if (!data.users || !Array.isArray(data.users)) {
      console.error('Invalid users data format:', data);
      return [];
    }
    
    // Skip the header row if it exists (check if first row has column headers)
    const users = data.users;
    console.log(`Processing ${users.length} users from sheet`);
    
    return users.map((user: any) => ({
      fullName: user.fullName || `${user.first_name} ${user.last_name}`,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      national_id: user.national_id || "",
      dob: user.dob || "",
      gender: user.gender || "",
      nationality: user.nationality || "",
      address: user.address || "",
      province: user.province || "",
      district: user.district || "",
      subdistrict: user.subdistrict || "",
      zip_code: user.zip_code || "",
      email: user.email || "",
      password: user.password || "",
      certificate: user.certificate || "No",
      passport: user.passport || "No",
      visa: user.visa || "No",
      work_permit: user.work_permit || "No"
    }));
  } catch (error) {
    console.error('Error fetching users from sheet:', error);
    return [];
  }
}

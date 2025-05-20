
import { User } from "@/data/users";

// Function to add a new user to the Google Sheet
export async function addUserToSheet(user: User): Promise<boolean> {
  try {
    // Format user data as an array for the sheet
    const userData = [
      user.fullName || `${user.first_name} ${user.last_name}`,
      user.email,
      user.password,
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
      user.certificate || "No",
      user.passport || "No",
      user.visa || "No",
      user.work_permit || "No"
    ];

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
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users from sheet');
    }
    
    const data = await response.json();
    return data.users.map((row: any) => {
      // Map sheet data to User object based on column positions
      return {
        fullName: row[0] || "",
        email: row[1] || "",
        password: row[2] || "",
        first_name: row[3] || row[0].split(' ')[0] || "",
        last_name: row[4] || row[0].split(' ')[1] || "",
        national_id: row[5] || "",
        dob: row[6] || "",
        gender: row[7] || "",
        nationality: row[8] || "",
        address: row[9] || "",
        province: row[10] || "",
        district: row[11] || "",
        subdistrict: row[12] || "",
        zip_code: row[13] || "",
        certificate: row[14] || "No",
        passport: row[15] || "No",
        visa: row[16] || "No",
        work_permit: row[17] || "No"
      };
    });
  } catch (error) {
    console.error('Error fetching users from sheet:', error);
    return [];
  }
}

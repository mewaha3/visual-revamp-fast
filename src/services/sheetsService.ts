
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
        fullName: `${row[0]} ${row[1]}`, // Combine first_name and last_name
        first_name: row[0] || "",
        last_name: row[1] || "",
        national_id: row[2] || "",
        dob: row[3] || "",
        gender: row[4] || "",
        nationality: row[5] || "",
        address: row[6] || "",
        province: row[7] || "",
        district: row[8] || "",
        subdistrict: row[9] || "",
        zip_code: row[10] || "",
        email: row[11] || "",
        password: row[12] || "",
        certificate: row[13] || "No",  // ID Card
        passport: row[14] || "No",
        visa: row[15] || "No",
        work_permit: row[16] || "No"
      };
    });
  } catch (error) {
    console.error('Error fetching users from sheet:', error);
    return [];
  }
}

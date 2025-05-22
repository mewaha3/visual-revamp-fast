
import { 
  auth, 
  db, 
  storage,
  createUserWithEmailAndPassword, 
  updateProfile,
  doc, 
  setDoc
} from "@/lib/firebase";

// Interface for user registration data
export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  national_id: string;
  dob: Date | string;
  gender: string;
  nationality: string;
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip_code: string;
}

/**
 * Register a new user with Firebase Authentication and store their profile in Firestore
 * 
 * @param userData User registration data
 * @returns Promise resolving to the user ID on success
 */
export async function registerUser(userData: UserRegistrationData): Promise<string> {
  try {
    console.log("Starting registration process with data:", { 
      ...userData, 
      password: "[REDACTED]" // Don't log the password
    });
    
    // Step 1: Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;
    const uid = user.uid;
    
    console.log("User created in Firebase Auth with UID:", uid);

    // Step 2: Update the user's display name
    await updateProfile(user, {
      displayName: `${userData.first_name} ${userData.last_name}`
    });
    console.log("User display name updated successfully");
    
    // Convert date to string if it's a Date object
    const formattedDob = typeof userData.dob === 'object' 
      ? userData.dob.toISOString().split('T')[0]
      : userData.dob;

    // Step 3: Create user profile document in Firestore
    // IMPORTANT: We do NOT save the password in Firestore
    const userDocRef = doc(db, "users", uid);
    
    const userProfileData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      fullName: `${userData.first_name} ${userData.last_name}`,
      national_id: userData.national_id,
      dob: formattedDob,
      gender: userData.gender,
      nationality: userData.nationality,
      address: userData.address,
      province: userData.province,
      district: userData.district,
      subdistrict: userData.subdistrict,
      zip_code: userData.zip_code,
      email: userData.email,
      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "user",
      user_id: uid
    };
    
    console.log("Attempting to save user profile to Firestore with uid:", uid);
    console.log("User profile data:", userProfileData);
    
    // Use setDoc to ensure document is created with the specific ID (uid)
    await setDoc(userDocRef, userProfileData);
    console.log("User profile saved successfully to Firestore");
    
    return uid;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

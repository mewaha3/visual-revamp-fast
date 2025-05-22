
import { 
  auth, 
  db, 
  storage,
  createUserWithEmailAndPassword, 
  updateProfile,
  doc, 
  setDoc, 
  ref, 
  uploadBytes, 
  getDownloadURL
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
  documents?: {
    certificate?: File | null;
    passport?: File | null;
    visa?: File | null;
    work_permit?: File | null;
  };
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
    
    console.log("User created in Firebase Auth:", uid);

    // Step 2: Update the user's display name
    await updateProfile(user, {
      displayName: `${userData.first_name} ${userData.last_name}`
    });
    console.log("User display name updated");

    // Step 3: Upload documents if available
    const documentUrls: Record<string, string | null> = {
      certificate: null,
      passport: null,
      visa: null,
      work_permit: null
    };

    if (userData.documents) {
      console.log("Uploading user documents...");
      for (const [docType, file] of Object.entries(userData.documents)) {
        if (file) {
          console.log(`Uploading ${docType} document:`, file.name);
          const fileExtension = file.name.split('.').pop();
          const storageRef = ref(storage, `users/${uid}/documents/${docType}.${fileExtension}`);
          await uploadBytes(storageRef, file);
          documentUrls[docType] = await getDownloadURL(storageRef);
          console.log(`Document ${docType} uploaded successfully. URL:`, documentUrls[docType]);
        }
      }
    }
    
    // Convert date to string if it's a Date object
    const formattedDob = typeof userData.dob === 'object' 
      ? userData.dob.toISOString().split('T')[0]
      : userData.dob;

    // Step 4: Create user profile document in Firestore
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
      // Document URLs
      certificate: documentUrls.certificate,
      passport: documentUrls.passport,
      visa: documentUrls.visa,
      work_permit: documentUrls.work_permit,
      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "user",
      user_id: uid
    };
    
    console.log("Saving user profile to Firestore:", uid);
    
    try {
      await setDoc(userDocRef, userProfileData);
      console.log("User profile saved successfully to Firestore");
    } catch (firestoreError) {
      console.error("Error saving to Firestore:", firestoreError);
      // Even if Firestore save fails, we don't throw here since the user account was created
      // Instead we log the error but still return the user ID
    }
    
    return uid;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

/**
 * Upload a document to Firebase Storage
 * 
 * @param file File to upload
 * @param userId User ID
 * @param docType Document type (e.g., 'idcard', 'passport')
 * @returns Promise resolving to the download URL
 */
export async function uploadUserDocument(
  file: File, 
  userId: string, 
  docType: string
): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(storage, `users/${userId}/documents/${docType}.${fileExtension}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`Error uploading ${docType}:`, error);
    throw error;
  }
}

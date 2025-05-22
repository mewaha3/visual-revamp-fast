
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Type definitions
interface ReviewSubmission {
  match_id: string;
  employer_id: string;
  employer_name: string;
  worker_id: string;
  worker_name: string;
  rating: number;
  comment: string;
  review_type: 'worker_to_employer' | 'employer_to_worker';
}

interface Review extends ReviewSubmission {
  id: string;
  created_at: any;
}

// Submit a review
export const submitReview = async (reviewData: ReviewSubmission): Promise<string> => {
  try {
    // Add the review to the reviews collection
    const reviewRef = await addDoc(collection(db, "reviews"), {
      ...reviewData,
      created_at: serverTimestamp()
    });
    
    // Update the corresponding match_results document
    const matchDocRef = doc(db, "match_results", reviewData.match_id);
    
    if (reviewData.review_type === 'worker_to_employer') {
      // Worker reviewing employer
      await updateDoc(matchDocRef, {
        worker_review_id: reviewRef.id,
        worker_review_rating: reviewData.rating,
        updated_at: serverTimestamp()
      });
    } else {
      // Employer reviewing worker
      await updateDoc(matchDocRef, {
        employer_review_id: reviewRef.id,
        employer_review_rating: reviewData.rating,
        updated_at: serverTimestamp()
      });
    }
    
    return reviewRef.id;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// Get reviews for a specific user (as a worker or employer)
export const getUserReviews = async (userId: string, type: 'worker' | 'employer'): Promise<Review[]> => {
  try {
    let q;
    
    if (type === 'worker') {
      // Get reviews for this user as a worker
      q = query(collection(db, "reviews"), where("worker_id", "==", userId));
    } else {
      // Get reviews for this user as an employer
      q = query(collection(db, "reviews"), where("employer_id", "==", userId));
    }
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...doc.data() as ReviewSubmission,
        created_at: data.created_at // Fixed: Properly access created_at from data
      });
    });
    
    return reviews;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    return [];
  }
};

// Get reviews for a specific match
export const getMatchReviews = async (matchId: string): Promise<Review[]> => {
  try {
    const q = query(collection(db, "reviews"), where("match_id", "==", matchId));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...doc.data() as ReviewSubmission,
        created_at: data.created_at // Fixed: Properly access created_at from data
      });
    });
    
    return reviews;
  } catch (error) {
    console.error("Error getting match reviews:", error);
    return [];
  }
};

// Calculate average rating for a user
export const calculateUserRating = async (userId: string, type: 'worker' | 'employer'): Promise<{ average: number, count: number }> => {
  try {
    const reviews = await getUserReviews(userId, type);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const average = sum / reviews.length;
    
    return {
      average: Number(average.toFixed(1)),
      count: reviews.length
    };
  } catch (error) {
    console.error("Error calculating user rating:", error);
    return { average: 0, count: 0 };
  }
};

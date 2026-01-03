import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * Torvix Arena Firebase Configuration
 * Project: jnv-tournament
 */
const firebaseConfig = {
  apiKey: "AIzaSyBDP3pbgTPW6x9sdsQusgwKO5UQyaZ3Yxg",
  authDomain: "jnv-tournament.firebaseapp.com",
  databaseURL: "https://jnv-tournament-default-rtdb.firebaseio.com",
  projectId: "jnv-tournament",
  storageBucket: "jnv-tournament.firebasestorage.app",
  messagingSenderId: "820125680828",
  appId: "1:820125680828:web:214d8f83e9356d65a2bcb9",
  measurementId: "G-WMETGN731M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper functions for Firestore operations
export const firebaseService = {
  // Sync User
  async saveUser(user: any) {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, user, { merge: true });
  },

  async getUser(userId: string) {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  },

  // Sync Tournaments
  async createTournament(tournament: any) {
    const tourRef = doc(db, "tournaments", tournament.id);
    await setDoc(tourRef, tournament);
  },

  async updateTournament(tournamentId: string, updates: any) {
    const tourRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tourRef, updates);
  },

  async joinTournamentParticipant(tournamentId: string, participant: any) {
    const tourRef = doc(db, "tournaments", tournamentId);
    await updateDoc(tourRef, {
      participants: arrayUnion(participant)
    });
  },

  subscribeToTournaments(callback: (tournaments: any[]) => void, onError?: (error: any) => void) {
    return onSnapshot(
      collection(db, "tournaments"), 
      (snapshot) => {
        const tournaments = snapshot.docs.map(doc => doc.data());
        callback(tournaments);
      },
      (error) => {
        console.error("Firestore Subscription Error:", error);
        if (onError) onError(error);
      }
    );
  }
};
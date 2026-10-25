/**
 * CivicConnect - Complete Firebase Integration
 * Project ID: civicconnect11
 * Connected Services: Firebase App, Firebase Analytics, Cloud Firestore
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD1aYB19Y0Brs7cqlwhDW7Js5tfoCeGZgA",
  authDomain: "civicconnect11.firebaseapp.com",
  projectId: "civicconnect11",
  storageBucket: "civicconnect11.firebasestorage.app",
  messagingSenderId: "943207997740",
  appId: "1:943207997740:web:ae1fa0e1269cd8bb6fcc89",
  measurementId: "G-B5XZPT3HP7"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Analytics
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("🔥 Firebase Analytics actively connected to civicconnect11");
    trackFirebaseEvent("platform_opened", { timestamp: new Date().toISOString() });
  }
}).catch((err) => {
  console.log("Firebase Analytics info:", err.message);
});

// Helper to safely track analytics events
export function trackFirebaseEvent(eventName, eventParams = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn("Analytics event notice:", err);
  }
}

// Sync a single grievance to Firebase Cloud Firestore
export async function syncComplaintToFirestore(complaint) {
  trackFirebaseEvent("grievance_filed", {
    complaint_id: complaint.id,
    category: complaint.category,
    agency: complaint.agency,
    road_type: complaint.roadType
  });

  try {
    const complaintRef = doc(db, "complaints", complaint.id);
    await setDoc(complaintRef, {
      ...complaint,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`🔥 Complaint ${complaint.id} synced to Firebase Firestore (civicconnect11)`);
    return true;
  } catch (err) {
    console.warn("Firestore sync notice (local backup preserved):", err.message);
    return false;
  }
}

// Sync Leaderboard to Firebase Cloud Firestore
export async function syncLeaderboardToFirestore(leaderboardList) {
  try {
    for (const item of leaderboardList) {
      const citizenRef = doc(db, "leaderboard", item.id);
      await setDoc(citizenRef, {
        ...item,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }
    console.log("🔥 Citizen Leaderboard synced to Firebase Firestore");
  } catch (err) {
    console.warn("Firestore leaderboard notice:", err.message);
  }
}

// Global hook for CivicConnect app
window.civicFirebase = {
  app,
  analytics,
  db,
  firebaseConfig,
  trackEvent: trackFirebaseEvent,
  syncComplaint: syncComplaintToFirestore,
  syncLeaderboard: syncLeaderboardToFirestore,
  isConnected: true
};

// Update visual status pill on page
document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("firebaseStatusBadge");
  if (badge) {
    badge.innerHTML = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10B981; margin-right:4px;"></span> Firebase Connected (civicconnect11)`;
  }
});

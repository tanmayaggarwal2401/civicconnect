/**
 * CivicConnect - Core Application Logic & Seed Data
 * Delhi NCT Civic Grievance & Municipal Grid
 * HackIIITD 2026 • Team HackX
 */

const STORAGE_KEY_COMPLAINTS = "civicconnect_complaints";

// Realistic Seed Complaints distributed across Delhi NCT
const DEFAULT_COMPLAINTS = [
  {
    id: "CC-DEL-2026-10492",
    date: "2026-10-21",
    time: "10:14 AM",
    category: "pothole",
    categoryLabel: "Pothole",
    roadType: "<60ft",
    roadTypeLabel: "Colony Lane (<60ft)",
    agency: "MCD",
    agencyFullName: "Municipal Corporation of Delhi",
    agencyReason: "Interior colony roads and lanes under 60 feet fall under MCD jurisdiction for asphalt patching and resurfacing.",
    locationText: "Sector 7, Block B, Rohini, North Delhi",
    coordinates: { lat: 28.7041, lng: 77.1025 },
    status: "Repaired", // Solved (Green)
    escalated: false,
    description: "Deep pothole creating severe risk for two-wheelers near the community market.",
    beforeImage: "images/pothole.jpg",
    afterImage: "images/pothole-repaired.jpg",
    verificationScore: 91,
    verified: true,
    demoOtp: "582194"
  },
  {
    id: "CC-DEL-2026-20984",
    date: "2026-10-22",
    time: "02:30 PM",
    category: "drain",
    categoryLabel: "Drain",
    roadType: "sewer",
    roadTypeLabel: "Sewer Pipeline",
    agency: "DJB",
    agencyFullName: "Delhi Jal Board",
    agencyReason: "Underground sewerage, trunk wastewater conduits, and stormwater drain maintenance fall under Delhi Jal Board jurisdiction.",
    locationText: "Ring Road near Lajpat Nagar Flyover, South Delhi",
    coordinates: { lat: 28.5677, lng: 77.2433 },
    status: "In Progress", // Work in process (Yellow)
    escalated: false,
    description: "Clogged stormwater channel overflowing onto the service lane.",
    beforeImage: "images/drain.jpg",
    afterImage: "",
    verificationScore: 0,
    verified: false,
    demoOtp: "419830"
  },
  {
    id: "CC-DEL-2026-31847",
    date: "2026-10-23",
    time: "09:45 AM",
    category: "damaged infrastructure",
    categoryLabel: "Damaged Infrastructure",
    roadType: "≥60ft",
    roadTypeLabel: "Arterial Road (≥60ft)",
    agency: "PWD",
    agencyFullName: "Public Works Department Delhi",
    agencyReason: "Arterial roads, avenues, and express corridors 60 feet or wider fall under PWD Delhi maintenance.",
    locationText: "Vikas Marg, Laxmi Nagar, East Delhi",
    coordinates: { lat: 28.6315, lng: 77.2774 },
    status: "Assigned", // Open / Not Solved (Red)
    escalated: false,
    description: "Broken central divider barrier and damaged median curb posing vehicle collision hazard.",
    beforeImage: "images/infrastructure.jpg",
    afterImage: "",
    verificationScore: 0,
    verified: false,
    demoOtp: "782013"
  },
  {
    id: "CC-DEL-2026-44120",
    date: "2026-10-24",
    time: "08:15 AM",
    category: "garbage",
    categoryLabel: "Garbage",
    roadType: "park",
    roadTypeLabel: "District Park",
    agency: "DDA",
    agencyFullName: "Delhi Development Authority",
    agencyReason: "Master plan green zones, district parks, and regional recreational tracts are maintained by DDA Horticulture & Sanitation.",
    locationText: "Sanjay Van District Park, Vasant Kunj, South-West Delhi",
    coordinates: { lat: 28.5284, lng: 77.1741 },
    status: "Filed", // Open / Not Solved (Red)
    escalated: true,
    description: "Unattended municipal garden waste and illegal dumping near gate 4.",
    beforeImage: "images/garbage.jpg",
    afterImage: "",
    verificationScore: 0,
    verified: false,
    demoOtp: "921854"
  },
  {
    id: "CC-DEL-2026-55912",
    date: "2026-10-23",
    time: "11:20 AM",
    category: "pothole",
    categoryLabel: "Pothole",
    roadType: "≥60ft",
    roadTypeLabel: "Arterial Road (≥60ft)",
    agency: "PWD",
    agencyFullName: "Public Works Department Delhi",
    agencyReason: "Inner and Outer Circle corridors and radial arterial avenues are managed directly by PWD Delhi / NDMC.",
    locationText: "Radial Road 2, Connaught Place, Central Delhi",
    coordinates: { lat: 28.6315, lng: 77.2167 },
    status: "Closed", // Solved (Green)
    escalated: false,
    description: "Surface crater near metro exit gate 3 patched and resurfaced.",
    beforeImage: "images/pothole.jpg",
    afterImage: "images/pothole-repaired.jpg",
    verificationScore: 94,
    verified: true,
    demoOtp: "631892"
  },
  {
    id: "CC-DEL-2026-67219",
    date: "2026-10-24",
    time: "01:05 PM",
    category: "drain",
    categoryLabel: "Drain",
    roadType: "sewer",
    roadTypeLabel: "Sewer Pipeline",
    agency: "DJB",
    agencyFullName: "Delhi Jal Board",
    agencyReason: "Trunk sewer lines and commercial stormwater drainage fall under Delhi Jal Board.",
    locationText: "Ajmal Khan Road, Karol Bagh, Central Delhi",
    coordinates: { lat: 28.6517, lng: 77.1906 },
    status: "In Progress", // Work in process (Yellow)
    escalated: false,
    description: "Commercial street drainage desilting in progress by DJB suction unit.",
    beforeImage: "images/drain.jpg",
    afterImage: "",
    verificationScore: 0,
    verified: false,
    demoOtp: "329104"
  },
  {
    id: "CC-DEL-2026-78103",
    date: "2026-10-24",
    time: "02:40 PM",
    category: "damaged infrastructure",
    categoryLabel: "Damaged Infrastructure",
    roadType: "<60ft",
    roadTypeLabel: "Colony Lane (<60ft)",
    agency: "MCD",
    agencyFullName: "Municipal Corporation of Delhi",
    agencyReason: "Residential colony footpaths and pavement curb stones fall under MCD Zonal division.",
    locationText: "Sector 10 Market, Dwarka, South-West Delhi",
    coordinates: { lat: 28.5815, lng: 77.0592 },
    status: "Filed", // Open / Not Solved (Red)
    escalated: false,
    description: "Broken pedestrian paver blocks creating stumbling hazard for senior citizens.",
    beforeImage: "images/infrastructure.jpg",
    afterImage: "",
    verificationScore: 0,
    verified: false,
    demoOtp: "847291"
  }
];

// Initialize Storage
function initStorage() {
  const existing = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
  if (!existing || existing.length < 50) {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(DEFAULT_COMPLAINTS));
  }
}

// Retrieve Complaints
function getComplaints() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLAINTS)) || DEFAULT_COMPLAINTS;
  } catch (e) {
    console.error("Error reading complaints from localStorage:", e);
    return DEFAULT_COMPLAINTS;
  }
}

// Save Complaint
function saveComplaint(complaint) {
  const complaints = getComplaints();
  complaints.unshift(complaint);
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));

  // Sync to Firebase Cloud Firestore
  if (window.civicFirebase && typeof window.civicFirebase.syncComplaint === "function") {
    window.civicFirebase.syncComplaint(complaint);
  }
}

// Update Complaint
function updateComplaint(updated) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    complaints[index] = { ...complaints[index], ...updated };
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));

    // Sync to Firebase Cloud Firestore
    if (window.civicFirebase && typeof window.civicFirebase.syncComplaint === "function") {
      window.civicFirebase.syncComplaint(complaints[index]);
    }
    return true;
  }
  return false;
}

// Find Complaint by ID
function findComplaintById(id) {
  if (!id) return null;
  const complaints = getComplaints();
  const cleanId = id.trim().toUpperCase();
  return complaints.find(c => c.id.toUpperCase() === cleanId) || null;
}

// Determine Agency Routing
function determineAgencyRoute(roadType, category) {
  if (category === "drain" || roadType === "sewer") {
    return {
      agency: "DJB",
      fullName: "Delhi Jal Board",
      reason: "Sewers, underground pipelines, and stormwater drain trunk infrastructure fall under DJB jurisdiction."
    };
  }

  if (roadType === "park") {
    return {
      agency: "DDA",
      fullName: "Delhi Development Authority",
      reason: "District parks, bio-diversity zones, and master plan recreational public lands fall under DDA jurisdiction."
    };
  }

  if (roadType === "≥60ft") {
    return {
      agency: "PWD",
      fullName: "Public Works Department Delhi",
      reason: "Major arterial roads, express corridors, avenues, and bypasses 60 feet or wider fall under PWD Delhi."
    };
  }

  return {
    agency: "MCD",
    fullName: "Municipal Corporation of Delhi",
    reason: "Interior residential colony roads and streets under 60 feet width fall under MCD zonal jurisdiction."
  };
}

// Determine Color Status according to user rules:
// Red: Issue not solved (Filed, Assigned)
// Yellow: Work in process (In Progress)
// Green: Issue solved (Repaired, Verified, Closed)
function getStatusIndicator(status) {
  const s = (status || "").toLowerCase();
  if (s === "closed" || s === "repaired" || s === "verified") {
    return {
      color: "green",
      hex: "#10B981",
      label: "Issue Solved",
      badgeClass: "badge-solved"
    };
  }
  if (s === "in progress" || s === "work in process" || s === "under repair") {
    return {
      color: "yellow",
      hex: "#F59E0B",
      label: "Work in Process",
      badgeClass: "badge-process"
    };
  }
  return {
    color: "red",
    hex: "#DC2626",
    label: "Issue Not Solved",
    badgeClass: "badge-unsolved"
  };
}

// Create Custom Leaflet SVG Colored Pin Icon
function createMapPinIcon(colorType) {
  let fillColor = "#DC2626"; // Default Red
  if (colorType === "yellow") fillColor = "#F59E0B";
  if (colorType === "green") fillColor = "#10B981";

  const svgHtml = `
    <div style="position: relative; width: 34px; height: 42px; transform: translate(-17px, -42px); filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); cursor: pointer;">
      <svg viewBox="0 0 34 42" width="34" height="42" fill="none">
        <path d="M17 0C7.61 0 0 7.61 0 17c0 11.2 15.1 23.9 15.8 24.5.7.6 1.7.6 2.4 0C18.9 40.9 34 28.2 34 17 34 7.61 26.39 0 17 0z" fill="${fillColor}"/>
        <circle cx="17" cy="16" r="6.5" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: `custom-pin-${colorType}`,
    html: svgHtml,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38]
  });
}

// Generate Reference ID
function generateReferenceId() {
  const randNum = Math.floor(10000 + Math.random() * 90000);
  return `CC-DEL-2026-${randNum}`;
}

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mobile Navbar Toggle Initialization
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initUserProfile();

  const toggleBtn = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
});

// ==========================================================================
// Citizen Leaderboard & Gamification System (Badges: Diamond, Gold, Silver, Bronze)
// ==========================================================================
const STORAGE_KEY_LEADERBOARD = "civicconnect_leaderboard";
const STORAGE_KEY_USER_PROFILE = "civicconnect_user_profile";

const DEFAULT_LEADERBOARD = [
  {
    id: "cit-1",
    name: "Aarav Sharma",
    avatar: "AS",
    zone: "South Delhi",
    locality: "Saket & Malviya Nagar",
    reports: 22,
    verified: 21,
    points: 2850,
    badgeTier: "Diamond",
    badgeTitle: "Diamond Civic Guardian",
    topContribution: "Reported 8 severe potholes on Mehrauli-Badarpur corridor"
  },
  {
    id: "cit-2",
    name: "Pooja Verma",
    avatar: "PV",
    zone: "North Delhi",
    locality: "Sector 7, Rohini",
    reports: 18,
    verified: 17,
    points: 2300,
    badgeTier: "Diamond",
    badgeTitle: "Diamond Civic Guardian",
    topContribution: "Mobilized MCD desilting for 6 colony interior lanes"
  },
  {
    id: "cit-3",
    name: "Vikram Malhotra",
    avatar: "VM",
    zone: "Central Delhi",
    locality: "Connaught Place & Barakhamba",
    reports: 16,
    verified: 15,
    points: 2050,
    badgeTier: "Diamond",
    badgeTitle: "Diamond Civic Guardian",
    topContribution: "Documented divider damages and pedestrian hazards"
  },
  {
    id: "cit-4",
    name: "Neha Gupta",
    avatar: "NG",
    zone: "South Delhi",
    locality: "Lajpat Nagar & Defence Colony",
    reports: 12,
    verified: 12,
    points: 1600,
    badgeTier: "Gold",
    badgeTitle: "Gold Neighborhood Champion",
    topContribution: "Achieved 100% verified closures with citizen OTP"
  },
  {
    id: "cit-5",
    name: "Rajesh Kumar",
    avatar: "RK",
    zone: "East Delhi",
    locality: "Laxmi Nagar & Vikas Marg",
    reports: 11,
    verified: 10,
    points: 1450,
    badgeTier: "Gold",
    badgeTitle: "Gold Neighborhood Champion",
    topContribution: "Cleared chronic garbage dumps near metro pillars"
  },
  {
    id: "cit-6",
    name: "Ananya Sen",
    avatar: "AS",
    zone: "West Delhi",
    locality: "Dwarka Sector 10 & 12",
    reports: 8,
    verified: 7,
    points: 950,
    badgeTier: "Silver",
    badgeTitle: "Silver Active Citizen",
    topContribution: "Reported storm drain blockage before monsoon"
  },
  {
    id: "cit-7",
    name: "Karan Kapoor",
    avatar: "KK",
    zone: "Central Delhi",
    locality: "Karol Bagh & Patel Nagar",
    reports: 6,
    verified: 6,
    points: 780,
    badgeTier: "Silver",
    badgeTitle: "Silver Active Citizen",
    topContribution: "Pothole identification on market access roads"
  },
  {
    id: "cit-8",
    name: "Simran Kaur",
    avatar: "SK",
    zone: "South Delhi",
    locality: "Vasant Kunj & Masoodpur",
    reports: 4,
    verified: 4,
    points: 520,
    badgeTier: "Bronze",
    badgeTitle: "Bronze Contributor",
    topContribution: "Flagged broken street railings along green belts"
  }
];

function getBadgeDetails(points) {
  if (points >= 1500) {
    return {
      tier: "Diamond",
      icon: "💎",
      title: "Diamond Civic Guardian",
      cssClass: "badge-diamond",
      nextGoal: null,
      pointsToNext: 0,
      color: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE"
    };
  } else if (points >= 1000) {
    return {
      tier: "Gold",
      icon: "🥇",
      title: "Gold Neighborhood Champion",
      cssClass: "badge-gold",
      nextGoal: "Diamond Civic Guardian",
      pointsToNext: 1500 - points,
      color: "#B45309",
      bg: "#FEF3C7",
      border: "#FDE68A"
    };
  } else if (points >= 500) {
    return {
      tier: "Silver",
      icon: "🥈",
      title: "Silver Active Citizen",
      cssClass: "badge-silver",
      nextGoal: "Gold Neighborhood Champion",
      pointsToNext: 1000 - points,
      color: "#475569",
      bg: "#F1F5F9",
      border: "#CBD5E1"
    };
  } else {
    return {
      tier: "Bronze",
      icon: "🥉",
      title: "Bronze Contributor",
      cssClass: "badge-bronze",
      nextGoal: "Silver Active Citizen",
      pointsToNext: 500 - points,
      color: "#92400E",
      bg: "#FFFBEB",
      border: "#FCD34D"
    };
  }
}

function initUserProfile() {
  if (!localStorage.getItem(STORAGE_KEY_USER_PROFILE)) {
    const initialUser = {
      id: "cit-user-me",
      name: "You (Active Citizen)",
      avatar: "YOU",
      zone: "Delhi NCT",
      locality: "Your Delhi Neighborhood",
      reports: 2,
      verified: 1,
      points: 250,
      isCurrentUser: true,
      topContribution: "Verified civic reporter via CivicConnect"
    };
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(initialUser));
  }
}

function getUserProfile() {
  initUserProfile();
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_PROFILE));
    const badge = getBadgeDetails(user.points);
    user.badgeTier = badge.tier;
    user.badgeTitle = badge.title;
    user.badgeDetails = badge;
    return user;
  } catch (e) {
    return {
      id: "cit-user-me",
      name: "You (Active Citizen)",
      avatar: "YOU",
      zone: "Delhi NCT",
      locality: "Your Delhi Neighborhood",
      reports: 1,
      verified: 0,
      points: 100,
      isCurrentUser: true,
      badgeTier: "Bronze",
      badgeTitle: "Bronze Contributor"
    };
  }
}

function rewardUserReport() {
  const user = getUserProfile();
  user.reports = (user.reports || 0) + 1;
  user.points = (user.points || 0) + 100; // 100 pts per verified submission
  localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(user));
  return user;
}

function rewardUserVerification() {
  const user = getUserProfile();
  user.verified = (user.verified || 0) + 1;
  user.points = (user.points || 0) + 150; // 150 pts bonus for resolution confirmation
  localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(user));
  return user;
}

function getFullLeaderboard() {
  let list = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    list = stored ? JSON.parse(stored) : [...DEFAULT_LEADERBOARD];
  } catch (e) {
    list = [...DEFAULT_LEADERBOARD];
  }

  // Inject current user profile
  const user = getUserProfile();
  const withoutUser = list.filter(item => item.id !== "cit-user-me");
  withoutUser.push(user);

  // Sort by points descending
  withoutUser.sort((a, b) => b.points - a.points);

  // Assign ranks
  withoutUser.forEach((item, idx) => {
    item.rank = idx + 1;
    const badge = getBadgeDetails(item.points);
    item.badgeTier = badge.tier;
    item.badgeTitle = badge.title;
    item.badgeDetails = badge;
  });

  return withoutUser;
}

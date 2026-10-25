/**
 * CivicConnect - Municipal Officer Authentication & Role-Based Access Control (RBAC)
 * NCT Delhi Inter-Agency Civic Grid • Team HackX (HackIIITD 2026)
 *
 * Strict boundary enforcement: Each municipal department officer has a unique Officer ID
 * and Security Access Key. Cross-department access is strictly prohibited.
 */

const OFFICER_STORAGE_KEY = "civicconnect_auth_officer";

// Authoritative Directory of Delhi Municipal Officers
const OFFICER_DIRECTORY = {
  mcd: {
    department: "MCD",
    deptFullName: "Municipal Corporation of Delhi",
    allowedPage: "admin-mcd.html",
    themeColor: "#1E40AF",
    badgeLabel: "MCD Zonal Command",
    officers: [
      {
        officerId: "MCD-OFFICER-401",
        aliasId: "MCD-ZONAL-04",
        name: "Insp. Rajesh Sharma",
        designation: "Zonal Sanitation & Street Works Inspector",
        zone: "North Delhi (Civil Lines Zone)",
        jurisdiction: "Colony lanes and interior residential streets under 60 feet width",
        password: "MCD#Lanes2026",
        avatar: "images/citizen-phone.jpg"
      }
    ]
  },
  pwd: {
    department: "PWD",
    deptFullName: "Public Works Department Delhi",
    allowedPage: "admin-pwd.html",
    themeColor: "#B45309",
    badgeLabel: "PWD Highway Command",
    officers: [
      {
        officerId: "PWD-OFFICER-209",
        aliasId: "PWD-NODAL-09",
        name: "Er. Sunita Rao",
        designation: "Superintending Highway & Flyover Engineer",
        zone: "Ring Road & Arterial Corridors Division",
        jurisdiction: "Arterial roads, express avenues, and flyovers 60 feet or wider",
        password: "PWD#Arterial2026",
        avatar: "images/citizen-phone.jpg"
      }
    ]
  },
  djb: {
    department: "DJB",
    deptFullName: "Delhi Jal Board",
    allowedPage: "admin-djb.html",
    themeColor: "#0284C7",
    badgeLabel: "DJB Drainage Ops",
    officers: [
      {
        officerId: "DJB-OFFICER-115",
        aliasId: "DJB-DRAIN-02",
        name: "Er. Amit Verma",
        designation: "Assistant Engineer (Sewerage & Jetting Ops)",
        zone: "Central Drainage & Pumping Station Division",
        jurisdiction: "Underground sewerage pipelines, stormwater trunk drains, and suction machines",
        password: "DJB#Sewers2026",
        avatar: "images/citizen-phone.jpg"
      }
    ]
  },
  dda: {
    department: "DDA",
    deptFullName: "Delhi Development Authority",
    allowedPage: "admin-dda.html",
    themeColor: "#065F46",
    badgeLabel: "DDA Parks & Greens",
    officers: [
      {
        officerId: "DDA-OFFICER-303",
        aliasId: "DDA-HORTI-01",
        name: "Dir. Meenakshi Gupta",
        designation: "Senior Director (Horticulture & Green Belts)",
        zone: "South Delhi District Parks & Biodiversity Belts",
        jurisdiction: "Master plan green zones, district parks, and public commons",
        password: "DDA#Greens2026",
        avatar: "images/citizen-phone.jpg"
      }
    ]
  },
  master: {
    department: "MASTER",
    deptFullName: "NCT Delhi Central Secretariat Control Room",
    allowedPage: "admin.html",
    themeColor: "#0F172A",
    badgeLabel: "Master Control Room",
    officers: [
      {
        officerId: "DELHI-CHIEF-01",
        aliasId: "DELHI-MASTER-01",
        name: "Sh. V. K. Saxena",
        designation: "Chief Central Nodal Officer",
        zone: "Delhi Secretariat (All 12 Delhi NCT Municipal Zones)",
        jurisdiction: "Inter-agency arbitration, cross-departmental SLA enforcement, and central grid telemetry",
        password: "MasterGrid#Delhi2026",
        avatar: "images/citizen-phone.jpg"
      }
    ]
  }
};

/**
 * Authenticates an officer against their designated department credentials.
 */
function authenticateOfficer(deptKey, enteredId, enteredPass) {
  const normDept = (deptKey || "").toLowerCase().trim();
  const deptData = OFFICER_DIRECTORY[normDept];

  if (!deptData) {
    return { success: false, message: "Invalid department selected." };
  }

  const cleanId = (enteredId || "").trim().toUpperCase();
  const cleanPass = (enteredPass || "").trim();

  const matched = deptData.officers.find(o => 
    (o.officerId.toUpperCase() === cleanId || (o.aliasId && o.aliasId.toUpperCase() === cleanId))
  );

  if (!matched) {
    return {
      success: false,
      message: `Officer ID "${enteredId}" is not registered in the ${deptData.deptFullName} registry.`
    };
  }

  // Also support universal demo key "delhigrid2026" for backwards compatibility, plus officer's unique key
  if (matched.password !== cleanPass && cleanPass !== "delhigrid2026") {
    return {
      success: false,
      message: `Invalid Security Access Key for ${matched.name} (${deptData.department}). Please check credentials.`
    };
  }

  // Successful Authentication
  const sessionUser = {
    department: deptData.department,
    deptKey: normDept,
    deptFullName: deptData.deptFullName,
    officerId: matched.officerId,
    officerName: matched.name,
    designation: matched.designation,
    zone: matched.zone,
    jurisdiction: matched.jurisdiction,
    allowedPage: deptData.allowedPage,
    themeColor: deptData.themeColor,
    badgeLabel: deptData.badgeLabel,
    token: "AUTH-" + deptData.department + "-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  sessionStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}

/**
 * Returns the currently authenticated officer from sessionStorage.
 */
function getActiveOfficer() {
  try {
    const raw = sessionStorage.getItem(OFFICER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error parsing officer session:", e);
    return null;
  }
}

/**
 * Enforces role-based access control on department pages.
 * If user is not authorized or attempts cross-department access, triggers alert and redirects.
 */
function enforceOfficerClearance(requiredDepartment) {
  const officer = getActiveOfficer();

  // 1. Not logged in at all
  if (!officer || !officer.department) {
    alert("⛔ Access Denied: Municipal Officer Authentication Required.\n\nPlease log in with your authorized departmental credentials.");
    window.location.replace("admin-login.html?reason=unauthenticated");
    return false;
  }

  // 2. Master Admin has universal oversight clearance
  if (officer.department === "MASTER") {
    return true;
  }

  // 3. Department Specific Boundary Check
  if (requiredDepartment === "MASTER") {
    // A single department officer attempting to access Master Control Room
    alert(`⛔ Restricted Command: Master Control Room\n\nOfficer ${officer.officerName} (${officer.department}) does NOT have Central Secretariat Master clearance.\n\nReturning you to your authorized ${officer.department} Command Portal.`);
    window.location.replace(officer.allowedPage || "admin-mcd.html");
    return false;
  }

  if (officer.department !== requiredDepartment) {
    // Cross-department access violation (e.g. MCD officer opening PWD portal)
    alert(`⛔ Cross-Departmental Boundary Violation!\n\nOfficer: ${officer.officerName} (${officer.officerId})\nDepartment: ${officer.deptFullName} (${officer.department})\n\nAccess to the ${requiredDepartment} Portal is strictly prohibited under NCT Delhi Inter-Agency Protocol.\n\nReturning you to your authorized ${officer.department} command.`);
    window.location.replace(officer.allowedPage || "admin-mcd.html");
    return false;
  }

  return true;
}

/**
 * Clears officer session and logs out.
 */
function logoutOfficer() {
  sessionStorage.removeItem(OFFICER_STORAGE_KEY);
  window.location.href = "admin-login.html?status=logged_out";
}

/**
 * Renders the official Security Clearance Banner with locked boundary indicators.
 */
function renderSecurityClearanceBar(containerId, activeDept) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const officer = getActiveOfficer();
  if (!officer) return;

  const isMaster = officer.department === "MASTER";

  const depts = [
    { key: "mcd", label: "MCD Command", dept: "MCD", page: "admin-mcd.html" },
    { key: "pwd", label: "PWD Command", dept: "PWD", page: "admin-pwd.html" },
    { key: "djb", label: "DJB Command", dept: "DJB", page: "admin-djb.html" },
    { key: "dda", label: "DDA Command", dept: "DDA", page: "admin-dda.html" },
    { key: "master", label: "Master Grid", dept: "MASTER", page: "admin.html" }
  ];

  let pillsHtml = depts.map(d => {
    const isCurrentPage = d.dept === activeDept;
    const isAuthorized = isMaster || (officer.department === d.dept);

    if (isCurrentPage) {
      return `
        <span class="clearance-pill active" title="Active Departmental Session">
          <span class="status-pulse-dot"></span>
          <strong>${d.label}</strong> (Active)
        </span>
      `;
    } else if (isAuthorized) {
      return `
        <a href="${d.page}" class="clearance-pill authorized" title="Authorized Access">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          ${d.label}
        </a>
      `;
    } else {
      return `
        <button type="button" class="clearance-pill locked" onclick="showLockedAlert('${d.dept}', '${d.label}')" title="Cross-Department Access Prohibited">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          ${d.label} <span class="badge-locked">LOCKED</span>
        </button>
      `;
    }
  }).join("");

  container.innerHTML = `
    <div class="officer-clearance-bar">
      <div class="clearance-info">
        <div class="clearance-badge-shield">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div>
          <div class="clearance-title">
            <strong>${officer.officerName}</strong> &bull; <span class="officer-id-tag">${officer.officerId}</span>
          </div>
          <div class="clearance-sub">
            ${officer.designation} &bull; ${officer.zone}
          </div>
        </div>
      </div>

      <div class="clearance-pills-row">
        <span class="clearance-label">Jurisdiction Boundaries:</span>
        ${pillsHtml}
      </div>

      <div class="clearance-actions">
        <button type="button" class="btn-clearance-logout" onclick="logoutOfficer()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout Officer
        </button>
      </div>
    </div>
  `;
}

/**
 * Interactive notification when an officer clicks another department's locked pill.
 */
function showLockedAlert(deptCode, deptLabel) {
  const officer = getActiveOfficer();
  const currentDept = officer ? officer.department : "Unknown";
  alert(`🔒 ACCESS DENIED - INTER-AGENCY BOUNDARY RESTRICTION\n\nTarget Portal: ${deptLabel} (${deptCode})\nYour Active Clearance: ${currentDept} Command (${officer ? officer.officerId : ''})\n\nReason: Under Delhi NCT Municipal Protocol, an officer assigned to ${currentDept} is legally restricted from inspecting or altering the ticket queues of ${deptCode}.\n\nPlease contact the Chief Central Secretary (DELHI-CHIEF-01) for inter-agency escalation.`);
}

window.civicOfficerAuth = {
  OFFICER_DIRECTORY,
  authenticateOfficer,
  getActiveOfficer,
  enforceOfficerClearance,
  logoutOfficer,
  renderSecurityClearanceBar,
  showLockedAlert
};

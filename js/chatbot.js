/**
 * TinyFish Help Chatbot with Official TinyFish Branding
 * CivicConnect - Delhi Civic Grievance Platform
 * Plain JS, in-session history, keyword matching, strictly site content
 */

(function () {
  const SESSION_STORAGE_CHAT = "civicconnect_chat_history";

  // Knowledge Base mapping to platform features
  const KB = {
    reporting: {
      title: "Reporting an Issue",
      text: "To report an issue: 1. Take or upload a photo of the hazard. 2. Select the category (pothole, drain, garbage, damaged infrastructure). 3. Allow your live Delhi GPS location pin. 4. Select road type (<60ft, ≥60ft, sewer, park) for auto-routing to MCD, PWD, DJB, or DDA. 5. Click Submit to launch the autonomous TinyFish agent.",
      linkText: "Go to Report Page",
      linkUrl: "report.html"
    },
    agency: {
      title: "Civic Jurisdiction Routing",
      text: "Jurisdiction is routed strictly by Delhi asset classifications:<br>• <strong>Lanes &lt;60ft</strong> = MCD (Municipal Corporation of Delhi)<br>• <strong>Roads &ge;60ft</strong> = PWD (Public Works Department)<br>• <strong>Sewers &amp; drains</strong> = DJB (Delhi Jal Board)<br>• <strong>Parks &amp; green belts</strong> = DDA (Delhi Development Authority).",
      linkText: "Test Auto-Routing on Report Page",
      linkUrl: "report.html"
    },
    tracking: {
      title: "Tracking Complaints",
      text: "You can track any grievance using your Reference ID (e.g., CC-DEL-2026-XXXXX) on the Track page. It shows an end-to-end timeline: Filed &rarr; Assigned &rarr; In Progress &rarr; Repaired &rarr; Verified &rarr; Closed. You can also view status on the live Delhi map with red, yellow, and green indicators.",
      linkText: "Track Your Grievance",
      linkUrl: "track.html"
    },
    leaderboard: {
      title: "Citizen Leaderboard & Badges",
      text: "Delhi citizens earn Civic Points and prestigious community badges by reporting and verifying neighborhood hazards:<br>• <strong>💎 Diamond Civic Guardian:</strong> 1,500+ pts (15+ verified reports)<br>• <strong>🥇 Gold Champion:</strong> 1,000–1,499 pts (10+ verified reports)<br>• <strong>🥈 Silver Active Citizen:</strong> 500–999 pts (5+ verified reports)<br>• <strong>🥉 Bronze Contributor:</strong> 100–499 pts (1+ verified reports)<br><br>You get <strong>+100 points</strong> per reported grievance and <strong>+150 bonus points</strong> for resolution verification!",
      linkText: "View Delhi Citizen Leaderboard",
      linkUrl: "leaderboard.html"
    },
    verification: {
      title: "AI Accountability Verification",
      text: "Verification prevents fake closures using our AI Accountability Wall: The field engineer submits an 'after' photo. A canvas pixel-similarity comparison checks the before/after match. <strong>85% or more passes</strong> and officially verifies resolution; below 85% is rejected as a fake closure.",
      linkText: "Open Verify Resolution",
      linkUrl: "verify.html"
    },
    admin: {
      title: "Government Municipal Officer Portals",
      text: "Municipal personnel from MCD, PWD, DJB, and DDA log in with their unique Officer Employee ID and secret access key. Each officer has distinct departmental authority, and cross-departmental access is strictly locked under NCT Delhi Inter-Agency Boundary Protocol.",
      linkText: "Open Municipal Officer Login",
      linkUrl: "admin-login.html"
    },
    map: {
      title: "Delhi Map Indicator Colors",
      text: "Our Delhi civic map displays live status using 3 color pins:<br>• <strong>Red:</strong> Issue Not Solved / Open (Pending acknowledgment)<br>• <strong>Yellow:</strong> Work in Process / Active repair team deployed<br>• <strong>Green:</strong> Issue Solved &amp; AI-Verified Resolution.",
      linkText: "View Live Map on Track Page",
      linkUrl: "track.html"
    },
    tinyfish: {
      title: "What is TinyFish?",
      text: "TinyFish Web Agents are autonomous browser agents that auto-fill official municipal grievance portals (MCD 311, PWD Delhi, DJB, DDA), extract official reference IDs, bypass portal bureaucracy, and monitor resolution status 24/7.",
      linkText: "Report an Issue via TinyFish",
      linkUrl: "report.html"
    },
    fallback: {
      text: "I can help with reporting issues, agency routing, tracking complaints, live Delhi map indicators, citizen leaderboard badges, and AI verification."
    },
    outside: {
      text: "I am specifically designed to assist with CivicConnect's Delhi grievance platform. I cannot assist with outside topics. I can help with reporting, routing, tracking, leaderboard badges, and verification."
    }
  };

  // Initialize Chat UI
  function initChatUI() {
    if (document.getElementById("tinyfishChatLauncher")) return;

    // Chat Launcher Button with TinyFish Orange Fish & Online Dot
    const launcher = document.createElement("button");
    launcher.id = "tinyfishChatLauncher";
    launcher.className = "chat-launcher-btn";
    launcher.setAttribute("aria-label", "Open TinyFish AI Civic Agent");
    launcher.innerHTML = `
      <img src="images/tinyfish-mascot.png" alt="TinyFish Mascot" class="chat-launcher-mascot-img">
      <span class="chat-launcher-status-dot"></span>
    `;

    // Chat Window with TinyFish Logo in header and clear name
    const win = document.createElement("div");
    win.id = "tinyfishChatWindow";
    win.className = "chat-window";
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-title-group">
          <div class="chat-header-mascot-box">
            <img src="images/tinyfish-mascot.png" alt="TinyFish Mascot" class="chat-header-mascot-img">
          </div>
          <div class="chat-name-block">
            <div class="chat-agent-title">TinyFish Assistant</div>
            <div class="chat-agent-subtitle"><span class="chat-online-dot"></span> Online &bull; Delhi Civic Guide</div>
          </div>
        </div>
        <button id="tinyfishCloseBtn" class="chat-close-btn" aria-label="Close Chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div id="tinyfishMessages" class="chat-messages"></div>
      <form id="tinyfishForm" class="chat-input-bar">
        <input type="text" id="tinyfishInput" class="chat-input" placeholder="Ask TinyFish about reporting, badges, tracking..." autocomplete="off">
        <button type="submit" class="chat-send-btn">Send</button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(win);

    launcher.addEventListener("click", toggleChat);
    document.getElementById("tinyfishCloseBtn").addEventListener("click", toggleChat);

    const form = document.getElementById("tinyfishForm");
    form.addEventListener("submit", handleUserSubmit);

    loadHistory();
  }

  function toggleChat() {
    const win = document.getElementById("tinyfishChatWindow");
    if (!win) return;
    win.classList.toggle("open");
    if (win.classList.contains("open")) {
      scrollBottom();
      const input = document.getElementById("tinyfishInput");
      if (input) input.focus();
    }
  }

  function scrollBottom() {
    const container = document.getElementById("tinyfishMessages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function loadHistory() {
    const history = getSessionHistory();
    const container = document.getElementById("tinyfishMessages");
    container.innerHTML = "";

    if (history.length === 0) {
      addMessageToDOM("bot", "Hello! I am the <strong>TinyFish AI Civic Agent</strong>. I help Delhi residents report civic issues, track real-time resolution on the Delhi map, earn <strong>Diamond &amp; Gold badges</strong> on the Citizen Leaderboard, and navigate municipal jurisdictions (MCD, PWD, DJB, DDA).", false);
    } else {
      history.forEach(m => {
        addMessageToDOM(m.sender, m.text, false);
      });
    }
    scrollBottom();
  }

  function getSessionHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_CHAT)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveMessageToSession(sender, text) {
    const history = getSessionHistory();
    history.push({ sender, text });
    sessionStorage.setItem(SESSION_STORAGE_CHAT, JSON.stringify(history));
  }

  function addMessageToDOM(sender, htmlContent, save = true) {
    const container = document.getElementById("tinyfishMessages");
    const wrapper = document.createElement("div");
    wrapper.className = `chat-msg-wrapper ${sender}-wrapper`;

    if (sender === "bot") {
      wrapper.innerHTML = `
        <div class="chat-msg-fish-avatar">
          <img src="images/tinyfish-mascot.png" alt="TinyFish" class="chat-avatar-fish-img">
        </div>
        <div class="chat-msg bot">
          <div class="chat-sender-name">TinyFish Agent</div>
          <div class="chat-msg-body">${htmlContent}</div>
        </div>
      `;
    } else {
      wrapper.innerHTML = `
        <div class="chat-msg user">
          <div class="chat-msg-body">${htmlContent}</div>
        </div>
      `;
    }

    container.appendChild(wrapper);
    scrollBottom();

    if (save) {
      saveMessageToSession(sender, htmlContent);
    }
  }

  function showTypingIndicator() {
    const container = document.getElementById("tinyfishMessages");
    const typingWrapper = document.createElement("div");
    typingWrapper.id = "tinyfishTyping";
    typingWrapper.className = "chat-msg-wrapper bot-wrapper";
    typingWrapper.innerHTML = `
      <div class="chat-msg-fish-avatar">
        <img src="images/tinyfish-mascot.png" alt="TinyFish" class="chat-avatar-fish-img">
      </div>
      <div class="chat-msg bot">
        <div class="chat-sender-name">TinyFish Agent is typing...</div>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    container.appendChild(typingWrapper);
    scrollBottom();
  }

  function removeTypingIndicator() {
    const typing = document.getElementById("tinyfishTyping");
    if (typing) typing.remove();
  }

  function handleUserSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("tinyfishInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleUserQuery(text);
  }

  function handleUserQuery(userText, directKey = null) {
    addMessageToDOM("user", escapeHTML(userText), true);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      let responseKey = directKey || matchKeyword(userText);
      let replyHtml = "";

      if (responseKey && KB[responseKey]) {
        const item = KB[responseKey];
        replyHtml = item.text;
        if (item.linkUrl && item.linkText) {
          replyHtml += `<br><br><a href="${item.linkUrl}">${item.linkText} &rarr;</a>`;
        }
      } else if (responseKey === "outside") {
        replyHtml = KB.outside.text;
      } else {
        replyHtml = KB.fallback.text;
      }

      addMessageToDOM("bot", replyHtml, true);
    }, 400);
  }

  function matchKeyword(text) {
    const lower = text.toLowerCase();

    const outsideWords = ["weather", "cricket", "movie", "recipe", "bitcoin", "crypto", "joke", "song", "president", "election", "price", "pricing"];
    for (const w of outsideWords) {
      if (lower.includes(w)) {
        return "outside";
      }
    }

    if (
      lower.includes("leaderboard") ||
      lower.includes("badge") ||
      lower.includes("diamond") ||
      lower.includes("gold") ||
      lower.includes("silver") ||
      lower.includes("bronze") ||
      lower.includes("rank") ||
      lower.includes("score") ||
      lower.includes("points") ||
      lower.includes("citizen")
    ) {
      return "leaderboard";
    }

    if (
      lower.includes("report") ||
      lower.includes("lodge") ||
      lower.includes("file") ||
      lower.includes("submit") ||
      lower.includes("pothole") ||
      lower.includes("garbage") ||
      lower.includes("broken") ||
      lower.includes("hazard")
    ) {
      return "reporting";
    }

    if (
      lower.includes("agency") ||
      lower.includes("jurisdiction") ||
      lower.includes("mcd") ||
      lower.includes("pwd") ||
      lower.includes("djb") ||
      lower.includes("dda") ||
      lower.includes("who handles") ||
      lower.includes("road") ||
      lower.includes("60ft") ||
      lower.includes("sewer") ||
      lower.includes("park")
    ) {
      return "agency";
    }

    if (
      lower.includes("map") ||
      lower.includes("color") ||
      lower.includes("red") ||
      lower.includes("yellow") ||
      lower.includes("green") ||
      lower.includes("pin")
    ) {
      return "map";
    }

    if (
      lower.includes("admin") ||
      lower.includes("govt") ||
      lower.includes("government") ||
      lower.includes("officer") ||
      lower.includes("nodal") ||
      lower.includes("control room")
    ) {
      return "admin";
    }

    if (
      lower.includes("track") ||
      lower.includes("status") ||
      lower.includes("reference") ||
      lower.includes("check") ||
      lower.includes("where is")
    ) {
      return "tracking";
    }

    if (
      lower.includes("verify") ||
      lower.includes("verification") ||
      lower.includes("otp") ||
      lower.includes("85") ||
      lower.includes("pixel") ||
      lower.includes("fake") ||
      lower.includes("boots photo")
    ) {
      return "verification";
    }

    if (
      lower.includes("tinyfish") ||
      lower.includes("agent") ||
      lower.includes("bot") ||
      lower.includes("automated") ||
      lower.includes("what is")
    ) {
      return "tinyfish";
    }

    return "fallback";
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatUI);
  } else {
    initChatUI();
  }
})();
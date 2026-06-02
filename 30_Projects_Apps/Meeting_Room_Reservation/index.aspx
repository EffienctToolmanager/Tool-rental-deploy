<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GEV Workspace | Shared Calendar</title>
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    /* --- GEV SYSTEM STANDARD: WHITE & EVERGREEN --- */
    :root {
      --primary: #054141; /* GEV Evergreen */
      --primary-hover: #0a5c5c;
      --primary-light: #e6f2f2;
      --bg-white: #ffffff;
      --bg-light: #f8fafc;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #cbd5e1;
      
      --status-vacant: #047857; /* Rich Emerald */
      --status-vacant-bg: #ecfdf5;
      --status-occupied: #be123c; /* Rich Crimson */
      --status-occupied-bg: #fff1f2;
      --accent: #b45309; /* Deep Amber for blocks/locks */
      --accent-light: #fef3c7;
      
      --font-main: 'Outfit', sans-serif;
      --font-mono: 'Roboto Mono', monospace;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: var(--font-main);
      -webkit-font-smoothing: antialiased;
    }
    
    body {
      background-color: var(--bg-light);
      color: var(--text-main);
      min-height: 100vh;
      padding-bottom: 4rem;
    }
    
    /* --- MINIMALIST HEADER --- */
    header {
      background: var(--bg-white);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .brand-logo {
      background: var(--primary);
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--bg-white);
      font-size: 1.1rem;
    }
    
    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.02em;
    }
    
    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .system-clock {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-light);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      border: 1px solid rgba(5, 65, 65, 0.15);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .sync-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--status-vacant);
      background: var(--status-vacant-bg);
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid rgba(4, 120, 87, 0.15);
    }
    
    .sync-dot {
      width: 8px;
      height: 8px;
      background-color: var(--status-vacant);
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(4, 120, 87, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(4, 120, 87, 0); }
    }
    
    /* --- CONTAINER & TWO-TRACK GRID --- */
    .container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .rooms-pair-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    @media (max-width: 1024px) {
      .rooms-pair-grid {
        grid-template-columns: 1fr;
      }
    }
    
    /* --- CARD STYLE --- */
    .card {
      background: var(--bg-white);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .room-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary-light);
      padding-bottom: 1rem;
    }
    
    .room-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary);
    }
    
    .room-capacity {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-top: 0.15rem;
    }
    
    .room-live-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .vacant-badge {
      background: var(--status-vacant-bg);
      color: var(--status-vacant);
      border: 1px solid rgba(4, 120, 87, 0.2);
    }
    
    .occupied-badge {
      background: var(--status-occupied-bg);
      color: var(--status-occupied);
      border: 1px solid rgba(190, 18, 60, 0.2);
    }
    
    .blocked-badge {
      background: var(--accent-light);
      color: var(--accent);
      border: 1px solid rgba(180, 83, 9, 0.2);
    }
    
    /* --- CALENDAR COMPONENT --- */
    .calendar-container {
      background: var(--bg-light);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 1rem;
    }
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .calendar-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--primary);
    }
    
    .calendar-btn-group {
      display: flex;
      gap: 0.35rem;
    }
    
    .btn-icon {
      background: var(--bg-white);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 0.8rem;
    }
    
    .btn-icon:hover {
      background: var(--primary-light);
      color: var(--primary);
      border-color: var(--primary);
    }
    
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }
    
    .weekday-header {
      text-align: center;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      padding: 0.35rem 0;
      letter-spacing: 0.05em;
    }
    
    .calendar-day {
      background: var(--bg-white);
      border: 1px solid var(--border-color);
      min-height: 52px;
      border-radius: 6px;
      padding: 0.25rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s;
    }
    
    .calendar-day:hover {
      border-color: var(--primary);
      background-color: var(--primary-light);
    }
    
    .calendar-day.empty {
      background: var(--bg-light);
      cursor: default;
      border-color: transparent;
      opacity: 0.3;
    }
    
    .calendar-day.selected {
      border-color: var(--primary);
      background-color: var(--primary-light);
      box-shadow: inset 0 0 0 1px var(--primary);
    }
    
    .day-num {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .calendar-day.today .day-num {
      background: var(--primary);
      color: var(--bg-white);
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .day-indicator-dots {
      display: flex;
      gap: 2px;
      justify-content: center;
      width: 100%;
      height: 6px;
      margin-top: 0.15rem;
    }
    
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .dot.vacant { background: var(--status-vacant); }
    .dot.occupied { background: var(--status-occupied); }
    .dot.blocked { background: var(--accent); }
    
    /* --- HOURLY TIMETABLE SECTION --- */
    .timetable-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .selected-date-label {
      color: var(--primary);
      font-weight: 800;
    }
    
    .hourly-timeline {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-light);
    }
    
    .hourly-row {
      display: grid;
      grid-template-columns: 75px 1fr;
      border-bottom: 1px solid var(--border-color);
      min-height: 40px;
      cursor: pointer;
      transition: background 0.15s;
    }
    
    .hourly-row:last-child {
      border-bottom: none;
    }
    
    .hourly-row:hover {
      background: var(--primary-light);
    }
    
    .hour-time-label {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      border-right: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
    }
    
    .hour-status-content {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }
    
    .status-free {
      color: var(--status-vacant);
    }
    
    .status-reserved {
      color: var(--status-occupied);
    }
    
    .status-blocked {
      color: var(--accent);
    }
    
    /* --- BUTTONS --- */
    .btn {
      background: var(--primary);
      color: var(--bg-white);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }
    
    .btn:hover {
      background: var(--primary-hover);
    }
    
    .btn-sm {
      padding: 0.3rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 4px;
    }
    
    .btn-secondary {
      background: var(--bg-light);
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }
    
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    
    .btn-danger {
      background: var(--rose);
      color: var(--bg-white);
    }
    
    .btn-danger:hover {
      background: #be123c;
    }
    
    /* --- MODAL DIALOG --- */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }
    
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    
    .modal {
      background: var(--bg-white);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      width: 100%;
      max-width: 450px;
      padding: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      transform: translateY(20px);
      transition: transform 0.25s;
    }
    
    .modal-overlay.active .modal {
      transform: translateY(0);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .modal-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--primary);
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .form-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.9rem;
      color: var(--text-main);
      outline: none;
      transition: border-color 0.2s;
    }
    
    .form-input:focus {
      border-color: var(--primary);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
  </style>
</head>
<body>

  <!-- MINIMALIST HEADER -->
  <header>
    <div class="brand">
      <div class="brand-logo"><i class="fa-solid fa-calendar-check"></i></div>
      <div>
        <h1 class="brand-title">GEV Shared Calendar</h1>
        <span class="brand-subtitle">Corporate Assets Hub</span>
      </div>
    </div>
    
    <div class="header-controls">
      <div class="system-clock" id="system-clock">
        <span id="system-clock-span"><i class="fa-solid fa-clock"></i> Live Clock</span>
      </div>
      <div class="sync-badge">
        <div class="sync-dot"></div>
        <span>Sync Status: Live</span>
      </div>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="container">
    <div class="rooms-pair-grid">
      
      <!-- ROOM 1 (BIGGER) TRACK -->
      <section class="card" id="room-card-1">
        <div class="room-header">
          <div>
            <h2 class="room-title">Room 1 (Bigger)</h2>
            <span class="room-capacity"><i class="fa-solid fa-users"></i> Boardroom (Up to 12 people)</span>
          </div>
          <span class="room-live-badge vacant-badge" id="live-badge-1">Vacant</span>
        </div>
        
        <!-- Calendar Grid -->
        <div class="calendar-container">
          <div class="calendar-header">
            <h3 id="cal-title-1" class="calendar-title">June 2026</h3>
            <div class="calendar-btn-group">
              <button class="btn-icon" onclick="changeMonth(1, -1)"><i class="fa-solid fa-chevron-left"></i></button>
              <button class="btn-icon" onclick="changeMonth(1, 1)"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="weekday-header">Sun</div>
            <div class="weekday-header">Mon</div>
            <div class="weekday-header">Tue</div>
            <div class="weekday-header">Wed</div>
            <div class="weekday-header">Thu</div>
            <div class="weekday-header">Fri</div>
            <div class="weekday-header">Sat</div>
          </div>
          <div id="calendar-days-1" class="calendar-grid"></div>
        </div>
        
        <!-- Hourly Timetable accordion -->
        <div class="timetable-section">
          <div class="card-title">
            <span id="selected-date-label-1" class="selected-date-label">June 1, 2026</span>
            <button class="btn btn-sm" onclick="openBookingModal(1)"><i class="fa-solid fa-plus"></i> Reserve</button>
          </div>
          <div id="hourly-timeline-1" class="hourly-timeline"></div>
        </div>
      </section>

      <!-- ROOM 2 (SMALLER) TRACK -->
      <section class="card" id="room-card-2">
        <div class="room-header">
          <div>
            <h2 class="room-title">Room 2 (Smaller)</h2>
            <span class="room-capacity"><i class="fa-solid fa-users"></i> Annex (Up to 6 people)</span>
          </div>
          <span class="room-live-badge vacant-badge" id="live-badge-2">Vacant</span>
        </div>
        
        <!-- Calendar Grid -->
        <div class="calendar-container">
          <div class="calendar-header">
            <h3 id="cal-title-2" class="calendar-title">June 2026</h3>
            <div class="calendar-btn-group">
              <button class="btn-icon" onclick="changeMonth(2, -1)"><i class="fa-solid fa-chevron-left"></i></button>
              <button class="btn-icon" onclick="changeMonth(2, 1)"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="weekday-header">Sun</div>
            <div class="weekday-header">Mon</div>
            <div class="weekday-header">Tue</div>
            <div class="weekday-header">Wed</div>
            <div class="weekday-header">Thu</div>
            <div class="weekday-header">Fri</div>
            <div class="weekday-header">Sat</div>
          </div>
          <div id="calendar-days-2" class="calendar-grid"></div>
        </div>
        
        <!-- Hourly Timetable accordion -->
        <div class="timetable-section">
          <div class="card-title">
            <span id="selected-date-label-2" class="selected-date-label">June 1, 2026</span>
            <button class="btn btn-sm" onclick="openBookingModal(2)"><i class="fa-solid fa-plus"></i> Reserve</button>
          </div>
          <div id="hourly-timeline-2" class="hourly-timeline"></div>
        </div>
      </section>

    </div>
  </main>

  <!-- BOOKING MODAL -->
  <div id="booking-modal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-heading" class="modal-title">New Booking</h3>
        <button class="btn-icon" onclick="closeBookingModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <form id="booking-form" onsubmit="handleFormSubmit(event)">
        <input type="hidden" id="edit-id">
        <input type="hidden" id="booking-room">
        
        <div class="form-group">
          <label class="form-label">Selected Room</label>
          <input type="text" id="booking-room-display" class="form-input" disabled style="background: var(--primary-light); color: var(--primary); font-weight: 700;">
        </div>

        <div class="form-group">
          <label class="form-label" for="booking-title">Title / Subject</label>
          <input type="text" id="booking-title" class="form-input" required placeholder="e.g. Design Review">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="booking-organizer">Organizer</label>
            <input type="text" id="booking-organizer" class="form-input" required placeholder="Your Name">
          </div>
          
          <div class="form-group">
            <label class="form-label" for="booking-dept">Department</label>
            <select id="booking-dept" class="form-input" required>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Planning">Planning</option>
              <option value="QA">QA</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="booking-start">Start Time</label>
            <input type="time" id="booking-start" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="booking-end">End Time</label>
            <input type="time" id="booking-end" class="form-input" required>
          </div>
        </div>
        
        <div class="modal-footer">
          <div>
            <button type="button" id="delete-btn" class="btn btn-danger" style="display: none;" onclick="handleDelete()"><i class="fa-solid fa-trash"></i> Remove</button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
            <button type="submit" class="btn"><i class="fa-solid fa-check"></i> Confirm</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- CORE LOGIC: LIGHTWEIGHT OCC SYNC ENGINE -->
  <script>
    // --- STATE MANAGEMENT ---
    const state = {
      currentViewDate1: new Date(),
      currentViewDate2: new Date(),
      selectedDate1: new Date(),
      selectedDate2: new Date(),
      reservations: [],
      lastUpdated: ""
    };
    
    // Check if running inside SharePoint
    const isSharePoint = window.location.href.includes('/sites/') || window.location.href.includes('.sharepoint.com') || window.location.href.includes('/personal/');
    
    // Dynamic SharePoint Site & Folder Detection
    let spSiteUrl = "/sites/NSEAResourceTeam"; // fallback default
    let spFolderPath = "/sites/NSEAResourceTeam/Shared Documents/Meeting Room Reservation"; // fallback default

    if (isSharePoint) {
      try {
        const urlObj = new URL(window.location.href);
        const pathParts = urlObj.pathname.split('/');
        
        // Find /sites/ or /personal/ in the path to get the site root
        const siteTypeIdx = pathParts.findIndex(p => {
          const lp = p.toLowerCase();
          return lp === 'sites' || lp === 'personal';
        });
        
        if (siteTypeIdx !== -1 && pathParts.length > siteTypeIdx + 1) {
          spSiteUrl = '/' + pathParts[siteTypeIdx] + '/' + pathParts[siteTypeIdx + 1];
          
          // Decode URL path and locate the folder containing this index.html file
          const decodedPath = decodeURIComponent(urlObj.pathname);
          const lastSlashIdx = decodedPath.lastIndexOf('/');
          if (lastSlashIdx !== -1) {
            spFolderPath = decodedPath.substring(0, lastSlashIdx);
          }
        }
      } catch (err) {
        console.error("Error parsing dynamic SharePoint path:", err);
      }
    }
    
    // --- INITIALIZATION ---
    window.addEventListener('DOMContentLoaded', async () => {
      await loadFromCache();
      startAutoSyncPoll();
      startRealTimeLoop();
    });
    
    // --- SERVER SYNC OPERATIONS ---
    const KVDB_ENDPOINT = "https://kvdb.io/MNmS98Jp6yU9x8r5XGf3nB/reservations";

    async function loadFromCache() {
      try {
        let reservations = null;
        let incomingVer = "";
        let success = false;
        
        // 1. Try to read from local server or SharePoint directory first
        try {
          const res = await fetch('reservations.json?nocache=' + Date.now());
          if (res.ok) {
            const data = await res.json();
            reservations = data ? data.reservations || [] : [];
            incomingVer = data ? data.lastUpdated || "" : "";
            success = true;
            console.log("🟢 Loaded database from local/SharePoint server.");
          }
        } catch (e) {
          // Local/SharePoint server is offline, proceed to Cloud KVDB fallback
        }
        
        // 2. Try to read from public Cloud Database (KVDB) if local failed
        if (!success) {
          try {
            const res = await fetch(KVDB_ENDPOINT + '?nocache=' + Date.now());
            if (res.ok) {
              const data = await res.json();
              if (data && typeof data === 'object' && 'reservations' in data) {
                reservations = data.reservations;
                incomingVer = data.lastUpdated || "";
              } else {
                reservations = data;
              }
              success = true;
              console.log("🟢 Loaded database from 24/7 cloud fallback.");
            }
          } catch (e) {
            // Cloud KVDB also failed
          }
        }
        
        // 3. Apply changes if fetch was successful, otherwise load from localStorage
        if (success && reservations && Array.isArray(reservations)) {
          state.reservations = reservations;
          state.lastUpdated = incomingVer;
          localStorage.setItem('gev_room_reservations', JSON.stringify(state.reservations));
        } else {
          console.warn("⚠️ All network channels offline/failing. Loading offline local storage cached data.");
          const cached = localStorage.getItem('gev_room_reservations');
          if (cached) {
            state.reservations = JSON.parse(cached);
          }
        }
        
        refreshAllViews();
      } catch (err) {
        console.error("Critical error inside loadFromCache:", err);
      }
    }
    
    async function saveToCache() {
      localStorage.setItem('gev_room_reservations', JSON.stringify(state.reservations));
      
      const payload = {
        lastUpdated: new Date().toISOString(),
        reservations: state.reservations
      };
      
      let saved = false;
      
      // 1. Try to save to SharePoint or local Python server first
      try {
        if (isSharePoint) {
          await saveToSharePoint(state.reservations);
          saved = true;
        } else {
          const response = await fetch('reservations.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            const resData = await response.json();
            state.lastUpdated = resData && resData.lastUpdated ? resData.lastUpdated : payload.lastUpdated;
            console.log("🟢 Saved successfully to local Python server!");
            saved = true;
          }
        }
      } catch (err) {
        // Local server/SharePoint save failed, proceed to Cloud KVDB fallback
      }
      
      // 2. Try to save to 24/7 cloud KVDB database if local save failed
      if (!saved) {
        try {
          const response = await fetch(KVDB_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            state.lastUpdated = payload.lastUpdated;
            console.log("🟢 Saved successfully to 24/7 cloud database fallback!");
            saved = true;
          }
        } catch (err) {
          console.error("Cloud database save failed:", err);
        }
      }
    }

    async function saveToSharePoint(reservations) {
      const digestRes = await fetch(spSiteUrl + '/_api/contextinfo', {
        method: 'POST',
        headers: { 'Accept': 'application/json;odata=verbose' }
      });
      if (!digestRes.ok) throw new Error("SharePoint digest failed");
      const digestData = await digestRes.json();
      const requestDigest = digestData.d.GetContextWebInformation.FormDigestValue;

      const payload = {
        lastUpdated: new Date().toISOString(),
        reservations: reservations
      };

      const uploadUrl = spSiteUrl + `/_api/web/GetFolderByServerRelativeUrl('${spFolderPath}')/Files/Add(url='reservations.json', overwrite=true)`;
      
      await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'X-RequestDigest': requestDigest,
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      state.lastUpdated = payload.lastUpdated;
    }
    
    // --- BACKGROUND BROADCASTING (5s Polling) ---
    function startAutoSyncPoll() {
      setInterval(async () => {
        try {
          let incomingRes = null;
          let incomingVer = "";
          let success = false;
          
          // 1. Poll from local/SharePoint server first
          try {
            const res = await fetch('reservations.json?nocache=' + Date.now());
            if (res.ok) {
              const data = await res.json();
              incomingRes = data ? data.reservations || [] : [];
              incomingVer = data ? data.lastUpdated || "" : "";
              success = true;
            }
          } catch (e) {
            // Local/SharePoint offline
          }
          
          // 2. Poll from Cloud KVDB fallback if local fails
          if (!success) {
            try {
              const res = await fetch(KVDB_ENDPOINT + '?nocache=' + Date.now());
              if (res.ok) {
                const data = await res.json();
                if (data && typeof data === 'object' && 'reservations' in data) {
                  incomingRes = data.reservations;
                  incomingVer = data.lastUpdated || "";
                } else {
                  incomingRes = data;
                }
                success = true;
              }
            } catch (e) {
              // Cloud offline
            }
          }
          
          // 3. Compare and apply only if a network check successfully returned data
          if (success && incomingRes && Array.isArray(incomingRes)) {
            const currentStr = JSON.stringify(state.reservations);
            const incomingStr = JSON.stringify(incomingRes);
            if (currentStr !== incomingStr) {
              state.reservations = incomingRes;
              state.lastUpdated = incomingVer;
              localStorage.setItem('gev_room_reservations', JSON.stringify(state.reservations));
              refreshAllViews();
              console.log("🔄 Real-time cloud sync: Synced latest events!");
            }
          }
        } catch (err) {
          console.warn("Polling synchronization status check failed.");
        }
      }, 5000);
    }
    
    // --- REAL-TIME LIVE BADGE CLOCK LOOP ---
    function startRealTimeLoop() {
      setInterval(() => {
        const now = new Date();
        const baseDateStr = now.toISOString().split('T')[0];
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        document.getElementById('system-clock-span').innerHTML = `<i class="fa-solid fa-clock"></i> ${baseDateStr} ${timeStr}`;
        
        const nowMins = now.getHours() * 60 + now.getMinutes();
        
        evaluateLiveStatus("Room 1 (Bigger)", baseDateStr, nowMins, document.getElementById('live-badge-1'));
        evaluateLiveStatus("Room 2 (Smaller)", baseDateStr, nowMins, document.getElementById('live-badge-2'));
      }, 1000);
    }

    function evaluateLiveStatus(roomName, dateStr, currentMins, badgeEl) {
      const active = state.reservations.find(r => 
        r.roomId === roomName && 
        r.date === dateStr && 
        currentMins >= timeToMinutes(r.startTime) && 
        currentMins < timeToMinutes(r.endTime)
      );

      if (active) {
        badgeEl.innerText = "In Use";
        badgeEl.className = "room-live-badge occupied-badge";
      } else {
        badgeEl.innerText = "Vacant";
        badgeEl.className = "room-live-badge vacant-badge";
      }
    }

    function timeToMinutes(timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    }

    // --- REFRESH VIEWS ---
    function refreshAllViews() {
      renderCalendar(1);
      renderCalendar(2);
      renderHourlyTimeline(1);
      renderHourlyTimeline(2);
    }

    // --- CALENDAR RENDERING ---
    function renderCalendar(roomNum) {
      const currentViewDate = roomNum === 1 ? state.currentViewDate1 : state.currentViewDate2;
      const selectedDate = roomNum === 1 ? state.selectedDate1 : state.selectedDate2;
      
      const year = currentViewDate.getFullYear();
      const month = currentViewDate.getMonth();
      
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      document.getElementById(`cal-title-${roomNum}`).innerText = `${monthNames[month]} ${year}`;
      
      const firstDayIdx = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      
      const container = document.getElementById(`calendar-days-${roomNum}`);
      container.innerHTML = "";
      
      // Empty days before the 1st
      for (let i = 0; i < firstDayIdx; i++) {
        const cell = document.createElement('div');
        cell.className = "calendar-day empty";
        container.appendChild(cell);
      }
      
      const roomName = roomNum === 1 ? "Room 1 (Bigger)" : "Room 2 (Smaller)";
      
      // Render standard month days
      for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.className = "calendar-day";
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Highlight active date selection
        const isSelected = dateStr === selectedDate.toISOString().split('T')[0];
        if (isSelected) cell.classList.add('selected');
        
        // Highlight current today
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        if (isToday) cell.classList.add('today');
        
        cell.onclick = () => selectDate(roomNum, year, month, day);
        
        // Day number
        const numSpan = document.createElement('span');
        numSpan.className = "day-num";
        numSpan.innerText = day;
        cell.appendChild(numSpan);
        
        // Render tiny preview indicators
        const dayRes = state.reservations.filter(r => r.roomId === roomName && r.date === dateStr);
        if (dayRes.length > 0) {
          const dotsContainer = document.createElement('div');
          dotsContainer.className = "day-indicator-dots";
          
          dayRes.forEach(r => {
            const dot = document.createElement('span');
            dot.className = "dot occupied";
            dotsContainer.appendChild(dot);
          });
          
          cell.appendChild(dotsContainer);
        }
        
        container.appendChild(cell);
      }
    }
    
    function changeMonth(roomNum, direction) {
      const currentViewDate = roomNum === 1 ? state.currentViewDate1 : state.currentViewDate2;
      currentViewDate.setMonth(currentViewDate.getMonth() + direction);
      renderCalendar(roomNum);
    }
    
    function selectDate(roomNum, year, month, day) {
      if (roomNum === 1) {
        state.selectedDate1 = new Date(year, month, day);
      } else {
        state.selectedDate2 = new Date(year, month, day);
      }
      renderCalendar(roomNum);
      renderHourlyTimeline(roomNum);
    }
    
    // --- HOURLY TIMETABLE RENDERING ---
    function renderHourlyTimeline(roomNum) {
      const selectedDate = roomNum === 1 ? state.selectedDate1 : state.selectedDate2;
      const dateStr = selectedDate.toISOString().split('T')[0];
      const roomName = roomNum === 1 ? "Room 1 (Bigger)" : "Room 2 (Smaller)";
      
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
      document.getElementById(`selected-date-label-${roomNum}`).innerText = selectedDate.toLocaleDateString('ko-KR', options);
      
      const container = document.getElementById(`hourly-timeline-${roomNum}`);
      container.innerHTML = "";
      
      const dayRes = state.reservations.filter(r => r.roomId === roomName && r.date === dateStr);
      
      // Standard business hours: 09:00 to 20:00 (11 hours)
      for (let hour = 9; hour < 20; hour++) {
        const startTimeStr = `${String(hour).padStart(2, '0')}:00`;
        const endTimeStr = `${String(hour + 1).padStart(2, '0')}:00`;
        
        const row = document.createElement('div');
        row.className = "hourly-row";
        
        // Find if this hour contains any active reservations
        const active = dayRes.find(r => {
          const sMin = timeToMinutes(r.startTime);
          const eMin = timeToMinutes(r.endTime);
          const currentMin = hour * 60;
          return currentMin >= sMin && currentMin < eMin;
        });
        
        let statusHtml = `<span class="status-free"><i class="fa-regular fa-circle-check"></i> Available</span>`;
        if (active) {
          statusHtml = `<span class="status-occupied"><i class="fa-solid fa-user-lock"></i> [${active.dept}] ${active.organizer} - ${active.title}</span>`;
        }
        
        row.innerHTML = `
          <div class="hour-time-label">${startTimeStr}</div>
          <div class="hour-status-content">${statusHtml}</div>
        `;
        
        row.onclick = () => {
          if (active) {
            openBookingModal(roomNum, active);
          } else {
            openBookingModal(roomNum, null, startTimeStr, endTimeStr);
          }
        };
        
        container.appendChild(row);
      }
    }
    
    // --- DIALOG MODAL CONTROLS ---
    function openBookingModal(roomNum, existingRes = null, start = "10:00", end = "11:00") {
      const modal = document.getElementById('booking-modal');
      const form = document.getElementById('booking-form');
      form.reset();
      
      const roomName = roomNum === 1 ? "Room 1 (Bigger)" : "Room 2 (Smaller)";
      document.getElementById('booking-room').value = roomName;
      document.getElementById('booking-room-display').value = roomNum === 1 ? "Room 1 (Evergreen Boardroom)" : "Room 2 (Evergreen Annex)";

      if (existingRes) {
        // Mode: EDIT / DELETE
        document.getElementById('modal-heading').innerText = "Edit Reservation";
        document.getElementById('edit-id').value = existingRes.id;
        document.getElementById('booking-title').value = existingRes.title;
        document.getElementById('booking-organizer').value = existingRes.organizer;
        document.getElementById('booking-dept').value = existingRes.dept;
        document.getElementById('booking-start').value = existingRes.startTime;
        document.getElementById('booking-end').value = existingRes.endTime;
        
        document.getElementById('delete-btn').style.display = "inline-flex";
      } else {
        // Mode: NEW
        document.getElementById('modal-heading').innerText = "Add Reservation";
        document.getElementById('edit-id').value = "";
        document.getElementById('delete-btn').style.display = "none";
        
        // Auto default hour
        document.getElementById('booking-start').value = start;
        document.getElementById('booking-end').value = end;
      }
      
      modal.classList.add('active');
    }
    
    function closeBookingModal() {
      document.getElementById('booking-modal').classList.remove('active');
    }
    
    // --- CREATE, EDIT, DELETE PROCESSORS ---
    async function handleFormSubmit(e) {
      e.preventDefault();
      
      const id = document.getElementById('edit-id').value;
      const title = document.getElementById('booking-title').value;
      const roomId = document.getElementById('booking-room').value;
      const organizer = document.getElementById('booking-organizer').value;
      const dept = document.getElementById('booking-dept').value;
      const startTime = document.getElementById('booking-start').value;
      const endTime = document.getElementById('booking-end').value;
      
      const roomNum = roomId === "Room 1 (Bigger)" ? 1 : 2;
      const selectedDate = roomNum === 1 ? state.selectedDate1 : state.selectedDate2;
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Simple validation: check if start time is before end time
      if (startTime >= endTime) {
        alert("🚨 시작 시간은 종료 시간보다 빨라야 합니다.");
        return;
      }
      
      // Detect time conflict within the same room resource
      const conflicting = state.reservations.some(r => {
        if (r.id === id) return false; // ignore self
        if (r.date !== dateStr) return false;
        if (r.roomId !== roomId) return false;
        
        // Time overlap checker
        return (startTime < r.endTime && endTime > r.startTime);
      });
      
      if (conflicting) {
        alert("🚨 시간대 충돌!\n\n동일한 자원(방)에 겹치는 시간에 이미 등록된 예약이 존재합니다.");
        return;
      }
      
      if (id) {
        // Process EDIT
        const idx = state.reservations.findIndex(r => r.id === id);
        if (idx !== -1) {
          state.reservations[idx] = { id, roomId, title, organizer, dept, date: dateStr, startTime, endTime };
        }
      } else {
        // Process CREATE
        const newRes = {
          id: 'RES-' + Date.now(),
          roomId,
          title,
          organizer,
          dept,
          date: dateStr,
          startTime,
          endTime
        };
        state.reservations.push(newRes);
      }
      
      closeBookingModal();
      refreshAllViews();
      
      // Broadcast immediately
      await saveToCache();
    }
    
    async function handleDelete() {
      const id = document.getElementById('edit-id').value;
      if (!id) return;
      
      if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        state.reservations = state.reservations.filter(r => r.id !== id);
        closeBookingModal();
        refreshAllViews();
        
        // Broadcast immediately
        await saveToCache();
      }
    }
  </script>
</body>
</html>

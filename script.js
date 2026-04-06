// API Configuration
const API_URL = `http://${window.location.hostname}:5000/api`;

// ── DATA (Initial placeholders, will be populated by API) ────────────────────
let leadsData = [];
let visitsData = [];

let bookingsData = [];

let followupsData = [];

const campaignsData = [
  {
    icon: "💬",
    name: "March Launch Offer",
    channel: "WhatsApp",
    audience: "All Leads",
    sent: 420,
    opened: 189,
    replies: 34,
    status: "Active",
    progress: 45,
  },
  {
    icon: "📧",
    name: "2 BHK Exclusive Deal",
    channel: "Email",
    audience: "2 BHK Interest",
    sent: 210,
    opened: 98,
    replies: 18,
    status: "Active",
    progress: 47,
  },
  {
    icon: "📱",
    name: "Weekend Visit Drive",
    channel: "SMS",
    audience: "Warm Leads",
    sent: 310,
    opened: 140,
    replies: 22,
    status: "Active",
    progress: 45,
  },
  {
    icon: "💬",
    name: "Cold Lead Re-engage",
    channel: "WhatsApp",
    audience: "Cold Leads",
    sent: 300,
    opened: 72,
    replies: 9,
    status: "Paused",
    progress: 24,
  },
];

let tasksData = [];

// ── FETCH DATA FROM BACKEND ────────────────────────────────────────────────
async function fetchAllData() {
  await Promise.all([
    fetchLeads(),
    fetchBookings(),
    fetchVisits(),
    fetchFollowups(),
    fetchTasks()
  ]);
}

async function fetchLeads() {
  try {
    const res = await fetch(`${API_URL}/leads`);
    leadsData = await res.json();
    renderLeadsTable();
    updateDashboardStats();
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}

async function fetchBookings() {
  try {
    const res = await fetch(`${API_URL}/bookings`);
    bookingsData = await res.json();
    renderBookingsTable();
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
}

async function fetchVisits() {
  try {
    const res = await fetch(`${API_URL}/visits`);
    visitsData = await res.json();
    renderVisitsTable();
  } catch (error) {
    console.error('Error fetching visits:', error);
  }
}

async function fetchFollowups() {
  try {
    const res = await fetch(`${API_URL}/followups`);
    followupsData = await res.json();
    renderFollowups();
  } catch (error) {
    console.error('Error fetching followups:', error);
  }
}

async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    tasksData = await res.json();
    renderTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function fetchLeads() {
  try {
    const res = await fetch(`${API_URL}/leads`);
    leadsData = await res.json();
    renderLeadsTable();
    updateDashboardStats();
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}

function updateDashboardStats() {
    // Basic dashboard stats update
    const totalLeads = leadsData.length;
    const hotLeads = leadsData.filter(l => l.status === 'Hot').length;
    
    // Update elements if they exist
    const totalEl = document.getElementById("total-leads-stat");
    if(totalEl) totalEl.textContent = totalLeads;
    
    const hotEl = document.getElementById("hot-leads-stat");
    if(hotEl) hotEl.textContent = hotLeads;
}

// ── STATUS CONFIG ──────────────────────────────────────────────────────────
const sC = {
  Hot: { bg: "var(--rose-soft)", fg: "var(--rose)" },
  Warm: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  New: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  Cold: { bg: "#f1f5f9", fg: "var(--text-3)" },
  Scheduled: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  Completed: { bg: "var(--green-soft)", fg: "var(--green)" },
  Cancelled: { bg: "var(--rose-soft)", fg: "var(--rose)" },
  "No-show": { bg: "#f1f5f9", fg: "var(--text-3)" },
  "Agreement Signed": { bg: "var(--green-soft)", fg: "var(--green)" },
  "Agreement Pending": { bg: "var(--amber-soft)", fg: "var(--amber)" },
  "Token Paid": { bg: "var(--accent-soft)", fg: "var(--accent)" },
  Urgent: { bg: "var(--rose-soft)", fg: "var(--rose)" },
  High: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  Medium: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  Low: { bg: "var(--green-soft)", fg: "var(--green)" },
  Active: { bg: "var(--green-soft)", fg: "var(--green)" },
  Paused: { bg: "#f1f5f9", fg: "var(--text-3)" },
};
const pC = {
  Urgent: { bg: "var(--rose-soft)", fg: "var(--rose)" },
  "Follow-up": { bg: "var(--amber-soft)", fg: "var(--amber)" },
  Planned: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  EOD: { bg: "#f1f5f9", fg: "var(--text-3)" },
};

function badge(val) {
  const c = sC[val] || { bg: "#f1f5f9", fg: "var(--text-3)" };
  return `<span class="badge" style="background:${c.bg};color:${c.fg}"><span class="badge-dot" style="background:${c.fg}"></span>${val}</span>`;
}

// ── TOPBAR ACTIONS PER PAGE ──
const topbarActions = {
  dashboard: `<button class="btn btn-ghost" onclick="exportCSV()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export CSV</button><button class="btn btn-primary" onclick="openModal('modal-lead')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Lead</button>`,
  leads: `<button class="btn btn-ghost" onclick="exportCSV()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export CSV</button><button class="btn btn-primary" onclick="openModal('modal-lead')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Lead</button>`,
  visits: `<button class="btn btn-primary" onclick="openModal('modal-visit')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Schedule Visit</button>`,
  bookings: `<button class="btn btn-primary" onclick="openModal('modal-booking')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Booking</button>`,
  analytics: "",
  followups: `<button class="btn btn-primary" onclick="openModal('modal-followup')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Follow-up</button>`,
  campaigns: `<button class="btn btn-primary" onclick="openModal('modal-campaign')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Campaign</button>`,
};
const pageTitle = {
  dashboard: "Dashboard",
  leads: "All Leads",
  visits: "Site Visits",
  bookings: "Bookings",
  analytics: "Analytics",
  followups: "Follow-ups",
  campaigns: "Campaigns",
};

// ── NAVIGATION ─────────────────────────────────────────────────────────────
function goPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.toggle("active", n.dataset.page === id));
  document.getElementById("page-" + id).classList.add("active");
  document.getElementById("topbar-title").textContent = pageTitle[id] || id;
  document.getElementById("topbar-actions").innerHTML = topbarActions[id] || "";
  if (id === "leads") renderLeadsTable();
  if (id === "visits") renderVisitsTable();
  if (id === "bookings") renderBookingsTable();
  if (id === "followups") renderFollowups();
  if (id === "campaigns") renderCampaigns();
  window.scrollTo(0, 0);
}
document
  .querySelectorAll(".nav-item[data-page]")
  .forEach((n) => n.addEventListener("click", () => goPage(n.dataset.page)));

// ── CHIP FILTERS ───────────────────────────────────────────────────────────
let leadStatusFilter = "all";
document.querySelectorAll('.chip[data-group="lead-status"]').forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll('.chip[data-group="lead-status"]')
      .forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    leadStatusFilter = c.dataset.val;
    renderLeadsTable();
  });
});

// ── RENDER: LEADS TABLE ────────────────────────────────────────────────────
function renderLeadsTable() {
  const q = (document.getElementById("leads-search")?.value || "").toLowerCase();
  const bhk = document.getElementById("leads-bhk-filter")?.value || "all";
  const src = document.getElementById("leads-src-filter")?.value || "all";
  let rows = leadsData.filter((l) => {
    if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(q))
      return false;
    if (bhk !== "all" && l.bhk !== bhk) return false;
    if (src !== "all" && l.source !== src) return false;
    if (leadStatusFilter !== "all" && l.status !== leadStatusFilter)
      return false;
    return true;
  });
  
  const leadsSub = document.getElementById("leads-sub");
  if(leadsSub) leadsSub.textContent = `${rows.length} of ${leadsData.length} leads`;
  
  const leadsBadge = document.getElementById("leads-badge");
  if(leadsBadge) leadsBadge.textContent = leadsData.length;
  
  const tb = document.getElementById("leads-tbody");
  if(!tb) return;
  
  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="10"><div class="empty-state"><div class="ei">🔍</div><p>No leads match your filters</p></div></td></tr>';
    return;
  }
  tb.innerHTML = rows
    .map(
      (l, i) => `<tr>
<td style="color:var(--text-3);font-size:12px">${i + 1}</td>
<td><div class="td-name">${l.name}</div><div class="td-sub">${l.email}</div></td>
<td style="color:var(--text-2);font-size:12px">${l.phone}</td>
<td style="font-weight:600">${l.budget}</td>
<td>${l.bhk}</td>
<td><span style="font-size:12px;color:var(--text-2)">${l.source}</span></td>
<td>${badge(l.status)}</td>
<td><span style="font-size:12px;color:var(--text-2)">${l.stage}</span></td>
<td style="font-size:12px;color:var(--text-3)">${l.contacted}</td>
<td><div class="row-acts">
  <button class="btn btn-sm btn-ghost" onclick="openLeadDetail(${leadsData.indexOf(l)})">View</button>
  <button class="btn btn-sm btn-ghost" onclick="toast('📞 Calling ${l.name.replace(/'/g, "\\'")}…')">Call</button>
  <button class="btn btn-sm btn-ghost" onclick="scheduleVisitFor('${l.name.replace(/'/g, "\\'")}','${l.phone}','${l.bhk}')">Visit</button>
</div></td>
</tr>`
    )
    .join("");
}

// ── LEAD DETAIL ────────────────────────────────────────────────────────────
function openLeadDetail(idx) {
  const l = leadsData[idx];
  document.getElementById("mld-name").textContent = l.name;
  document.getElementById("mld-grid").innerHTML = `
<div class="detail-item"><div class="dl">Phone</div><div class="dv">${l.phone}</div></div>
<div class="detail-item"><div class="dl">Email</div><div class="dv">${l.email || '-'}</div></div>
<div class="detail-item"><div class="dl">Budget</div><div class="dv">${l.budget || '-'}</div></div>
<div class="detail-item"><div class="dl">BHK</div><div class="dv">${l.bhk || '-'}</div></div>
<div class="detail-item"><div class="dl">Source</div><div class="dv">${l.source || '-'}</div></div>
<div class="detail-item"><div class="dl">Status</div><div class="dv">${badge(l.status)}</div></div>
<div class="detail-item"><div class="dl">Stage</div><div class="dv">${l.stage || '-'}</div></div>
<div class="detail-item"><div class="dl">Last Contact</div><div class="dv">${l.contacted || '-'}</div></div>
<div class="detail-item" style="grid-column:1/-1"><div class="dl">Notes</div><div class="dv" style="font-weight:400;color:var(--text-2)">${l.notes || '-'}</div></div>`;
  document.getElementById("mld-timeline").innerHTML = `
<div class="tl-item"><div class="tl-dot" style="background:var(--green)"></div><div><div class="tl-text">Lead created</div><div class="tl-time">via ${l.source || 'Manual'}</div></div></div>
<div class="tl-item"><div class="tl-dot" style="background:var(--accent)"></div><div><div class="tl-text">First contact made</div><div class="tl-time">${l.contacted || 'N/A'}</div></div></div>
<div class="tl-item"><div class="tl-dot" style="background:var(--amber)"></div><div><div class="tl-text">Stage: ${l.stage || 'New'}</div><div class="tl-time">Current stage</div></div></div>`;
  document.getElementById("mld-call-btn").onclick = () => {
    toast(`📞 Calling ${l.name}…`);
    closeModal("modal-lead-detail");
  };
  document.getElementById("mld-visit-btn").onclick = () => {
    closeModal("modal-lead-detail");
    scheduleVisitFor(l.name, l.phone, l.bhk);
  };
  document.getElementById("mld-wa-btn").onclick = () => {
    toast(`💬 WhatsApp opened for ${l.name}`);
    closeModal("modal-lead-detail");
  };
  openModal("modal-lead-detail");
}

// ── RENDER: VISITS TABLE ───────────────────────────────────────────────────
function renderVisitsTable() {
  const q = (document.getElementById("visits-search")?.value || "").toLowerCase();
  const sf = document.getElementById("visits-status-filter")?.value || "all";
  let rows = visitsData.filter((v) => {
    if (q && !v.name.toLowerCase().includes(q)) return false;
    if (sf !== "all" && v.status !== sf) return false;
    return true;
  });
  const tb = document.getElementById("visits-tbody");
  if(!tb) return;
  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="9"><div class="empty-state"><div class="ei">🏠</div><p>No visits found</p></div></td></tr>';
    return;
  }
  tb.innerHTML = rows
    .map(
      (v, i) => `<tr>
<td style="color:var(--text-3);font-size:12px">${i + 1}</td>
<td><div class="td-name">${v.name}</div></td>
<td style="color:var(--text-2);font-size:12px">${v.phone}</td>
<td>${v.bhk}</td>
<td style="font-size:12px;color:var(--text-2)">${v.date}</td>
<td style="font-size:12px;font-weight:600">${v.time}</td>
<td style="font-size:12px;color:var(--text-2)">${v.agent}</td>
<td>${badge(v.status)}</td>
<td><div class="row-acts">
  <button class="btn btn-sm btn-ghost" onclick="openVisitDetail(${visitsData.indexOf(v)})">View</button>
  <button class="btn btn-sm btn-ghost" onclick="toast('📞 Calling ${v.name.replace(/'/g, "\\'")}…')">Call</button>
</div></td>
</tr>`
    )
    .join("");
}

async function openVisitDetail(idx) {
  const v = visitsData[idx];
  document.getElementById("mvd-title").textContent = `Visit \u2014 ${v.name}`;
  document.getElementById("mvd-grid").innerHTML = `
<div class="detail-item"><div class="dl">Visitor</div><div class="dv">${v.name}</div></div>
<div class="detail-item"><div class="dl">Phone</div><div class="dv">${v.phone}</div></div>
<div class="detail-item"><div class="dl">BHK</div><div class="dv">${v.bhk}</div></div>
<div class="detail-item"><div class="dl">Status</div><div class="dv">${badge(v.status)}</div></div>
<div class="detail-item"><div class="dl">Date</div><div class="dv">${v.date}</div></div>
<div class="detail-item"><div class="dl">Time</div><div class="dv">${v.time}</div></div>
<div class="detail-item"><div class="dl">Agent</div><div class="dv">${v.agent}</div></div>`;
  document.getElementById("mvd-complete-btn").onclick = async () => {
    try {
      const res = await fetch(`${API_URL}/visits/${v._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "Completed" })
      });
      const updated = await res.json();
      visitsData[idx] = updated;
      renderVisitsTable();
      toast(`✅ ${v.name}'s visit marked Completed`);
      closeModal("modal-visit-detail");
    } catch (e) { toast("⚠️ Update failed"); }
  };
  document.getElementById("mvd-cancel-btn").onclick = async () => {
    try {
      const res = await fetch(`${API_URL}/visits/${v._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "Cancelled" })
      });
      const updated = await res.json();
      visitsData[idx] = updated;
      renderVisitsTable();
      toast(`❌ Visit for ${v.name} cancelled`);
      closeModal("modal-visit-detail");
    } catch (e) { toast("⚠️ Update failed"); }
  };
  document.getElementById("mvd-call-btn").onclick = () =>
    toast(`📞 Calling ${v.name}…`);
  openModal("modal-visit-detail");
}

// ── RENDER: BOOKINGS TABLE ─────────────────────────────────────────────────
function renderBookingsTable() {
  const q = (document.getElementById("bookings-search")?.value || "").toLowerCase();
  const sf = document.getElementById("bookings-status-filter")?.value || "all";
  let rows = bookingsData.filter((b) => {
    if (q && !b.name.toLowerCase().includes(q)) return false;
    if (sf !== "all" && b.status !== sf) return false;
    return true;
  });
  const tb = document.getElementById("bookings-tbody");
  if(!tb) return;
  if (!rows.length) {
    tb.innerHTML =
      '<tr><td colspan="9"><div class="empty-state"><div class="ei">📋</div><p>No bookings found</p></div></td></tr>';
    return;
  }
  tb.innerHTML = rows
    .map(
      (b, i) => `<tr>
<td style="color:var(--text-3);font-size:12px">${i + 1}</td>
<td><div class="td-name">${b.name}</div></td>
<td style="color:var(--text-2);font-size:12px">${b.phone}</td>
<td style="font-size:12px;font-weight:600">${b.unit}</td>
<td style="font-size:12px;color:var(--text-2)">Floor ${b.floor}</td>
<td style="font-weight:700;color:var(--green)">${b.amount}</td>
<td style="font-size:12px;color:var(--text-2)">${b.date}</td>
<td>${badge(b.status)}</td>
<td><div class="row-acts">
  <button class="btn btn-sm btn-ghost" onclick="openBookingDetail(${bookingsData.indexOf(b)})">View</button>
  <button class="btn btn-sm btn-ghost" onclick="toast('📞 Calling ${b.name.replace(/'/g, "\\'")}…')">Call</button>
</div></td>
</tr>`
    )
    .join("");
}

async function openBookingDetail(idx) {
  const b = bookingsData[idx];
  document.getElementById("mbd-title").textContent = `Booking \u2014 ${b.name}`;
  document.getElementById("mbd-grid").innerHTML = `
<div class="detail-item"><div class="dl">Buyer</div><div class="dv">${b.name}</div></div>
<div class="detail-item"><div class="dl">Phone</div><div class="dv">${b.phone}</div></div>
<div class="detail-item"><div class="dl">Unit</div><div class="dv">${b.unit}</div></div>
<div class="detail-item"><div class="dl">Floor</div><div class="dv">${b.floor}</div></div>
<div class="detail-item"><div class="dl">Amount</div><div class="dv" style="color:var(--green)">${b.amount}</div></div>
<div class="detail-item"><div class="dl">Booking Date</div><div class="dv">${b.date}</div></div>
<div class="detail-item"><div class="dl">Status</div><div class="dv">${badge(b.status)}</div></div>`;
  document.getElementById("mbd-sign-btn").onclick = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings/${b._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "Agreement Signed" })
      });
      const updated = await res.json();
      bookingsData[idx] = updated;
      renderBookingsTable();
      toast(`📝 Agreement marked signed for ${b.name}`);
      closeModal("modal-booking-detail");
    } catch (e) { toast("⚠️ Update failed"); }
  };
  document.getElementById("mbd-call-btn").onclick = () =>
    toast(`📞 Calling ${b.name}…`);
  openModal("modal-booking-detail");
}

// ── RENDER: FOLLOW-UPS ─────────────────────────────────────────────────────
function renderFollowups() {
  const pf = document.getElementById("fu-priority-filter")?.value || "all";
  let rows = followupsData.filter((f) => pf === "all" || f.priority === pf);
  const c = sC;
  const fuList = document.getElementById("fu-list");
  if(!fuList) return;
  fuList.innerHTML =
    rows
      .map((f, i) => {
        const pc = c[f.priority] || c.Medium;
        const tc =
          { Call: "📞", WhatsApp: "💬", Email: "📧", "Site Visit": "🏠" }[
            f.type
          ] || "📋";
        return `<div class="fu-item">
<div class="fu-info">
  <div class="fu-name">${f.name}</div>
  <div class="fu-meta">${f.phone} \u00B7 Due: ${f.due} \u00B7 ${tc} ${f.type}</div>
  <div class="fu-meta" style="margin-top:3px;color:var(--text-2)">${f.notes}</div>
</div>
<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
  ${badge(f.priority)}
  <div class="fu-acts">
    <button class="btn btn-sm btn-primary" onclick="toast('${tc} Follow-up initiated for ${f.name.replace(/'/g, "\\'")}')">Do Now</button>
    <button class="btn btn-sm btn-ghost" onclick="followupsData.splice(${followupsData.indexOf(f)},1);renderFollowups();toast('\u2705 Marked done')">Done</button>
  </div>
</div>
</div>`;
      })
      .join("") ||
    '<div class="empty-state"><div class="ei">\uD83C\uDF89</div><p>All follow-ups completed!</p></div>';
}

// ── RENDER: CAMPAIGNS ──────────────────────────────────────────────────────
function renderCampaigns() {
  const chIcons = { WhatsApp: "💬", Email: "📧", SMS: "📱" };
  const campGrid = document.getElementById("camp-grid");
  if(!campGrid) return;
  campGrid.innerHTML = campaignsData
    .map((c, i) => {
      const sc = sC[c.status] || sC.Active;
      const openRate = Math.round((c.opened / c.sent) * 100);
      return `<div class="camp-card">
<div class="camp-icon">${c.icon}</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
  <div class="camp-name">${c.name}</div>
  ${badge(c.status)}
</div>
<div class="camp-meta">${chIcons[c.channel] || "📋"} ${c.channel} \u00B7 ${c.audience}</div>
<div class="camp-stat"><span class="camp-stat-label">Sent</span><span class="camp-stat-val">${c.sent}</span></div>
<div class="camp-stat"><span class="camp-stat-label">Opened</span><span class="camp-stat-val">${c.opened} (${openRate}%)</span></div>
<div class="camp-stat"><span class="camp-stat-label">Replies</span><span class="camp-stat-val">${c.replies}</span></div>
<div class="camp-progress"><div class="camp-bar" style="width:${c.progress}%;background:${sc.fg}"></div></div>
<div style="display:flex;gap:7px;margin-top:12px">
  <button class="btn btn-sm btn-ghost" style="flex:1;justify-content:center" onclick="toast('\uD83D\uDCCA Campaign analytics opened')">Analytics</button>
  <button class="btn btn-sm btn-${c.status === "Active" ? "danger" : "success"}" style="flex:1;justify-content:center" onclick="toggleCampaign(${i})">${c.status === "Active" ? "Pause" : "Resume"}</button>
</div>
</div>`;
    })
    .join("");
}
function toggleCampaign(i) {
  campaignsData[i].status =
    campaignsData[i].status === "Active" ? "Paused" : "Active";
  renderCampaigns();
  toast(
    campaignsData[i].status === "Active"
      ? "\u25B6\uFE0F Campaign resumed"
      : "\u23F8 Campaign paused"
  );
}

// ── TASKS ──────────────────────────────────────────────────────────────────
function renderTasks() {
  const done = tasksData.filter((t) => t.done).length;
  const taskCount = document.getElementById("task-count");
  if(taskCount) taskCount.textContent = `${tasksData.length - done} pending \u00B7 ${done} done`;
  
  const tasksBody = document.getElementById("tasks-body");
  if(!tasksBody) return;
  
  tasksBody.innerHTML =
    tasksData
      .map((t, i) => {
        const pc = t.done
          ? { bg: "var(--green-soft)", fg: "var(--green)" }
          : pC[t.priority] || pC.Planned;
        return `<div class="task-item" onclick="toggleTask(${i})">
<div class="task-check${t.done ? " done" : ""}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
<div class="task-bi">
  <div class="task-name${t.done ? " done" : ""}">${t.name}</div>
  <div class="task-meta"><span class="task-badge" style="background:${pc.bg};color:${pc.fg}">${t.done ? "Done" : t.priority}</span>${t.time}</div>
</div>
</div>`;
      })
      .join("") +
    `<button class="add-task-btn" onclick="event.stopPropagation();openModal('modal-task')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Task</button>`;
}
async function toggleTask(i) {
  const t = tasksData[i];
  try {
    const res = await fetch(`${API_URL}/tasks/${t._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !t.done })
    });
    const updated = await res.json();
    tasksData[i] = updated;
    renderTasks();
    toast(updated.done ? "✅ Task marked done" : "↩️ Task reopened");
  } catch (e) { toast("⚠️ Update failed"); }
}

// ── SAVE FUNCTIONS ─────────────────────────────────────────────────────────
async function saveLead() {
  const name = document.getElementById("fl-name").value.trim();
  const phone = document.getElementById("fl-phone").value.trim();
  if (!name || !phone) {
    toast("\u26A0\uFE0F Name and Phone required");
    return;
  }
  const bv = document.getElementById("fl-budget").value.split("|");
  
  const newLead = {
    name,
    phone,
    email: document.getElementById("fl-email").value,
    budget: bv[0],
    budgetN: parseFloat(bv[1]),
    bhk: document.getElementById("fl-bhk").value,
    status: document.getElementById("fl-status").value,
    source: document.getElementById("fl-source").value,
    stage: document.getElementById("fl-stage").value,
    contacted: "Just now",
    notes: document.getElementById("fl-notes").value,
  };

  try {
      const res = await fetch(`${API_URL}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLead)
      });
      const savedLead = await res.json();
      leadsData.unshift(savedLead);
      closeModal("modal-lead");
      ["fl-name", "fl-phone", "fl-email", "fl-notes"].forEach(
        (id) => (document.getElementById(id).value = "")
      );
      renderLeadsTable();
      updateDashboardStats();
      toast(`\u2705 Lead "${name}" added and saved!`);
  } catch (error) {
      console.error('Error saving lead:', error);
      toast('\u26A0\uFE0F Failed to save lead to database');
  }
}

async function saveVisit() {
  const name = document.getElementById("fv-name").value.trim();
  const phone = document.getElementById("fv-phone").value.trim();
  if (!name || !phone) {
    toast("⚠️ Name and Phone required");
    return;
  }
  const newVisit = {
    name,
    phone,
    bhk: document.getElementById("fv-bhk").value,
    date: document.getElementById("fv-date").value || "TBD",
    time: document.getElementById("fv-time").value,
    agent: document.getElementById("fv-agent").value,
    status: "Scheduled",
  };
  try {
    const res = await fetch(`${API_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVisit)
    });
    const saved = await res.json();
    visitsData.unshift(saved);
    closeModal("modal-visit");
    ["fv-name", "fv-phone"].forEach(id => document.getElementById(id).value = "");
    renderVisitsTable();
    toast(`🏠 Visit scheduled for ${name}!`);
  } catch (e) { toast("⚠️ Save failed"); }
}

function scheduleVisitFor(name, phone, bhk) {
  document.getElementById("fv-name").value = name;
  document.getElementById("fv-phone").value = phone;
  document.getElementById("fv-bhk").value = bhk;
  openModal("modal-visit");
}

async function saveBooking() {
  const name = document.getElementById("fb-name").value.trim();
  const phone = document.getElementById("fb-phone").value.trim();
  if (!name || !phone) {
    toast("⚠️ Name and Phone required");
    return;
  }
  const newBooking = {
    name,
    phone,
    unit: document.getElementById("fb-unit").value,
    floor: document.getElementById("fb-floor").value || "-",
    amount: document.getElementById("fb-amount").value,
    date: document.getElementById("fb-date").value || "Today",
    status: document.getElementById("fb-status").value,
  };
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    const saved = await res.json();
    bookingsData.unshift(saved);
    closeModal("modal-booking");
    ["fb-name", "fb-phone", "fb-floor"].forEach(id => document.getElementById(id).value = "");
    renderBookingsTable();
    toast(`📋 Booking added for ${name}!`);
  } catch (e) { toast("⚠️ Save failed"); }
}

async function saveFollowup() {
  const name = document.getElementById("ffu-name").value.trim();
  if (!name) {
    toast("⚠️ Lead name required");
    return;
  }
  const newFU = {
    name,
    phone: document.getElementById("ffu-phone").value,
    priority: document.getElementById("ffu-priority").value,
    type: document.getElementById("ffu-type").value,
    due: document.getElementById("ffu-date").value || "Today",
    notes: document.getElementById("ffu-notes").value,
  };
  try {
    const res = await fetch(`${API_URL}/followups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFU)
    });
    const saved = await res.json();
    followupsData.unshift(saved);
    closeModal("modal-followup");
    ["ffu-name", "ffu-phone", "ffu-notes"].forEach(id => document.getElementById(id).value = "");
    renderFollowups();
    toast(`📅 Follow-up added for ${name}!`);
  } catch (e) { toast("⚠️ Save failed"); }
}

async function saveTask() {
  const name = document.getElementById("ft-name").value.trim();
  if (!name) {
    toast("⚠️ Task description required");
    return;
  }
  const newTask = {
    name,
    time: document.getElementById("ft-time").value || "Today",
    priority: document.getElementById("ft-priority").value,
    done: false,
  };
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const saved = await res.json();
    tasksData.push(saved);
    closeModal("modal-task");
    document.getElementById("ft-name").value = "";
    document.getElementById("ft-time").value = "";
    renderTasks();
    toast("✅ Task added!");
  } catch (e) { toast("⚠️ Save failed"); }
}

function saveCampaign() {
  const name = document.getElementById("fc-name").value.trim();
  if (!name) {
    toast("\u26A0\uFE0F Campaign name required");
    return;
  }
  campaignsData.unshift({
    icon: "\uD83D\uDCE2",
    name,
    channel: document.getElementById("fc-channel").value,
    audience: document.getElementById("fc-audience").value,
    sent: 0,
    opened: 0,
    replies: 0,
    status: "Active",
    progress: 0,
  });
  closeModal("modal-campaign");
  document.getElementById("fc-name").value = "";
  document.getElementById("fc-msg").value = "";
  renderCampaigns();
  toast(`\uD83D\uDE80 Campaign "${name}" launched!`);
}

// ── EXPORT CSV ─────────────────────────────────────────────────────────────
function exportCSV() {
  const h = [
    "Name",
    "Phone",
    "Email",
    "Budget",
    "BHK",
    "Status",
    "Source",
    "Stage",
    "Last Contacted",
  ];
  const rows = [
    h,
    ...leadsData.map((l) => [
      l.name,
      l.phone,
      l.email,
      l.budget,
      l.bhk,
      l.status,
      l.source,
      l.stage,
      l.contacted,
    ]),
  ];
  const csv = rows
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download =
    "Seabreeze_Leads_" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  toast("\uD83D\uDCE5 CSV exported!");
}

// ── MODALS ─────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
document.querySelectorAll(".modal-overlay").forEach((o) =>
  o.addEventListener("click", (e) => {
    if (e.target === o) o.classList.remove("open");
  })
);

// ── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.getElementById("toast-container").appendChild(el);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => el.classList.add("show"))
  );
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

// ── INIT ───────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    const topbarDate = document.getElementById("topbar-date");
    if(topbarDate) {
        topbarDate.textContent =
          new Date().toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
          });
    }
    
    document.getElementById("topbar-actions").innerHTML = topbarActions.dashboard;
    fetchAllData(); // Fetch everything from backend on init
});

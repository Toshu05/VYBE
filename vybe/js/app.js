/**
 * CampusConnect — Digital Campus Engagement & Promotion Ecosystem
 * Target Institution: ABES Engineering College, Ghaziabad
 * Complete Single-Page Application Client Engine
 */
(function() {
  'use strict';

  var KEY = 'campusconnect_abes_v1';
  var API_BASE = 'http://127.0.0.1:8000';

  var $ = function(sel) { return document.querySelector(sel); };
  var $$ = function(sel) { return document.querySelectorAll(sel); };
  var esc = function(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    });
  };

  var CATS = {
    Technical: ['p1', '#4338CA', 'tech'],
    Cultural: ['p2', '#EA580C', 'cult'],
    Gaming: ['p3', '#10B981', 'game'],
    Sports: ['p4', '#F59E0B', 'sport'],
    Workshop: ['p5', '#7C3AED', 'work'],
    Entrepreneurship: ['p1', '#4338CA', 'ecell'],
    Other: ['p2', '#6366F1', 'other']
  };

  var CHANNELS = {
    standee: { label: 'Physical Standee', icon: '📍', color: '#EA580C' },
    classroom: { label: 'Classroom Visit Slide', icon: '🎓', color: '#4338CA' },
    noticeboard: { label: 'Department Noticeboard', icon: '📌', color: '#D97706' },
    instagram: { label: 'Instagram Story & Post', icon: '📸', color: '#EC4899' },
    whatsapp: { label: 'WhatsApp Broadcast', icon: '💬', color: '#10B981' },
    digital_screen: { label: 'Campus TV Kiosk', icon: '📺', color: '#6366F1' },
    direct: { label: 'Direct Portal Link', icon: '🔗', color: '#64748B' }
  };

  var USERS = {
    student: { id: 'u_student_1', name: 'Aarav Sharma', role: 'student', email: 'aarav.sharma@abes.ac.in', dept: 'CSE', year: 3 },
    rep: { id: 'u_rep_1', name: 'GDSC Core Team', role: 'rep', club: 'Google Developer Student Club (GDSC)', email: 'gdsc@abes.ac.in', dept: 'CSE', year: 4 },
    faculty: { id: 'u_fac_1', name: 'Dr. R.K. Mehta', role: 'faculty', email: 'rk.mehta@abes.ac.in', dept: 'Dean Student Welfare', year: 0 },
    admin: { id: 'u_admin_1', name: 'Campus Operations Admin', role: 'admin', email: 'admin@abes.ac.in', dept: 'Institutional Admin', year: 0 }
  };

  function futureDate(days, hours, minutes) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hours || 14, minutes || 0, 0, 0);
    return d.toISOString();
  }

  function tok(len) {
    var a = new Uint8Array(len || 16);
    crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function(b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  function seedState() {
    return {
      me: 'student',
      follow: { 'u_student_1': ['Google Developer Student Club (GDSC)', 'Raag Society'] },
      clubs: [
        { id: 'c1', name: 'Google Developer Student Club (GDSC)', cat: 'Technical', dept: 'CSE & IT', lead: 'Devansh Verma', desc: 'Google developers community driving cloud, mobile, and AI initiatives across ABES.' },
        { id: 'c2', name: 'Raag Society', cat: 'Cultural', dept: 'College-wide', lead: 'Ananya Gupta', desc: 'The official music, fine arts, and literary society of ABES Engineering College.' },
        { id: 'c3', name: 'En Passant Chess Club', cat: 'Gaming', dept: 'Sports Council', lead: 'Rohan Joshi', desc: 'FIDE-rated tournaments, blitz cups, and strategic board game leagues.' },
        { id: 'c4', name: 'E-Cell ABES', cat: 'Entrepreneurship', dept: 'MBA & Tech', lead: 'Pooja Tiwari', desc: 'Incubation, angel pitch contests, and startup founder mentorship.' },
        { id: 'c5', name: 'Pixel Guild', cat: 'Workshop', dept: 'Applied Sciences', lead: 'Sameer Khan', desc: 'UI/UX design, visual branding, typography, and creative media production.' }
      ],
      events: [
        {
          id: 'e1',
          club: 'Google Developer Student Club (GDSC)',
          title: 'Cloud Study Jam: GenAI & Kubernetes',
          cat: 'Technical',
          date: futureDate(2, 11, 0),
          venue: 'Auditorium 1 (Main Block)',
          cap: 80,
          status: 'published',
          desc: 'Hands-on architectural deep dive into containerized cloud deployment and generative LLM orchestration on Google Cloud Platform. Bring your fully charged laptops. Official GCP badges will be awarded to attendees.',
          rules: 'Active institutional email required. Laptop with Chrome/Firefox. Prerequisite: basic familiarity with command line.',
          eligibility: 'Open to 2nd, 3rd, and 4th Year B.Tech students.',
          fb: ''
        },
        {
          id: 'e2',
          club: 'Raag Society',
          title: 'Acoustic Resonance: Campus Open Mic',
          cat: 'Cultural',
          date: futureDate(3, 17, 30),
          venue: 'Central Amphitheatre',
          cap: 120,
          status: 'published',
          desc: 'An evening of live vocal harmonies, acoustic instruments, spoken word poetry, and comedic performances under the campus lights. Spot registrations available for acoustic solo acts.',
          rules: 'Original compositions preferred. Time limit per performer: 5 minutes. No explicit or offensive language.',
          eligibility: 'All ABES Students & Faculty members.',
          fb: ''
        },
        {
          id: 'e3',
          club: 'En Passant Chess Club',
          title: 'Grandmaster Blitz Cup 2026',
          cat: 'Gaming',
          date: futureDate(5, 14, 0),
          venue: 'Aryabhatta Block Room 204',
          cap: 40,
          status: 'published',
          desc: '7-round Swiss system tournament with 3 minutes + 2 seconds Fischer time controls. Digital clocks and standard tournament boards provided.',
          rules: 'Touch-move rule enforced. Clock etiquette applies. Arbiter decision is final.',
          eligibility: 'ABES Chess enthusiasts of all rating levels.',
          fb: ''
        },
        {
          id: 'e4',
          club: 'E-Cell ABES',
          title: 'Startup Pitch & Venture Catalyst',
          cat: 'Entrepreneurship',
          date: futureDate(7, 10, 0),
          venue: 'B-Block Seminar Hall',
          cap: 60,
          status: 'published',
          desc: 'Pitch your breakthrough tech product or SaaS idea to seed investors and alumni entrepreneurs. Winner receives incubation grant and AWS credits.',
          rules: 'Slide deck max 10 slides. 5-min pitch + 3-min Q&A.',
          eligibility: 'Student teams of 1-4 members from any department.',
          fb: ''
        },
        {
          id: 'e5',
          club: 'Google Developer Student Club (GDSC)',
          title: 'Algorithmic Sprint & Web3 Hackathon',
          cat: 'Technical',
          date: futureDate(9, 9, 0),
          venue: 'Main Computer Center Lab 4',
          cap: 50,
          status: 'submitted',
          desc: '24-hour hackathon focused on high-throughput decentralized protocols, smart contracts, and real-time distributed consensus.',
          rules: 'All code must be written during the hackathon window. GitHub commits strictly monitored.',
          eligibility: 'ABES B.Tech / MCA students.',
          fb: ''
        }
      ],
      campaigns: [
        { id: 'camp1', ev: 'e1', name: 'Main Canteen Standee', channel: 'standee', code: 'cantn1', scans: 142 },
        { id: 'camp2', ev: 'e1', name: 'CSE 3rd Yr Class Visit', channel: 'classroom', code: 'cse3rd', scans: 96 },
        { id: 'camp3', ev: 'e1', name: 'GDSC Instagram Story', channel: 'instagram', code: 'ig_gds', scans: 215 },
        { id: 'camp4', ev: 'e2', name: 'Amphitheatre Noticeboard', channel: 'noticeboard', code: 'amphi2', scans: 64 },
        { id: 'camp5', ev: 'e2', name: 'Hostel WhatsApp Blast', channel: 'whatsapp', code: 'h_wa26', scans: 180 }
      ],
      regs: [
        { id: 'r1', ev: 'e1', user: 'u_student_1', name: 'Aarav Sharma', token: 'pass_' + tok(12), status: 'going', camp: 'camp2', att: 0, cert: null },
        { id: 'r2', ev: 'e1', user: 'd_u2', name: 'Priya Malik', token: 'pass_' + tok(12), status: 'going', camp: 'camp1', att: Date.now() - 36e5, cert: 'ABES-' + tok(4).toUpperCase() },
        { id: 'r3', ev: 'e1', user: 'd_u3', name: 'Kabir Verma', token: 'pass_' + tok(12), status: 'going', camp: 'camp3', att: Date.now() - 72e5, cert: 'ABES-' + tok(4).toUpperCase() },
        { id: 'r4', ev: 'e2', user: 'u_student_1', name: 'Aarav Sharma', token: 'pass_' + tok(12), status: 'going', camp: 'camp5', att: 0, cert: null },
        { id: 'r5', ev: 'e3', user: 'd_u4', name: 'Tanvi Nair', token: 'pass_' + tok(12), status: 'going', camp: null, att: 0, cert: null }
      ],
      audit: [
        { id: 'a1', time: new Date(Date.now() - 864e5).toISOString(), user: 'admin@abes.ac.in', action: 'ROLE_ELEVATION', detail: 'Elevated GDSC Lead to Club Rep' },
        { id: 'a2', time: new Date(Date.now() - 432e5).toISOString(), user: 'rk.mehta@abes.ac.in', action: 'EVENT_APPROVAL', detail: 'Approved Cloud Study Jam for GDSC' },
        { id: 'a3', time: new Date(Date.now() - 144e5).toISOString(), user: 'gdsc@abes.ac.in', action: 'CAMPAIGN_CREATED', detail: 'Generated Standee & Classroom QRs for e1' }
      ]
    };
  }

  var S;
  try {
    S = JSON.parse(localStorage.getItem(KEY));
  } catch (e) {}
  if (!S || !S.events || !S.campaigns) S = seedState();

  function saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {}
  }

  var me = function() { return USERS[S.me] || USERS.student; };
  var ev = function(id) { return S.events.find(function(e) { return e.id === id; }); };
  var cnt = function(id) { return S.regs.filter(function(r) { return r.ev === id && r.status === 'going'; }).length; };
  var myReg = function(id) { return S.regs.find(function(r) { return r.ev === id && r.user === me().id; }); };
  var fl = function() { return (S.follow && S.follow[me().id]) || []; };
  var live = function(e) { return e.status === 'published' && new Date(e.date) > new Date(); };

  var fmt = function(iso) {
    return new Date(iso).toLocaleString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
    });
  };

  var toast = function(msg) {
    var old = $('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span>⚡</span> <span>' + esc(msg) + '</span>';
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 2400);
  };

  function qr(data) {
    try {
      var q = qrcode(0, 'M');
      q.addData(data);
      q.make();
      return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (e) {
      return '<div class="muted" style="padding:10px">QR Unavailable</div>';
    }
  }

  // Active filters
  var filt = { q: '', cat: 'All' };
  var kioskTimer = null;
  var editingId = null;

  // ----------------- NAVIGATION -----------------
  function updateNav() {
    var r = me().role;
    var links = [
      ['#/', 'Discover'],
      ['#/clubs', 'Clubs'],
      ['#/display', 'Screen Kiosk']
    ];

    if (r === 'student') links.push(['#/my', 'My Passes']);
    if (r === 'rep') links.push(['#/club', 'Club Workspace']);
    if (r === 'faculty') links.push(['#/review', 'Faculty Review']);
    if (r === 'admin') links.push(['#/admin', 'Admin Console']);
    links.push(['#/ai', '✨ AI Tools']);

    var cur = location.hash || '#/';
    $('#nav').innerHTML = links.map(function(item) {
      var isAct = cur === item[0] || (item[0] !== '#/' && cur.indexOf(item[0]) === 0);
      return '<a href="' + item[0] + '" class="' + (isAct ? 'on' : '') + '">' + item[1] + '</a>';
    }).join('');
  }

  // ----------------- MODULE 1: STUDENT DISCOVERY -----------------
  function renderFeed() {
    var all = S.events.filter(live).sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    var top = all.slice().sort(function(a, b) { return cnt(b.id) - cnt(a.id); }).slice(0, 3);

    var list = all.filter(function(e) {
      var matchesCat = (filt.cat === 'All') ||
        (filt.cat === 'Following' && fl().indexOf(e.club) > -1) ||
        (e.cat === filt.cat);
      var text = (e.title + ' ' + e.club + ' ' + e.venue + ' ' + e.cat).toLowerCase();
      var matchesQ = text.indexOf(filt.q.toLowerCase()) > -1;
      return matchesCat && matchesQ;
    });

    var chips = ['All'].concat(me().role === 'student' ? ['Following'] : [], Object.keys(CATS));

    var totalRegs = S.regs.filter(function(r) { return r.status === 'going'; }).length;
    var totalScans = S.campaigns.reduce(function(acc, c) { return acc + (c.scans || 0); }, 0);

    return '<div class="hero">' +
      '<div class="hero-tag">Official Digital Campus Infrastructure · ABES Engineering College</div>' +
      '<h1 class="big">One Campus.<br>Every Event.<br>Everyone Connected.</h1>' +
      '<p class="hero-sub">Discover, participate and promote college events across departments and student societies. From hackathons to cultural festivals, verified with cryptographic entry passes.</p>' +
      '<div class="hero-stats">' +
        '<div class="hero-stat-card"><b>' + all.length + '</b><span>Active Campus Events</span></div>' +
        '<div class="hero-stat-card"><b>' + S.clubs.length + '</b><span>Verified Clubs & Societies</span></div>' +
        '<div class="hero-stat-card"><b>' + totalRegs + '</b><span>Verified Registrations</span></div>' +
        '<div class="hero-stat-card"><b>' + totalScans + '</b><span>Offline QR Campaign Scans</span></div>' +
      '</div>' +
    '</div>' +

    '<h2>Trending Events</h2>' +
    '<ul class="lineup">' +
      (top.map(function(e) {
        return '<li><a href="#/event/' + e.id + '">' + esc(e.title) + '</a>' +
          '<span>' + esc(e.club) + ' · ' + esc(fmt(e.date)) + ' · <b>' + cnt(e.id) + ' going</b></span></li>';
      }).join('') || '<li><span>No published upcoming events yet.</span></li>') +
    '</ul>' +

    '<div class="tools">' +
      '<input id="q" type="search" placeholder="Search events, clubs, venues, categories..." value="' + esc(filt.q) + '">' +
      chips.map(function(c) {
        return '<button class="chip ' + (filt.cat === c ? 'on' : '') + '" data-cat="' + c + '" type="button">' + c + '</button>';
      }).join('') +
    '</div>' +

    '<div class="grid">' +
      (list.map(renderCard).join('') ||
        '<div class="panel" style="grid-column:1/-1;text-align:center;padding:48px">' +
        '<h3 style="margin:0">No matching events found</h3>' +
        '<p class="muted">Try searching with another keyword, pick another category, or follow a club.</p>' +
        '</div>') +
    '</div>' +

    '<h2 style="margin-top:64px">How CampusConnect Works</h2>' +
    '<div class="how" style="margin-bottom:32px">' +
      '<div><b>1. Clubs Create & Campaign</b><p>Verified organizers design events, generate campaign-specific QR codes for standees, classrooms, and social kits.</p></div>' +
      '<div><b>2. Faculty Verify & Moderate</b><p>Faculty coordinators review submissions with automated venue-clash detection, ensuring zero scheduling overlaps.</p></div>' +
      '<div><b>3. Students Scan & Walk In</b><p>Students discover events, claim cryptographic dynamic QR passes, check in instantly, and receive verified certificates.</p></div>' +
    '</div>';
  }

  function renderCard(e) {
    var c = CATS[e.cat] || CATS.Other;
    var spots = e.cap - cnt(e.id);
    var statusText = spots <= 0 ? 'Full · Waitlist' : spots <= 12 ? spots + ' spots left' : spots + ' spots open';
    var t = new Date(e.date);

    return '<article>' +
      '<a class="poster ' + c[0] + '" href="#/event/' + e.id + '">' +
        '<div class="t2">' +
          '<span>' + esc(t.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })) + '</span>' +
          '<span>' + esc(t.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })) + '</span>' +
        '</div>' +
        '<h3>' + esc(e.title) + '</h3>' +
      '</a>' +
      '<div class="info">' +
        '<div>' +
          '<h4>' + esc(e.title) + '</h4>' +
          '<p>' + esc(e.club) + '<br><b>📍 ' + esc(e.venue) + '</b></p>' +
        '</div>' +
        '<div class="card-footer">' +
          '<span class="cat"><b style="background:' + c[1] + '"></b>' + esc(e.cat) + '</span>' +
          '<span class="hot">' + esc(statusText) + '</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  // ----------------- MODULE 1 DETAIL: EVENT PROFILE & DYNAMIC PASS -----------------
  function renderDetail(id) {
    var e = ev(id);
    if (!e || (e.status !== 'published' && me().role === 'student')) {
      return '<div class="panel" style="text-align:center;padding:48px"><h2>Event not found or under review</h2><p><a href="#/" class="btn">Back to Discover</a></p></div>';
    }

    var r = myReg(id);
    var full = cnt(id) >= e.cap;
    var past = new Date(e.date) <= new Date();
    var spotsLeft = Math.max(e.cap - cnt(id), 0);
    var msLeft = new Date(e.date) - new Date();
    var daysLeft = Math.floor(msLeft / 864e5);
    var hoursLeft = Math.floor((msLeft % 864e5) / 36e5);

    var countdownBadge = past ? '<span class="pill">Event Concluded</span>' :
      '<span class="pill s-published">Starts in ' + daysLeft + 'd ' + hoursLeft + 'h</span>';

    var c = CATS[e.cat] || CATS.Other;

    var actionBlock = '';
    if (me().role !== 'student') {
      actionBlock = '<div class="panel"><p class="muted">You are logged in as <b>' + esc(me().name) + ' (' + esc(me().role) + ')</b>. Switch role at top to register as a student.</p></div>';
    } else if (r && r.status === 'wait') {
      actionBlock = '<div class="panel" style="border-color:var(--flare)">' +
        '<span class="pill s-submitted">Waitlist Status: Active</span>' +
        '<h4>You are currently waitlisted</h4>' +
        '<p class="muted">As confirmed participants cancel, waitlisted students are automatically promoted with immediate pass generation.</p>' +
        '<button class="btn ghost sm" data-act="unreg" data-id="' + id + '" type="button">Leave Waitlist</button>' +
      '</div>';
    } else if (r) {
      // Dynamic Anti-Screenshot Pass
      var passUrl = location.origin + location.pathname + '#/verify-ticket/' + r.token;
      actionBlock = '<div class="pass-ticket">' +
        '<div class="pass-guard"></div>' +
        '<div>' +
          '<span class="pill s-published">Verified Campus Entry Pass</span>' +
          '<h4 style="margin:10px 0">' + esc(e.title) + '</h4>' +
          '<p class="muted" style="margin:0 0 8px"><b>Attendee:</b> ' + esc(me().name) + ' (' + esc(me().dept) + ')</p>' +
          '<p class="muted" style="margin:0 0 12px"><b>Venue:</b> ' + esc(e.venue) + ' · ' + esc(fmt(e.date)) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button class="btn ghost sm" data-act="download-ics" data-id="' + id + '" type="button">📅 Add to Calendar (.ics)</button>' +
            '<button class="btn ghost sm" data-act="unreg" data-id="' + id + '" type="button">Cancel Ticket</button>' +
          '</div>' +
          '<p class="muted" style="font-size:11px;margin-top:10px">Pass Token: <code>' + esc(r.token.slice(0, 16)) + '...</code> (Validated via HMAC-SHA256)</p>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div class="qr">' + qr(passUrl) + '</div>' +
          '<small class="muted" style="display:block;margin-top:6px;font-size:11px">Show at Venue</small>' +
        '</div>' +
      '</div>';
    } else {
      actionBlock = '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
        '<button class="btn primary" data-act="reg" data-id="' + id + '" type="button" ' + (past ? 'disabled' : '') + '>' +
          (past ? 'Registration Closed' : full ? 'Join Waitlist (' + cnt(id) + '/' + e.cap + ' full)' : 'Count Me In (' + spotsLeft + ' spots left)') +
        '</button>' +
        '<button class="btn ghost" data-act="download-ics" data-id="' + id + '" type="button">📅 Calendar (.ics)</button>' +
        '<button class="btn ghost" data-act="share" data-id="' + id + '" type="button">🔗 Share Event</button>' +
      '</div>';
    }

    return '<div style="margin-bottom:16px"><a href="#/" class="btn ghost sm">← Back to Discover</a></div>' +
    '<div class="detail">' +
      '<div>' +
        '<div class="detail-poster poster ' + c[0] + '" style="aspect-ratio:4/5">' +
          '<div class="t2"><span>' + esc(e.club) + '</span><span>' + esc(e.cat) + '</span></div>' +
          '<h3>' + esc(e.title) + '</h3>' +
        '</div>' +
        '<div class="panel" style="margin-top:18px">' +
          '<h4 style="margin:0 0 10px">Event Logistics</h4>' +
          '<p style="margin:4px 0"><b>Organized by:</b> ' + esc(e.club) + '</p>' +
          '<p style="margin:4px 0"><b>Venue:</b> ' + esc(e.venue) + '</p>' +
          '<p style="margin:4px 0"><b>Date & Time:</b> ' + esc(fmt(e.date)) + '</p>' +
          '<p style="margin:4px 0"><b>Capacity:</b> ' + cnt(id) + ' / ' + e.cap + ' registered (' + spotsLeft + ' remaining)</p>' +
        '</div>' +
      '</div>' +
      '<div class="detail-content">' +
        '<div>' +
          countdownBadge + ' ' +
          '<span class="pill" style="margin-left:6px">' + esc(e.cat) + '</span>' +
          '<h1 class="big" style="font-size:clamp(32px, 5vw, 56px);margin:14px 0 8px">' + esc(e.title) + '</h1>' +
          '<p class="muted" style="font-size:16px">Organized by <b>' + esc(e.club) + '</b> · Verified ABES Student Chapter</p>' +
        '</div>' +

        actionBlock +

        '<div class="panel">' +
          '<h3 style="margin:0 0 12px">Event Description & Agenda</h3>' +
          '<p style="line-height:1.7;white-space:pre-wrap">' + esc(e.desc) + '</p>' +
        '</div>' +

        '<div class="two">' +
          '<div class="panel">' +
            '<h4 style="margin:0 0 8px">Rules & Guidelines</h4>' +
            '<p class="muted" style="margin:0;font-size:13px">' + esc(e.rules || 'Standard ABES Engineering College code of conduct applies. Valid institutional ID required.') + '</p>' +
          '</div>' +
          '<div class="panel">' +
            '<h4 style="margin:0 0 8px">Eligibility Criteria</h4>' +
            '<p class="muted" style="margin:0;font-size:13px">' + esc(e.eligibility || 'Open to all enrolled ABES students across departments.') + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ----------------- MODULE 1: STUDENT VAULT ("MY PASSES") -----------------
  function renderMyPasses() {
    var myRegistrations = S.regs.filter(function(r) { return r.user === me().id; });
    var activePasses = myRegistrations.filter(function(r) { return r.status === 'going' && !r.att; });
    var attended = myRegistrations.filter(function(r) { return r.att; });
    var waitlisted = myRegistrations.filter(function(r) { return r.status === 'wait'; });

    return '<h2>My Campus Engagement Vault</h2>' +
    '<p class="muted">Access your verified digital passes, waitlist status, and authenticated participation certificates.</p>' +
    '<div class="stats" style="margin-bottom:24px">' +
      '<div><b>' + activePasses.length + '</b>Active Passes</div>' +
      '<div><b>' + attended.length + '</b>Events Attended</div>' +
      '<div><b>' + attended.filter(function(r) { return r.cert; }).length + '</b>Certificates</div>' +
      '<div><b>' + waitlisted.length + '</b>Waitlists</div>' +
    '</div>' +

    '<h3>Active Digital Passes</h3>' +
    (activePasses.map(function(r) {
      var e = ev(r.ev);
      if (!e) return '';
      var passUrl = location.origin + location.pathname + '#/verify-ticket/' + r.token;
      return '<div class="pass-ticket" style="margin-bottom:16px">' +
        '<div class="pass-guard"></div>' +
        '<div>' +
          '<span class="pill s-published">Confirmed Ticket</span>' +
          '<h4 style="margin:8px 0">' + esc(e.title) + '</h4>' +
          '<p class="muted"><b>' + esc(e.club) + '</b> · ' + esc(fmt(e.date)) + ' · 📍 ' + esc(e.venue) + '</p>' +
          '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<a href="#/event/' + e.id + '" class="btn ghost sm">View Event Details</a>' +
            '<button class="btn ghost sm" data-act="download-ics" data-id="' + e.id + '" type="button">📅 .ics</button>' +
            '<button class="btn ghost sm" data-act="unreg" data-id="' + e.id + '" type="button">Cancel</button>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div class="qr">' + qr(passUrl) + '</div>' +
          '<small class="muted" style="display:block;margin-top:6px;font-size:11px">Pass: ' + esc(r.token.slice(0, 8)) + '</small>' +
        '</div>' +
      '</div>';
    }).join('') || '<div class="panel"><p class="muted">No active upcoming passes. <a href="#/">Explore events to attend.</a></p></div>') +

    '<h3 style="margin-top:36px">Verified Certificates of Participation</h3>' +
    (attended.filter(function(r) { return r.cert; }).map(function(r) {
      var e = ev(r.ev);
      return '<div class="panel" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
        '<div>' +
          '<span class="pill s-published">Verified Credential</span>' +
          '<h4 style="margin:6px 0">' + esc(e ? e.title : 'Campus Event') + '</h4>' +
          '<p class="muted" style="margin:0;font-size:13px">Issued by ' + esc(e ? e.club : 'ABES Society') + ' · Certificate Code: <code>' + esc(r.cert) + '</code></p>' +
        '</div>' +
        '<div>' +
          '<a href="#/verify/' + r.cert + '" class="btn primary sm">📜 View & Download Certificate</a>' +
        '</div>' +
      '</div>';
    }).join('') || '<div class="panel"><p class="muted">Certificates will be issued automatically once your pass is verified at the venue by organizers.</p></div>');
  }

  // ----------------- MODULE 2: CLUB MANAGEMENT WORKSPACE -----------------
  function renderClubWorkspace() {
    if (me().role !== 'rep') return renderDeny();
    var mine = S.events.filter(function(e) { return e.club === me().club; });
    var myCamps = S.campaigns.filter(function(c) {
      return mine.some(function(e) { return e.id === c.ev; });
    });
    var totalScans = myCamps.reduce(function(a, b) { return a + (b.scans || 0); }, 0);
    var totalRegs = mine.reduce(function(a, b) { return a + cnt(b.id); }, 0);
    var convRate = totalScans > 0 ? ((totalRegs / totalScans) * 100).toFixed(1) : '0.0';

    var cur = editingId ? ev(editingId) : {
      title: '', cat: 'Technical', venue: '', cap: 60, desc: '', date: '', rules: '', eligibility: 'All ABES Students'
    };

    return '<h2>' + esc(me().club) + ' — Management Dashboard</h2>' +
    '<p class="muted">Manage your student chapter events, offline promotional campaigns, and attendance verification.</p>' +
    '<div class="stats" style="margin-bottom:28px">' +
      '<div><b>' + mine.length + '</b>Events Hosted</div>' +
      '<div><b>' + mine.filter(live).length + '</b>Live Listings</div>' +
      '<div><b>' + totalRegs + '</b>Registrations</div>' +
      '<div><b>' + totalScans + '</b>Campaign Scans</div>' +
      '<div><b>' + convRate + '%</b>Conversion Rate</div>' +
    '</div>' +

    '<h3>' + (editingId ? 'Edit Event: ' + esc(cur.title) : 'Create New Campus Event') + '</h3>' +
    '<div class="panel">' +
      '<form id="form_event">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<label style="flex:1">Event Title<input name="title" required maxlength="100" placeholder="e.g. Web3 Architecture Sprint" value="' + esc(cur.title) + '"></label>' +
          '<button class="btn ghost sm" type="button" data-act="ai-draft-copy" style="margin-left:12px;margin-top:16px;border-color:var(--blue);color:var(--blue)">✨ AI Copy Assistant</button>' +
        '</div>' +
        '<div class="three">' +
          '<label>Category' +
            '<select name="cat">' + Object.keys(CATS).map(function(k) {
              return '<option ' + (k === cur.cat ? 'selected' : '') + '>' + k + '</option>';
            }).join('') + '</select>' +
          '</label>' +
          '<label>Date & Start Time' +
            '<input name="date" type="datetime-local" required value="' + (cur.date ? new Date(new Date(cur.date) - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16) : '') + '">' +
          '</label>' +
          '<label>Maximum Capacity' +
            '<input name="cap" type="number" min="1" max="10000" required value="' + esc(cur.cap) + '">' +
          '</label>' +
        '</div>' +
        '<div class="two">' +
          '<label>Campus Venue<input name="venue" required maxlength="100" placeholder="e.g. Auditorium 1, Main Block" value="' + esc(cur.venue) + '"></label>' +
          '<label>Eligibility<input name="eligibility" maxlength="100" placeholder="e.g. Open to 2nd & 3rd Year CSE/IT" value="' + esc(cur.eligibility) + '"></label>' +
        '</div>' +
        '<label>Comprehensive Description & Agenda<textarea name="desc" rows="4" maxlength="2000" placeholder="Explain the agenda, speaker profiles, and what students will build...">' + esc(cur.desc) + '</textarea></label>' +
        '<label>Rules & Prerequisites<input name="rules" maxlength="500" placeholder="e.g. Bring your college ID and laptop with Python installed." value="' + esc(cur.rules) + '"></label>' +
        '<div style="display:flex;gap:12px">' +
          '<button class="btn primary" type="submit">' + (editingId ? 'Save Changes' : 'Save Draft Event') + '</button>' +
          (editingId ? '<button class="btn ghost" type="button" data-act="cancel-edit">Cancel Edit</button>' : '') +
        '</div>' +
      '</form>' +
    '</div>' +

    '<h3 style="margin-top:36px">Club Event Roster</h3>' +
    (mine.map(function(e) {
      var isDraft = e.status === 'draft' || e.status === 'changes';
      return '<div class="panel" style="margin-bottom:14px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">' +
          '<div>' +
            '<span class="pill s-' + e.status + '">' + esc(e.status.toUpperCase()) + '</span> ' +
            '<span class="pill" style="margin-left:6px">' + esc(e.cat) + '</span>' +
            '<h4 style="margin:8px 0 4px;font-size:20px"><a href="#/event/' + e.id + '">' + esc(e.title) + '</a></h4>' +
            '<p class="muted" style="margin:0;font-size:13px">' + esc(fmt(e.date)) + ' · 📍 ' + esc(e.venue) + ' · <b>' + cnt(e.id) + ' / ' + e.cap + ' registered</b></p>' +
            (e.fb ? '<p style="color:var(--flare);font-size:13px;margin:6px 0 0"><b>Faculty Feedback:</b> ' + esc(e.fb) + '</p>' : '') +
          '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            (isDraft ? '<button class="btn ghost sm" data-act="edit-event" data-id="' + e.id + '" type="button">Edit</button>' : '') +
            (isDraft ? '<button class="btn primary sm" data-act="submit-event" data-id="' + e.id + '" type="button">' + (e.status === 'changes' ? 'Resubmit for Review' : 'Submit for Approval') + '</button>' : '') +
            '<a href="#/campaigns/' + e.id + '" class="btn ghost sm" style="border-color:var(--blue);color:var(--blue)">📢 Smart Promotion Engine</a>' +
            '<a href="#/manage/' + e.id + '" class="btn ghost sm">👥 Manage & Scan Passes</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') || '<div class="panel"><p class="muted">No events created yet. Use the form above to post your first event.</p></div>');
  }

  // ----------------- MODULE 3: SMART PROMOTION ENGINE HUB -----------------
  function renderCampaignHub(eventId) {
    var e = ev(eventId);
    if (!e) return '<div class="panel"><h3>Event not found</h3><p><a href="#/club" class="btn">Back to Club Workspace</a></p></div>';
    if (me().role !== 'rep' && me().role !== 'admin') return renderDeny();

    var camps = S.campaigns.filter(function(c) { return c.ev === eventId; });

    return '<div style="margin-bottom:16px"><a href="#/club" class="btn ghost sm">← Back to Club Workspace</a></div>' +
    '<h2>Smart Promotion Engine — ' + esc(e.title) + '</h2>' +
    '<p class="muted">Generate offline-to-online attributed QR codes, classroom presentation slides, and social kits to drive event discovery across ABES.</p>' +

    '<div class="two">' +
      '<div class="panel">' +
        '<h4 style="margin:0 0 12px">Create Attributed Campaign</h4>' +
        '<form id="form_campaign" data-id="' + eventId + '">' +
          '<label>Campaign Title<input name="name" required placeholder="e.g. Ground Floor Standee, 3rd Yr CSE Visit" maxlength="60"></label>' +
          '<label>Promotional Channel' +
            '<select name="channel">' +
              Object.keys(CHANNELS).map(function(k) {
                return '<option value="' + k + '">' + CHANNELS[k].icon + ' ' + CHANNELS[k].label + '</option>';
              }).join('') +
            '</select>' +
          '</label>' +
          '<button class="btn primary" type="submit">⚡ Generate Attributed QR Code</button>' +
        '</form>' +
      '</div>' +

      '<div class="panel" style="background:var(--blue-light);border-color:var(--blue)">' +
        '<h4 style="margin:0 0 8px;color:var(--blue)">Classroom & Signage Modes</h4>' +
        '<p style="font-size:13px;line-height:1.6;margin:0 0 16px">' +
          'Deliver seamless, projector-ready presentation slides for student representatives during lectures, or broadcast to campus televisions.' +
        '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<a href="#/classroom-slide/' + eventId + '" class="btn primary sm">🎓 Open Classroom Slide (16:9)</a>' +
          '<a href="#/social-kit/' + eventId + '" class="btn ghost sm">📱 Social Media Kit Generator</a>' +
          '<a href="#/display" class="btn ghost sm">📺 Digital Kiosk Feed</a>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<h3 style="margin-top:32px">Active Campaign Telemetry & Funnel Attribution</h3>' +
    '<div class="table-wrap">' +
      '<table>' +
        '<thead>' +
          '<tr>' +
            '<th>Channel</th>' +
            '<th>Campaign Name</th>' +
            '<th>Short Code</th>' +
            '<th>Scans</th>' +
            '<th>Registrations</th>' +
            '<th>Conversion %</th>' +
            '<th>Actions</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          (camps.map(function(c) {
            var ch = CHANNELS[c.channel] || CHANNELS.direct;
            var regs = S.regs.filter(function(r) { return r.camp === c.id; }).length;
            var rate = c.scans > 0 ? ((regs / c.scans) * 100).toFixed(1) : '0.0';
            var directUrl = location.origin + location.pathname + '#/event/' + e.id + '?camp=' + c.id;

            return '<tr>' +
              '<td><b>' + ch.icon + ' ' + ch.label + '</b></td>' +
              '<td><b>' + esc(c.name) + '</b></td>' +
              '<td><code>' + esc(c.code) + '</code></td>' +
              '<td>' + c.scans + '</td>' +
              '<td><b>' + regs + '</b></td>' +
              '<td>' +
                '<span>' + rate + '%</span>' +
                '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(rate * 2, 100) + '%"></div></div>' +
              '</td>' +
              '<td>' +
                '<button class="btn ghost sm" data-act="show-qr-modal" data-title="' + esc(c.name) + '" data-url="' + esc(directUrl) + '" type="button">🔍 View QR</button>' +
              '</td>' +
            '</tr>';
          }).join('') || '<tr><td colspan="7" class="muted" style="text-align:center;padding:24px">No promotional campaigns created yet.</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  // ----------------- MODULE 3 SUB-MODULES: CLASSROOM SLIDE & SOCIAL KIT -----------------
  function renderClassroomSlide(eventId) {
    var e = ev(eventId);
    if (!e) return '<div class="panel"><h3>Event not found</h3></div>';
    var regUrl = location.origin + location.pathname + '#/event/' + e.id + '?ref=classroom';

    return '<div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">' +
      '<a href="#/campaigns/' + eventId + '" class="btn ghost sm">← Exit Presentation Mode</a>' +
      '<button class="btn ghost sm" onclick="document.querySelector(\'.slide-box\').requestFullscreen()">⛶ Fullscreen Projector Mode</button>' +
    '</div>' +
    '<div class="slide-box">' +
      '<div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<span class="pill s-published" style="font-size:14px;padding:4px 16px">' + esc(e.club) + ' Presents</span>' +
          '<span style="font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#A5B4FC">ABES Engineering College</span>' +
        '</div>' +
        '<h1>' + esc(e.title) + '</h1>' +
        '<p style="font-size:clamp(18px, 2vw, 24px);color:#E2E8F0;margin:6px 0">' +
          '📅 ' + esc(fmt(e.date)) + ' &nbsp;·&nbsp; 📍 ' + esc(e.venue) +
        '</p>' +
      '</div>' +
      '<div class="slide-grid">' +
        '<div>' +
          '<p style="font-size:clamp(16px, 1.8vw, 20px);line-height:1.5;color:#CBD5E1;max-width:720px">' +
            esc(e.desc.slice(0, 240)) + (e.desc.length > 240 ? '...' : '') +
          '</p>' +
          '<p style="font-size:18px;font-weight:700;color:#FBBF24;margin-top:12px">' +
            '⚡ Scan the QR Code right now to reserve your verified digital pass!' +
          '</p>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div class="qr" style="width:200px;padding:12px;border-radius:12px">' + qr(regUrl) + '</div>' +
          '<span style="display:block;margin-top:8px;font-weight:700;font-size:14px;color:#FFF">Scan to Register</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderSocialKit(eventId) {
    var e = ev(eventId);
    if (!e) return '<div class="panel"><h3>Event not found</h3></div>';
    var regUrl = location.origin + location.pathname + '#/event/' + e.id + '?ref=social';

    var caption = '🚨 BIG ANNOUNCEMENT! ' + e.club + ' presents ' + e.title + ' at ABES Engineering College!\n\n' +
      '📅 When: ' + fmt(e.date) + '\n' +
      '📍 Where: ' + e.venue + '\n' +
      '👥 Capacity: ' + e.cap + ' seats only.\n\n' +
      'Scan the QR code or tap the link in bio to claim your verified digital pass! #ABES #CampusConnect #' + e.cat;

    return '<div style="margin-bottom:16px"><a href="#/campaigns/' + eventId + '" class="btn ghost sm">← Back to Campaigns</a></div>' +
    '<h2>Social Media Promotional Kit — ' + esc(e.title) + '</h2>' +
    '<p class="muted">Ready-to-publish social formats generated dynamically from your approved event details.</p>' +

    '<div class="social-preview-grid">' +
      '<div class="social-card">' +
        '<div style="padding:14px;border-bottom:1px solid var(--line);font-weight:700">Instagram Post (1:1 Aspect Ratio)</div>' +
        '<div style="padding:16px">' +
          '<div class="social-1-1">' +
            '<div>' +
              '<span class="pill" style="background:rgba(255,255,255,0.2);color:#FFF;border:none">' + esc(e.club) + '</span>' +
              '<h3 style="font-size:22px;margin:12px 0;line-height:1.1">' + esc(e.title) + '</h3>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-end">' +
              '<div>' +
                '<p style="margin:0;font-size:12px;font-weight:700">' + esc(fmt(e.date)) + '</p>' +
                '<p style="margin:0;font-size:11px;opacity:0.8">📍 ' + esc(e.venue) + '</p>' +
              '</div>' +
              '<div class="qr" style="width:80px;padding:4px">' + qr(regUrl) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="social-card">' +
        '<div style="padding:14px;border-bottom:1px solid var(--line);font-weight:700">Instagram Story (9:16 Ratio)</div>' +
        '<div style="padding:16px">' +
          '<div class="social-9-16">' +
            '<div>' +
              '<small style="text-transform:uppercase;letter-spacing:1px;color:#A5B4FC">' + esc(e.club) + '</small>' +
              '<h3 style="font-size:20px;margin:8px 0;line-height:1.1">' + esc(e.title) + '</h3>' +
              '<p style="font-size:12px;color:#CBD5E1;margin:4px 0">' + esc(fmt(e.date)) + '<br>📍 ' + esc(e.venue) + '</p>' +
            '</div>' +
            '<div style="text-align:center">' +
              '<div class="qr" style="width:110px;margin:0 auto;padding:6px">' + qr(regUrl) + '</div>' +
              '<span style="display:block;margin-top:6px;font-size:11px;font-weight:700">LINK IN BIO</span>' +
            '</div>' +
            '<div style="text-align:center;font-size:11px;color:#94A3B8">' +
              'CampusConnect · ABES Engineering College' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="social-card">' +
        '<div style="padding:14px;border-bottom:1px solid var(--line);font-weight:700">WhatsApp Broadcast Copy</div>' +
        '<div style="padding:16px">' +
          '<textarea id="wa_copy" rows="10" readonly style="font-size:13px;line-height:1.6;font-family:monospace">' + esc(caption) + '</textarea>' +
          '<button class="btn primary sm" style="margin-top:12px;width:100%" data-act="copy-text" data-target="#wa_copy" type="button">📋 Copy Broadcast Message</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ----------------- MODULE 5: EVENT OPS, ATTENDANCE & CERTIFICATES -----------------
  function renderEventOps(eventId) {
    var e = ev(eventId);
    if (!e) return '<div class="panel"><h3>Event not found</h3></div>';
    if (me().role !== 'rep' && me().role !== 'admin') return renderDeny();

    var regs = S.regs.filter(function(r) { return r.ev === eventId; });
    var attended = regs.filter(function(r) { return r.att; });
    var unissued = attended.filter(function(r) { return !r.cert; });

    return '<div style="margin-bottom:16px"><a href="#/club" class="btn ghost sm">← Back to Club Workspace</a></div>' +
    '<h2>' + esc(e.title) + ' — Check-in & Certification</h2>' +
    '<p class="muted">Scan attendee cryptographic passcodes and issue tamper-evident credentials.</p>' +

    '<div class="stats" style="margin-bottom:24px">' +
      '<div><b>' + regs.filter(function(r) { return r.status === 'going'; }).length + '</b>Going</div>' +
      '<div><b>' + attended.length + '</b>Checked-in</div>' +
      '<div><b>' + attended.filter(function(r) { return r.cert; }).length + '</b>Certificates</div>' +
      '<div><b>' + regs.filter(function(r) { return r.status === 'wait'; }).length + '</b>Waitlisted</div>' +
    '</div>' +

    '<div class="two">' +
      '<div class="panel">' +
        '<h4 style="margin:0 0 12px">⚡ Instant QR Check-In Scanner</h4>' +
        '<form id="form_checkin" data-id="' + eventId + '">' +
          '<label>Scan or Enter 8-Character Passcode<input name="code" required minlength="6" maxlength="32" placeholder="e.g. pass_9a4f21"></label>' +
          '<button class="btn primary" type="submit">Verify & Check In</button>' +
        '</form>' +
      '</div>' +

      '<div class="panel">' +
        '<h4 style="margin:0 0 8px">Issue Verified Certificates</h4>' +
        '<p class="muted" style="font-size:13px;margin:0 0 16px">Certificates are granted only to verified attendees. Each certificate receives a unique tamper-evident verification code.</p>' +
        '<button class="btn primary" data-act="issue-certs" data-id="' + eventId + '" type="button" ' + (unissued.length === 0 ? 'disabled' : '') + '>' +
          'Issue Certificates to Verified Attendees (' + unissued.length + ' ready)' +
        '</button>' +
        '<button class="btn ghost sm" data-act="export-csv" data-id="' + eventId + '" type="button" style="margin-left:10px">📥 Export CSV Roster</button>' +
      '</div>' +
    '</div>' +

    '<h3 style="margin-top:28px">Participant Check-in Roster</h3>' +
    '<div class="table-wrap">' +
      '<table>' +
        '<thead>' +
          '<tr>' +
            '<th>Student Name</th>' +
            '<th>Status</th>' +
            '<th>Passcode Token</th>' +
            '<th>Attendance</th>' +
            '<th>Certificate</th>' +
            '<th>Action</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          (regs.map(function(r) {
            return '<tr>' +
              '<td><b>' + esc(r.name || 'ABES Student') + '</b></td>' +
              '<td><span class="pill ' + (r.status === 'wait' ? 's-submitted' : 's-published') + '">' + r.status + '</span></td>' +
              '<td><code>' + esc(r.token.slice(0, 12)) + '...</code></td>' +
              '<td>' + (r.att ? '<span style="color:var(--emerald);font-weight:700">✓ Present (' + new Date(r.att).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) + ')</span>' : '<span class="muted">Not Checked-in</span>') + '</td>' +
              '<td>' + (r.cert ? '<a href="#/verify/' + r.cert + '"><code>' + r.cert + '</code></a>' : '<span class="muted">—</span>') + '</td>' +
              '<td>' +
                (r.status === 'going' ? '<button class="btn ghost sm" data-act="toggle-att" data-id="' + eventId + '" data-tok="' + r.token + '" type="button">' + (r.att ? 'Undo' : 'Mark Present') + '</button>' : '—') +
              '</td>' +
            '</tr>';
          }).join('') || '<tr><td colspan="6" class="muted" style="text-align:center;padding:24px">No students registered yet.</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  // ----------------- MODULE 6: FACULTY GOVERNANCE & CONFLICT DETECTION -----------------
  function renderFacultyDesk() {
    if (me().role !== 'faculty' && me().role !== 'admin') return renderDeny();
    var q = S.events.filter(function(e) { return e.status === 'submitted'; });

    return '<h2>Faculty Coordinator & Moderation Desk</h2>' +
    '<p class="muted">Review pending event submissions with automated venue-clash and timing conflict detection.</p>' +
    '<div class="stats" style="margin-bottom:28px">' +
      '<div><b>' + S.events.length + '</b>Total Events</div>' +
      '<div><b>' + q.length + '</b>Awaiting Review</div>' +
      '<div><b>' + S.events.filter(live).length + '</b>Live Listings</div>' +
      '<div><b>' + S.regs.filter(function(r) { return r.status === 'going'; }).length + '</b>Registrations</div>' +
    '</div>' +

    '<h3>Pending Submissions</h3>' +
    (q.map(function(e) {
      // Conflict detection: venue and time collision within 3 hours
      var clash = S.events.find(function(o) {
        return o.id !== e.id && o.status === 'published' && o.venue === e.venue &&
          Math.abs(new Date(o.date) - new Date(e.date)) < 36e5 * 3;
      });

      return '<div class="panel" style="margin-bottom:18px">' +
        (clash ? '<div class="conflict-alert">' +
          '<span>⚠️</span>' +
          '<div>' +
            '<b>SCHEDULING CLASH DETECTED!</b><br>' +
            'Venue <b>' + esc(e.venue) + '</b> is already booked for <i>"' + esc(clash.title) + '"</i> on ' + esc(fmt(clash.date)) + ' (within 3 hours).' +
          '</div>' +
        '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap">' +
          '<div>' +
            '<span class="pill" style="background:var(--blue-light);color:var(--blue)">' + esc(e.club) + '</span> ' +
            '<span class="pill" style="margin-left:6px">' + esc(e.cat) + '</span>' +
            '<h3 style="margin:8px 0">' + esc(e.title) + '</h3>' +
            '<p class="muted" style="margin:0 0 10px">📅 ' + esc(fmt(e.date)) + ' · 📍 ' + esc(e.venue) + ' · Capacity: ' + e.cap + ' students</p>' +
          '</div>' +
        '</div>' +
        '<p style="line-height:1.6;background:var(--surface-alt);padding:12px;border-radius:8px">' + esc(e.desc) + '</p>' +
        '<label style="margin:14px 0 10px">Note / Guidance to Organizing Club<input id="note_' + e.id + '" placeholder="e.g. Approved. Please confirm projector arrangement with IT department."></label>' +
        '<div style="display:flex;gap:10px">' +
          '<button class="btn primary sm" data-act="fac-approve" data-id="' + e.id + '" type="button">✓ Approve & Publish to Campus</button>' +
          '<button class="btn ghost sm" data-act="fac-changes" data-id="' + e.id + '" type="button" style="color:var(--flare)">Request Modifications</button>' +
        '</div>' +
      '</div>';
    }).join('') || '<div class="panel"><p class="muted">No events currently awaiting review. Queue is clear.</p></div>');
  }

  // ----------------- MODULE 7: SUPER ADMIN CONSOLE -----------------
  function renderAdminConsole() {
    if (me().role !== 'admin') return renderDeny();
    var totalScans = S.campaigns.reduce(function(a, b) { return a + (b.scans || 0); }, 0);
    var totalRegs = S.regs.filter(function(r) { return r.status === 'going'; }).length;

    return '<h2>Super Administrator Control Center</h2>' +
    '<p class="muted">Institution-wide operations, club verifications, and non-repudiable audit trails.</p>' +
    '<div class="stats" style="margin-bottom:28px">' +
      '<div><b>' + S.clubs.length + '</b>Clubs</div>' +
      '<div><b>' + S.events.length + '</b>Total Events</div>' +
      '<div><b>' + totalRegs + '</b>Registrations</div>' +
      '<div><b>' + totalScans + '</b>QR Scans</div>' +
    '</div>' +

    '<div class="two">' +
      '<div class="panel">' +
        '<h4 style="margin:0 0 12px">Register New Verified Club</h4>' +
        '<form id="form_add_club">' +
          '<label>Club / Society Name<input name="name" required placeholder="e.g. Robotics & IoT Club"></label>' +
          '<div class="two">' +
            '<label>Category<select name="cat">' + Object.keys(CATS).map(function(k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
            '<label>Department<input name="dept" required placeholder="e.g. ECE / ME" value="CSE"></label>' +
          '</div>' +
          '<label>Lead Representative<input name="lead" placeholder="Student Lead Name"></label>' +
          '<button class="btn primary" type="submit">Verify & Register Club</button>' +
        '</form>' +
      '</div>' +

      '<div class="panel">' +
        '<h4 style="margin:0 0 12px">Platform Audit Logs</h4>' +
        '<div style="max-height:280px;overflow-y:auto;font-size:12px">' +
          (S.audit.map(function(a) {
            return '<div style="padding:8px 0;border-bottom:1px solid var(--line)">' +
              '<b>' + esc(a.action) + '</b> <span class="muted">(' + esc(fmt(a.time)) + ')</span><br>' +
              '<span class="muted">' + esc(a.user) + '</span> — ' + esc(a.detail) +
            '</div>';
          }).join('') || '<p class="muted">No audit logs recorded yet.</p>') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ----------------- MODULE 8: VERIFIED CERTIFICATE VIEWER -----------------
  function renderVerifyCert(code) {
    var r = S.regs.find(function(x) { return x.cert === code.toUpperCase(); });
    var e = r ? ev(r.ev) : null;
    if (!r || !e) {
      return '<div class="panel" style="text-align:center;padding:48px">' +
        '<h2>Invalid Certificate Code</h2>' +
        '<p class="muted">The verification code <code>' + esc(code) + '</code> does not correspond to an authentic credential.</p>' +
        '<a href="#/" class="btn">Return to CampusConnect</a>' +
      '</div>';
    }

    return '<div class="cert-frame">' +
      '<div class="cert-seal">ABES SEAL</div>' +
      '<span class="pill s-published" style="margin-bottom:12px">Official Credential Authenticated</span>' +
      '<h3 style="font-size:16px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin:8px 0">Certificate of Participation & Achievement</h3>' +
      '<p style="font-size:18px;margin:12px 0 4px">This is to officially certify that</p>' +
      '<h1 style="font-size:clamp(36px, 6vw, 56px);margin:0;font-stretch:85%;color:var(--blue)">' + esc(r.name || 'ABES Student') + '</h1>' +
      '<p style="font-size:16px;margin:12px 0">has actively participated in and successfully completed</p>' +
      '<h2 style="font-size:clamp(22px, 3.5vw, 32px);margin:6px 0">' + esc(e.title) + '</h2>' +
      '<p class="muted" style="margin:8px 0 24px">Organized by <b>' + esc(e.club) + '</b> at ABES Engineering College on ' + esc(fmt(e.date)) + '</p>' +
      '<div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:16px;font-size:12px;color:var(--muted)">' +
        '<div>Verification Hash: <code>' + esc(r.cert) + '</code></div>' +
        '<div>Status: <b>Tamper-Evident & Valid</b></div>' +
      '</div>' +
      '<div style="margin-top:24px">' +
        '<button class="btn ghost sm" onclick="window.print()">🖨️ Print Certificate</button>' +
      '</div>' +
    '</div>';
  }

  // ----------------- MODULE 9: GROUNDED AI SUITE -----------------
  function renderAITools() {
    return '<h2>✨ Grounded AI Suite for Campus Operations</h2>' +
    '<p class="muted">Intelligent tooling grounded exclusively in verified ABES platform data to automate promotional copy and campaign timelines.</p>' +

    '<div class="two" style="margin-top:24px">' +
      '<div class="panel">' +
        '<h3 style="margin:0 0 12px">AI Promotional Copy Generator</h3>' +
        '<form id="form_ai_copy">' +
          '<label>Event Topic / Concept<input name="title" required placeholder="e.g. Intercollege Machine Learning Sprint"></label>' +
          '<label>Category<select name="cat">' + Object.keys(CATS).map(function(k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
          '<label>Target Audience<input name="aud" placeholder="e.g. 2nd & 3rd Year Engineers" value="ABES Engineering College students"></label>' +
          '<button class="btn primary" type="submit">⚡ Generate High-Converting Copy</button>' +
        '</form>' +
        '<div id="ai_copy_output" style="margin-top:16px"></div>' +
      '</div>' +

      '<div class="panel">' +
        '<h3 style="margin:0 0 12px">AI Campaign Strategy Planner</h3>' +
        '<form id="form_ai_strategy">' +
          '<label>Event Title<input name="title" required placeholder="e.g. Annual Tech Symposium"></label>' +
          '<label>Days until Event<input name="days" type="number" min="3" max="30" value="7"></label>' +
          '<button class="btn primary" type="submit">📅 Build Promotional Schedule</button>' +
        '</form>' +
        '<div id="ai_strategy_output" style="margin-top:16px"></div>' +
      '</div>' +
    '</div>' +

    '<h3 style="margin-top:36px">Campus Event Q&A Assistant</h3>' +
    '<div class="panel">' +
      '<div id="chat_history" style="max-height:220px;overflow-y:auto;margin-bottom:14px;display:flex;flex-direction:column;gap:10px">' +
        '<div style="background:var(--surface-alt);padding:10px 14px;border-radius:8px"><b>CampusBot:</b> Hello! Ask me about upcoming workshops, cultural nights, or registration rules at ABES.</div>' +
      '</div>' +
      '<form id="form_ai_chat" style="display:flex;gap:10px">' +
        '<input name="msg" placeholder="e.g. What technical events are happening this week?" required style="flex:1">' +
        '<button class="btn primary" type="submit">Ask Bot</button>' +
      '</form>' +
    '</div>';
  }

  // ----------------- MODULE 10: DIGITAL KIOSK NOTICEBOARD -----------------
  function renderKioskDisplay() {
    return '<div id="kiosk_scr" class="screen"></div>';
  }

  function startKioskRotation() {
    var idx = 0;
    var container = $('#kiosk_scr');
    if (!container) return;

    var validEvents = S.events.filter(live).sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });

    if (validEvents.length === 0) {
      container.innerHTML = '<div class="sl"><h1>No upcoming events</h1><p class="sd">Check back soon for new club announcements.</p></div><a class="ex" href="#/">Exit Kiosk</a>';
      return;
    }

    function step() {
      var scr = $('#kiosk_scr');
      if (!scr) {
        clearInterval(kioskTimer);
        return;
      }
      var evItem = validEvents[idx++ % validEvents.length];
      var ms = new Date(evItem.date) - new Date();
      var spots = evItem.cap - cnt(evItem.id);
      var regUrl = location.origin + location.pathname + '#/event/' + evItem.id + '?ref=kiosk';

      scr.innerHTML = '<div class="kiosk-progress" style="width:100%;transition:width 7s linear"></div>' +
      '<div class="sl">' +
        '<div>' +
          '<p class="sk">' + esc(evItem.club) + ' presents</p>' +
          '<h1>' + esc(evItem.title) + '</h1>' +
          '<p class="sd">📅 ' + esc(fmt(evItem.date)) + ' &nbsp;·&nbsp; 📍 ' + esc(evItem.venue) + '</p>' +
          '<p class="sd" style="color:#FBBF24">Starts in ' + Math.floor(ms / 864e5) + 'd ' + Math.floor((ms % 864e5) / 36e5) + 'h &nbsp;·&nbsp; ' + (spots > 0 ? spots + ' spots left' : 'Waitlist Open') + '</p>' +
          '<p class="sd" style="font-size:20px;color:#A5B4FC">Scan the QR code to claim your verified pass instantly</p>' +
        '</div>' +
        '<div class="qr big">' + qr(regUrl) + '</div>' +
      '</div>' +
      '<a class="ex" href="#/">Exit Kiosk</a>';
    }

    step();
    clearInterval(kioskTimer);
    kioskTimer = setInterval(step, 7000);
  }

  function renderClubs() {
    return '<h2>Verified Student Clubs & Societies</h2>' +
    '<p class="muted">Follow your favorite technical, cultural, and sports clubs to receive priority registration alerts.</p>' +
    '<div class="grid" style="margin-top:20px">' +
      S.clubs.map(function(c) {
        var up = S.events.filter(function(e) { return e.club === c.name && live(e); });
        var isFollowed = fl().indexOf(c.name) > -1;
        return '<div class="panel" style="display:flex;flex-direction:column;justify-content:space-between">' +
          '<div>' +
            '<span class="pill" style="margin-bottom:8px">' + esc(c.cat) + '</span>' +
            '<h3 style="margin:6px 0;font-size:22px">' + esc(c.name) + '</h3>' +
            '<p class="muted" style="font-size:13px;margin:4px 0 12px">' + esc(c.desc) + '</p>' +
            '<p style="font-size:12px"><b>Dept:</b> ' + esc(c.dept) + ' · <b>Lead:</b> ' + esc(c.lead) + '</p>' +
          '</div>' +
          '<div style="margin-top:16px;border-top:1px solid var(--line);padding-top:12px;display:flex;justify-content:space-between;align-items:center">' +
            '<span class="hot">' + up.length + ' upcoming</span>' +
            (me().role === 'student' ? '<button class="btn sm ' + (isFollowed ? 'primary' : 'ghost') + '" data-act="follow" data-id="' + esc(c.name) + '" type="button">' + (isFollowed ? '✓ Following' : '+ Follow') + '</button>' : '') +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function renderDeny() {
    return '<div class="panel" style="text-align:center;padding:48px">' +
      '<h2>Access Restricted for Current Role</h2>' +
      '<p class="muted">Your currently simulated identity (<b>' + esc(me().name) + '</b>) does not possess authorized permissions for this workspace. Switch role at the top right header to access this view.</p>' +
    '</div>';
  }

  // ----------------- ROOT ROUTER -----------------
  function router() {
    var hash = location.hash || '#/';
    var parts = hash.split('/');
    var view = parts[1] || '';
    var param = parts[2] || '';

    updateNav();
    clearInterval(kioskTimer);
    document.body.classList.toggle('kiosk', view === 'display');

    var content = '';
    if (view === 'event') content = renderDetail(param);
    else if (view === 'my') content = renderMyPasses();
    else if (view === 'clubs') content = renderClubs();
    else if (view === 'club') content = renderClubWorkspace();
    else if (view === 'campaigns') content = renderCampaignHub(param);
    else if (view === 'classroom-slide') content = renderClassroomSlide(param);
    else if (view === 'social-kit') content = renderSocialKit(param);
    else if (view === 'manage') content = renderEventOps(param);
    else if (view === 'review') content = renderFacultyDesk();
    else if (view === 'admin') content = renderAdminConsole();
    else if (view === 'verify') content = renderVerifyCert(param);
    else if (view === 'ai') content = renderAITools();
    else if (view === 'display') {
      content = renderKioskDisplay();
      setTimeout(startKioskRotation, 50);
    } else {
      content = renderFeed();
    }

    $('#app').innerHTML = content;
    window.scrollTo(0, 0);

    var qInput = $('#q');
    if (qInput && filt.q) {
      qInput.focus();
      qInput.setSelectionRange(qInput.value.length, qInput.value.length);
    }
  }

  // ----------------- ACTION HANDLERS -----------------
  var ACTIONS = {
    reg: function(id) {
      var e = ev(id);
      if (!e || e.status !== 'published') return;
      if (myReg(id)) return;
      var full = cnt(id) >= e.cap;
      var reg = {
        id: 'r_' + Date.now(),
        ev: id,
        user: me().id,
        name: me().name,
        token: 'pass_' + tok(12),
        status: full ? 'wait' : 'going',
        camp: null,
        att: 0,
        cert: null
      };
      S.regs.push(reg);
      saveState();
      toast(full ? 'Placed on Automatic Waitlist' : 'Registration Confirmed! Pass generated in My Passes');
      router();
    },

    unreg: function(id) {
      var prevReg = myReg(id);
      if (!prevReg) return;
      var wasGoing = prevReg.status === 'going';
      S.regs = S.regs.filter(function(r) { return !(r.ev === id && r.user === me().id); });

      // Auto-promote waitlisted student
      if (wasGoing) {
        var nxt = S.regs.find(function(r) { return r.ev === id && r.status === 'wait'; });
        if (nxt && cnt(id) < ev(id).cap) {
          nxt.status = 'going';
        }
      }
      saveState();
      toast('Registration Cancelled');
      router();
    },

    follow: function(clubName) {
      S.follow = S.follow || {};
      var list = S.follow[me().id] || [];
      var idx = list.indexOf(clubName);
      if (idx > -1) list.splice(idx, 1);
      else list.push(clubName);
      S.follow[me().id] = list;
      saveState();
      toast(idx > -1 ? 'Unfollowed ' + clubName : 'Now following ' + clubName);
      router();
    },

    'download-ics': function(id) {
      var e = ev(id);
      if (!e) return;
      var start = new Date(e.date);
      var end = new Date(start.getTime() + 2 * 36e5);
      var ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ABES Engineering College//CampusConnect//EN\n' +
        'BEGIN:VEVENT\n' +
        'SUMMARY:' + e.title + '\n' +
        'DESCRIPTION:' + e.desc.replace(/\n/g, '\\n') + '\n' +
        'LOCATION:' + e.venue + '\n' +
        'DTSTART:' + start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z\n' +
        'DTEND:' + end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z\n' +
        'END:VEVENT\nEND:VCALENDAR';
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = (e.title.replace(/[^a-zA-Z0-9]/g, '_')) + '.ics';
      a.click();
      toast('Calendar event (.ics) downloaded');
    },

    share: function(id) {
      var shareUrl = location.origin + location.pathname + '#/event/' + id;
      navigator.clipboard.writeText(shareUrl).then(function() {
        toast('Direct event URL copied to clipboard');
      }).catch(function() {
        toast('Share URL: ' + shareUrl);
      });
    },

    'show-qr-modal': function(id, dummy, el) {
      var title = el.dataset.title;
      var url = el.dataset.url;
      var modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:999';
      modal.innerHTML = '<div style="background:var(--surface);padding:32px;border-radius:16px;max-width:360px;width:90%;text-align:center">' +
        '<h3>' + esc(title) + '</h3>' +
        '<div class="qr" style="width:200px;margin:16px auto">' + qr(url) + '</div>' +
        '<p class="muted" style="font-size:12px;word-break:break-all">' + esc(url) + '</p>' +
        '<button class="btn primary sm" onclick="this.closest(\'.modal-backdrop\').remove()">Done</button>' +
      '</div>';
      document.body.appendChild(modal);
    },

    'toggle-att': function(eventId, tokVal) {
      var r = S.regs.find(function(x) { return x.ev === eventId && x.token === tokVal; });
      if (!r) return;
      r.att = r.att ? 0 : Date.now();
      saveState();
      toast(r.att ? 'Student marked present' : 'Attendance record cleared');
      router();
    },

    'issue-certs': function(eventId) {
      var count = 0;
      S.regs.forEach(function(r) {
        if (r.ev === eventId && r.att && !r.cert) {
          r.cert = 'ABES-' + tok(4).toUpperCase();
          count++;
        }
      });
      saveState();
      toast(count + ' verified participation certificates issued!');
      router();
    },

    'export-csv': function(eventId) {
      var e = ev(eventId);
      var regs = S.regs.filter(function(r) { return r.ev === eventId; });
      var csv = 'Name,Status,Attendance,CertificateCode,Token\n' +
        regs.map(function(r) {
          return '"' + (r.name || 'ABES Student') + '","' + r.status + '","' + (r.att ? 'Attended' : 'Absent') + '","' + (r.cert || 'N/A') + '","' + r.token + '"';
        }).join('\n');
      var blob = new Blob([csv], { type: 'text/csv' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'participants_' + (e ? e.title.replace(/[^a-zA-Z0-9]/g, '_') : 'event') + '.csv';
      a.click();
      toast('Participant CSV exported');
    },

    'edit-event': function(id) {
      editingId = id;
      router();
      window.scrollTo(0, 0);
    },

    'cancel-edit': function() {
      editingId = null;
      router();
    },

    'submit-event': function(id) {
      var e = ev(id);
      if (!e) return;
      e.status = 'submitted';
      e.fb = '';
      saveState();
      toast('Event submitted for faculty approval queue');
      router();
    },

    'fac-approve': function(id) {
      var e = ev(id);
      if (!e) return;
      e.status = 'published';
      e.fb = '';
      S.audit.unshift({
        id: 'a_' + Date.now(),
        time: new Date().toISOString(),
        user: me().email,
        action: 'EVENT_APPROVED',
        detail: 'Approved event ' + e.title
      });
      saveState();
      toast('Event approved and published across campus!');
      router();
    },

    'fac-changes': function(id) {
      var note = ($('#note_' + id) || {}).value || 'Please adjust the timing or venue as requested.';
      var e = ev(id);
      if (!e) return;
      e.status = 'changes';
      e.fb = note;
      saveState();
      toast('Sent back to club with feedback note');
      router();
    },

    'copy-text': function(d1, d2, el) {
      var target = $(el.dataset.target);
      if (target) {
        navigator.clipboard.writeText(target.value);
        toast('Broadcast text copied to clipboard');
      }
    },

    'open-ai': function() {
      location.hash = '#/ai';
    },

    reset: function() {
      S = seedState();
      saveState();
      editingId = null;
      toast('Demo ecosystem data reset to factory defaults');
      router();
    }
  };

  // ----------------- EVENT LISTENERS -----------------
  document.addEventListener('click', function(e) {
    var b = e.target.closest('[data-act],[data-cat]');
    if (!b) return;

    if (b.dataset.cat) {
      filt.cat = b.dataset.cat;
      router();
      return;
    }

    var act = b.dataset.act;
    if (ACTIONS[act]) {
      ACTIONS[act](b.dataset.id, b.dataset.tok, b);
    }
  });

  document.addEventListener('input', function(e) {
    if (e.target.id === 'q') {
      filt.q = e.target.value;
      router();
    }
  });

  document.addEventListener('submit', function(e) {
    var form = e.target;

    // Create / Edit Event
    if (form.id === 'form_event') {
      e.preventDefault();
      var fd = new FormData(form);
      var dt = new Date(fd.get('date'));
      var cap = parseInt(fd.get('cap'), 10);
      if (isNaN(dt) || dt <= new Date()) return toast('Select a valid future date & time');
      if (cap < 1) return toast('Capacity must be at least 1');

      var item = editingId ? ev(editingId) : {
        id: 'e_' + Date.now(),
        club: me().club,
        status: 'draft',
        fb: ''
      };

      item.title = fd.get('title').trim();
      item.cat = fd.get('cat');
      item.date = dt.toISOString();
      item.venue = fd.get('venue').trim();
      item.cap = cap;
      item.desc = fd.get('desc').trim();
      item.rules = (fd.get('rules') || '').trim();
      item.eligibility = (fd.get('eligibility') || '').trim();

      if (!editingId) S.events.push(item);
      editingId = null;
      saveState();
      toast('Event draft saved successfully');
      router();
      return;
    }

    // Create Campaign
    if (form.id === 'form_campaign') {
      e.preventDefault();
      var eventId = form.dataset.id;
      var fd = new FormData(form);
      var camp = {
        id: 'camp_' + Date.now(),
        ev: eventId,
        name: fd.get('name').trim(),
        channel: fd.get('channel'),
        code: tok(3),
        scans: 0
      };
      S.campaigns.push(camp);
      saveState();
      toast('Campaign-specific QR code created');
      router();
      return;
    }

    // Check-in Scanner
    if (form.id === 'form_checkin') {
      e.preventDefault();
      var eventId = form.dataset.id;
      var code = (form.code.value || '').trim().toLowerCase();
      var match = S.regs.find(function(r) {
        return r.ev === eventId && r.status === 'going' &&
          (r.token.toLowerCase().indexOf(code) > -1 || code.indexOf(r.token.slice(0, 8).toLowerCase()) > -1);
      });

      if (!match) return toast('Invalid pass code for this event');
      if (match.att) return toast('Already checked in: ' + (match.name || 'Student'));

      match.att = Date.now();
      saveState();
      toast('✓ Checked in: ' + (match.name || 'ABES Student'));
      form.code.value = '';
      router();
      return;
    }

    // Add Club (Admin)
    if (form.id === 'form_add_club') {
      e.preventDefault();
      var fd = new FormData(form);
      S.clubs.push({
        id: 'c_' + Date.now(),
        name: fd.get('name').trim(),
        cat: fd.get('cat'),
        dept: fd.get('dept').trim(),
        lead: fd.get('lead').trim(),
        desc: 'Verified student society at ABES Engineering College.'
      });
      saveState();
      toast('Club verified and registered');
      form.reset();
      router();
      return;
    }

    // AI Copy
    if (form.id === 'form_ai_copy') {
      e.preventDefault();
      var fd = new FormData(form);
      var title = fd.get('title');
      var cat = fd.get('cat');
      var out = $('#ai_copy_output');
      out.innerHTML = '<div class="panel" style="background:var(--surface-alt)">' +
        '<b>Suggested Headline:</b><p style="font-size:18px;color:var(--blue);margin:4px 0">' + esc(title) + ': Unleash Your Potential</p>' +
        '<b>Taglines:</b><ul style="margin:4px 0 10px;padding-left:20px;font-size:13px">' +
          '<li>One campus. Every mind. Connect at ' + esc(title) + '.</li>' +
          '<li>Level up your skills with fellow ABESians.</li>' +
        '</ul>' +
        '<b>Social Blurb:</b><p style="font-size:12px;margin:4px 0">🚨 Calling all ABES engineers! Register now for ' + esc(title) + ' and grab your verified pass.</p>' +
      '</div>';
      return;
    }

    // AI Strategy
    if (form.id === 'form_ai_strategy') {
      e.preventDefault();
      var fd = new FormData(form);
      var title = fd.get('title');
      var days = parseInt(fd.get('days'), 10) || 7;
      var out = $('#ai_strategy_output');
      out.innerHTML = '<div class="panel" style="background:var(--surface-alt);font-size:13px">' +
        '<h4 style="margin:0 0 8px">7-Day Multi-Channel Promotion Plan</h4>' +
        '<p>• <b>Day 1:</b> Publish on CampusConnect & broadcast on verified club WhatsApp groups.</p>' +
        '<p>• <b>Day 3:</b> Deploy physical standee QRs in Library and Cafeteria.</p>' +
        '<p>• <b>Day 5:</b> Conduct 15-minute classroom presentation announcement blitz.</p>' +
        '<p>• <b>Day 7:</b> Final call on Instagram Stories & campus noticeboards.</p>' +
      '</div>';
      return;
    }

    // AI Chat
    if (form.id === 'form_ai_chat') {
      e.preventDefault();
      var msg = form.msg.value.trim();
      var hist = $('#chat_history');
      hist.innerHTML += '<div style="align-self:flex-end;background:var(--blue);color:#FFF;padding:8px 14px;border-radius:8px;max-width:80%">' + esc(msg) + '</div>';
      form.msg.value = '';

      var reply = 'Here are the upcoming events across ABES Engineering College: ' +
        S.events.filter(live).slice(0, 3).map(function(x) { return x.title; }).join(', ') +
        '. You can register directly on CampusConnect to receive your verified pass!';

      setTimeout(function() {
        hist.innerHTML += '<div style="background:var(--surface-alt);padding:10px 14px;border-radius:8px"><b>CampusBot:</b> ' + esc(reply) + '</div>';
        hist.scrollTop = hist.scrollHeight;
      }, 300);
      return;
    }
  });

  // Role Switcher
  var roleSelect = $('#me');
  if (roleSelect) {
    roleSelect.value = S.me;
    roleSelect.addEventListener('change', function(e) {
      S.me = e.target.value;
      editingId = null;
      saveState();
      toast('Switched view to ' + USERS[S.me].name + ' (' + USERS[S.me].role.toUpperCase() + ')');
      if (['#/my', '#/club', '#/review', '#/admin'].indexOf(location.hash) > -1) {
        location.hash = '#/';
      }
      router();
    });
  }

  // Theme Toggle
  var themeBtn = $('#theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var root = document.documentElement;
      var cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', cur);
      toast('Theme switched to ' + cur + ' mode');
    });
  }

  // Window Event Listeners
  window.addEventListener('hashchange', router);
  router();

})();

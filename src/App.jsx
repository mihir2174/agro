import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Sprout, FlaskConical, Users, CalendarDays,
  UserCog, Plus, MapPin, Check, ChevronRight, X, Search, Bell, Menu,
  Leaf, Phone, Ruler, Clock, Crown, ShieldCheck, LocateFixed, IndianRupee,
  Layers, ArrowRight, Lock, LayoutGrid, Camera, AlertTriangle, BarChart3, Image as ImageIcon
} from "lucide-react";

/* ============================================================
   GreenGrow — Agro Agency Demo Management (prototype, fake data)
   Demo = one (farmer × crop). Farmers run many demos.
   Stages carry days-to-next → due dates → reminders.
   Officers update each stage with photo + remarks.
   Each demo records qty + price given to the farmer.
   ============================================================ */

const PEOPLE = [
  { id: "u_admin", name: "Rajesh Patel",   role: "admin",    title: "Agency Owner",          region: "Saurashtra" },
  { id: "u_mgr1",  name: "Suresh Mehta",   role: "manager",  title: "Area Manager · Rajkot", reportsTo: "u_admin" },
  { id: "u_mgr2",  name: "Kavita Shah",    role: "manager",  title: "Area Manager · Amreli", reportsTo: "u_admin" },
  { id: "u_emp1",  name: "Amit Chauhan",   role: "employee", title: "Field Officer",         manager: "u_mgr1" },
  { id: "u_emp2",  name: "Priya Desai",    role: "employee", title: "Field Officer",         manager: "u_mgr1" },
  { id: "u_emp3",  name: "Vikram Solanki", role: "employee", title: "Field Officer",         manager: "u_mgr2" },
  { id: "u_emp4",  name: "Neha Joshi",     role: "employee", title: "Field Officer",         manager: "u_mgr2" },
];
const USER_FOR_ROLE = { admin: "u_admin", manager: "u_mgr1", employee: "u_emp1" };
const byId = (id) => PEOPLE.find((p) => p.id === id);

const SEED_PRODUCTS = [
  { id: "p1", name: "Kaveri 9090",       cat: "Seed",       brand: "Kaveri Seeds", pack: "450 g",  price: 810 },
  { id: "p2", name: "Pioneer GG-20",     cat: "Seed",       brand: "Corteva",      pack: "10 kg",  price: 1250 },
  { id: "p3", name: "Lok-1 Wheat Seed",  cat: "Seed",       brand: "Mahyco",       pack: "20 kg",  price: 690 },
  { id: "p4", name: "IFFCO Urea 46%",    cat: "Fertilizer", brand: "IFFCO",        pack: "45 kg",  price: 267 },
  { id: "p5", name: "Coromandel DAP",    cat: "Fertilizer", brand: "Coromandel",   pack: "50 kg",  price: 1350 },
  { id: "p6", name: "Zinc Sulphate 21%", cat: "Fertilizer", brand: "Aries Agro",   pack: "5 kg",   price: 420 },
  { id: "p7", name: "Confidor 200 SL",   cat: "Pesticide",  brand: "Bayer",        pack: "100 ml", price: 340 },
  { id: "p8", name: "Amistar Fungicide", cat: "Pesticide",  brand: "Syngenta",     pack: "250 ml", price: 985 },
  { id: "p9", name: "Saaf Carbendazim",  cat: "Pesticide",  brand: "UPL",          pack: "500 g",  price: 310 },
];

/* stages carry {name, days} — days until the NEXT stage is due (terminal stage: days 0) */
const SEED_CROPS = [
  { id: "c1", name: "Cotton", icon: "🌱", season: "Kharif", stages: [
    { name: "Sowing", days: 7 }, { name: "Germination", days: 10 }, { name: "Vegetative", days: 18 },
    { name: "Squaring", days: 14 }, { name: "Flowering", days: 12 }, { name: "Boll Formation", days: 20 }, { name: "Harvest", days: 0 } ] },
  { id: "c2", name: "Groundnut", icon: "🥜", season: "Kharif", stages: [
    { name: "Sowing", days: 7 }, { name: "Germination", days: 9 }, { name: "Vegetative", days: 15 },
    { name: "Pegging", days: 12 }, { name: "Pod Development", days: 18 }, { name: "Maturity", days: 14 }, { name: "Harvest", days: 0 } ] },
  { id: "c3", name: "Wheat", icon: "🌾", season: "Rabi", stages: [
    { name: "Sowing", days: 6 }, { name: "Germination", days: 8 }, { name: "Tillering", days: 15 },
    { name: "Jointing", days: 14 }, { name: "Heading", days: 12 }, { name: "Grain Filling", days: 20 }, { name: "Harvest", days: 0 } ] },
];

const SEED_FARMERS = [
  { id: "f1", name: "Bharat Kanani",     phone: "98240 11223", village: "Rajsamadhiyala", acres: 6,  addedBy: "u_emp1", lat: "22.24051", lng: "70.86112" },
  { id: "f2", name: "Mansukh Vaghasiya", phone: "99091 44556", village: "Khandheri",      acres: 4,  addedBy: "u_emp1", lat: "22.31980", lng: "70.72410" },
  { id: "f3", name: "Jayaben Patel",     phone: "94280 77889", village: "Kotharia",       acres: 9,  addedBy: "u_emp2", lat: "22.25630", lng: "70.83200" },
  { id: "f4", name: "Dilip Bhalodia",    phone: "97250 33221", village: "Vinchhiya",      acres: 12, addedBy: "u_emp3", lat: "21.98410", lng: "71.20330" },
  { id: "f5", name: "Ramesh Zala",       phone: "90998 55447", village: "Jetpur",         acres: 5,  addedBy: "u_emp4", lat: "21.75410", lng: "70.62220" },
];

const li = (productId, qty, price) => ({ productId, qty, price });
const SEED_DEMOS = [
  { id: "d1", cropId: "c1", farmerId: "f1", assignedTo: "u_emp1", start: "2026-07-02", stageIndex: 4, stageStart: "2026-08-20",
    items: [li("p1", 2, 810), li("p7", 3, 340)],
    log: [
      { stageIndex: 0, stageName: "Sowing",     date: "2026-07-02", remarks: "Sown across 2 acres, soil moisture good.", completed: true, photo: null },
      { stageIndex: 2, stageName: "Vegetative", date: "2026-07-30", remarks: "Healthy canopy, applied zinc spray.",      completed: true, photo: null } ] },
  { id: "d6", cropId: "c2", farmerId: "f1", assignedTo: "u_emp1", start: "2026-07-20", stageIndex: 3, stageStart: "2026-08-15",
    items: [li("p2", 1, 1250), li("p6", 4, 420)],
    log: [{ stageIndex: 0, stageName: "Sowing", date: "2026-07-20", remarks: "Good germination expected.", completed: true, photo: null }] },
  { id: "d7", cropId: "c3", farmerId: "f1", assignedTo: "u_emp1", start: "2026-08-05", stageIndex: 1, stageStart: "2026-08-26", items: [li("p3", 2, 690), li("p4", 3, 267)], log: [] },
  { id: "d2", cropId: "c2", farmerId: "f2", assignedTo: "u_emp1", start: "2026-07-10", stageIndex: 2, stageStart: "2026-08-24", items: [li("p2", 1, 1250), li("p6", 2, 420)], log: [] },
  { id: "d3", cropId: "c1", farmerId: "f3", assignedTo: "u_emp2", start: "2026-06-28", stageIndex: 6, stageStart: "2026-08-10", items: [li("p1", 3, 810), li("p8", 1, 985)], log: [] },
  { id: "d8", cropId: "c2", farmerId: "f3", assignedTo: "u_emp2", start: "2026-07-18", stageIndex: 2, stageStart: "2026-08-28", items: [li("p2", 2, 1250), li("p5", 1, 1350)], log: [] },
  { id: "d4", cropId: "c2", farmerId: "f4", assignedTo: "u_emp3", start: "2026-07-15", stageIndex: 1, stageStart: "2026-08-29", items: [li("p2", 1, 1250), li("p5", 2, 1350)], log: [] },
  { id: "d5", cropId: "c3", farmerId: "f5", assignedTo: "u_emp4", start: "2026-08-01", stageIndex: 0, stageStart: "2026-08-30", items: [li("p3", 1, 690), li("p4", 4, 267)], log: [] },
];

const SEED_MEETINGS = [
  { id: "m1", title: "Cotton field walk — Rajsamadhiyala", type: "Farmer Meet",      date: "2026-08-24", time: "09:30", host: "u_emp1", place: "Bharat Kanani's field" },
  { id: "m2", title: "Weekly team sync",                    type: "Team Sync",        date: "2026-08-22", time: "17:00", host: "u_mgr1", place: "Rajkot branch office" },
  { id: "m3", title: "Confidor spray demo training",        type: "Product Training", date: "2026-08-26", time: "11:00", host: "u_admin", place: "GreenGrow HQ" },
  { id: "m4", title: "Groundnut pegging review",            type: "Farmer Meet",      date: "2026-08-28", time: "08:00", host: "u_emp3", place: "Vinchhiya" },
];

const NEARBY_VILLAGES = ["Rajsamadhiyala", "Khandheri", "Kotharia", "Vinchhiya", "Jetpur", "Gondal", "Paddhari", "Wankaner"];
const EMOJIS = ["🌱", "🥜", "🌾", "🌽", "🫑", "🍅", "🌻", "🧅", "🥔", "🌶️"];

const CAPS = {
  admin:    { manageProducts: true,  manageCrops: true,  manageTeam: true,  viewTeam: true,  viewReports: true,  canAssign: true,  scope: "all"  },
  manager:  { manageProducts: false, manageCrops: false, manageTeam: false, viewTeam: true,  viewReports: false, canAssign: true,  scope: "team" },
  employee: { manageProducts: false, manageCrops: false, manageTeam: false, viewTeam: false, viewReports: false, canAssign: false, scope: "own"  },
};

const initials = (n) => n.split(" ").map((x) => x[0]).slice(0, 2).join("");
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const fmtINR = (n) => "₹" + (n || 0).toLocaleString("en-IN");
const uid = () => "x" + Math.random().toString(36).slice(2, 8);
const catTone = { Seed: "green", Fertilizer: "amber", Pesticide: "sky" };
const stageName = (s) => (typeof s === "string" ? s : s.name);
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
const demoValue = (d) => (d.items || []).reduce((a, it) => a + it.qty * it.price, 0);

/* reminder: due = stageStart + stage.days; remind from 2 days before */
function reminderFor(demo, crop) {
  const last = crop.stages.length - 1;
  if (demo.stageIndex >= last) return { status: "completed" };
  const days = crop.stages[demo.stageIndex].days || 0;
  const due = addDays(demo.stageStart, days);
  const daysLeft = daysBetween(todayISO(), due);
  const status = daysLeft < 0 ? "overdue" : daysLeft <= 2 ? "dueSoon" : "onTrack";
  return { status, due, daysLeft };
}

/* ============================================================ */
export default function App() {
  const [role, setRole] = useState("admin");
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [crops, setCrops] = useState(SEED_CROPS);
  const [farmers, setFarmers] = useState(SEED_FARMERS);
  const [demos, setDemos] = useState(SEED_DEMOS);
  const [meetings, setMeetings] = useState(SEED_MEETINGS);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [openDemoId, setOpenDemoId] = useState(null);
  const [openCrop, setOpenCrop] = useState(null);
  const [openFarmer, setOpenFarmer] = useState(null);

  const me = byId(USER_FOR_ROLE[role]);
  const caps = CAPS[role];
  const cropById = (id) => crops.find((c) => c.id === id);

  const teamEmployeeIds = useMemo(() => PEOPLE.filter((p) => p.role === "employee" && p.manager === me.id).map((p) => p.id), [me.id]);
  const inScope = (ownerId) => caps.scope === "all" ? true : caps.scope === "team" ? teamEmployeeIds.includes(ownerId) : ownerId === me.id;

  const visDemos = demos.filter((d) => inScope(d.assignedTo));
  const assignedFarmerIds = useMemo(() => new Set(visDemos.map((d) => d.farmerId)), [demos, role]);
  const visFarmers = farmers.filter((f) => inScope(f.addedBy) || assignedFarmerIds.has(f.id));
  const visMeetings = meetings;

  const officers = caps.canAssign
    ? (caps.scope === "all" ? PEOPLE.filter((p) => p.role === "employee") : PEOPLE.filter((p) => p.manager === me.id))
    : [];

  const reminders = visDemos
    .map((d) => ({ d, c: cropById(d.cropId), r: reminderFor(d, cropById(d.cropId)) }))
    .filter((x) => x.r.status === "overdue" || x.r.status === "dueSoon")
    .sort((a, b) => a.r.daysLeft - b.r.daysLeft);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const resetViews = () => { setOpenDemoId(null); setOpenCrop(null); setOpenFarmer(null); };
  const switchRole = (r) => { setRole(r); setPage("dashboard"); resetViews(); setDrawer(false); };
  const go = (p) => { setPage(p); resetViews(); setDrawer(false); };
  const openDemo = (d) => setOpenDemoId(d.id);

  /* actions */
  const addProduct = (p) => { setProducts((s) => [{ ...p, id: uid() }, ...s]); flash("Product added to master"); };
  const addCrop = (c) => { setCrops((s) => [...s, { ...c, id: uid() }]); flash(`${c.name} added — Admin owns crops & stages`); };
  const addStage = (cropId, stage) => { setCrops((s) => s.map((c) => (c.id === cropId ? { ...c, stages: [...c.stages, stage] } : c))); flash("Stage added to pipeline"); };
  const setStageDays = (cropId, idx, days) => setCrops((s) => s.map((c) => c.id === cropId ? { ...c, stages: c.stages.map((st, i) => i === idx ? { ...st, days } : st) } : c));

  const addFarmerStandalone = (f) => {
    const dupe = farmers.find((x) => sameFarmer(x, f));
    if (dupe) { flash(`${dupe.name} is already registered — a farmer is added only once`); return false; }
    setFarmers((s) => [{ ...f, id: uid(), addedBy: me.id }, ...s]); flash("Farmer captured with live location"); return true;
  };
  const resolveFarmerId = (f, ownerId) => {
    const dupe = farmers.find((x) => sameFarmer(x, f));
    if (dupe) { flash(`${dupe.name} already on record — using existing farmer`); return dupe.id; }
    const id = uid(); setFarmers((s) => [{ ...f, id, addedBy: ownerId }, ...s]); return id;
  };

  const submitDemo = (d) => {
    const assignee = caps.canAssign ? (d.assignedTo || me.id) : me.id;
    const farmerId = d.mode === "new" ? resolveFarmerId(d.farmer, assignee) : d.farmerId;
    setDemos((s) => [{ id: uid(), cropId: d.cropId, farmerId, items: d.items, start: d.start, assignedTo: assignee, stageIndex: 0, stageStart: todayISO(), log: [] }, ...s]);
    flash(`Demo started · assigned to ${byId(assignee).name}`); setModal(null);
  };

  const updateStage = ({ demoId, photo, remarks, advance }) => {
    setDemos((s) => s.map((d) => {
      if (d.id !== demoId) return d;
      const crop = cropById(d.cropId); const last = crop.stages.length - 1;
      const entry = { stageIndex: d.stageIndex, stageName: crop.stages[d.stageIndex].name, date: todayISO(), photo: photo || null, remarks: remarks || "", completed: advance };
      const log = [...(d.log || []), entry];
      if (advance && d.stageIndex < last) return { ...d, log, stageIndex: d.stageIndex + 1, stageStart: todayISO() };
      return { ...d, log };
    }));
    flash(advance ? "Stage completed — moved to next" : "Stage update saved"); setModal(null);
  };

  const addMeeting = (m) => { setMeetings((s) => [{ ...m, id: uid(), host: me.id }, ...s]); flash("Meeting scheduled"); };
  const startFor = (farmerId, cropId) => setModal({ type: "demo", presetFarmerId: farmerId, presetCropId: cropId });

  const NAV = [
    { id: "dashboard", label: "Dashboard",      icon: LayoutDashboard },
    { id: "products",  label: "Product Master", icon: Package },
    { id: "crops",     label: "Crops & Stages", icon: Sprout },
    { id: "demos",     label: "Crop Demos",     icon: FlaskConical },
    { id: "track",     label: "Track",          icon: LayoutGrid },
    { id: "farmers",   label: "Farmers",        icon: Users },
    { id: "meetings",  label: "Meetings",       icon: CalendarDays },
    ...(caps.viewReports ? [{ id: "reports", label: "Reports", icon: BarChart3 }] : []),
    ...(caps.viewTeam ? [{ id: "team", label: "Team", icon: UserCog }] : []),
  ];

  const openDemoObj = demos.find((d) => d.id === openDemoId);

  return (
    <div className="gg">
      <style>{CSS}</style>

      <aside className={"sidebar" + (drawer ? " open" : "")}>
        <div className="brand">
          <span className="brand-mark"><Leaf size={20} /></span>
          <div><div className="brand-name">GreenGrow</div><div className="brand-sub">Agro Demo Suite</div></div>
          <button className="drawer-x" onClick={() => setDrawer(false)}><X size={18} /></button>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button key={n.id} className={"nav-item" + (page === n.id ? " active" : "")} onClick={() => go(n.id)}>
              <n.icon size={18} /> <span>{n.label}</span>{page === n.id && <ChevronRight size={16} className="nav-caret" />}
            </button>
          ))}
        </nav>
        <div className="side-foot"><div className="scope-note">
          {caps.scope === "all" && <><ShieldCheck size={14} /> Full agency access</>}
          {caps.scope === "team" && <><Users size={14} /> Your team only</>}
          {caps.scope === "own" && <><Lock size={14} /> Only your farmers</>}
        </div></div>
      </aside>
      {drawer && <div className="scrim" onClick={() => setDrawer(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setDrawer(true)}><Menu size={20} /></button>
          <div className="page-head"><h1>{NAV.find((n) => n.id === page)?.label || "Dashboard"}</h1><p>{me.name} · <span className="role-pill">{role}</span></p></div>
          <div className="topbar-right">
            <div className="search only-desktop"><Search size={16} /><input placeholder="Search farmers, demos…" /></div>
            <RoleSwitch role={role} onChange={switchRole} />
            <button className="icon-btn" title={`${reminders.length} reminders`}><Bell size={18} />{reminders.length > 0 && <span className="count">{reminders.length}</span>}</button>
            <div className="me-avatar" title={me.name}>{initials(me.name)}</div>
          </div>
        </header>

        <main className="content">
          {openDemoObj
            ? <DemoDetail demo={openDemoObj} crops={crops} farmers={farmers} products={products} onBack={() => setOpenDemoId(null)} setModal={setModal} />
            : openFarmer
            ? <FarmerDetail farmer={openFarmer} demos={demos} crops={crops} me={me} onBack={() => setOpenFarmer(null)} onOpenDemo={openDemo} onStart={startFor} setModal={setModal} />
            : openCrop
            ? <CropDetail crop={cropById(openCrop.id) || openCrop} demos={demos} caps={caps} onBack={() => setOpenCrop(null)} onAddStage={(s) => addStage(openCrop.id, s)} onSetDays={(i, dys) => setStageDays(openCrop.id, i, dys)} />
            : (() => { switch (page) {
                case "dashboard": return <Dashboard {...{ me, caps, visDemos, visFarmers, visMeetings, crops, reminders, setModal, onOpenDemo: openDemo, go }} />;
                case "products":  return <Products {...{ products, caps, setModal }} />;
                case "crops":     return <Crops {...{ crops, caps, demos, setOpenCrop, setModal }} />;
                case "demos":     return <Demos {...{ visDemos, crops, farmers, setModal, onOpenDemo: openDemo }} />;
                case "track":     return <Track {...{ visFarmers, visDemos, crops, caps, onOpenDemo: openDemo, onOpenFarmer: setOpenFarmer, onStart: startFor }} />;
                case "farmers":   return <Farmers {...{ visFarmers, demos, crops, caps, me, setModal, setOpenFarmer }} />;
                case "meetings":  return <Meetings {...{ visMeetings, setModal }} />;
                case "reports":   return <Reports {...{ demos, farmers, crops }} />;
                case "team":      return <Team {...{ me, caps, farmers, demos }} />;
                default: return null;
              } })()}
        </main>
      </div>

      {modal?.type === "product" && <ProductModal onClose={() => setModal(null)} onSave={(p) => { addProduct(p); setModal(null); }} />}
      {modal?.type === "crop"    && <CropModal onClose={() => setModal(null)} onSave={(c) => { addCrop(c); setModal(null); }} />}
      {modal?.type === "farmer"  && <FarmerModal onClose={() => setModal(null)} onSave={(f) => { if (addFarmerStandalone(f)) setModal(null); }} />}
      {modal?.type === "demo"    && <DemoModal onClose={() => setModal(null)} onSave={submitDemo} {...{ crops, products, visFarmers, officers, caps, me, presetFarmerId: modal.presetFarmerId, presetCropId: modal.presetCropId }} />}
      {modal?.type === "meeting" && <MeetingModal onClose={() => setModal(null)} onSave={(m) => { addMeeting(m); setModal(null); }} />}
      {modal?.type === "update"  && <UpdateStageModal onClose={() => setModal(null)} onSave={updateStage} demo={demos.find((d) => d.id === modal.demoId)} crop={cropById(demos.find((d) => d.id === modal.demoId).cropId)} />}

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

const sameFarmer = (a, b) => a.phone.replace(/\s/g, "") === b.phone.replace(/\s/g, "") || a.name.trim().toLowerCase() === b.name.trim().toLowerCase();

/* ============================================================ */
function RoleSwitch({ role, onChange }) {
  const opts = [{ id: "admin", label: "Admin", icon: Crown }, { id: "manager", label: "Manager", icon: ShieldCheck }, { id: "employee", label: "Employee", icon: Users }];
  return <div className="roleswitch">{opts.map((o) => <button key={o.id} className={"rs-opt" + (role === o.id ? " on" : "")} onClick={() => onChange(o.id)}><o.icon size={14} /> <span>{o.label}</span></button>)}</div>;
}

function GrowthTrack({ stages, index, compact }) {
  return (
    <div className={"track" + (compact ? " compact" : "")}>
      <div className="track-rail">
        <div className="track-fill" style={{ width: stages.length > 1 ? `${(index / (stages.length - 1)) * 100}%` : "0%" }} />
        {stages.map((s, i) => {
          const state = i < index ? "done" : i === index ? "current" : "todo";
          return (
            <div className={"node " + state} key={i} style={{ left: `${(i / (stages.length - 1)) * 100}%` }}>
              <span className="node-dot">{state === "done" && <Check size={compact ? 10 : 13} />}{state === "current" && <Sprout size={compact ? 11 : 14} />}</span>
              {!compact && <span className="node-label">{stageName(s)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MiniDots({ stages, index }) {
  return <div className="dots">{stages.map((_, i) => <span key={i} className={"dot-mini " + (i < index ? "done" : i === index ? "cur" : "todo")} />)}</div>;
}
function ReminderPill({ r, small }) {
  if (!r || r.status === "onTrack" || r.status === "completed") return null;
  const over = r.status === "overdue";
  return <span className={"rem-pill " + (over ? "over" : "soon") + (small ? " sm" : "")}>{over ? <AlertTriangle size={11} /> : <Clock size={11} />}{over ? `Overdue ${-r.daysLeft}d` : r.daysLeft === 0 ? "Due today" : `Due in ${r.daysLeft}d`}</span>;
}

/* ============================================================ Dashboard */
function Dashboard({ me, caps, visDemos, visFarmers, visMeetings, crops, reminders, setModal, onOpenDemo, go }) {
  const cropById = (id) => crops.find((c) => c.id === id);
  const active = visDemos.filter((d) => d.stageIndex < cropById(d.cropId).stages.length - 1);
  const stagesAdvanced = visDemos.reduce((a, d) => a + d.stageIndex, 0);
  const upcoming = [...visMeetings].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const byCrop = crops.map((c) => ({ name: c.name, icon: c.icon, count: visDemos.filter((d) => d.cropId === c.id).length }));
  const maxCount = Math.max(1, ...byCrop.map((b) => b.count));
  const greet = `${["Good morning", "Good afternoon", "Good evening"][Math.floor(new Date().getHours() / 8) % 3]}, ${me.name.split(" ")[0]}`;

  return (
    <div className="stack">
      <div className="hero">
        <div><p className="eyebrow">{greet}</p>
          <h2 className="hero-title">{active.length} demo{active.length !== 1 ? "s" : ""} growing across your {caps.scope === "own" ? "farms" : "region"}</h2>
          <p className="hero-sub">Every demo is one farmer × one crop, tracked stage by stage.</p></div>
        <button className="btn btn-primary" onClick={() => setModal({ type: "demo" })}><Plus size={16} /> Start a demo</button>
      </div>

      {reminders.length > 0 && (
        <section className="rem-banner">
          <div className="rem-head"><span className="rem-ic"><Bell size={16} /></span><strong>{reminders.length} stage reminder{reminders.length !== 1 && "s"}</strong><span className="muted-sm">complete before the due date</span></div>
          <div className="rem-list">
            {reminders.slice(0, 4).map(({ d, c, r }) => (
              <div className="rem-item" key={d.id}>
                <span className="crop-chip sm">{c.icon}</span>
                <div className="rem-item-main"><div className="rem-item-top">{c.name} · {c.stages[d.stageIndex].name}<ReminderPill r={r} small /></div>
                  <div className="muted-sm"><Clock size={11} /> due {fmtDate(r.due)}</div></div>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "update", demoId: d.id })}><Camera size={13} /> Update</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="kpi-grid">
        <Stat icon={FlaskConical} tone="green" label="Active demos" value={active.length} sub={`${visDemos.length} total`} />
        <Stat icon={Users} tone="sky" label={caps.scope === "own" ? "My farmers" : "Farmers"} value={visFarmers.length} sub="registered" />
        <Stat icon={AlertTriangle} tone="amber" label="Reminders" value={reminders.length} sub="due soon / overdue" />
        <Stat icon={CalendarDays} tone="violet" label="Meetings" value={visMeetings.length} sub="scheduled" />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-head"><h3>Demos in progress</h3><button className="link" onClick={() => go("demos")}>View all <ArrowRight size={14} /></button></div>
          <div className="stack-sm">
            {active.slice(0, 4).map((d) => { const c = cropById(d.cropId); const r = reminderFor(d, c);
              return (
                <button className="demo-row" key={d.id} onClick={() => onOpenDemo(d)}>
                  <span className="crop-chip">{c.icon}</span>
                  <div className="demo-row-main"><div className="demo-row-top"><strong>{c.name} demo</strong><span className="badge badge-green">{c.stages[d.stageIndex].name}</span><ReminderPill r={r} small /></div>
                    <GrowthTrack stages={c.stages} index={d.stageIndex} compact /></div>
                  <ChevronRight size={18} className="muted" />
                </button>
              ); })}
            {active.length === 0 && <Empty text="No active demos yet. Start one to see it grow." />}
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h3>Demos by crop</h3></div>
          <div className="bars">{byCrop.map((b) => (
            <div className="bar-row" key={b.name}><span className="bar-label">{b.icon} {b.name}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.count / maxCount) * 100}%` }} /></div><span className="bar-val">{b.count}</span></div>
          ))}</div>
          <div className="card-head mt"><h3>Upcoming meetings</h3><button className="link" onClick={() => go("meetings")}>All</button></div>
          <div className="stack-xs">{upcoming.map((m) => (
            <div className="mini-meet" key={m.id}><div className="date-chip"><span>{fmtDate(m.date).split(" ")[0]}</span><em>{fmtDate(m.date).split(" ")[1]}</em></div>
              <div><div className="mm-title">{m.title}</div><div className="mm-sub"><Clock size={12} /> {m.time} · {byId(m.host).name}</div></div></div>
          ))}</div>
        </section>
      </div>
    </div>
  );
}
function Stat({ icon: Icon, label, value, sub, tone }) {
  return <div className={"kpi kpi-" + tone}><span className="kpi-ic"><Icon size={18} /></span><div className="kpi-num">{value}</div><div className="kpi-label">{label}</div><div className="kpi-sub">{sub}</div></div>;
}

/* ============================================================ Products */
function Products({ products, caps, setModal }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Seed", "Fertilizer", "Pesticide"];
  const list = products.filter((p) => filter === "All" || p.cat === filter);
  return (
    <div className="stack">
      <SectionHead title="Product master" sub="Seeds, fertilizers and crop-protection products used across demos"
        action={caps.manageProducts && <button className="btn btn-primary" onClick={() => setModal({ type: "product" })}><Plus size={16} /> Add product</button>}
        note={!caps.manageProducts && <span className="ro-note"><Lock size={13} /> View only — the owner maintains the master</span>} />
      <div className="chips">{cats.map((c) => <button key={c} className={"chip" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>{c}</button>)}</div>
      <div className="prod-grid">{list.map((p) => (
        <div className="prod-card" key={p.id}>
          <div className="prod-top"><span className={"badge badge-" + catTone[p.cat]}>{p.cat}</span><span className="prod-price"><IndianRupee size={13} />{p.price}</span></div>
          <div className="prod-name">{p.name}</div><div className="prod-brand">{p.brand}</div><div className="prod-foot"><Package size={13} /> {p.pack}</div>
        </div>
      ))}</div>
    </div>
  );
}

/* ============================================================ Crops */
function Crops({ crops, caps, demos, setOpenCrop, setModal }) {
  return (
    <div className="stack">
      <SectionHead title="Crops & growth stages" sub="Each stage carries the days until the next — Admin sets those, and demos get due dates from them"
        action={caps.manageCrops && <button className="btn btn-primary" onClick={() => setModal({ type: "crop" })}><Plus size={16} /> New crop</button>}
        note={caps.manageCrops ? <span className="ro-note ok"><ShieldCheck size={13} /> You own crops, stages & their day gaps</span> : <span className="ro-note"><Lock size={13} /> Crops & stages are defined by the owner</span>} />
      <div className="crop-grid">{crops.map((c) => { const running = demos.filter((d) => d.cropId === c.id).length;
        return (
          <button className="crop-card" key={c.id} onClick={() => setOpenCrop(c)}>
            <div className="crop-card-head"><span className="crop-emoji">{c.icon}</span>
              <div><div className="crop-name">{c.name}</div><div className="crop-season">{c.season} · {running} demo{running !== 1 && "s"}</div></div>
              <span className="stage-count">{c.stages.length} stages</span></div>
            <GrowthTrack stages={c.stages} index={c.stages.length - 1} compact />
            <div className="crop-stage-tags">{c.stages.slice(0, 4).map((s) => <span key={s.name} className="tag">{s.name}{s.days ? ` ·${s.days}d` : ""}</span>)}{c.stages.length > 4 && <span className="tag more">+{c.stages.length - 4}</span>}</div>
            <span className="crop-open">Open pipeline <ChevronRight size={14} /></span>
          </button>
        ); })}</div>
    </div>
  );
}
function CropDetail({ crop, demos, caps, onBack, onAddStage, onSetDays }) {
  const [val, setVal] = useState("");
  const [days, setDays] = useState("10");
  const running = demos.filter((d) => d.cropId === crop.id).length;
  return (
    <div className="stack">
      <button className="back" onClick={onBack}><ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Crops</button>
      <div className="detail-hero"><span className="crop-emoji xl">{crop.icon}</span>
        <div><h2 className="detail-title">{crop.name}</h2><p className="detail-sub">{crop.season} season · {crop.stages.length} stages · {running} demo{running !== 1 && "s"} running</p></div></div>
      <div className="card">
        <div className="card-head"><h3>Stage pipeline & day gaps</h3><span className="muted-sm">days = time until the next stage is due</span></div>
        <div className="pipe-days">
          {crop.stages.map((s, i) => { const terminal = i === crop.stages.length - 1;
            return (
              <div className="pd-step" key={i}>
                <span className="pd-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pd-name">{s.name}</span>
                {terminal ? <span className="pd-terminal">final stage</span>
                  : caps.manageCrops
                    ? <span className="pd-days"><input type="number" min="1" value={s.days} onChange={(e) => onSetDays(i, Number(e.target.value) || 0)} /> days → next</span>
                    : <span className="pd-days ro">{s.days} days → next</span>}
              </div>
            ); })}
        </div>
        {caps.manageCrops && (
          <div className="add-stage">
            <input placeholder="New stage name (e.g. Top Dressing)" value={val} onChange={(e) => setVal(e.target.value)} />
            <input className="days-in" type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} /> <span className="days-lbl">days</span>
            <button className="btn btn-primary" disabled={!val.trim()} onClick={() => { onAddStage({ name: val.trim(), days: Number(days) || 0 }); setVal(""); }}><Plus size={16} /> Add stage</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ Demos */
function Demos({ visDemos, crops, farmers, setModal, onOpenDemo }) {
  const cropById = (id) => crops.find((c) => c.id === id);
  return (
    <div className="stack">
      <SectionHead title="Crop demos" sub="Each card is one farmer × one crop, with its stage due date and the value given"
        action={<button className="btn btn-primary" onClick={() => setModal({ type: "demo" })}><Plus size={16} /> Start demo</button>} />
      <div className="demo-grid">{visDemos.map((d) => { const c = cropById(d.cropId); const f = farmers.find((x) => x.id === d.farmerId); const done = d.stageIndex >= c.stages.length - 1; const r = reminderFor(d, c);
        return (
          <button className="card demo-card" key={d.id} onClick={() => onOpenDemo(d)}>
            <div className="demo-card-head"><span className="crop-chip lg">{c.icon}</span>
              <div className="demo-card-title"><strong>{c.name} demo</strong><span className="muted-sm"><MapPin size={12} /> {f?.name} · {f?.village}</span></div>
              <span className={"badge " + (done ? "badge-amber" : "badge-green")}>{done ? "Harvest" : c.stages[d.stageIndex].name}</span></div>
            <GrowthTrack stages={c.stages} index={d.stageIndex} />
            <div className="demo-card-foot"><span className="tiny"><Sprout size={12} /> {byId(d.assignedTo).name}</span><span className="tiny"><IndianRupee size={12} />{demoValue(d).toLocaleString("en-IN")}</span><ReminderPill r={r} small /></div>
          </button>
        ); })}
        {visDemos.length === 0 && <Empty text="No demos in your scope yet." />}
      </div>
    </div>
  );
}
function DemoDetail({ demo: d, crops, farmers, products, onBack, setModal }) {
  const c = crops.find((x) => x.id === d.cropId);
  const f = farmers.find((x) => x.id === d.farmerId);
  const done = d.stageIndex >= c.stages.length - 1;
  const r = reminderFor(d, c);
  const items = (d.items || []).map((it) => ({ ...it, p: products.find((p) => p.id === it.productId) }));
  const total = demoValue(d);
  const log = [...(d.log || [])].reverse();

  return (
    <div className="stack">
      <button className="back" onClick={onBack}><ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Back</button>
      <div className="detail-hero"><span className="crop-emoji xl">{c.icon}</span>
        <div><h2 className="detail-title">{c.name} demo</h2>
          <p className="detail-sub"><MapPin size={13} /> {f?.name} · {f?.village} · {f?.acres} acres · <Sprout size={13} /> {byId(d.assignedTo).name} · started {fmtDate(d.start)}</p></div>
        <span className={"badge lg " + (done ? "badge-amber" : "badge-green")}>{done ? "Completed" : "In progress"}</span></div>

      <div className="card">
        <div className="card-head"><h3>Growth progress</h3>
          <span className="muted-sm">{done ? "reached harvest" : <>current stage due {fmtDate(r.due)} <ReminderPill r={r} small /></>}</span></div>
        <div className="track-full-wrap"><GrowthTrack stages={c.stages} index={d.stageIndex} /></div>
        <div className="advance-bar">
          <div><div className="advance-label">Current stage</div><div className="advance-stage"><Sprout size={16} /> {c.stages[d.stageIndex].name}{!done && <span className="stage-due">· {c.stages[d.stageIndex].days} day gap</span>}</div></div>
          {done ? <span className="done-pill"><Check size={15} /> Demo reached harvest</span>
                : <button className="btn btn-primary" onClick={() => setModal({ type: "update", demoId: d.id })}><Camera size={16} /> Update stage (photo + remarks)</button>}
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head"><h3>Products given to farmer</h3><span className="muted-sm">quantity × price</span></div>
          <div className="bill">
            <div className="bill-row bill-head"><span>Product</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
            {items.map((it) => (
              <div className="bill-row" key={it.productId}><span className="bill-name"><span className={"dot-cat " + catTone[it.p?.cat]} />{it.p?.name}</span><span>{it.qty}</span><span>{fmtINR(it.price)}</span><span>{fmtINR(it.qty * it.price)}</span></div>
            ))}
            <div className="bill-row bill-total"><span>Total value given</span><span></span><span></span><span>{fmtINR(total)}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Farmer</h3></div>
          <div className="farmer-detail"><div className="fd-avatar">{initials(f.name)}</div>
            <div><div className="fd-name">{f.name}</div><div className="fd-line"><Phone size={13} /> {f.phone}</div><div className="fd-line"><MapPin size={13} /> {f.village}</div><div className="fd-line"><Ruler size={13} /> {f.acres} acres · {f.lat}, {f.lng}</div></div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Stage updates</h3><span className="muted-sm">{log.length} logged · photo + remarks per stage</span></div>
        {log.length === 0 ? <Empty text="No stage updates yet. Use “Update stage” to log a field photo and remarks." /> : (
          <div className="log">{log.map((e, i) => (
            <div className="log-item" key={i}>
              {e.photo ? <img className="log-photo" src={e.photo} alt="stage" /> : <div className="log-photo none"><ImageIcon size={18} /></div>}
              <div className="log-main"><div className="log-top"><strong>{e.stageName}</strong>{e.completed && <span className="badge badge-green">completed</span>}<span className="muted-sm">{fmtDate(e.date)}</span></div>
                <p className="log-remark">{e.remarks || <em className="muted">No remarks</em>}</p></div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ Track */
function Track({ visFarmers, visDemos, crops, caps, onOpenDemo, onOpenFarmer, onStart }) {
  const cellDemo = (fid, cid) => visDemos.find((d) => d.farmerId === fid && d.cropId === cid);
  const rows = visFarmers.filter((f) => visDemos.some((d) => d.farmerId === f.id) || caps.scope === "own");
  const totalActive = visDemos.filter((d) => d.stageIndex < crops.find((c) => c.id === d.cropId).stages.length - 1).length;
  return (
    <div className="stack">
      <SectionHead title="Track" sub="Farmers down the side, crops across the top. A row is one farmer's crops; a column is one crop across farmers." />
      <div className="legend"><span><span className="dot-mini done" /> done</span><span><span className="dot-mini cur" /> current</span><span><span className="dot-mini todo" /> upcoming</span><span className="legend-sep" /><span>{totalActive} active · {visDemos.length} demos · {rows.length} farmers</span></div>
      <div className="matrix-scroll">
        <table className="matrix">
          <thead><tr><th className="mx-corner">Farmer / Crop</th>{crops.map((c) => <th key={c.id} className="mx-crop-head"><span className="mx-crop-emoji">{c.icon}</span>{c.name}</th>)}</tr></thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id}>
                <td className="mx-farmer"><button onClick={() => onOpenFarmer(f)}><span className="fd-avatar xs">{initials(f.name)}</span><span><span className="mxf-name">{f.name}</span><span className="mxf-village"><MapPin size={10} /> {f.village}</span></span></button></td>
                {crops.map((c) => { const d = cellDemo(f.id, c.id);
                  if (!d) return <td key={c.id}><button className="cell empty" onClick={() => onStart(f.id, c.id)}><Plus size={14} /></button></td>;
                  const done = d.stageIndex >= c.stages.length - 1; const r = reminderFor(d, c);
                  return (
                    <td key={c.id}><button className={"cell filled" + (done ? " done" : "")} onClick={() => onOpenDemo(d)}>
                      <span className="cell-stage">{done ? "Harvest ✓" : c.stages[d.stageIndex].name}</span>
                      <div className="cell-foot"><MiniDots stages={c.stages} index={d.stageIndex} /><ReminderPill r={r} small /></div>
                    </button></td>
                  ); })}
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="mx-empty" colSpan={crops.length + 1}>No farmers in your scope yet. Start a demo to add one from the field.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================ Farmers */
function Farmers({ visFarmers, demos, crops, caps, me, setModal, setOpenFarmer }) {
  const cropById = (id) => crops.find((c) => c.id === id);
  return (
    <div className="stack">
      <SectionHead title={caps.scope === "own" ? "My farmers" : "Farmers"}
        sub={caps.scope === "own" ? "Farmers you registered, plus any demo allocated to you" : caps.scope === "team" ? "Farmers registered by your field team" : "Every farmer across the agency"}
        action={<button className="btn btn-primary" onClick={() => setModal({ type: "farmer" })}><Plus size={16} /> Add farmer</button>}
        note={<span className="ro-note"><LocateFixed size={13} /> Location is captured live · each farmer is added only once</span>} />
      <div className="farmer-grid">{visFarmers.map((f) => { const fd = demos.filter((d) => d.farmerId === f.id);
        return (
          <button className="card farmer-card" key={f.id} onClick={() => setOpenFarmer(f)}>
            <div className="fc-head"><div className="fd-avatar">{initials(f.name)}</div><div><div className="fc-name">{f.name}</div><div className="fc-village"><MapPin size={12} /> {f.village}</div></div></div>
            <div className="fc-lines"><span><Phone size={13} /> {f.phone}</span><span><Ruler size={13} /> {f.acres} acres</span></div>
            <div className="fc-crops">{fd.length ? fd.map((d) => { const c = cropById(d.cropId); return <span key={d.id} className="crop-mini">{c.icon} {c.name} · {c.stages[d.stageIndex].name}</span>; }) : <span className="crop-mini none">No demos yet</span>}</div>
            <div className="fc-foot">{fd.length} demo{fd.length !== 1 && "s"} · by {byId(f.addedBy).name}{f.addedBy === me.id ? " (you)" : ""} <ChevronRight size={13} /></div>
          </button>
        ); })}
        {visFarmers.length === 0 && <Empty text="You haven't registered any farmers yet. Add your first one." />}
      </div>
    </div>
  );
}
function FarmerDetail({ farmer, demos, crops, me, onBack, onOpenDemo, onStart, setModal }) {
  const fd = demos.filter((d) => d.farmerId === farmer.id);
  const cropById = (id) => crops.find((c) => c.id === id);
  return (
    <div className="stack">
      <button className="back" onClick={onBack}><ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Farmers</button>
      <div className="detail-hero"><div className="fd-avatar xl">{initials(farmer.name)}</div>
        <div><h2 className="detail-title">{farmer.name}</h2><p className="detail-sub"><MapPin size={13} /> {farmer.village} · <Phone size={13} /> {farmer.phone} · <Ruler size={13} /> {farmer.acres} acres · <LocateFixed size={13} /> {farmer.lat}, {farmer.lng}</p></div>
        <button className="btn btn-primary" onClick={() => onStart(farmer.id, null)}><Plus size={16} /> Start another demo</button></div>
      <div className="card">
        <div className="card-head"><h3>Demos for this farmer</h3><span className="muted-sm">{fd.length} across crops · each on its own stage & due date</span></div>
        <div className="fd-demos">{fd.map((d) => { const c = cropById(d.cropId); const done = d.stageIndex >= c.stages.length - 1; const r = reminderFor(d, c);
          return (
            <div className="fd-demo" key={d.id}>
              <div className="fd-demo-head"><span className="crop-chip">{c.icon}</span><div className="fd-demo-title"><strong>{c.name}</strong><span className="muted-sm">{fmtINR(demoValue(d))} given</span></div><span className={"badge " + (done ? "badge-amber" : "badge-green")}>{done ? "Harvest" : c.stages[d.stageIndex].name}</span></div>
              <GrowthTrack stages={c.stages} index={d.stageIndex} />
              <div className="fd-demo-actions"><ReminderPill r={r} small /><button className="btn btn-ghost btn-sm" onClick={() => onOpenDemo(d)}>Open</button>{!done && <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "update", demoId: d.id })}><Camera size={14} /> Update stage</button>}</div>
            </div>
          ); })}
          {fd.length === 0 && <Empty text="No demos for this farmer yet. Start one above." />}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ Meetings */
function Meetings({ visMeetings, setModal }) {
  const sorted = [...visMeetings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const tone = { "Farmer Meet": "green", "Team Sync": "sky", "Product Training": "amber" };
  return (
    <div className="stack">
      <SectionHead title="Meetings" sub="Farmer meets, team syncs and product trainings — everyone can schedule" action={<button className="btn btn-primary" onClick={() => setModal({ type: "meeting" })}><Plus size={16} /> Schedule meeting</button>} />
      <div className="meet-list">{sorted.map((m) => (
        <div className="card meet-card" key={m.id}><div className="meet-date"><span>{fmtDate(m.date).split(" ")[0]}</span><em>{fmtDate(m.date).split(" ")[1]}</em></div>
          <div className="meet-main"><div className="meet-title-row"><strong>{m.title}</strong><span className={"badge badge-" + tone[m.type]}>{m.type}</span></div>
            <div className="meet-sub"><Clock size={13} /> {m.time} <span className="sep">·</span> <MapPin size={13} /> {m.place} <span className="sep">·</span> {byId(m.host).name}</div></div></div>
      ))}</div>
    </div>
  );
}

/* ============================================================ Reports (admin) */
function Reports({ demos, farmers, crops }) {
  const cropById = (id) => crops.find((c) => c.id === id);
  const totalValue = demos.reduce((a, d) => a + demoValue(d), 0);
  const active = demos.filter((d) => d.stageIndex < cropById(d.cropId).stages.length - 1).length;
  const statusCount = { onTrack: 0, dueSoon: 0, overdue: 0, completed: 0 };
  demos.forEach((d) => { statusCount[reminderFor(d, cropById(d.cropId)).status]++; });
  const byCrop = crops.map((c) => { const ds = demos.filter((d) => d.cropId === c.id); return { name: c.name, icon: c.icon, count: ds.length, value: ds.reduce((a, d) => a + demoValue(d), 0) }; });
  const maxVal = Math.max(1, ...byCrop.map((b) => b.value));
  const employees = PEOPLE.filter((p) => p.role === "employee").map((e) => {
    const ds = demos.filter((d) => d.assignedTo === e.id);
    return { name: e.name, mgr: byId(e.manager).name, farmers: farmers.filter((f) => f.addedBy === e.id).length, demos: ds.length,
      stages: ds.reduce((a, d) => a + d.stageIndex, 0), value: ds.reduce((a, d) => a + demoValue(d), 0),
      overdue: ds.filter((d) => reminderFor(d, cropById(d.cropId)).status === "overdue").length };
  });

  return (
    <div className="stack">
      <SectionHead title="Overall report" sub="Agency-wide view across every demo, crop and field officer" note={<span className="ro-note ok"><ShieldCheck size={13} /> Visible to the owner only</span>} />
      <div className="kpi-grid">
        <Stat icon={FlaskConical} tone="green" label="Total demos" value={demos.length} sub={`${active} active`} />
        <Stat icon={IndianRupee} tone="amber" label="Value given" value={fmtINR(totalValue)} sub="products to farmers" />
        <Stat icon={AlertTriangle} tone="sky" label="Overdue stages" value={statusCount.overdue} sub={`${statusCount.dueSoon} due soon`} />
        <Stat icon={Users} tone="violet" label="Farmers" value={farmers.length} sub="registered" />
      </div>

      <div className="two-col">
        <div className="card"><div className="card-head"><h3>Value given by crop</h3></div>
          <div className="bars">{byCrop.map((b) => (
            <div className="bar-row" key={b.name}><span className="bar-label">{b.icon} {b.name}</span><div className="bar-track"><div className="bar-fill" style={{ width: `${(b.value / maxVal) * 100}%` }} /></div><span className="bar-val" style={{ width: 64, fontSize: 12 }}>{fmtINR(b.value)}</span></div>
          ))}</div>
        </div>
        <div className="card"><div className="card-head"><h3>Demos by status</h3></div>
          <div className="status-grid">
            <div className="status-cell on"><div className="sc-num">{statusCount.onTrack}</div><div className="sc-lbl">On track</div></div>
            <div className="status-cell soon"><div className="sc-num">{statusCount.dueSoon}</div><div className="sc-lbl">Due soon</div></div>
            <div className="status-cell over"><div className="sc-num">{statusCount.overdue}</div><div className="sc-lbl">Overdue</div></div>
            <div className="status-cell done"><div className="sc-num">{statusCount.completed}</div><div className="sc-lbl">Completed</div></div>
          </div>
        </div>
      </div>

      <div className="card"><div className="card-head"><h3>Field officer performance</h3></div>
        <div className="rep-scroll"><table className="rep-table">
          <thead><tr><th>Officer</th><th>Manager</th><th>Farmers</th><th>Demos</th><th>Stages done</th><th>Overdue</th><th>Value given</th></tr></thead>
          <tbody>{employees.map((e) => (
            <tr key={e.name}><td className="rep-name"><span className="fd-avatar xs">{initials(e.name)}</span>{e.name}</td><td>{e.mgr}</td><td>{e.farmers}</td><td>{e.demos}</td><td>{e.stages}</td>
              <td>{e.overdue > 0 ? <span className="rem-pill over sm"><AlertTriangle size={11} />{e.overdue}</span> : "0"}</td><td className="rep-val">{fmtINR(e.value)}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

/* ============================================================ Team */
function Team({ me, caps, farmers, demos }) {
  const stat = (id) => ({ farmers: farmers.filter((f) => f.addedBy === id).length, demos: demos.filter((d) => d.assignedTo === id).length });
  const managers = caps.manageTeam ? PEOPLE.filter((p) => p.role === "manager") : PEOPLE.filter((p) => p.id === me.id);
  return (
    <div className="stack">
      <SectionHead title={caps.manageTeam ? "Team" : "Your field team"} sub={caps.manageTeam ? "The whole agency — owner, managers and the officers under each" : "The officers reporting to you and what they're running"} />
      {caps.manageTeam && <div className="card owner-card"><div className="fd-avatar owner">{initials("Rajesh Patel")}</div><div><div className="fc-name">Rajesh Patel <span className="badge badge-amber">Owner</span></div><div className="fc-village">Agency Owner · Saurashtra</div></div></div>}
      {managers.map((mgr) => { const emps = PEOPLE.filter((p) => p.manager === mgr.id);
        return (
          <div className="card mgr-block" key={mgr.id}>
            <div className="mgr-head"><div className="fd-avatar mgr">{initials(mgr.name)}</div><div><div className="fc-name">{mgr.name} <span className="badge badge-sky">{caps.manageTeam ? "Manager" : "You"}</span></div><div className="fc-village">{mgr.title}</div></div><span className="mgr-count">{emps.length} field officers</span></div>
            <div className="emp-row">{emps.map((e) => { const s = stat(e.id); return (
              <div className="emp-card" key={e.id}><div className="fd-avatar sm">{initials(e.name)}</div><div className="emp-name">{e.name}</div><div className="emp-stats"><span>{s.farmers} farmers</span><span>{s.demos} demos</span></div></div>
            ); })}</div>
          </div>
        ); })}
    </div>
  );
}

/* ============================================================ shared */
function SectionHead({ title, sub, action, note }) { return <div className="section-head"><div><h2 className="sh-title">{title}</h2><p className="sh-sub">{sub}</p>{note}</div>{action}</div>; }
function Empty({ text }) { return <div className="empty"><Sprout size={22} /><p>{text}</p></div>; }
function Field({ label, children }) { return <label className="field"><span className="field-label">{label}</span>{children}</label>; }
function Modal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">{children}</div>{footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
function GeoCapture({ loc, setLoc, onVillage }) {
  const fetchLoc = () => {
    setLoc({ status: "loading" });
    const fallback = () => { const v = NEARBY_VILLAGES[Math.floor(Math.random() * NEARBY_VILLAGES.length)]; setLoc({ status: "done", lat: (21.6 + Math.random() * 0.9).toFixed(5), lng: (70.6 + Math.random() * 0.9).toFixed(5), village: v, approx: true }); onVillage && onVillage(v); };
    if (navigator.geolocation) { const t = setTimeout(fallback, 6500);
      navigator.geolocation.getCurrentPosition((pos) => { clearTimeout(t); setLoc({ status: "done", lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5), village: "", approx: false }); }, () => { clearTimeout(t); fallback(); }, { enableHighAccuracy: true, timeout: 6000 });
    } else fallback();
  };
  return (
    <div className={"geo-box" + (loc?.status === "done" ? " ready" : "")}>
      <div className="geo-ic"><LocateFixed size={18} /></div>
      <div className="geo-main">
        {!loc && <><div className="geo-title">Location not captured</div><div className="geo-sub">Fetch GPS on the field before saving</div></>}
        {loc?.status === "loading" && <><div className="geo-title">Fetching GPS…</div><div className="geo-sub">Reading device location</div></>}
        {loc?.status === "done" && <><div className="geo-title">Location captured{loc.approx ? " (approx.)" : ""}</div><div className="geo-sub">{loc.lat}, {loc.lng}{loc.village ? ` · near ${loc.village}` : ""}</div></>}
      </div>
      <button className="btn btn-sky btn-sm" onClick={fetchLoc}>{loc?.status === "done" ? "Re-fetch" : "Fetch"}</button>
    </div>
  );
}
function PhotoInput({ photo, setPhoto }) {
  const onFile = (e) => { const file = e.target.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = () => setPhoto(r.result); r.readAsDataURL(file); };
  return (
    <label className={"photo-input" + (photo ? " has" : "")}>
      {photo ? <img src={photo} alt="stage" /> : <span className="pi-empty"><Camera size={22} /><span>Tap to add a field photo</span></span>}
      <input type="file" accept="image/*" capture="environment" onChange={onFile} hidden />
    </label>
  );
}

/* ---------- modals ---------- */
function ProductModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", brand: "", cat: "Seed", pack: "", price: "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ok = f.name && f.brand && f.pack && f.price;
  return (
    <Modal title="Add product" subtitle="New entry in the product master" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!ok} onClick={() => onSave({ ...f, price: Number(f.price) })}>Save product</button></>}>
      <Field label="Product name"><input value={f.name} onChange={set("name")} placeholder="e.g. Kaveri Jadoo Cotton" /></Field>
      <Field label="Brand"><input value={f.brand} onChange={set("brand")} placeholder="e.g. Kaveri Seeds" /></Field>
      <div className="grid2"><Field label="Category"><select value={f.cat} onChange={set("cat")}><option>Seed</option><option>Fertilizer</option><option>Pesticide</option></select></Field><Field label="Pack size"><input value={f.pack} onChange={set("pack")} placeholder="e.g. 450 g" /></Field></div>
      <Field label="Price (₹)"><input type="number" value={f.price} onChange={set("price")} placeholder="e.g. 810" /></Field>
    </Modal>
  );
}
function CropModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", season: "Kharif", icon: "🌱" });
  const [stages, setStages] = useState([{ name: "Sowing", days: 7 }, { name: "Germination", days: 10 }, { name: "Harvest", days: 0 }]);
  const [stg, setStg] = useState(""); const [stgDays, setStgDays] = useState("10");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const addStg = () => { if (stg.trim()) { setStages((s) => [...s, { name: stg.trim(), days: Number(stgDays) || 0 }]); setStg(""); setStgDays("10"); } };
  const ok = f.name && stages.length >= 2;
  return (
    <Modal title="New crop" subtitle="Define a crop and the stages (with day gaps) its demos move through" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!ok} onClick={() => onSave({ ...f, stages })}>Create crop</button></>}>
      <div className="grid2"><Field label="Crop name"><input value={f.name} onChange={set("name")} placeholder="e.g. Castor" /></Field><Field label="Season"><select value={f.season} onChange={set("season")}><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></Field></div>
      <Field label="Icon"><div className="emoji-pick">{EMOJIS.map((e) => <button key={e} type="button" className={"emoji-opt" + (f.icon === e ? " on" : "")} onClick={() => setF((s) => ({ ...s, icon: e }))}>{e}</button>)}</div></Field>
      <Field label="Stage pipeline (name · days to next)">
        <div className="stage-edit">{stages.map((s, i) => (
          <span className="stage-tag" key={i}>{i + 1}. {s.name}{i < stages.length - 1 ? ` ·${s.days}d` : ""}<button type="button" onClick={() => setStages((x) => x.filter((_, j) => j !== i))}><X size={11} /></button></span>
        ))}</div>
        <div className="stage-add"><input value={stg} onChange={(e) => setStg(e.target.value)} placeholder="Stage name…" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStg())} /><input className="days-in" type="number" min="1" value={stgDays} onChange={(e) => setStgDays(e.target.value)} /><span className="days-lbl">d</span><button type="button" className="btn btn-ghost btn-sm" onClick={addStg}><Plus size={14} /></button></div>
      </Field>
    </Modal>
  );
}
function FarmerModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", phone: "", village: "", acres: "" }); const [loc, setLoc] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ok = f.name && f.phone && f.village && f.acres && loc?.status === "done";
  return (
    <Modal title="Add farmer" subtitle="Capture live location on the field — a farmer is registered only once" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!ok} onClick={() => onSave({ ...f, acres: Number(f.acres), lat: loc.lat, lng: loc.lng })}>Register farmer</button></>}>
      <GeoCapture loc={loc} setLoc={setLoc} onVillage={(v) => setF((s) => ({ ...s, village: s.village || v }))} />
      <Field label="Farmer name"><input value={f.name} onChange={set("name")} placeholder="e.g. Bharat Kanani" /></Field>
      <div className="grid2"><Field label="Phone"><input value={f.phone} onChange={set("phone")} placeholder="98240 11223" /></Field><Field label="Land (acres)"><input type="number" value={f.acres} onChange={set("acres")} placeholder="6" /></Field></div>
      <Field label="Village"><input value={f.village} onChange={set("village")} placeholder="Village name" /></Field>
    </Modal>
  );
}
function DemoModal({ onClose, onSave, crops, products, visFarmers, officers, caps, me, presetFarmerId, presetCropId }) {
  const lockedFarmer = presetFarmerId ? visFarmers.find((f) => f.id === presetFarmerId) : null;
  const [mode, setMode] = useState(lockedFarmer ? "existing" : visFarmers.length ? "existing" : "new");
  const [d, setD] = useState({ cropId: presetCropId || crops[0].id, farmerId: presetFarmerId || visFarmers[0]?.id || "", start: "2026-08-30" });
  const [assignedTo, setAssignedTo] = useState(officers[0]?.id || me.id);
  const [nf, setNf] = useState({ name: "", phone: "", village: "", acres: "" }); const [loc, setLoc] = useState(null);
  const [sel, setSel] = useState({}); // productId -> {qty, price}
  const setNfk = (k) => (e) => setNf((s) => ({ ...s, [k]: e.target.value }));
  const toggleProd = (p) => setSel((s) => { const n = { ...s }; if (n[p.id]) delete n[p.id]; else n[p.id] = { qty: 1, price: p.price }; return n; });
  const setLine = (id, k, v) => setSel((s) => ({ ...s, [id]: { ...s[id], [k]: Number(v) || 0 } }));

  const items = Object.entries(sel).map(([productId, v]) => ({ productId, qty: v.qty, price: v.price }));
  const total = items.reduce((a, it) => a + it.qty * it.price, 0);
  const newOk = nf.name && nf.phone && nf.village && nf.acres && loc?.status === "done";
  const ok = d.cropId && items.length > 0 && items.every((it) => it.qty > 0) && (mode === "existing" ? d.farmerId : newOk);

  const submit = () => onSave(mode === "existing"
    ? { mode: "existing", farmerId: d.farmerId, cropId: d.cropId, items, start: d.start, assignedTo }
    : { mode: "new", farmer: { ...nf, acres: Number(nf.acres), lat: loc.lat, lng: loc.lng }, cropId: d.cropId, items, start: d.start, assignedTo });

  return (
    <Modal title="Start crop demo" subtitle="Pick a farmer or add one on the spot, set the crop, quantities and who runs it" onClose={onClose}
      footer={<><span className="modal-total">Total given: {fmtINR(total)}</span><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!ok} onClick={submit}>Start demo</button></>}>
      {!lockedFarmer && <div className="seg"><button className={mode === "existing" ? "on" : ""} onClick={() => setMode("existing")} disabled={!visFarmers.length}>Existing farmer</button><button className={mode === "new" ? "on" : ""} onClick={() => setMode("new")}>New farmer (on the ride)</button></div>}

      {mode === "existing"
        ? (visFarmers.length === 0 ? <div className="warn"><Users size={16} /> No farmers yet — switch to “New farmer”.</div>
            : lockedFarmer ? <div className="locked-farmer"><div className="fd-avatar sm">{initials(lockedFarmer.name)}</div><div><strong>{lockedFarmer.name}</strong><span className="muted-sm">{lockedFarmer.village}</span></div></div>
              : <Field label="Farmer"><select value={d.farmerId} onChange={(e) => setD((s) => ({ ...s, farmerId: e.target.value }))}>{visFarmers.map((fr) => <option key={fr.id} value={fr.id}>{fr.name} · {fr.village}</option>)}</select></Field>)
        : <><GeoCapture loc={loc} setLoc={setLoc} onVillage={(v) => setNf((s) => ({ ...s, village: s.village || v }))} />
            <Field label="Farmer name"><input value={nf.name} onChange={setNfk("name")} placeholder="e.g. new farmer met today" /></Field>
            <div className="grid2"><Field label="Phone"><input value={nf.phone} onChange={setNfk("phone")} placeholder="98xxx xxxxx" /></Field><Field label="Land (acres)"><input type="number" value={nf.acres} onChange={setNfk("acres")} placeholder="5" /></Field></div>
            <Field label="Village"><input value={nf.village} onChange={setNfk("village")} placeholder="Village name" /></Field></>}

      <div className="grid2">
        <Field label="Crop"><select value={d.cropId} onChange={(e) => setD((s) => ({ ...s, cropId: e.target.value }))}>{crops.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></Field>
        <Field label="Start date"><input type="date" value={d.start} onChange={(e) => setD((s) => ({ ...s, start: e.target.value }))} /></Field>
      </div>

      {caps.canAssign && officers.length > 0 && (
        <Field label={`Assign to (${caps.scope === "all" ? "any officer" : "your team"})`}>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>{officers.map((o) => <option key={o.id} value={o.id}>{o.name} · {byId(o.manager)?.name || ""}</option>)}</select>
        </Field>
      )}

      <Field label="Products given to farmer — quantity & price">
        <div className="prod-pick">{products.map((p) => <button key={p.id} type="button" className={"pick" + (sel[p.id] ? " on" : "")} onClick={() => toggleProd(p)}>{sel[p.id] && <Check size={12} />} {p.name}</button>)}</div>
        {items.length > 0 && (
          <div className="qty-list">{Object.entries(sel).map(([id, v]) => { const p = products.find((x) => x.id === id); return (
            <div className="qty-row" key={id}><span className="qty-name">{p.name}</span>
              <span className="qty-field">Qty <input type="number" min="1" value={v.qty} onChange={(e) => setLine(id, "qty", e.target.value)} /></span>
              <span className="qty-field">₹ <input type="number" min="0" value={v.price} onChange={(e) => setLine(id, "price", e.target.value)} /></span>
              <span className="qty-amt">{fmtINR(v.qty * v.price)}</span></div>
          ); })}</div>
        )}
      </Field>
    </Modal>
  );
}
function MeetingModal({ onClose, onSave }) {
  const [f, setF] = useState({ title: "", type: "Farmer Meet", date: "2026-08-31", time: "10:00", place: "" });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ok = f.title && f.date && f.time && f.place;
  return (
    <Modal title="Schedule meeting" subtitle="Farmer meet, team sync or product training" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!ok} onClick={() => onSave(f)}>Schedule</button></>}>
      <Field label="Title"><input value={f.title} onChange={set("title")} placeholder="e.g. Cotton field walk" /></Field>
      <Field label="Type"><select value={f.type} onChange={set("type")}><option>Farmer Meet</option><option>Team Sync</option><option>Product Training</option></select></Field>
      <div className="grid2"><Field label="Date"><input type="date" value={f.date} onChange={set("date")} /></Field><Field label="Time"><input type="time" value={f.time} onChange={set("time")} /></Field></div>
      <Field label="Place"><input value={f.place} onChange={set("place")} placeholder="e.g. Rajsamadhiyala field" /></Field>
    </Modal>
  );
}
function UpdateStageModal({ onClose, onSave, demo, crop }) {
  const stage = crop.stages[demo.stageIndex];
  const last = demo.stageIndex >= crop.stages.length - 1;
  const [photo, setPhoto] = useState(null); const [remarks, setRemarks] = useState(""); const [advance, setAdvance] = useState(!last);
  const nextName = !last ? crop.stages[demo.stageIndex + 1].name : null;
  return (
    <Modal title={`Update · ${stage.name}`} subtitle="Log a field photo and remarks for this stage" onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => onSave({ demoId: demo.id, photo, remarks, advance })}>{advance && !last ? "Save & complete stage" : "Save update"}</button></>}>
      <PhotoInput photo={photo} setPhoto={setPhoto} />
      <Field label="Remarks"><textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="What did you observe? (growth, pest, spray done…)" /></Field>
      {!last && (
        <label className="check-row"><input type="checkbox" checked={advance} onChange={(e) => setAdvance(e.target.checked)} />
          <span>Mark <strong>{stage.name}</strong> complete and move to <strong>{nextName}</strong></span></label>
      )}
      {last && <div className="warn"><Check size={16} /> This is the final stage (harvest).</div>}
    </Modal>
  );
}

/* ============================================================ styles */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap');
.gg{
  --bg:#F1F5EC; --surface:#FFFFFF; --surface-2:#F7FAF3; --ink:#16281E; --ink-soft:#5A6B60; --line:#E4EBDD;
  --primary:#1F6B3B; --primary-d:#17542E; --accent:#7CB342; --amber:#C67A1E; --sky:#2F7FA3; --violet:#7C5CBF; --danger:#C0463B;
  --shadow:0 1px 2px rgba(22,40,30,.05),0 6px 20px rgba(22,40,30,.06);
  --font:'Inter',system-ui,sans-serif; --display:'Bricolage Grotesque',var(--font);
  display:flex; min-height:100vh; background:var(--bg); color:var(--ink); font-family:var(--font); font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased;
}
.gg *{box-sizing:border-box;} .gg button{font-family:inherit; cursor:pointer;} .gg input,.gg select,.gg textarea{font-family:inherit;}
.gg h1,.gg h2,.gg h3{margin:0; font-family:var(--display); letter-spacing:-.01em;}

.sidebar{width:246px; flex-shrink:0; background:var(--surface); border-right:1px solid var(--line); display:flex; flex-direction:column; position:sticky; top:0; height:100vh;}
.brand{display:flex; align-items:center; gap:11px; padding:20px 18px; border-bottom:1px solid var(--line);}
.brand-mark{width:38px; height:38px; border-radius:11px; display:grid; place-items:center; background:linear-gradient(135deg,var(--primary),var(--accent)); color:#fff; box-shadow:0 4px 12px rgba(31,107,59,.32);}
.brand-name{font-family:var(--display); font-weight:700; font-size:17px; line-height:1.1;} .brand-sub{font-size:11px; color:var(--ink-soft); letter-spacing:.02em;}
.drawer-x{display:none; margin-left:auto; background:none; border:none; color:var(--ink-soft);}
.nav{padding:12px 10px; display:flex; flex-direction:column; gap:2px; flex:1; overflow:auto;}
.nav-item{display:flex; align-items:center; gap:11px; width:100%; padding:10px 12px; border:none; border-radius:10px; background:none; color:var(--ink-soft); font-size:13.5px; font-weight:500; text-align:left; transition:.15s;}
.nav-item:hover{background:var(--surface-2); color:var(--ink);} .nav-item.active{background:linear-gradient(90deg,rgba(31,107,59,.12),rgba(124,179,66,.06)); color:var(--primary); font-weight:600;}
.nav-caret{margin-left:auto;} .side-foot{padding:14px; border-top:1px solid var(--line);}
.scope-note{display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--ink-soft); background:var(--surface-2); padding:9px 11px; border-radius:9px;}

.main{flex:1; min-width:0; display:flex; flex-direction:column;}
.topbar{position:sticky; top:0; z-index:20; display:flex; align-items:center; gap:14px; padding:13px 24px; background:rgba(241,245,236,.82); backdrop-filter:blur(10px); border-bottom:1px solid var(--line);}
.page-head h1{font-size:18px;} .page-head p{font-size:12px; color:var(--ink-soft); margin-top:1px;} .role-pill{text-transform:capitalize; color:var(--primary); font-weight:600;}
.topbar-right{margin-left:auto; display:flex; align-items:center; gap:11px;}
.search{display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--line); padding:8px 12px; border-radius:10px; color:var(--ink-soft);}
.search input{border:none; outline:none; background:none; font-size:13px; width:170px; color:var(--ink);}
.icon-btn{position:relative; width:36px; height:36px; border-radius:10px; border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); display:grid; place-items:center; transition:.15s;}
.icon-btn:hover{color:var(--ink); border-color:#d4dfc7;}
.count{position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; padding:0 4px; border-radius:9px; background:var(--danger); color:#fff; font-size:10px; font-weight:700; display:grid; place-items:center; border:2px solid var(--bg);}
.me-avatar{width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--primary-d),var(--primary)); color:#fff; display:grid; place-items:center; font-weight:700; font-size:13px;}

.roleswitch{display:flex; background:var(--surface); border:1px solid var(--line); border-radius:11px; padding:3px; gap:2px;}
.rs-opt{display:flex; align-items:center; gap:6px; padding:7px 11px; border:none; border-radius:8px; background:none; color:var(--ink-soft); font-size:12.5px; font-weight:600; transition:.15s;}
.rs-opt:hover{color:var(--ink);} .rs-opt.on{background:var(--primary); color:#fff; box-shadow:0 2px 8px rgba(31,107,59,.28);}

.content{padding:26px 24px 60px; max-width:1180px; width:100%; margin:0 auto;}
.stack{display:flex; flex-direction:column; gap:20px;} .stack-sm{display:flex; flex-direction:column; gap:10px;} .stack-xs{display:flex; flex-direction:column; gap:8px;}

.hero{display:flex; align-items:flex-end; justify-content:space-between; gap:20px; background:linear-gradient(120deg,#173F27,#245C36 60%,#2E7A44); color:#fff; padding:26px 28px; border-radius:20px; overflow:hidden; position:relative;}
.hero:after{content:""; position:absolute; right:-40px; top:-40px; width:220px; height:220px; border-radius:50%; background:radial-gradient(circle,rgba(124,179,66,.4),transparent 70%);}
.eyebrow{font-size:12px; text-transform:uppercase; letter-spacing:.14em; color:#bfe3c6; margin-bottom:8px; font-weight:600;}
.hero-title{font-family:var(--display); font-size:26px; line-height:1.15; font-weight:700; max-width:560px;} .hero-sub{color:#d4ead9; font-size:13.5px; margin-top:8px;}
.hero .btn-primary{background:#fff; color:var(--primary-d); position:relative; z-index:1;} .hero .btn-primary:hover{background:#f0f7ee;}

.rem-banner{background:linear-gradient(180deg,#FFF7EE,#FFFDF9); border:1px solid rgba(198,122,30,.28); border-radius:16px; padding:16px 18px; box-shadow:var(--shadow);}
.rem-head{display:flex; align-items:center; gap:9px; margin-bottom:12px;} .rem-head strong{font-family:var(--display); font-size:15px;}
.rem-ic{width:30px; height:30px; border-radius:9px; background:rgba(198,122,30,.15); color:var(--amber); display:grid; place-items:center;}
.rem-list{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
.rem-item{display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--surface); border:1px solid var(--line); border-radius:11px;}
.rem-item-main{flex:1; min-width:0;} .rem-item-top{display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600;}
.crop-chip.sm{width:30px; height:30px; font-size:15px; border-radius:9px;}

.kpi-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:14px;}
.kpi{background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:16px 17px; box-shadow:var(--shadow);}
.kpi-ic{width:36px; height:36px; border-radius:10px; display:grid; place-items:center; margin-bottom:12px;}
.kpi-green .kpi-ic{background:rgba(31,107,59,.12); color:var(--primary);} .kpi-sky .kpi-ic{background:rgba(47,127,163,.12); color:var(--sky);}
.kpi-amber .kpi-ic{background:rgba(198,122,30,.13); color:var(--amber);} .kpi-violet .kpi-ic{background:rgba(124,92,191,.13); color:var(--violet);}
.kpi-num{font-family:var(--display); font-size:28px; font-weight:700; line-height:1;} .kpi-label{font-size:13px; font-weight:600; margin-top:6px;} .kpi-sub{font-size:11.5px; color:var(--ink-soft);}

.card{background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:18px; box-shadow:var(--shadow);}
.card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; gap:10px;} .card-head.mt{margin-top:22px;} .card-head h3{font-size:15px;}
.two-col{display:grid; grid-template-columns:1.35fr 1fr; gap:16px;}
.link{background:none; border:none; color:var(--primary); font-weight:600; font-size:12.5px; display:inline-flex; align-items:center; gap:4px;}
.muted{color:var(--ink-soft);} .muted-sm{color:var(--ink-soft); font-size:12px; display:inline-flex; align-items:center; gap:4px;}

.demo-row{display:flex; align-items:center; gap:13px; width:100%; text-align:left; padding:12px; border-radius:13px; border:1px solid var(--line); background:var(--surface-2); transition:.15s;}
.demo-row:hover{border-color:var(--accent); background:#fff; transform:translateX(2px);}
.demo-row-main{flex:1; min-width:0;} .demo-row-top{display:flex; align-items:center; gap:9px; margin-bottom:11px; flex-wrap:wrap;} .demo-row-top strong{font-size:13.5px;}
.crop-chip{width:38px; height:38px; border-radius:11px; display:grid; place-items:center; background:#eaf3e2; font-size:19px; flex-shrink:0;} .crop-chip.lg{width:44px; height:44px; font-size:22px;}

.track{padding:14px 8px 26px;} .track.compact{padding:4px 6px 4px;}
.track-rail{position:relative; height:4px; background:var(--line); border-radius:99px; margin:0 8px;}
.track-fill{position:absolute; left:0; top:0; height:100%; border-radius:99px; background:linear-gradient(90deg,var(--primary),var(--accent)); transition:width .5s cubic-bezier(.4,0,.2,1);}
.node{position:absolute; top:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center;}
.node-dot{width:20px; height:20px; border-radius:50%; display:grid; place-items:center; background:var(--surface); border:2px solid var(--line); color:transparent; transition:.2s; z-index:1;}
.track.compact .node-dot{width:15px; height:15px;}
.node.done .node-dot{background:var(--primary); border-color:var(--primary); color:#fff;}
.node.current .node-dot{background:var(--accent); border-color:var(--accent); color:#fff; width:26px; height:26px; box-shadow:0 0 0 5px rgba(124,179,66,.22); animation:pulse 2s infinite;}
.track.compact .node.current .node-dot{width:19px; height:19px; box-shadow:0 0 0 4px rgba(124,179,66,.22);}
@keyframes pulse{0%,100%{box-shadow:0 0 0 5px rgba(124,179,66,.22);}50%{box-shadow:0 0 0 9px rgba(124,179,66,.08);}}
.node-label{position:absolute; top:26px; font-size:10.5px; color:var(--ink-soft); white-space:nowrap; font-weight:500;} .node.current .node-label{color:var(--primary); font-weight:700;} .node.done .node-label{color:var(--ink);}
.track-full-wrap{padding:8px 10px 4px;}
.dots{display:flex; gap:4px;} .dot-mini{width:7px; height:7px; border-radius:50%; background:var(--line);}
.dot-mini.done{background:var(--primary);} .dot-mini.cur{background:var(--accent); box-shadow:0 0 0 3px rgba(124,179,66,.2);}

.rem-pill{display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; padding:3px 8px; border-radius:99px; white-space:nowrap;}
.rem-pill.sm{font-size:10.5px; padding:2px 7px;} .rem-pill.soon{background:rgba(198,122,30,.14); color:var(--amber);} .rem-pill.over{background:rgba(192,70,59,.13); color:var(--danger);}

.bars{display:flex; flex-direction:column; gap:12px;}
.bar-row{display:flex; align-items:center; gap:10px;} .bar-label{font-size:12.5px; font-weight:500; width:96px; flex-shrink:0;}
.bar-track{height:9px; background:var(--surface-2); border-radius:99px; overflow:hidden; border:1px solid var(--line); flex:1;}
.bar-fill{height:100%; border-radius:99px; background:linear-gradient(90deg,var(--primary),var(--accent)); transition:width .6s;}
.bar-val{font-weight:700; font-size:13px; text-align:right; font-family:var(--display); width:24px; flex-shrink:0;}

.mini-meet{display:flex; align-items:center; gap:11px;}
.date-chip{width:44px; height:46px; border-radius:11px; background:var(--surface-2); border:1px solid var(--line); display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;}
.date-chip span{font-family:var(--display); font-weight:700; font-size:16px; line-height:1;} .date-chip em{font-style:normal; font-size:10px; color:var(--ink-soft); text-transform:uppercase;}
.mm-title{font-size:13px; font-weight:600;} .mm-sub{font-size:11.5px; color:var(--ink-soft); display:flex; align-items:center; gap:5px;}

.badge{font-size:11px; font-weight:600; padding:3px 9px; border-radius:99px; white-space:nowrap;} .badge.lg{font-size:12px; padding:5px 12px;}
.badge-green{background:rgba(31,107,59,.12); color:var(--primary);} .badge-amber{background:rgba(198,122,30,.14); color:var(--amber);} .badge-sky{background:rgba(47,127,163,.13); color:var(--sky);}

.section-head{display:flex; align-items:flex-start; justify-content:space-between; gap:16px;}
.sh-title{font-size:21px;} .sh-sub{color:var(--ink-soft); font-size:13.5px; margin-top:4px; max-width:620px;}
.ro-note{display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-soft); margin-top:9px; background:var(--surface-2); border:1px solid var(--line); padding:5px 10px; border-radius:8px;}
.ro-note.ok{color:var(--primary); background:rgba(31,107,59,.07); border-color:rgba(31,107,59,.2);}

.btn{display:inline-flex; align-items:center; gap:7px; padding:10px 16px; border-radius:11px; border:1px solid transparent; font-weight:600; font-size:13.5px; transition:.15s; white-space:nowrap;}
.btn-primary{background:var(--primary); color:#fff; box-shadow:0 3px 10px rgba(31,107,59,.28);} .btn-primary:hover{background:var(--primary-d); transform:translateY(-1px);} .btn-primary:disabled{opacity:.45; cursor:not-allowed; transform:none;}
.btn-ghost{background:var(--surface); border-color:var(--line); color:var(--ink-soft);} .btn-ghost:hover{color:var(--ink); border-color:#d4dfc7;}
.btn-sky{background:var(--sky); color:#fff;} .btn-sky:hover{filter:brightness(.94);} .btn-sm{padding:7px 12px; font-size:12.5px; border-radius:9px;}

.chips{display:flex; gap:8px; flex-wrap:wrap;}
.chip{padding:7px 14px; border-radius:99px; border:1px solid var(--line); background:var(--surface); font-size:12.5px; font-weight:600; color:var(--ink-soft); transition:.15s;}
.chip:hover{border-color:var(--accent);} .chip.on{background:var(--ink); color:#fff; border-color:var(--ink);}

.prod-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:13px;}
.prod-card{background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:15px; box-shadow:var(--shadow); transition:.15s;} .prod-card:hover{transform:translateY(-2px); border-color:var(--accent);}
.prod-top{display:flex; justify-content:space-between; align-items:center; margin-bottom:11px;}
.prod-price{font-family:var(--display); font-weight:700; font-size:15px; display:inline-flex; align-items:center;}
.prod-name{font-weight:700; font-size:15px; font-family:var(--display);} .prod-brand{font-size:12px; color:var(--ink-soft); margin-top:2px;}
.prod-foot{display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-soft); margin-top:12px; padding-top:11px; border-top:1px solid var(--line);}

.crop-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:15px;}
.crop-card{text-align:left; background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:18px; box-shadow:var(--shadow); display:flex; flex-direction:column; gap:6px; transition:.15s;} .crop-card:hover{transform:translateY(-2px); border-color:var(--accent);}
.crop-card-head{display:flex; align-items:center; gap:12px; margin-bottom:6px;}
.crop-emoji{width:46px; height:46px; border-radius:13px; background:#eaf3e2; display:grid; place-items:center; font-size:24px;} .crop-emoji.xl{width:60px; height:60px; font-size:32px;}
.crop-name{font-family:var(--display); font-weight:700; font-size:17px;} .crop-season{font-size:12px; color:var(--ink-soft);}
.stage-count{margin-left:auto; font-size:11.5px; font-weight:600; color:var(--primary); background:rgba(31,107,59,.09); padding:4px 9px; border-radius:8px;}
.crop-stage-tags{display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;}
.tag{font-size:11px; padding:3px 9px; border-radius:7px; background:var(--surface-2); border:1px solid var(--line); color:var(--ink-soft); font-weight:500;} .tag.more{color:var(--primary); font-weight:700;}
.crop-open{margin-top:10px; font-size:12.5px; font-weight:600; color:var(--primary); display:inline-flex; align-items:center; gap:3px;}

.back{background:none; border:none; color:var(--ink-soft); font-weight:600; font-size:13px; display:inline-flex; align-items:center; gap:4px; padding:0; width:fit-content;} .back:hover{color:var(--ink);}
.detail-hero{display:flex; align-items:center; gap:16px;} .detail-title{font-size:24px;}
.detail-sub{color:var(--ink-soft); font-size:13.5px; margin-top:4px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;}
.detail-hero .btn-primary{margin-left:auto;} .detail-hero .badge{margin-left:auto;}

.pipe-days{display:flex; flex-direction:column;}
.pd-step{display:grid; grid-template-columns:34px 1fr auto; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--line);}
.pd-step:last-child{border-bottom:none;}
.pd-num{font-family:var(--display); font-weight:700; font-size:12px; color:var(--accent); background:rgba(124,179,66,.12); width:28px; height:28px; border-radius:8px; display:grid; place-items:center;}
.pd-name{font-weight:600; font-size:14px;}
.pd-days{font-size:12.5px; color:var(--ink-soft); display:inline-flex; align-items:center; gap:6px;} .pd-days.ro{font-weight:600; color:var(--primary);}
.pd-days input{width:56px; padding:6px 8px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:13px; text-align:center;} .pd-days input:focus{border-color:var(--accent);}
.pd-terminal{font-size:11.5px; font-weight:600; color:var(--amber); background:rgba(198,122,30,.12); padding:4px 9px; border-radius:8px;}
.add-stage{display:flex; gap:8px; align-items:center; margin-top:18px; padding-top:16px; border-top:1px solid var(--line); flex-wrap:wrap;}
.add-stage input{flex:1; min-width:120px; padding:10px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px;} .add-stage input:focus{border-color:var(--accent);}
.days-in{flex:0 0 62px !important; text-align:center;} .days-lbl{font-size:12.5px; color:var(--ink-soft);}

.demo-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:16px;}
.demo-card{text-align:left; cursor:pointer; transition:.15s; display:flex; flex-direction:column;} .demo-card:hover{transform:translateY(-2px); border-color:var(--accent);}
.demo-card-head{display:flex; align-items:center; gap:12px; margin-bottom:4px;} .demo-card-title{flex:1; min-width:0;}
.demo-card-title strong{font-family:var(--display); font-size:15.5px;} .demo-card-title .muted-sm{margin-top:2px;}
.demo-card-foot{display:flex; gap:14px; align-items:center; padding-top:12px; margin-top:2px; border-top:1px solid var(--line); flex-wrap:wrap;}
.tiny{font-size:11.5px; color:var(--ink-soft); display:inline-flex; align-items:center; gap:5px;}

.advance-bar{display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:18px; padding:16px; background:var(--surface-2); border-radius:13px; border:1px solid var(--line); flex-wrap:wrap;}
.advance-label{font-size:11.5px; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-soft); font-weight:600;}
.advance-stage{font-family:var(--display); font-weight:700; font-size:18px; display:flex; align-items:center; gap:8px; color:var(--primary); margin-top:3px;}
.stage-due{font-family:var(--font); font-size:12px; font-weight:500; color:var(--ink-soft);}
.done-pill{display:inline-flex; align-items:center; gap:7px; font-weight:600; color:var(--amber); background:rgba(198,122,30,.13); padding:9px 15px; border-radius:11px;}

.bill{border:1px solid var(--line); border-radius:12px; overflow:hidden;}
.bill-row{display:grid; grid-template-columns:2fr .6fr 1fr 1fr; gap:8px; padding:10px 13px; font-size:13px; align-items:center; border-bottom:1px solid var(--line);}
.bill-row:last-child{border-bottom:none;} .bill-row span:not(.bill-name){text-align:right;}
.bill-head{background:var(--surface-2); font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-soft); font-weight:600;}
.bill-name{display:flex; align-items:center; gap:8px; font-weight:600; text-align:left;}
.dot-cat{width:8px; height:8px; border-radius:50%; flex-shrink:0;} .dot-cat.green{background:var(--primary);} .dot-cat.amber{background:var(--amber);} .dot-cat.sky{background:var(--sky);}
.bill-total{background:var(--surface-2); font-weight:700; font-family:var(--display);} .bill-total span:last-child{color:var(--primary); font-size:15px;}

.farmer-detail{display:flex; gap:14px; align-items:flex-start;}
.fd-avatar{width:48px; height:48px; border-radius:13px; background:linear-gradient(135deg,var(--sky),#3f97bd); color:#fff; display:grid; place-items:center; font-weight:700; flex-shrink:0;}
.fd-avatar.owner{background:linear-gradient(135deg,var(--amber),#dd9a3f);} .fd-avatar.mgr{background:linear-gradient(135deg,var(--sky),#3f97bd);}
.fd-avatar.sm{width:38px; height:38px; font-size:13px;} .fd-avatar.xs{width:30px; height:30px; font-size:11px; border-radius:9px;} .fd-avatar.xl{width:60px; height:60px; font-size:20px; border-radius:16px;}
.fd-name{font-family:var(--display); font-weight:700; font-size:16px;} .fd-line{font-size:12.5px; color:var(--ink-soft); display:flex; align-items:center; gap:7px; margin-top:5px;}

.log{display:flex; flex-direction:column; gap:12px;}
.log-item{display:flex; gap:13px; padding:12px; border:1px solid var(--line); border-radius:13px; background:var(--surface-2);}
.log-photo{width:76px; height:76px; border-radius:11px; object-fit:cover; flex-shrink:0; border:1px solid var(--line);}
.log-photo.none{display:grid; place-items:center; color:var(--ink-soft); background:var(--surface);}
.log-main{flex:1; min-width:0;} .log-top{display:flex; align-items:center; gap:9px; flex-wrap:wrap;} .log-top strong{font-family:var(--display); font-size:14.5px;}
.log-remark{font-size:13px; color:var(--ink-soft); margin-top:6px;}

.fd-demos{display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:14px;}
.fd-demo{border:1px solid var(--line); border-radius:14px; padding:15px; background:var(--surface-2);}
.fd-demo-head{display:flex; align-items:center; gap:11px;} .fd-demo-title{flex:1;} .fd-demo-title strong{font-family:var(--display); font-size:15px;} .fd-demo-title .muted-sm{margin-top:1px;}
.fd-demo-actions{display:flex; gap:8px; justify-content:flex-end; align-items:center; margin-top:4px;}

.farmer-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:14px;}
.farmer-card{display:flex; flex-direction:column; gap:11px; transition:.15s; text-align:left; cursor:pointer;} .farmer-card:hover{transform:translateY(-2px); border-color:var(--accent);}
.fc-head{display:flex; align-items:center; gap:12px;}
.fc-name{font-family:var(--display); font-weight:700; font-size:15.5px; display:flex; align-items:center; gap:8px;}
.fc-village{font-size:12px; color:var(--ink-soft); display:flex; align-items:center; gap:4px; margin-top:2px;}
.fc-lines{display:flex; gap:16px;} .fc-lines span{font-size:12.5px; color:var(--ink-soft); display:inline-flex; align-items:center; gap:6px;}
.fc-crops{display:flex; flex-wrap:wrap; gap:6px;}
.crop-mini{font-size:11px; padding:4px 9px; border-radius:8px; background:rgba(31,107,59,.08); color:var(--primary); font-weight:600;} .crop-mini.none{background:var(--surface-2); color:var(--ink-soft); font-weight:500;}
.fc-foot{font-size:11.5px; color:var(--ink-soft); padding-top:10px; border-top:1px solid var(--line); display:flex; align-items:center; gap:5px;} .fc-foot svg{margin-left:auto;}

.legend{display:flex; align-items:center; gap:16px; font-size:12px; color:var(--ink-soft); flex-wrap:wrap;} .legend span{display:inline-flex; align-items:center; gap:6px;} .legend-sep{width:1px; height:14px; background:var(--line);}
.matrix-scroll{overflow-x:auto; border:1px solid var(--line); border-radius:16px; background:var(--surface); box-shadow:var(--shadow);}
.matrix{border-collapse:collapse; width:100%; min-width:600px;}
.matrix th,.matrix td{border-bottom:1px solid var(--line); border-right:1px solid var(--line); padding:0;} .matrix th:last-child,.matrix td:last-child{border-right:none;} .matrix tr:last-child td{border-bottom:none;}
.mx-corner{background:var(--surface-2); text-align:left; padding:12px 14px; font-size:11.5px; color:var(--ink-soft); font-family:var(--font); font-weight:600; position:sticky; left:0; z-index:2;}
.mx-crop-head{background:var(--surface-2); padding:12px 14px; font-family:var(--font); font-size:13px; font-weight:700; white-space:nowrap;} .mx-crop-emoji{margin-right:6px;}
.mx-farmer{position:sticky; left:0; background:var(--surface); z-index:1;}
.mx-farmer button{display:flex; align-items:center; gap:10px; padding:11px 14px; width:100%; background:none; border:none; text-align:left; transition:.15s;} .mx-farmer button:hover{background:var(--surface-2);}
.mxf-name{display:block; font-weight:600; font-size:13px;} .mxf-village{display:flex; align-items:center; gap:3px; font-size:11px; color:var(--ink-soft); margin-top:1px;}
.cell{display:flex; flex-direction:column; align-items:flex-start; gap:7px; width:100%; padding:12px 14px; background:none; border:none; transition:.15s; min-height:64px;}
.cell.filled{cursor:pointer;} .cell.filled:hover{background:rgba(124,179,66,.08);} .cell.filled.done{background:rgba(198,122,30,.06);}
.cell-stage{font-size:12px; font-weight:600; color:var(--ink);} .cell.done .cell-stage{color:var(--amber);}
.cell-foot{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
.cell.empty{align-items:center; justify-content:center; color:var(--line); min-height:64px;} .cell.empty:hover{background:var(--surface-2); color:var(--accent);}
.mx-empty{padding:30px; text-align:center; color:var(--ink-soft);}

.meet-list{display:flex; flex-direction:column; gap:11px;}
.meet-card{display:flex; align-items:center; gap:16px; padding:15px 18px;}
.meet-date{width:56px; height:58px; border-radius:13px; background:linear-gradient(135deg,var(--primary),var(--accent)); color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;}
.meet-date span{font-family:var(--display); font-weight:700; font-size:20px; line-height:1;} .meet-date em{font-style:normal; font-size:10.5px; text-transform:uppercase; opacity:.9;}
.meet-title-row{display:flex; align-items:center; gap:10px; margin-bottom:4px; flex-wrap:wrap;} .meet-title-row strong{font-family:var(--display); font-size:15px;}
.meet-sub{font-size:12.5px; color:var(--ink-soft); display:flex; align-items:center; gap:6px; flex-wrap:wrap;} .sep{color:var(--line);}

.status-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:12px;}
.status-cell{padding:16px; border-radius:13px; border:1px solid var(--line); text-align:center;}
.status-cell.on{background:rgba(31,107,59,.06);} .status-cell.soon{background:rgba(198,122,30,.08);} .status-cell.over{background:rgba(192,70,59,.08);} .status-cell.done{background:var(--surface-2);}
.sc-num{font-family:var(--display); font-weight:700; font-size:26px;} .sc-lbl{font-size:12px; color:var(--ink-soft); font-weight:600; margin-top:2px;}
.status-cell.on .sc-num{color:var(--primary);} .status-cell.soon .sc-num{color:var(--amber);} .status-cell.over .sc-num{color:var(--danger);}

.rep-scroll{overflow-x:auto;} .rep-table{width:100%; border-collapse:collapse; min-width:640px;}
.rep-table th{text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-soft); font-weight:600; padding:8px 12px; border-bottom:1px solid var(--line);}
.rep-table td{padding:11px 12px; font-size:13px; border-bottom:1px solid var(--line);} .rep-table tr:last-child td{border-bottom:none;}
.rep-table th:not(:first-child):not(:nth-child(2)),.rep-table td:not(:first-child):not(:nth-child(2)){text-align:right;}
.rep-name{display:flex; align-items:center; gap:9px; font-weight:600;} .rep-val{font-family:var(--display); font-weight:700; color:var(--primary);}

.owner-card{display:flex; align-items:center; gap:14px;}
.mgr-block{padding:0; overflow:hidden;}
.mgr-head{display:flex; align-items:center; gap:13px; padding:16px 18px; background:var(--surface-2); border-bottom:1px solid var(--line);} .mgr-count{margin-left:auto; font-size:12px; color:var(--ink-soft); font-weight:600;}
.emp-row{display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; padding:16px 18px;}
.emp-card{background:var(--surface-2); border:1px solid var(--line); border-radius:13px; padding:14px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:7px;}
.emp-name{font-weight:600; font-size:13.5px;} .emp-stats{display:flex; gap:8px; font-size:11px; color:var(--ink-soft);} .emp-stats span{background:var(--surface); border:1px solid var(--line); padding:3px 8px; border-radius:7px;}

.empty{grid-column:1/-1; display:flex; flex-direction:column; align-items:center; gap:10px; padding:44px; color:var(--ink-soft); background:var(--surface-2); border:1px dashed var(--line); border-radius:16px; text-align:center;} .empty svg{color:var(--accent);}

.overlay{position:fixed; inset:0; background:rgba(19,32,24,.5); backdrop-filter:blur(3px); z-index:100; display:flex; align-items:flex-start; justify-content:center; padding:5vh 16px; overflow:auto; animation:fade .2s;} @keyframes fade{from{opacity:0;}}
.modal{background:var(--surface); border-radius:18px; width:100%; max-width:480px; box-shadow:0 20px 60px rgba(19,32,24,.3); animation:rise .25s;} @keyframes rise{from{transform:translateY(14px); opacity:0;}}
.modal-head{display:flex; align-items:flex-start; justify-content:space-between; padding:20px 20px 6px;} .modal-head h3{font-size:18px;} .modal-head p{font-size:12.5px; color:var(--ink-soft); margin-top:3px; max-width:380px;}
.modal-body{padding:14px 20px; display:flex; flex-direction:column; gap:13px;}
.modal-foot{display:flex; justify-content:flex-end; align-items:center; gap:10px; padding:16px 20px; border-top:1px solid var(--line);} .modal-total{margin-right:auto; font-size:12.5px; font-weight:700; color:var(--primary);}
.field{display:flex; flex-direction:column; gap:6px;} .field-label{font-size:12px; font-weight:600; color:var(--ink-soft);}
.field input,.field select,.field textarea{padding:10px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--surface); color:var(--ink); resize:vertical;}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--accent); box-shadow:0 0 0 3px rgba(124,179,66,.14);}
.grid2{display:grid; grid-template-columns:1fr 1fr; gap:12px;}

.seg{display:flex; background:var(--surface-2); border:1px solid var(--line); border-radius:11px; padding:3px; gap:2px;}
.seg button{flex:1; padding:9px; border:none; border-radius:8px; background:none; font-size:12.5px; font-weight:600; color:var(--ink-soft); transition:.15s;} .seg button.on{background:var(--primary); color:#fff;} .seg button:disabled{opacity:.4; cursor:not-allowed;}
.locked-farmer{display:flex; align-items:center; gap:11px; padding:11px 13px; background:var(--surface-2); border:1px solid var(--line); border-radius:11px;} .locked-farmer strong{display:block; font-size:13.5px;} .locked-farmer .muted-sm{margin-top:1px;}

.geo-box{display:flex; align-items:center; gap:12px; padding:13px; border-radius:13px; border:1px dashed var(--line); background:var(--surface-2);}
.geo-box.ready{border-style:solid; border-color:rgba(47,127,163,.35); background:rgba(47,127,163,.06);}
.geo-ic{width:38px; height:38px; border-radius:10px; background:rgba(47,127,163,.12); color:var(--sky); display:grid; place-items:center; flex-shrink:0;} .geo-box.ready .geo-ic{background:var(--sky); color:#fff;}
.geo-main{flex:1; min-width:0;} .geo-title{font-weight:700; font-size:13px;} .geo-sub{font-size:11.5px; color:var(--ink-soft);}

.photo-input{display:block; border:1px dashed var(--line); border-radius:13px; background:var(--surface-2); overflow:hidden; cursor:pointer; transition:.15s;} .photo-input:hover{border-color:var(--accent);}
.photo-input.has{border-style:solid; padding:0;} .photo-input img{width:100%; height:180px; object-fit:cover; display:block;}
.pi-empty{display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; height:130px; color:var(--ink-soft); font-size:12.5px; font-weight:500;} .pi-empty svg{color:var(--accent);}
.check-row{display:flex; align-items:center; gap:10px; font-size:13px; color:var(--ink-soft); padding:10px 12px; background:var(--surface-2); border:1px solid var(--line); border-radius:11px; cursor:pointer;} .check-row input{width:16px; height:16px; accent-color:var(--primary);} .check-row strong{color:var(--ink);}

.emoji-pick{display:flex; flex-wrap:wrap; gap:6px;}
.emoji-opt{width:40px; height:40px; border-radius:10px; border:1px solid var(--line); background:var(--surface); font-size:19px; transition:.15s;} .emoji-opt:hover{border-color:var(--accent);} .emoji-opt.on{border-color:var(--primary); background:rgba(31,107,59,.08); box-shadow:0 0 0 2px rgba(31,107,59,.15);}
.stage-edit{display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;}
.stage-tag{display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; padding:4px 6px 4px 10px; border-radius:8px; background:rgba(31,107,59,.08); color:var(--primary);} .stage-tag button{background:none; border:none; color:var(--primary); display:grid; place-items:center; opacity:.6;} .stage-tag button:hover{opacity:1;}
.stage-add{display:flex; gap:6px; align-items:center;} .stage-add input{flex:1; padding:9px 12px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px;} .stage-add input:focus{border-color:var(--accent);} .stage-add .days-in{flex:0 0 54px;}

.prod-pick{display:flex; flex-wrap:wrap; gap:7px;}
.pick{display:inline-flex; align-items:center; gap:5px; padding:7px 11px; border-radius:9px; border:1px solid var(--line); background:var(--surface); font-size:12px; font-weight:500; color:var(--ink-soft); transition:.15s;} .pick:hover{border-color:var(--accent);} .pick.on{background:var(--primary); color:#fff; border-color:var(--primary); font-weight:600;}
.qty-list{display:flex; flex-direction:column; gap:7px; margin-top:10px;}
.qty-row{display:flex; align-items:center; gap:8px; background:var(--surface-2); border:1px solid var(--line); border-radius:10px; padding:8px 10px;}
.qty-name{flex:1; font-size:12.5px; font-weight:600; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.qty-field{font-size:11px; color:var(--ink-soft); display:inline-flex; align-items:center; gap:4px;} .qty-field input{width:52px; padding:5px 7px; border:1px solid var(--line); border-radius:7px; outline:none; font-size:12.5px; text-align:center;} .qty-field input:focus{border-color:var(--accent);}
.qty-amt{font-family:var(--display); font-weight:700; font-size:12.5px; color:var(--primary); width:66px; text-align:right;}
.warn{display:flex; align-items:center; gap:9px; padding:14px; background:rgba(198,122,30,.1); border:1px solid rgba(198,122,30,.3); border-radius:11px; color:var(--amber); font-size:13px; font-weight:500;}

.toast{position:fixed; bottom:26px; left:50%; transform:translateX(-50%); z-index:200; display:flex; align-items:center; gap:9px; background:var(--ink); color:#fff; padding:12px 18px; border-radius:12px; font-size:13.5px; font-weight:500; box-shadow:0 12px 34px rgba(19,32,24,.35); animation:toast .3s;} .toast svg{color:var(--accent);} @keyframes toast{from{transform:translate(-50%,14px); opacity:0;}}

.only-mobile{display:none;} .drawer-x{display:none;} .scrim{display:none;}
@media(max-width:1000px){ .two-col{grid-template-columns:1fr;} .kpi-grid{grid-template-columns:repeat(2,1fr);} .rem-list{grid-template-columns:1fr;} }
@media(max-width:820px){
  .sidebar{position:fixed; left:0; top:0; z-index:60; transform:translateX(-100%); transition:.28s; box-shadow:0 0 50px rgba(0,0,0,.2);} .sidebar.open{transform:none;}
  .drawer-x{display:block;} .scrim{display:block; position:fixed; inset:0; background:rgba(19,32,24,.4); z-index:55;}
  .only-mobile{display:grid;} .only-desktop{display:none;}
  .content{padding:20px 16px 60px;} .topbar{padding:12px 16px;}
  .hero{flex-direction:column; align-items:flex-start; gap:16px;} .hero-title{font-size:22px;}
  .section-head{flex-direction:column;} .detail-hero{flex-wrap:wrap;} .detail-hero .btn-primary,.detail-hero .badge{margin-left:0;}
}
@media(max-width:520px){ .kpi-grid{grid-template-columns:repeat(2,1fr);} .roleswitch .rs-opt span{display:none;} .grid2{grid-template-columns:1fr;} .status-grid{grid-template-columns:repeat(2,1fr);} .node-label{font-size:9px;} }
@media(prefers-reduced-motion:reduce){ *{animation:none!important; transition:none!important;} }
`;
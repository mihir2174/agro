import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Sprout, FlaskConical, Users, CalendarDays,
  UserCog, Plus, MapPin, Check, ChevronRight, X, Search, Bell, Menu,
  Leaf, Phone, Ruler, Clock, Crown, ShieldCheck, LocateFixed, IndianRupee,
  Layers, ArrowRight, Lock, LayoutGrid, Camera, AlertTriangle, BarChart3,
  Image as ImageIcon, UserPlus, Pencil, Trash2, Eye
} from "lucide-react";

/* ====== SEED DATA ====== */
const SEED_PEOPLE = [
  {id:"u_admin",name:"Rajesh Patel",  role:"admin",   title:"Agency Owner",         region:"Saurashtra",phone:"99250 00001"},
  {id:"u_mgr1", name:"Suresh Mehta",  role:"manager", title:"Area Manager · Rajkot",reportsTo:"u_admin",phone:"99250 00002"},
  {id:"u_mgr2", name:"Kavita Shah",   role:"manager", title:"Area Manager · Amreli",reportsTo:"u_admin",phone:"99250 00003"},
  {id:"u_emp1", name:"Amit Chauhan",  role:"employee",title:"Field Officer",        manager:"u_mgr1",  phone:"99250 00004"},
  {id:"u_emp2", name:"Priya Desai",   role:"employee",title:"Field Officer",        manager:"u_mgr1",  phone:"99250 00005"},
  {id:"u_emp3", name:"Vikram Solanki",role:"employee",title:"Field Officer",        manager:"u_mgr2",  phone:"99250 00006"},
  {id:"u_emp4", name:"Neha Joshi",    role:"employee",title:"Field Officer",        manager:"u_mgr2",  phone:"99250 00007"},
];
const USER_FOR_ROLE = {admin:"u_admin",manager:"u_mgr1",employee:"u_emp1"};

const SEED_PRODUCTS = [
  {id:"p1",name:"Kaveri 9090",      cat:"Seed",      brand:"Kaveri Seeds",pack:"450 g", price:810},
  {id:"p2",name:"Pioneer GG-20",    cat:"Seed",      brand:"Corteva",     pack:"10 kg", price:1250},
  {id:"p3",name:"Lok-1 Wheat Seed", cat:"Seed",      brand:"Mahyco",      pack:"20 kg", price:690},
  {id:"p4",name:"IFFCO Urea 46%",   cat:"Fertilizer",brand:"IFFCO",       pack:"45 kg", price:267},
  {id:"p5",name:"Coromandel DAP",   cat:"Fertilizer",brand:"Coromandel",  pack:"50 kg", price:1350},
  {id:"p6",name:"Zinc Sulphate 21%",cat:"Fertilizer",brand:"Aries Agro",  pack:"5 kg",  price:420},
  {id:"p7",name:"Confidor 200 SL",  cat:"Pesticide", brand:"Bayer",       pack:"100 ml",price:340},
  {id:"p8",name:"Amistar Fungicide",cat:"Pesticide", brand:"Syngenta",    pack:"250 ml",price:985},
  {id:"p9",name:"Saaf Carbendazim", cat:"Pesticide", brand:"UPL",         pack:"500 g", price:310},
];
const SEED_CROPS = [
  {id:"c1",name:"Cotton",   icon:"\u{1F331}",season:"Kharif",stages:[
    {name:"Sowing",days:7},{name:"Germination",days:10},{name:"Vegetative",days:18},{name:"Squaring",days:14},{name:"Flowering",days:12},{name:"Boll Formation",days:20},{name:"Harvest",days:0}]},
  {id:"c2",name:"Groundnut",icon:"\u{1F95C}",season:"Kharif",stages:[
    {name:"Sowing",days:7},{name:"Germination",days:9},{name:"Vegetative",days:15},{name:"Pegging",days:12},{name:"Pod Development",days:18},{name:"Maturity",days:14},{name:"Harvest",days:0}]},
  {id:"c3",name:"Wheat",    icon:"\u{1F33E}",season:"Rabi",  stages:[
    {name:"Sowing",days:6},{name:"Germination",days:8},{name:"Tillering",days:15},{name:"Jointing",days:14},{name:"Heading",days:12},{name:"Grain Filling",days:20},{name:"Harvest",days:0}]},
];
const SEED_FARMERS = [
  {id:"f1",name:"Bharat Kanani",    phone:"98240 11223",village:"Rajsamadhiyala",acres:6, addedBy:"u_emp1",lat:"22.24051",lng:"70.86112"},
  {id:"f2",name:"Mansukh Vaghasiya",phone:"99091 44556",village:"Khandheri",     acres:4, addedBy:"u_emp1",lat:"22.31980",lng:"70.72410"},
  {id:"f3",name:"Jayaben Patel",    phone:"94280 77889",village:"Kotharia",      acres:9, addedBy:"u_emp2",lat:"22.25630",lng:"70.83200"},
  {id:"f4",name:"Dilip Bhalodia",   phone:"97250 33221",village:"Vinchhiya",     acres:12,addedBy:"u_emp3",lat:"21.98410",lng:"71.20330"},
  {id:"f5",name:"Ramesh Zala",      phone:"90998 55447",village:"Jetpur",        acres:5, addedBy:"u_emp4",lat:"21.75410",lng:"70.62220"},
];
const mkli=(pid,q,pr)=>({productId:pid,qty:q,price:pr});
const SEED_DEMOS = [
  {id:"d1",cropId:"c1",farmerId:"f1",assignedTo:"u_emp1",start:"2026-07-02",stageIndex:4,stageStart:"2026-08-20",
    items:[mkli("p1",2,810),mkli("p7",3,340)],
    log:[{stageIndex:0,stageName:"Sowing",date:"2026-07-02",remarks:"Sown 2 acres, soil moisture good.",completed:true,photo:null}]},
  {id:"d6",cropId:"c2",farmerId:"f1",assignedTo:"u_emp1",start:"2026-07-20",stageIndex:3,stageStart:"2026-08-15",
    items:[mkli("p2",1,1250),mkli("p6",4,420)],log:[]},
  {id:"d7",cropId:"c3",farmerId:"f1",assignedTo:"u_emp1",start:"2026-08-05",stageIndex:1,stageStart:"2026-08-26",
    items:[mkli("p3",2,690),mkli("p4",3,267)],log:[]},
  {id:"d2",cropId:"c2",farmerId:"f2",assignedTo:"u_emp1",start:"2026-07-10",stageIndex:2,stageStart:"2026-08-24",
    items:[mkli("p2",1,1250),mkli("p6",2,420)],log:[]},
  {id:"d3",cropId:"c1",farmerId:"f3",assignedTo:"u_emp2",start:"2026-06-28",stageIndex:6,stageStart:"2026-08-10",
    items:[mkli("p1",3,810),mkli("p8",1,985)],log:[]},
  {id:"d8",cropId:"c2",farmerId:"f3",assignedTo:"u_emp2",start:"2026-07-18",stageIndex:2,stageStart:"2026-08-28",
    items:[mkli("p2",2,1250),mkli("p5",1,1350)],log:[]},
  {id:"d4",cropId:"c2",farmerId:"f4",assignedTo:"u_emp3",start:"2026-07-15",stageIndex:1,stageStart:"2026-08-29",
    items:[mkli("p2",1,1250),mkli("p5",2,1350)],log:[]},
  {id:"d5",cropId:"c3",farmerId:"f5",assignedTo:"u_emp4",start:"2026-08-01",stageIndex:0,stageStart:"2026-08-30",
    items:[mkli("p3",1,690),mkli("p4",4,267)],log:[]},
];
const SEED_MEETINGS = [
  {id:"m1",title:"Cotton field walk",type:"Farmer Meet",date:"2026-08-24",time:"09:30",host:"u_emp1",assignedTo:"u_emp1",place:"Rajsamadhiyala",farmerIds:["f1","f2"],photos:[],remarks:"Discussed boll formation."},
  {id:"m2",title:"Weekly team sync",type:"Team Sync",date:"2026-08-22",time:"17:00",host:"u_mgr1",assignedTo:"u_mgr1",place:"Rajkot office",farmerIds:[],photos:[],remarks:""},
  {id:"m3",title:"Confidor spray training",type:"Product Training",date:"2026-08-26",time:"11:00",host:"u_admin",assignedTo:"u_emp2",place:"GreenGrow HQ",farmerIds:["f3"],photos:[],remarks:""},
  {id:"m4",title:"Groundnut pegging review",type:"Farmer Meet",date:"2026-08-28",time:"08:00",host:"u_emp3",assignedTo:"u_emp3",place:"Vinchhiya",farmerIds:["f4"],photos:[],remarks:""},
];

const NEARBY_VILLAGES=["Rajsamadhiyala","Khandheri","Kotharia","Vinchhiya","Jetpur","Gondal","Paddhari","Wankaner"];
const EMOJIS=["\u{1F331}","\u{1F95C}","\u{1F33E}","\u{1F33D}","\u{1FAD1}","\u{1F345}","\u{1F33B}","\u{1F9C5}","\u{1F954}","\u{1F336}"];

const CAPS={
  admin:   {manageProducts:true, manageCrops:true, manageTeam:true, viewTeam:true, viewReports:true, canAssign:true, canAddUser:true, scope:"all"},
  manager: {manageProducts:false,manageCrops:false,manageTeam:false,viewTeam:true, viewReports:false,canAssign:true, canAddUser:true, scope:"team"},
  employee:{manageProducts:false,manageCrops:false,manageTeam:false,viewTeam:false,viewReports:false,canAssign:false,canAddUser:false,scope:"own"},
};

/* ====== HELPERS ====== */
const initials=(n)=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
const fmtDate=(iso)=>new Date(iso+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const fmtINR=(n)=>"\u20B9"+(n||0).toLocaleString("en-IN");
const uid=()=>"x"+Math.random().toString(36).slice(2,8);
const catTone={Seed:"green",Fertilizer:"amber",Pesticide:"sky"};
const todayISO=()=>new Date().toISOString().slice(0,10);
const addDays=(iso,n)=>{const d=new Date(iso+"T00:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/86400000);
const demoValue=(d)=>(d.items||[]).reduce((a,it)=>a+it.qty*it.price,0);

function reminderFor(demo,crop){
  if(!crop) return {status:"completed"};
  var last=crop.stages.length-1;
  if(demo.stageIndex>=last) return {status:"completed"};
  var days=crop.stages[demo.stageIndex].days||0;
  var due=addDays(demo.stageStart,days);
  var left=daysBetween(todayISO(),due);
  if(left<0) return {status:"overdue",due:due,daysLeft:left};
  if(left<=2) return {status:"dueSoon",due:due,daysLeft:left};
  return {status:"onTrack",due:due,daysLeft:left};
}

/* ====== MAIN APP ====== */
export default function App(){
  var [role,setRole]=useState("admin");
  var [page,setPage]=useState("dashboard");
  var [people,setPeople]=useState(SEED_PEOPLE);
  var [products,setProducts]=useState(SEED_PRODUCTS);
  var [crops,setCrops]=useState(SEED_CROPS);
  var [farmers,setFarmers]=useState(SEED_FARMERS);
  var [demos,setDemos]=useState(SEED_DEMOS);
  var [meetings,setMeetings]=useState(SEED_MEETINGS);
  var [modal,setModal]=useState(null);
  var [toast,setToast]=useState(null);
  var [drawer,setDrawer]=useState(false);
  var [sub,setSub]=useState(null);

  var me=people.find(function(p){return p.id===USER_FOR_ROLE[role];})||people[0];
  var caps=CAPS[role];
  var findCrop=function(id){return crops.find(function(c){return c.id===id;});};
  var findPerson=function(id){return people.find(function(p){return p.id===id;});};

  var teamEmpIds=useMemo(function(){return people.filter(function(p){return p.role==="employee"&&p.manager===me.id;}).map(function(p){return p.id;});},[me.id,people]);
  var inScope=function(oid){return caps.scope==="all"?true:caps.scope==="team"?teamEmpIds.includes(oid):oid===me.id;};

  var visDemos=demos.filter(function(d){return inScope(d.assignedTo);});
  var assignedFids=useMemo(function(){return new Set(visDemos.map(function(d){return d.farmerId;}));},[demos,role]);
  var visFarmers=farmers.filter(function(f){return inScope(f.addedBy)||assignedFids.has(f.id);});

  var officers=caps.canAssign?(caps.scope==="all"?people.filter(function(p){return p.role==="employee";}):people.filter(function(p){return p.manager===me.id;})):[];
  var allStaff=people.filter(function(p){return p.role!=="admin";});

  var stageRems=visDemos.map(function(d){var c=findCrop(d.cropId);return {d:d,c:c,r:reminderFor(d,c)};}).filter(function(x){return x.r.status==="overdue"||x.r.status==="dueSoon";});

  var flash=function(m){setToast(m);setTimeout(function(){setToast(null);},2600);};
  var resetSub=function(){setSub(null);};
  var switchRole=function(r){setRole(r);setPage("dashboard");setSub(null);setDrawer(false);};
  var go=function(p){setPage(p);setSub(null);setDrawer(false);};

  /* --- actions --- */
  var addProduct=function(p){setProducts(function(s){return [{...p,id:uid()}].concat(s);});flash("Product added");};
  var addCrop=function(c){setCrops(function(s){return s.concat([{...c,id:uid()}]);});flash(c.name+" added");};
  var addStage=function(cid,st){setCrops(function(s){return s.map(function(c){return c.id===cid?{...c,stages:c.stages.concat([st])}:c;});});flash("Stage added");};
  var setStageDays=function(cid,i,d){setCrops(function(s){return s.map(function(c){return c.id===cid?{...c,stages:c.stages.map(function(st,j){return j===i?{...st,days:d}:st;})}:c;});});};

  var sameFarmer=function(a,b){return a.phone.replace(/\s/g,"")===b.phone.replace(/\s/g,"")||a.name.trim().toLowerCase()===b.name.trim().toLowerCase();};
  var addFarmerStandalone=function(f){if(farmers.find(function(x){return sameFarmer(x,f);})){flash("Farmer already registered");return false;}setFarmers(function(s){return [{...f,id:uid(),addedBy:me.id}].concat(s);});flash("Farmer captured");return true;};
  var resolveFarmerId=function(f,own){var d=farmers.find(function(x){return sameFarmer(x,f);});if(d){flash(d.name+" reused");return d.id;}var id=uid();setFarmers(function(s){return [{...f,id:id,addedBy:own}].concat(s);});return id;};

  var submitDemo=function(d){
    var assignee=caps.canAssign?(d.assignedTo||me.id):me.id;
    var fid=d.mode==="new"?resolveFarmerId(d.farmer,assignee):d.farmerId;
    setDemos(function(s){return [{id:uid(),cropId:d.cropId,farmerId:fid,items:d.items,start:d.start,assignedTo:assignee,stageIndex:0,stageStart:todayISO(),log:[]}].concat(s);});
    flash("Demo started");setModal(null);
  };

  var updateStage=function(o){
    setDemos(function(s){return s.map(function(d){
      if(d.id!==o.demoId) return d;
      var c=findCrop(d.cropId); var last=c.stages.length-1;
      var entry={stageIndex:d.stageIndex,stageName:c.stages[d.stageIndex].name,date:todayISO(),photo:o.photo||null,remarks:o.remarks||"",completed:o.advance};
      var newLog=(d.log||[]).concat([entry]);
      if(o.advance&&d.stageIndex<last) return {...d,log:newLog,stageIndex:d.stageIndex+1,stageStart:todayISO()};
      return {...d,log:newLog};
    });});
    flash(o.advance?"Stage completed":"Update saved");setModal(null);
  };

  var addMeeting=function(m){setMeetings(function(s){return [{...m,id:uid(),host:me.id,photos:[],remarks:""}].concat(s);});flash("Meeting scheduled");};
  var updateMeeting=function(o){
    setMeetings(function(s){return s.map(function(m){return m.id===o.meetId?{...m,photos:(m.photos||[]).concat(o.photos),remarks:m.remarks?(m.remarks+"\n"+o.remarks):o.remarks}:m;});});
    flash("Meeting updated");setModal(null);
  };

  var addPerson=function(p){setPeople(function(s){return s.concat([{...p,id:uid()}]);});flash(p.name+" added to team");setModal(null);};
  var editPerson=function(p){setPeople(function(s){return s.map(function(x){return x.id===p.id?{...x,...p}:x;});});flash(p.name+" updated");setModal(null);};
  var removePerson=function(id){setPeople(function(s){return s.filter(function(x){return x.id!==id;});});flash("User removed");};

  var startFor=function(fid,cid){setModal({type:"demo",presetFarmerId:fid,presetCropId:cid});};

  var NAV=[
    {id:"dashboard",label:"Dashboard",     icon:LayoutDashboard},
    {id:"products", label:"Product Master",icon:Package},
    {id:"crops",    label:"Crops & Stages",icon:Sprout},
    {id:"demos",    label:"Crop Demos",    icon:FlaskConical},
    {id:"track",    label:"Track",         icon:LayoutGrid},
    {id:"farmers",  label:"Farmers",       icon:Users},
    {id:"meetings", label:"Meetings",      icon:CalendarDays},
  ];
  if(caps.viewReports) NAV.push({id:"reports",label:"Reports",icon:BarChart3});
  if(caps.viewTeam||caps.canAddUser) NAV.push({id:"team",label:"Team",icon:UserCog});

  /* --- sub pages --- */
  var subDemo=sub&&sub.type==="demo"?demos.find(function(d){return d.id===sub.id;}):null;
  var subFarmer=sub&&sub.type==="farmer"?farmers.find(function(f){return f.id===sub.id;}):null;
  var subCrop=sub&&sub.type==="crop"?findCrop(sub.id):null;
  var subMeet=sub&&sub.type==="meeting"?meetings.find(function(m){return m.id===sub.id;}):null;

  function renderPage(){
    if(subDemo) return React.createElement(DemoDetail,{d:subDemo,crops:crops,farmers:farmers,products:products,people:people,setModal:setModal,onBack:resetSub});
    if(subFarmer) return React.createElement(FarmerDetail,{farmer:subFarmer,demos:demos,crops:crops,people:people,me:me,setModal:setModal,onBack:resetSub,onOpenDemo:function(id){setSub({type:"demo",id:id});},onStart:startFor});
    if(subCrop) return React.createElement(CropDetail,{crop:subCrop,demos:demos,caps:caps,onBack:resetSub,onAddStage:function(s){addStage(subCrop.id,s);},onSetDays:function(i,d){setStageDays(subCrop.id,i,d);}});
    if(subMeet) return React.createElement(MeetingDetail,{meeting:subMeet,farmers:farmers,people:people,setModal:setModal,onBack:resetSub});
    switch(page){
      case "dashboard": return React.createElement(Dashboard,{me:me,caps:caps,visDemos:visDemos,visFarmers:visFarmers,visMeetings:meetings,crops:crops,people:people,stageRems:stageRems,setModal:setModal,go:go,onOpenDemo:function(id){setSub({type:"demo",id:id});}});
      case "products": return React.createElement(Products,{products:products,caps:caps,setModal:setModal});
      case "crops": return React.createElement(Crops,{crops:crops,caps:caps,demos:demos,setModal:setModal,onOpenCrop:function(id){setSub({type:"crop",id:id});}});
      case "demos": return React.createElement(Demos,{visDemos:visDemos,crops:crops,farmers:farmers,people:people,setModal:setModal,onOpenDemo:function(id){setSub({type:"demo",id:id});}});
      case "track": return React.createElement(Track,{visFarmers:visFarmers,visDemos:visDemos,crops:crops,caps:caps,people:people,onOpenDemo:function(id){setSub({type:"demo",id:id});},onOpenFarmer:function(id){setSub({type:"farmer",id:id});},onStart:startFor});
      case "farmers": return React.createElement(FarmersList,{visFarmers:visFarmers,demos:demos,crops:crops,caps:caps,people:people,me:me,setModal:setModal,onOpenFarmer:function(id){setSub({type:"farmer",id:id});}});
      case "meetings": return React.createElement(MeetingsList,{visMeetings:meetings,farmers:farmers,people:people,setModal:setModal,onOpenMeeting:function(id){setSub({type:"meeting",id:id});}});
      case "reports": return React.createElement(Reports,{demos:demos,farmers:farmers,crops:crops,people:people});
      case "team": return React.createElement(TeamPage,{me:me,caps:caps,people:people,farmers:farmers,demos:demos,setModal:setModal,onRemove:removePerson});
      default: return null;
    }
  }

  var remCount=stageRems.length;

  return (
    <div className="gg"><style>{CSS}</style>
      <aside className={"sidebar"+(drawer?" open":"")}>
        <div className="brand"><span className="brand-mark"><Leaf size={20}/></span><div><div className="brand-name">GreenGrow</div><div className="brand-sub">Agro Demo Suite</div></div><button className="drawer-x" onClick={function(){setDrawer(false);}}><X size={18}/></button></div>
        <nav className="nav">{NAV.map(function(n){return(
          <button key={n.id} className={"nav-item"+(page===n.id?" active":"")} onClick={function(){go(n.id);}}>
            <n.icon size={18}/><span>{n.label}</span>{page===n.id?<ChevronRight size={16} className="nav-caret"/>:null}
          </button>
        );})}</nav>
        <div className="side-foot"><div className="scope-note">
          {caps.scope==="all"?<span><ShieldCheck size={14}/> Full agency</span>:caps.scope==="team"?<span><Users size={14}/> Your team</span>:<span><Lock size={14}/> Your farmers</span>}
        </div></div>
      </aside>
      {drawer?<div className="scrim" onClick={function(){setDrawer(false);}}/>:null}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={function(){setDrawer(true);}}><Menu size={20}/></button>
          <div className="page-head"><h1>{(NAV.find(function(n){return n.id===page;})||{label:"Dashboard"}).label}</h1><p>{me.name} · <span className="role-pill">{role}</span></p></div>
          <div className="topbar-right">
            <div className="search only-desktop"><Search size={16}/><input placeholder="Search..."/></div>
            <RoleSwitch role={role} onChange={switchRole}/>
            <button className="icon-btn"><Bell size={18}/>{remCount>0?<span className="count">{remCount}</span>:null}</button>
            <div className="me-avatar">{initials(me.name)}</div>
          </div>
        </header>
        <main className="content">{renderPage()}</main>
      </div>

      {modal&&modal.type==="product"?<ProductModal onClose={function(){setModal(null);}} onSave={function(p){addProduct(p);setModal(null);}}/>:null}
      {modal&&modal.type==="crop"?<CropModal onClose={function(){setModal(null);}} onSave={function(c){addCrop(c);setModal(null);}}/>:null}
      {modal&&modal.type==="farmer"?<FarmerModal onClose={function(){setModal(null);}} onSave={function(f){if(addFarmerStandalone(f))setModal(null);}}/>:null}
      {modal&&modal.type==="demo"?<DemoModal onClose={function(){setModal(null);}} onSave={submitDemo} crops={crops} products={products} visFarmers={visFarmers} officers={officers} caps={caps} me={me} presetFarmerId={modal.presetFarmerId} presetCropId={modal.presetCropId}/>:null}
      {modal&&modal.type==="meeting"?<MeetingModal onClose={function(){setModal(null);}} onSave={function(m){addMeeting(m);setModal(null);}} visFarmers={visFarmers} allStaff={allStaff} me={me}/>:null}
      {modal&&modal.type==="update"?<UpdateStageModal onClose={function(){setModal(null);}} onSave={updateStage} demo={demos.find(function(d){return d.id===modal.demoId;})} crop={findCrop((demos.find(function(d){return d.id===modal.demoId;})||{}).cropId)}/>:null}
      {modal&&modal.type==="meetUpdate"?<MeetUpdateModal onClose={function(){setModal(null);}} onSave={updateMeeting} meeting={meetings.find(function(m){return m.id===modal.meetId;})}/>:null}
      {modal&&modal.type==="addUser"?<UserModal onClose={function(){setModal(null);}} onSave={addPerson} people={people} me={me} caps={caps} editUser={null}/>:null}
      {modal&&modal.type==="editUser"?<UserModal onClose={function(){setModal(null);}} onSave={editPerson} people={people} me={me} caps={caps} editUser={people.find(function(p){return p.id===modal.userId;})}/>:null}

      {toast?<div className="toast"><Check size={16}/> {toast}</div>:null}
    </div>
  );
}

/* ====== SHARED COMPONENTS ====== */
function RoleSwitch(props){
  var opts=[{id:"admin",label:"Admin",icon:Crown},{id:"manager",label:"Manager",icon:ShieldCheck},{id:"employee",label:"Employee",icon:Users}];
  return <div className="roleswitch">{opts.map(function(o){return <button key={o.id} className={"rs-opt"+(props.role===o.id?" on":"")} onClick={function(){props.onChange(o.id);}}><o.icon size={14}/><span>{o.label}</span></button>;})}</div>;
}
function GrowthTrack(props){
  var stages=props.stages,index=props.index,compact=props.compact;
  return(
    <div className={"track"+(compact?" compact":"")}>
      <div className="track-rail">
        <div className="track-fill" style={{width:stages.length>1?(index/(stages.length-1)*100)+"%":"0%"}}/>
        {stages.map(function(s,i){
          var st=i<index?"done":i===index?"current":"todo";
          return(
            <div className={"node "+st} key={i} style={{left:(i/(stages.length-1)*100)+"%"}}>
              <span className="node-dot">
                {st==="done"?<Check size={compact?10:13}/>:null}
                {st==="current"?<Sprout size={compact?11:14}/>:null}
              </span>
              {!compact?<span className="node-label">{s.name||s}</span>:null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MiniDots(props){return <div className="dots">{props.stages.map(function(_,i){return <span key={i} className={"dot-mini "+(i<props.index?"done":i===props.index?"cur":"todo")}/>;})}</div>;}
function ReminderPill(props){
  var r=props.r;if(!r||r.status==="onTrack"||r.status==="completed") return null;
  var over=r.status==="overdue";
  return <span className={"rem-pill "+(over?"over":"soon")+(props.small?" sm":"")}>
    {over?<AlertTriangle size={11}/>:<Clock size={11}/>}
    {over?"Overdue "+(-r.daysLeft)+"d":r.daysLeft===0?"Due today":"Due in "+r.daysLeft+"d"}
  </span>;
}

function SectionHead(props){return <div className="section-head"><div><h2 className="sh-title">{props.title}</h2><p className="sh-sub">{props.sub}</p>{props.note||null}</div>{props.action||null}</div>;}
function Empty(props){return <div className="empty"><Sprout size={22}/><p>{props.text}</p></div>;}
function Fld(props){return <label className="field"><span className="field-label">{props.label}</span>{props.children}</label>;}
function Stat(props){var I=props.icon;return <div className={"kpi kpi-"+props.tone}><span className="kpi-ic"><I size={18}/></span><div className="kpi-num">{props.value}</div><div className="kpi-label">{props.label}</div><div className="kpi-sub">{props.sub}</div></div>;}
function Mdl(props){
  return(
    <div className="overlay" onClick={props.onClose}>
      <div className="modal" onClick={function(e){e.stopPropagation();}}>
        <div className="modal-head"><div><h3>{props.title}</h3>{props.subtitle?<p>{props.subtitle}</p>:null}</div><button className="icon-btn" onClick={props.onClose}><X size={18}/></button></div>
        <div className="modal-body">{props.children}</div>
        {props.footer?<div className="modal-foot">{props.footer}</div>:null}
      </div>
    </div>
  );
}
function GeoCapture(props){
  var loc=props.loc,setLoc=props.setLoc;
  var doFetch=function(){setLoc({status:"loading"});var fb=function(){var v=NEARBY_VILLAGES[Math.floor(Math.random()*NEARBY_VILLAGES.length)];setLoc({status:"done",lat:(21.6+Math.random()*.9).toFixed(5),lng:(70.6+Math.random()*.9).toFixed(5),village:v,approx:true});if(props.onVillage) props.onVillage(v);};if(navigator.geolocation){var t=setTimeout(fb,6500);navigator.geolocation.getCurrentPosition(function(p){clearTimeout(t);setLoc({status:"done",lat:p.coords.latitude.toFixed(5),lng:p.coords.longitude.toFixed(5),village:"",approx:false});},function(){clearTimeout(t);fb();},{enableHighAccuracy:true,timeout:6000});}else fb();};
  var ready=loc&&loc.status==="done";
  return(
    <div className={"geo-box"+(ready?" ready":"")}>
      <div className="geo-ic"><LocateFixed size={18}/></div>
      <div className="geo-main">
        {!loc?<div><div className="geo-title">Location not captured</div><div className="geo-sub">Fetch GPS before saving</div></div>:null}
        {loc&&loc.status==="loading"?<div><div className="geo-title">Fetching GPS...</div></div>:null}
        {ready?<div><div className="geo-title">{"Captured"+(loc.approx?" (approx.)":"")}</div><div className="geo-sub">{loc.lat+", "+loc.lng+(loc.village?" near "+loc.village:"")}</div></div>:null}
      </div>
      <button className="btn btn-sky btn-sm" onClick={doFetch}>{ready?"Re-fetch":"Fetch"}</button>
    </div>
  );
}

/* ====== DASHBOARD ====== */
function Dashboard(props){
  var visDemos=props.visDemos,crops=props.crops;
  var findCrop=function(id){return crops.find(function(c){return c.id===id;});};
  var active=visDemos.filter(function(d){return d.stageIndex<findCrop(d.cropId).stages.length-1;});
  var totalVal=visDemos.reduce(function(a,d){return a+demoValue(d);},0);

  return(
    <div className="stack">
      <div className="hero"><div><p className="eyebrow">{"Hello, "+props.me.name.split(" ")[0]}</p><h2 className="hero-title">{active.length+" demo"+(active.length!==1?"s":"")+" growing"}</h2></div>
        <button className="btn btn-primary" onClick={function(){props.setModal({type:"demo"});}}><Plus size={16}/> Start demo</button></div>

      {(props.stageRems.length>0)?
        <div className="rem-banner"><div className="rem-head"><span className="rem-ic"><Bell size={16}/></span><strong>{props.stageRems.length} reminder{(props.stageRems.length)!==1?"s":""}</strong></div>
          <div className="rem-list">
            {props.stageRems.slice(0,3).map(function(x){return <div className="rem-item" key={x.d.id+"s"}><span className="crop-chip sm">{x.c.icon}</span><div className="rem-item-main"><div className="rem-item-top">{x.c.name+" - "+x.c.stages[x.d.stageIndex].name} <ReminderPill r={x.r} small={true}/></div></div><button className="btn btn-ghost btn-sm" onClick={function(){props.setModal({type:"update",demoId:x.d.id});}}><Camera size={13}/></button></div>;})}
          </div></div>:null}

      <div className="kpi-grid">
        <Stat icon={FlaskConical} tone="green" label="Active demos" value={active.length} sub={visDemos.length+" total"}/>
        <Stat icon={Users} tone="sky" label="Farmers" value={props.visFarmers.length} sub="registered"/>
        <Stat icon={IndianRupee} tone="amber" label="Given" value={fmtINR(totalVal)} sub={"total"}/>
        <Stat icon={CalendarDays} tone="violet" label="Meetings" value={props.visMeetings.length} sub="scheduled"/>
      </div>

      <div className="card"><div className="card-head"><h3>Active demos</h3><button className="link" onClick={function(){props.go("demos");}}>All <ArrowRight size={14}/></button></div>
        <div className="stack-sm">{active.slice(0,4).map(function(d){var c=findCrop(d.cropId);var r=reminderFor(d,c);return(
          <button className="demo-row" key={d.id} onClick={function(){props.onOpenDemo(d.id);}}>
            <span className="crop-chip">{c.icon}</span>
            <div className="demo-row-main"><div className="demo-row-top"><strong>{c.name}</strong><span className="badge badge-green">{c.stages[d.stageIndex].name}</span><ReminderPill r={r} small={true}/></div><GrowthTrack stages={c.stages} index={d.stageIndex} compact={true}/></div>
            <ChevronRight size={18} className="muted"/>
          </button>);})}{active.length===0?<Empty text="No active demos."/>:null}</div>
      </div>
    </div>
  );
}

/* ====== PRODUCTS ====== */
function Products(props){
  var [filter,setFilter]=useState("All");
  var list=props.products.filter(function(p){return filter==="All"||p.cat===filter;});
  return(
    <div className="stack">
      <SectionHead title="Product master" sub="Seeds, fertilizers, pesticides" action={props.caps.manageProducts?<button className="btn btn-primary" onClick={function(){props.setModal({type:"product"});}}><Plus size={16}/> Add</button>:null}/>
      <div className="chips">{["All","Seed","Fertilizer","Pesticide"].map(function(c){return <button key={c} className={"chip"+(filter===c?" on":"")} onClick={function(){setFilter(c);}}>{c}</button>;})}</div>
      <div className="prod-grid">{list.map(function(p){return(
        <div className="prod-card" key={p.id}><div className="prod-top"><span className={"badge badge-"+catTone[p.cat]}>{p.cat}</span><span className="prod-price"><IndianRupee size={13}/>{p.price}</span></div><div className="prod-name">{p.name}</div><div className="prod-brand">{p.brand}</div><div className="prod-foot"><Package size={13}/> {p.pack}</div></div>
      );})}</div>
    </div>
  );
}

/* ====== CROPS ====== */
function Crops(props){
  return(
    <div className="stack">
      <SectionHead title="Crops and stages" sub="Each stage carries days until next - Admin sets those" action={props.caps.manageCrops?<button className="btn btn-primary" onClick={function(){props.setModal({type:"crop"});}}><Plus size={16}/> New crop</button>:null}/>
      <div className="crop-grid">{props.crops.map(function(c){var n=props.demos.filter(function(d){return d.cropId===c.id;}).length;return(
        <button className="crop-card" key={c.id} onClick={function(){props.onOpenCrop(c.id);}}>
          <div className="crop-card-head"><span className="crop-emoji">{c.icon}</span><div><div className="crop-name">{c.name}</div><div className="crop-season">{c.season+" - "+n+" demos"}</div></div><span className="stage-count">{c.stages.length}</span></div>
          <GrowthTrack stages={c.stages} index={c.stages.length-1} compact={true}/>
          <span className="crop-open">Open <ChevronRight size={14}/></span>
        </button>);})}</div>
    </div>
  );
}
function CropDetail(props){
  var [val,setVal]=useState("");var [days,setDays]=useState("10");var crop=props.crop;
  return(
    <div className="stack">
      <button className="back" onClick={props.onBack}><ChevronRight size={16} style={{transform:"rotate(180deg)"}}/> Crops</button>
      <div className="detail-hero"><span className="crop-emoji xl">{crop.icon}</span><div><h2 className="detail-title">{crop.name}</h2><p className="detail-sub">{crop.season+" - "+crop.stages.length+" stages"}</p></div></div>
      <div className="card"><div className="card-head"><h3>Pipeline and day gaps</h3></div>
        <div className="pipe-days">{crop.stages.map(function(s,i){var term=i===crop.stages.length-1;return(
          <div className="pd-step" key={i}><span className="pd-num">{String(i+1).padStart(2,"0")}</span><span className="pd-name">{s.name}</span>
            {term?<span className="pd-terminal">final</span>:props.caps.manageCrops?<span className="pd-days"><input type="number" min="1" value={s.days} onChange={function(e){props.onSetDays(i,Number(e.target.value)||0);}}/> days</span>:<span className="pd-days ro">{s.days+"d"}</span>}
          </div>);})}</div>
        {props.caps.manageCrops?<div className="add-stage"><input placeholder="Stage name..." value={val} onChange={function(e){setVal(e.target.value);}}/><input className="days-in" type="number" min="1" value={days} onChange={function(e){setDays(e.target.value);}}/><span className="days-lbl">d</span><button className="btn btn-primary" disabled={!val.trim()} onClick={function(){props.onAddStage({name:val.trim(),days:Number(days)||0});setVal("");}}><Plus size={16}/></button></div>:null}
      </div>
    </div>
  );
}

/* ====== DEMOS ====== */
function Demos(props){
  var findCrop=function(id){return props.crops.find(function(c){return c.id===id;});};
  return(
    <div className="stack">
      <SectionHead title="Crop demos" sub="Each is one farmer x one crop with its stage and value" action={<button className="btn btn-primary" onClick={function(){props.setModal({type:"demo"});}}><Plus size={16}/> Start demo</button>}/>
      <div className="demo-grid">{props.visDemos.map(function(d){var c=findCrop(d.cropId);var f=props.farmers.find(function(x){return x.id===d.farmerId;});var done=d.stageIndex>=c.stages.length-1;var r=reminderFor(d,c);var p=props.people.find(function(x){return x.id===d.assignedTo;});return(
        <button className="card demo-card" key={d.id} onClick={function(){props.onOpenDemo(d.id);}}>
          <div className="demo-card-head"><span className="crop-chip lg">{c.icon}</span><div className="demo-card-title"><strong>{c.name+" demo"}</strong><span className="muted-sm"><MapPin size={12}/> {(f?f.name:"")+" - "+(f?f.village:"")}</span></div><span className={"badge "+(done?"badge-amber":"badge-green")}>{done?"Harvest":c.stages[d.stageIndex].name}</span></div>
          <GrowthTrack stages={c.stages} index={d.stageIndex}/>
          <div className="demo-card-foot"><span className="tiny"><Sprout size={12}/>{p?p.name:""}</span><span className="tiny"><IndianRupee size={12}/>{demoValue(d).toLocaleString("en-IN")}</span><ReminderPill r={r} small={true}/></div>
        </button>);})}{props.visDemos.length===0?<Empty text="No demos in scope."/>:null}</div>
    </div>
  );
}
function DemoDetail(props){
  var d=props.d,crops=props.crops,farmers=props.farmers,products=props.products,people=props.people;
  var c=crops.find(function(x){return x.id===d.cropId;});var f=farmers.find(function(x){return x.id===d.farmerId;});
  var done=d.stageIndex>=c.stages.length-1;var r=reminderFor(d,c);  var items=(d.items||[]).map(function(it){return{...it,p:products.find(function(x){return x.id===it.productId;})};});
  var total=demoValue(d);
  var log=(d.log||[]).slice().reverse();
  var officer=people.find(function(x){return x.id===d.assignedTo;});

  return(
    <div className="stack">
      <button className="back" onClick={props.onBack}><ChevronRight size={16} style={{transform:"rotate(180deg)"}}/> Back</button>
      <div className="detail-hero"><span className="crop-emoji xl">{c.icon}</span>
        <div><h2 className="detail-title">{c.name+" demo"}</h2><p className="detail-sub"><MapPin size={13}/> {f?f.name:""} - {f?f.village:""} - <Sprout size={13}/> {officer?officer.name:""} - started {fmtDate(d.start)}</p></div>
        <span className={"badge lg "+(done?"badge-amber":"badge-green")}>{done?"Completed":"In progress"}</span>
      </div>

      <div className="card"><div className="card-head"><h3>Growth progress</h3>{!done?<span className="muted-sm">due {fmtDate(r.due)} <ReminderPill r={r} small={true}/></span>:null}</div>
        <GrowthTrack stages={c.stages} index={d.stageIndex}/>
        <div className="advance-bar"><div><div className="advance-label">Current stage</div><div className="advance-stage"><Sprout size={16}/> {c.stages[d.stageIndex].name}{!done?<span className="stage-due">{" - "+c.stages[d.stageIndex].days+"d gap"}</span>:null}</div></div>
          {done?<span className="done-pill"><Check size={15}/> Harvest reached</span>:<button className="btn btn-primary" onClick={function(){props.setModal({type:"update",demoId:d.id});}}><Camera size={16}/> Update stage</button>}
        </div></div>

      <div className="card"><div className="card-head"><h3>Products given to farmer</h3></div>
          <div className="bill"><div className="bill-row bill-head"><span>Product</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
            {items.map(function(it){return <div className="bill-row" key={it.productId}><span className="bill-name"><span className={"dot-cat "+(catTone[it.p?it.p.cat:""]||"")}/>{it.p?it.p.name:""}</span><span>{it.qty}</span><span>{fmtINR(it.price)}</span><span>{fmtINR(it.qty*it.price)}</span></div>;})}
            <div className="bill-row bill-total"><span>Total</span><span></span><span></span><span>{fmtINR(total)}</span></div>
          </div></div>

      <div className="card"><div className="card-head"><h3>Stage updates</h3><span className="muted-sm">{log.length+" logged"}</span></div>
        {log.length===0?<Empty text="No updates yet."/>:
        <div className="log">{log.map(function(e,i){return(
          <div className="log-item" key={i}>
            {e.photo?<img className="log-photo" src={e.photo} alt=""/>:<div className="log-photo none"><ImageIcon size={18}/></div>}
            <div className="log-main"><div className="log-top"><strong>{e.stageName}</strong>{e.completed?<span className="badge badge-green">completed</span>:null}<span className="muted-sm">{fmtDate(e.date)}</span></div><p className="log-remark">{e.remarks||"No remarks"}</p></div>
          </div>);})}</div>}
      </div>
    </div>
  );
}

/* ====== TRACK ====== */
function Track(props){
  var [view,setView]=useState("matrix");
  var visFarmers=props.visFarmers,visDemos=props.visDemos,crops=props.crops,people=props.people;
  var cellDemo=function(fid,cid){return visDemos.find(function(d){return d.farmerId===fid&&d.cropId===cid;});};
  var rows=visFarmers.filter(function(f){return visDemos.some(function(d){return d.farmerId===f.id;})||props.caps.scope==="own";});
  var empIds=[]; visDemos.forEach(function(d){if(empIds.indexOf(d.assignedTo)===-1)empIds.push(d.assignedTo);});

  return(
    <div className="stack">
      <SectionHead title="Track" sub={view==="matrix"?"Farmers x crops matrix":"Employee-wise demo detail"}/>
      <div className="seg wide">
        <button className={view==="matrix"?"on":""} onClick={function(){setView("matrix");}}><LayoutGrid size={14}/> Farmer x Crop</button>
        <button className={view==="employee"?"on":""} onClick={function(){setView("employee");}}><Users size={14}/> By officer</button>
      </div>

      {view==="matrix"?<div>
        <div className="legend"><span><span className="dot-mini done"/> done</span><span><span className="dot-mini cur"/> current</span><span><span className="dot-mini todo"/> upcoming</span></div>
        <div className="matrix-scroll"><table className="matrix"><thead><tr><th className="mx-corner">Farmer</th>{crops.map(function(c){return <th key={c.id} className="mx-crop-head">{c.icon+" "+c.name}</th>;})}</tr></thead>
          <tbody>{rows.map(function(f){return(
            <tr key={f.id}>
              <td className="mx-farmer"><button onClick={function(){props.onOpenFarmer(f.id);}}><span className="fd-avatar xs">{initials(f.name)}</span><span><span className="mxf-name">{f.name}</span><span className="mxf-village"><MapPin size={10}/> {f.village}</span></span></button></td>
              {crops.map(function(c){var d=cellDemo(f.id,c.id);if(!d) return <td key={c.id}><button className="cell empty" onClick={function(){props.onStart(f.id,c.id);}}><Plus size={14}/></button></td>;
                var done2=d.stageIndex>=c.stages.length-1;var r2=reminderFor(d,c);
                return <td key={c.id}><button className={"cell filled"+(done2?" done":"")} onClick={function(){props.onOpenDemo(d.id);}}>
                  <span className="cell-stage">{done2?"Harvest":c.stages[d.stageIndex].name}</span>
                  <div className="cell-foot"><MiniDots stages={c.stages} index={d.stageIndex}/><ReminderPill r={r2} small={true}/></div>
                </button></td>;})}
            </tr>);})}
            {rows.length===0?<tr><td className="mx-empty" colSpan={crops.length+1}>No data.</td></tr>:null}
          </tbody></table></div>
      </div>:
      <div className="emp-track">{empIds.map(function(eid){
        var emp=people.find(function(p){return p.id===eid;});if(!emp) return null;
        var ds=visDemos.filter(function(d){return d.assignedTo===eid;});
        var val=ds.reduce(function(a,d){return a+demoValue(d);},0);
                return(
          <div className="card emp-track-card" key={eid}>
            <div className="emp-track-head"><div className="fd-avatar sm">{initials(emp.name)}</div><div><div className="fc-name">{emp.name}</div><div className="muted-sm">{emp.title+" - "+ds.length+" demos - "+fmtINR(val)+" given - "}</div></div></div>
            <div className="emp-demo-list">{ds.map(function(d){var c=crops.find(function(x){return x.id===d.cropId;});var f2=visFarmers.find(function(x){return x.id===d.farmerId;});var done3=d.stageIndex>=c.stages.length-1;var r3=reminderFor(d,c);return(
              <button className="emp-demo-row" key={d.id} onClick={function(){props.onOpenDemo(d.id);}}>
                <span className="crop-chip sm">{c.icon}</span>
                <div className="emp-demo-main"><div className="emp-demo-top"><strong>{c.name}</strong><span className="muted-sm">{f2?f2.name:""}</span></div><div className="emp-demo-meta"><span className={"badge "+(done3?"badge-amber":"badge-green")}>{done3?"Harvest":c.stages[d.stageIndex].name}</span><ReminderPill r={r3} small={true}/><span className="muted-sm">{fmtINR(demoValue(d))}</span></div></div>
                <MiniDots stages={c.stages} index={d.stageIndex}/>
              </button>);})}</div>
          </div>);})}{empIds.length===0?<Empty text="No demos."/>:null}</div>}
    </div>
  );
}

/* ====== FARMERS ====== */
function FarmersList(props){
  var findCrop=function(id){return props.crops.find(function(c){return c.id===id;});};
  var findPerson=function(id){return props.people.find(function(p){return p.id===id;});};
  return(
    <div className="stack">
      <SectionHead title={props.caps.scope==="own"?"My farmers":"Farmers"} sub="Each farmer added once - GPS captured live" action={<button className="btn btn-primary" onClick={function(){props.setModal({type:"farmer"});}}><Plus size={16}/> Add</button>}/>
      <div className="farmer-grid">{props.visFarmers.map(function(f){var fd=props.demos.filter(function(d){return d.farmerId===f.id;});var own=findPerson(f.addedBy);return(
        <button className="card farmer-card" key={f.id} onClick={function(){props.onOpenFarmer(f.id);}}>
          <div className="fc-head"><div className="fd-avatar">{initials(f.name)}</div><div><div className="fc-name">{f.name}</div><div className="fc-village"><MapPin size={12}/> {f.village}</div></div></div>
          <div className="fc-lines"><span><Phone size={13}/> {f.phone}</span><span><Ruler size={13}/> {f.acres+" ac"}</span></div>
          <div className="fc-crops">{fd.map(function(d){var c=findCrop(d.cropId);return <span key={d.id} className="crop-mini">{c.icon+" "+c.stages[d.stageIndex].name}</span>;})}</div>
          <div className="fc-foot">{fd.length+" demos - "+(own?own.name:"?")} <ChevronRight size={13}/></div>
        </button>);})}{props.visFarmers.length===0?<Empty text="No farmers."/>:null}</div>
    </div>
  );
}
function FarmerDetail(props){
  var farmer=props.farmer,demos=props.demos,crops=props.crops;
  var fd=demos.filter(function(d){return d.farmerId===farmer.id;});
  var findCrop=function(id){return crops.find(function(c){return c.id===id;});};
  return(
    <div className="stack">
      <button className="back" onClick={props.onBack}><ChevronRight size={16} style={{transform:"rotate(180deg)"}}/> Farmers</button>
      <div className="detail-hero"><div className="fd-avatar xl">{initials(farmer.name)}</div><div><h2 className="detail-title">{farmer.name}</h2><p className="detail-sub"><MapPin size={13}/> {farmer.village} - <Phone size={13}/> {farmer.phone} - <Ruler size={13}/> {farmer.acres+" ac"}</p></div><button className="btn btn-primary" onClick={function(){props.onStart(farmer.id,null);}}><Plus size={16}/> Start demo</button></div>
      <div className="card"><div className="card-head"><h3>Demos</h3><span className="muted-sm">{fd.length+" across crops"}</span></div>
        <div className="fd-demos">{fd.map(function(d){var c=findCrop(d.cropId);var done=d.stageIndex>=c.stages.length-1;var r=reminderFor(d,c);return(
          <div className="fd-demo" key={d.id}><div className="fd-demo-head"><span className="crop-chip">{c.icon}</span><div className="fd-demo-title"><strong>{c.name}</strong><span className="muted-sm">{fmtINR(demoValue(d))}</span></div><span className={"badge "+(done?"badge-amber":"badge-green")}>{done?"Harvest":c.stages[d.stageIndex].name}</span></div>
            <GrowthTrack stages={c.stages} index={d.stageIndex}/>
            <div className="fd-demo-actions"><ReminderPill r={r} small={true}/><button className="btn btn-ghost btn-sm" onClick={function(){props.onOpenDemo(d.id);}}>Open</button>{!done?<button className="btn btn-primary btn-sm" onClick={function(){props.setModal({type:"update",demoId:d.id});}}><Camera size={14}/> Update</button>:null}</div>
          </div>);})}{fd.length===0?<Empty text="No demos yet."/>:null}</div>
      </div>
    </div>
  );
}

/* ====== COLLECTIONS ====== */
/* ====== MEETINGS ====== */
function MeetingsList(props){
  var sorted=props.visMeetings.slice().sort(function(a,b){return(a.date+a.time).localeCompare(b.date+b.time);});
  var tone={"Farmer Meet":"green","Team Sync":"sky","Product Training":"amber"};
  return(
    <div className="stack">
      <SectionHead title="Meetings" sub="Assign, invite farmers, capture photos and remarks" action={<button className="btn btn-primary" onClick={function(){props.setModal({type:"meeting"});}}><Plus size={16}/> Schedule</button>}/>
      <div className="meet-list">{sorted.map(function(m){var att=(m.farmerIds||[]).length;var assigned=props.people.find(function(p){return p.id===(m.assignedTo||m.host);});return(
        <button className="card meet-card" key={m.id} onClick={function(){props.onOpenMeeting(m.id);}}>
          <div className="meet-date"><span>{fmtDate(m.date).split(" ")[0]}</span><em>{fmtDate(m.date).split(" ")[1]}</em></div>
          <div className="meet-main"><div className="meet-title-row"><strong>{m.title}</strong><span className={"badge badge-"+(tone[m.type]||"green")}>{m.type}</span></div>
            <div className="meet-sub"><Clock size={13}/> {m.time} - <MapPin size={13}/> {m.place} - <Sprout size={13}/> {assigned?assigned.name:""}{att>0?(" - "+att+" farmer"+(att!==1?"s":"")):""}</div></div>
          <ChevronRight size={18} className="muted"/>
        </button>);})}</div>
    </div>
  );
}
function MeetingDetail(props){
  var m=props.meeting;var att=props.farmers.filter(function(f){return(m.farmerIds||[]).includes(f.id);});
  var assigned=props.people.find(function(p){return p.id===(m.assignedTo||m.host);});
  var photos=m.photos||[];
  return(
    <div className="stack">
      <button className="back" onClick={props.onBack}><ChevronRight size={16} style={{transform:"rotate(180deg)"}}/> Meetings</button>
      <div className="detail-hero"><div className="meet-date lg"><span>{fmtDate(m.date).split(" ")[0]}</span><em>{fmtDate(m.date).split(" ")[1]}</em></div>
        <div><h2 className="detail-title">{m.title}</h2><p className="detail-sub"><Clock size={13}/> {m.time} - <MapPin size={13}/> {m.place} - <Sprout size={13}/> {assigned?assigned.name:""}</p></div>
        <button className="btn btn-primary" onClick={function(){props.setModal({type:"meetUpdate",meetId:m.id});}}><Camera size={16}/> Add photos</button>
      </div>
      <div className="two-col">
        <div className="card"><div className="card-head"><h3>Farmer list</h3><span className="muted-sm">{att.length+" farmers"}</span></div>
          {att.length===0?<Empty text="No farmers in this meeting."/>:<div className="stack-xs">{att.map(function(f){return <div className="meet-farmer" key={f.id}><div className="fd-avatar xs">{initials(f.name)}</div><div><div className="mf-name">{f.name}</div><div className="muted-sm"><MapPin size={11}/> {f.village}</div></div></div>;})}</div>}
        </div>
        <div className="card"><div className="card-head"><h3>Photos</h3></div>
          {photos.length===0?<Empty text="No photos yet."/>:<div className="meet-photos">{photos.map(function(p,i){return <img key={i} src={p} alt="meeting"/>;})}</div>}
          {m.remarks?<div className="card-head mt"><h3>Remarks</h3></div>:null}
          {m.remarks?<p className="meet-remarks">{m.remarks}</p>:null}
        </div>
      </div>
    </div>
  );
}

/* ====== REPORTS ====== */
function Reports(props){
  var findCrop=function(id){return props.crops.find(function(c){return c.id===id;});};
  var totalVal=props.demos.reduce(function(a,d){return a+demoValue(d);},0);
  var active=props.demos.filter(function(d){var c=findCrop(d.cropId);return d.stageIndex<c.stages.length-1;}).length;
  var sc={onTrack:0,dueSoon:0,overdue:0,completed:0};props.demos.forEach(function(d){sc[reminderFor(d,findCrop(d.cropId)).status]++;});
  var byCrop=props.crops.map(function(c){var ds=props.demos.filter(function(d){return d.cropId===c.id;});return{name:c.name,icon:c.icon,value:ds.reduce(function(a,d){return a+demoValue(d);},0)};});var maxV=Math.max(1,...byCrop.map(function(b){return b.value;}));
  var emps=props.people.filter(function(p){return p.role==="employee";}).map(function(e){var ds=props.demos.filter(function(d){return d.assignedTo===e.id;});var mgr=props.people.find(function(p){return p.id===e.manager;});return{name:e.name,mgr:mgr?mgr.name:"",farmers:props.farmers.filter(function(f){return f.addedBy===e.id;}).length,demos:ds.length,stages:ds.reduce(function(a,d){return a+d.stageIndex;},0),value:ds.reduce(function(a,d){return a+demoValue(d);},0),overdue:ds.filter(function(d){return reminderFor(d,findCrop(d.cropId)).status==="overdue";}).length};});
  return(
    <div className="stack">
      <SectionHead title="Overall report" sub="Agency-wide"/>
      <div className="kpi-grid">
        <Stat icon={FlaskConical} tone="green" label="Demos" value={props.demos.length} sub={active+" active"}/>
        <Stat icon={IndianRupee} tone="amber" label="Given" value={fmtINR(totalVal)} sub={"total"}/>
        <Stat icon={AlertTriangle} tone="sky" label="Overdue" value={sc.overdue} sub={sc.dueSoon+" due soon"}/>
        <Stat icon={Users} tone="violet" label="Farmers" value={props.farmers.length} sub="registered"/>
      </div>
      <div className="two-col">
        <div className="card"><div className="card-head"><h3>Value by crop</h3></div><div className="bars">{byCrop.map(function(b){return <div className="bar-row" key={b.name}><span className="bar-label">{b.icon+" "+b.name}</span><div className="bar-track"><div className="bar-fill" style={{width:(b.value/maxV*100)+"%"}}/></div><span className="bar-val" style={{width:64,fontSize:11}}>{fmtINR(b.value)}</span></div>;})}</div></div>
        <div className="card"><div className="card-head"><h3>Status</h3></div><div className="status-grid"><div className="status-cell on"><div className="sc-num">{sc.onTrack}</div><div className="sc-lbl">On track</div></div><div className="status-cell soon"><div className="sc-num">{sc.dueSoon}</div><div className="sc-lbl">Due soon</div></div><div className="status-cell over"><div className="sc-num">{sc.overdue}</div><div className="sc-lbl">Overdue</div></div><div className="status-cell done"><div className="sc-num">{sc.completed}</div><div className="sc-lbl">Done</div></div></div></div>
      </div>
      <div className="card"><div className="card-head"><h3>Officer performance</h3></div><div className="rep-scroll"><table className="rep-table"><thead><tr><th>Officer</th><th>Manager</th><th>Farmers</th><th>Demos</th><th>Stages</th><th>Overdue</th><th>Given</th></tr></thead><tbody>{emps.map(function(e){return <tr key={e.name}><td className="rep-name"><span className="fd-avatar xs">{initials(e.name)}</span>{e.name}</td><td>{e.mgr}</td><td>{e.farmers}</td><td>{e.demos}</td><td>{e.stages}</td><td>{e.overdue>0?<span className="rem-pill over sm"><AlertTriangle size={11}/>{e.overdue}</span>:"0"}</td><td className="rep-val">{fmtINR(e.value)}</td></tr>;})}</tbody></table></div></div>
    </div>
  );
}

/* ====== TEAM & USER MANAGEMENT ====== */
function TeamPage(props){
  var me=props.me,caps=props.caps,people=props.people;
  var managers=caps.manageTeam?people.filter(function(p){return p.role==="manager";}):people.filter(function(p){return p.id===me.id;});
  var stat=function(id){return{farmers:props.farmers.filter(function(f){return f.addedBy===id;}).length,demos:props.demos.filter(function(d){return d.assignedTo===id;}).length};};
  var canAdd=caps.canAddUser;
  var isAdmin=caps.manageTeam;

  return(
    <div className="stack">
      <SectionHead title={isAdmin?"Team Management":"Your Team"} sub={isAdmin?"Create and manage managers and employees":"Add employees to your team"}
        action={canAdd?<button className="btn btn-primary" onClick={function(){props.setModal({type:"addUser"});}}><UserPlus size={16}/> {isAdmin?"Add user":"Add employee"}</button>:null}/>

      {isAdmin?<div className="card owner-card"><div className="fd-avatar owner">{initials("Rajesh Patel")}</div><div><div className="fc-name">Rajesh Patel <span className="badge badge-amber">Owner</span></div><div className="fc-village">Agency Owner</div></div></div>:null}

      {managers.map(function(mgr){
        var emps=people.filter(function(p){return p.manager===mgr.id;});
        return(
          <div className="card mgr-block" key={mgr.id}>
            <div className="mgr-head">
              <div className="fd-avatar mgr">{initials(mgr.name)}</div>
              <div><div className="fc-name">{mgr.name} <span className="badge badge-sky">{isAdmin?"Manager":"You"}</span></div><div className="fc-village">{mgr.title}{mgr.phone?" - "+mgr.phone:""}</div></div>
              <span className="mgr-count">{emps.length+" officers"}</span>
              {isAdmin?<div className="user-actions">
                <button className="btn btn-ghost btn-sm" onClick={function(){props.setModal({type:"editUser",userId:mgr.id});}}><Pencil size={13}/></button>
                <button className="btn btn-ghost btn-sm btn-danger" onClick={function(){if(confirm("Remove "+mgr.name+"?"))props.onRemove(mgr.id);}}><Trash2 size={13}/></button>
              </div>:null}
            </div>
            <div className="emp-row">{emps.map(function(e){var s=stat(e.id);return(
              <div className="emp-card" key={e.id}>
                <div className="fd-avatar sm">{initials(e.name)}</div><div className="emp-name">{e.name}</div>
                {e.phone?<div className="muted-sm">{e.phone}</div>:null}
                <div className="emp-stats"><span>{s.farmers+" farmers"}</span><span>{s.demos+" demos"}</span></div>
                {(isAdmin||me.id===mgr.id)?<div className="user-actions-sm">
                  <button className="btn btn-ghost btn-sm" onClick={function(){props.setModal({type:"editUser",userId:e.id});}}><Pencil size={12}/></button>
                  <button className="btn btn-ghost btn-sm btn-danger" onClick={function(){if(confirm("Remove "+e.name+"?"))props.onRemove(e.id);}}><Trash2 size={12}/></button>
                </div>:null}
              </div>);})}</div>
          </div>);
      })}
    </div>
  );
}

/* ====== MODALS ====== */
function ProductModal(props){
  var [f,setF]=useState({name:"",brand:"",cat:"Seed",pack:"",price:""});var set=function(k){return function(e){setF(function(s){return{...s,[k]:e.target.value};});};};var ok=f.name&&f.brand&&f.pack&&f.price;
  return <Mdl title="Add product" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={function(){props.onSave({...f,price:Number(f.price)});}}>Save</button></div>}>
    <Fld label="Name"><input value={f.name} onChange={set("name")}/></Fld>
    <Fld label="Brand"><input value={f.brand} onChange={set("brand")}/></Fld>
    <div className="grid2"><Fld label="Category"><select value={f.cat} onChange={set("cat")}><option>Seed</option><option>Fertilizer</option><option>Pesticide</option></select></Fld><Fld label="Pack"><input value={f.pack} onChange={set("pack")}/></Fld></div>
    <Fld label="Price"><input type="number" value={f.price} onChange={set("price")}/></Fld>
  </Mdl>;
}
function CropModal(props){
  var [f,setF]=useState({name:"",season:"Kharif",icon:"\u{1F331}"});var [stages,setStages]=useState([{name:"Sowing",days:7},{name:"Germination",days:10},{name:"Harvest",days:0}]);var [stg,setStg]=useState("");var [sd,setSd]=useState("10");var set=function(k){return function(e){setF(function(s){return{...s,[k]:e.target.value};});};};
  var addS=function(){if(stg.trim()){setStages(function(s){return s.concat([{name:stg.trim(),days:Number(sd)||0}]);});setStg("");}};var ok=f.name&&stages.length>=2;
  return <Mdl title="New crop" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={function(){props.onSave({...f,stages});}}>Create</button></div>}>
    <div className="grid2"><Fld label="Name"><input value={f.name} onChange={set("name")}/></Fld><Fld label="Season"><select value={f.season} onChange={set("season")}><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></Fld></div>
    <Fld label="Icon"><div className="emoji-pick">{EMOJIS.map(function(e){return <button key={e} type="button" className={"emoji-opt"+(f.icon===e?" on":"")} onClick={function(){setF(function(s){return{...s,icon:e};});}}>{e}</button>;})}</div></Fld>
    <Fld label="Stages"><div className="stage-edit">{stages.map(function(s,i){return <span className="stage-tag" key={i}>{(i+1)+". "+s.name+(i<stages.length-1?" "+s.days+"d":"")}<button type="button" onClick={function(){setStages(function(x){return x.filter(function(_,j){return j!==i;});});}}><X size={11}/></button></span>;})}</div>
      <div className="stage-add"><input value={stg} onChange={function(e){setStg(e.target.value);}} placeholder="Stage..." onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();addS();}}}/><input className="days-in" type="number" min="1" value={sd} onChange={function(e){setSd(e.target.value);}}/><span className="days-lbl">d</span><button type="button" className="btn btn-ghost btn-sm" onClick={addS}><Plus size={14}/></button></div></Fld>
  </Mdl>;
}
function FarmerModal(props){
  var [f,setF]=useState({name:"",phone:"",village:"",acres:""});var [loc,setLoc]=useState(null);var set=function(k){return function(e){setF(function(s){return{...s,[k]:e.target.value};});};};var ok=f.name&&f.phone&&f.village&&f.acres&&loc&&loc.status==="done";
  return <Mdl title="Add farmer" subtitle="GPS captured live" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={function(){props.onSave({...f,acres:Number(f.acres),lat:loc.lat,lng:loc.lng});}}>Register</button></div>}>
    <GeoCapture loc={loc} setLoc={setLoc} onVillage={function(v){setF(function(s){return{...s,village:s.village||v};});}}/>
    <Fld label="Name"><input value={f.name} onChange={set("name")}/></Fld>
    <div className="grid2"><Fld label="Phone"><input value={f.phone} onChange={set("phone")}/></Fld><Fld label="Acres"><input type="number" value={f.acres} onChange={set("acres")}/></Fld></div>
    <Fld label="Village"><input value={f.village} onChange={set("village")}/></Fld>
  </Mdl>;
}
function DemoModal(props){
  var lf=props.presetFarmerId?props.visFarmers.find(function(f){return f.id===props.presetFarmerId;}):null;
  var [mode,setMode]=useState(lf?"existing":props.visFarmers.length?"existing":"new");
  var [d,setD]=useState({cropId:props.presetCropId||props.crops[0].id,farmerId:props.presetFarmerId||((props.visFarmers[0]||{}).id||""),start:"2026-08-30"});
  var [assignedTo,setAssignedTo]=useState(props.officers.length?props.officers[0].id:props.me.id);
  var [nf,setNf]=useState({name:"",phone:"",village:"",acres:""});var [loc,setLoc]=useState(null);
  var [sel,setSel]=useState({});
  var setNfk=function(k){return function(e){setNf(function(s){return{...s,[k]:e.target.value};});};};
  var toggleP=function(p){setSel(function(s){var n={...s};if(n[p.id])delete n[p.id];else n[p.id]={qty:1,price:p.price};return n;});};
  var setLine=function(id,k,v){setSel(function(s){return{...s,[id]:{...s[id],[k]:Number(v)||0}};});};
  var items=Object.entries(sel).map(function(x){return{productId:x[0],qty:x[1].qty,price:x[1].price};});
  var total=items.reduce(function(a,it){return a+it.qty*it.price;},0);
  var newOk=nf.name&&nf.phone&&nf.village&&nf.acres&&loc&&loc.status==="done";
  var ok=d.cropId&&items.length>0&&items.every(function(it){return it.qty>0;})&&(mode==="existing"?d.farmerId:newOk);
  var submit=function(){props.onSave(mode==="existing"?{mode:"existing",farmerId:d.farmerId,cropId:d.cropId,items:items,start:d.start,assignedTo:assignedTo}:{mode:"new",farmer:{...nf,acres:Number(nf.acres),lat:loc.lat,lng:loc.lng},cropId:d.cropId,items:items,start:d.start,assignedTo:assignedTo});};
  return <Mdl title="Start demo" onClose={props.onClose} footer={<div><span className="modal-total">{"Total: "+fmtINR(total)}</span><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={submit}>Start</button></div>}>
    {!lf?<div className="seg"><button className={mode==="existing"?"on":""} onClick={function(){setMode("existing");}} disabled={!props.visFarmers.length}>Existing</button><button className={mode==="new"?"on":""} onClick={function(){setMode("new");}}>New farmer</button></div>:null}
    {mode==="existing"?(lf?<div className="locked-farmer"><div className="fd-avatar sm">{initials(lf.name)}</div><div><strong>{lf.name}</strong><span className="muted-sm">{lf.village}</span></div></div>:<Fld label="Farmer"><select value={d.farmerId} onChange={function(e){setD(function(s){return{...s,farmerId:e.target.value};});}}>{props.visFarmers.map(function(fr){return <option key={fr.id} value={fr.id}>{fr.name+" - "+fr.village}</option>;})}</select></Fld>):
      <div><GeoCapture loc={loc} setLoc={setLoc} onVillage={function(v){setNf(function(s){return{...s,village:s.village||v};});}}/><Fld label="Name"><input value={nf.name} onChange={setNfk("name")}/></Fld><div className="grid2"><Fld label="Phone"><input value={nf.phone} onChange={setNfk("phone")}/></Fld><Fld label="Acres"><input type="number" value={nf.acres} onChange={setNfk("acres")}/></Fld></div><Fld label="Village"><input value={nf.village} onChange={setNfk("village")}/></Fld></div>}
    <div className="grid2"><Fld label="Crop"><select value={d.cropId} onChange={function(e){setD(function(s){return{...s,cropId:e.target.value};});}}>{props.crops.map(function(c){return <option key={c.id} value={c.id}>{c.icon+" "+c.name}</option>;})}</select></Fld><Fld label="Start"><input type="date" value={d.start} onChange={function(e){setD(function(s){return{...s,start:e.target.value};});}}/></Fld></div>
    {props.caps.canAssign&&props.officers.length>0?<Fld label="Assign to"><select value={assignedTo} onChange={function(e){setAssignedTo(e.target.value);}}>{props.officers.map(function(o){return <option key={o.id} value={o.id}>{o.name}</option>;})}</select></Fld>:null}
    <Fld label="Products - qty and price"><div className="prod-pick">{props.products.map(function(p){return <button key={p.id} type="button" className={"pick"+(sel[p.id]?" on":"")} onClick={function(){toggleP(p);}}>{sel[p.id]?<Check size={12}/>:null} {p.name}</button>;})}</div>
      {items.length>0?<div className="qty-list">{Object.entries(sel).map(function(x){var id=x[0],v=x[1];var p=props.products.find(function(pp){return pp.id===id;});return <div className="qty-row" key={id}><span className="qty-name">{p?p.name:""}</span><span className="qty-field">Qty <input type="number" min="1" value={v.qty} onChange={function(e){setLine(id,"qty",e.target.value);}}/></span><span className="qty-field">{"\u20B9"} <input type="number" min="0" value={v.price} onChange={function(e){setLine(id,"price",e.target.value);}}/></span><span className="qty-amt">{fmtINR(v.qty*v.price)}</span></div>;})}</div>:null}</Fld>
  </Mdl>;
}
function MeetingModal(props){
  var [f,setF]=useState({title:"",type:"Farmer Meet",date:"2026-08-31",time:"10:00",place:""});var [assignedTo,setAssignedTo]=useState(props.me.id);var [selF,setSelF]=useState([]);
  var set=function(k){return function(e){setF(function(s){return{...s,[k]:e.target.value};});};};
  var toggleF=function(id){setSelF(function(s){return s.includes(id)?s.filter(function(x){return x!==id;}):s.concat([id]);});};
  var ok=f.title&&f.date&&f.time&&f.place;
  return <Mdl title="Schedule meeting" subtitle="Assign someone, invite farmers" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={function(){props.onSave({...f,assignedTo:assignedTo,farmerIds:selF});}}>Schedule</button></div>}>
    <Fld label="Title"><input value={f.title} onChange={set("title")} placeholder="e.g. Cotton field walk"/></Fld>
    <div className="grid2"><Fld label="Type"><select value={f.type} onChange={set("type")}><option>Farmer Meet</option><option>Team Sync</option><option>Product Training</option></select></Fld>
      <Fld label="Assign to"><select value={assignedTo} onChange={function(e){setAssignedTo(e.target.value);}}>{props.allStaff.map(function(o){return <option key={o.id} value={o.id}>{o.name}</option>;})}<option value={props.me.id}>{props.me.name+" (me)"}</option></select></Fld></div>
    <div className="grid2"><Fld label="Date"><input type="date" value={f.date} onChange={set("date")}/></Fld><Fld label="Time"><input type="time" value={f.time} onChange={set("time")}/></Fld></div>
    <Fld label="Place"><input value={f.place} onChange={set("place")}/></Fld>
    {props.visFarmers.length>0?<Fld label="Farmers attending"><div className="prod-pick">{props.visFarmers.map(function(fr){return <button key={fr.id} type="button" className={"pick"+(selF.includes(fr.id)?" on":"")} onClick={function(){toggleF(fr.id);}}>{selF.includes(fr.id)?<Check size={12}/>:null} {fr.name}</button>;})}</div></Fld>:null}
  </Mdl>;
}
function UpdateStageModal(props){
  var demo=props.demo,crop=props.crop; if(!demo||!crop) return null;
  var stage=crop.stages[demo.stageIndex];var last=demo.stageIndex>=crop.stages.length-1;
  var [photo,setPhoto]=useState(null);var [remarks,setRemarks]=useState("");var [advance,setAdvance]=useState(!last);
  var next=!last?crop.stages[demo.stageIndex+1].name:null;
  var onFile=function(e){var file=e.target.files&&e.target.files[0];if(!file)return;var r=new FileReader();r.onload=function(){setPhoto(r.result);};r.readAsDataURL(file);};
  return <Mdl title={"Update - "+stage.name} subtitle="Photo and remarks" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" onClick={function(){props.onSave({demoId:demo.id,photo:photo,remarks:remarks,advance:advance});}}>{advance&&!last?"Save and complete":"Save"}</button></div>}>
    <label className={"photo-input"+(photo?" has":"")}>
      {photo?<img src={photo} alt="stage"/>:<span className="pi-empty"><Camera size={22}/><span>Tap for photo</span></span>}
      <input type="file" accept="image/*" capture="environment" onChange={onFile} hidden/>
    </label>
    <Fld label="Remarks"><textarea rows={3} value={remarks} onChange={function(e){setRemarks(e.target.value);}} placeholder="Observations..."/></Fld>
    {!last?<label className="check-row"><input type="checkbox" checked={advance} onChange={function(e){setAdvance(e.target.checked);}}/><span>{"Complete "+stage.name+" and move to "+next}</span></label>:null}
    {last?<div className="warn"><Check size={16}/> Final stage.</div>:null}
  </Mdl>;
}

function MeetUpdateModal(props){
  var m=props.meeting;if(!m) return null;
  var [photos,setPhotos]=useState([]);var [remarks,setRemarks]=useState("");
  var onFiles=function(e){var files=Array.from(e.target.files||[]);files.forEach(function(f){var r=new FileReader();r.onload=function(){setPhotos(function(s){return s.concat([r.result]);});};r.readAsDataURL(f);});};
  return <Mdl title="Update meeting" subtitle="Add photos and remarks" onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" onClick={function(){props.onSave({meetId:m.id,photos:photos,remarks:remarks});}}>Save</button></div>}>
    <div className="multi-photo"><div className="mp-grid">{photos.map(function(p,i){return <img key={i} src={p} alt=""/>;})}
      <label className="mp-add"><Camera size={20}/><span>Add</span><input type="file" accept="image/*" multiple onChange={onFiles} hidden/></label>
    </div></div>
    <Fld label="Remarks"><textarea rows={3} value={remarks} onChange={function(e){setRemarks(e.target.value);}} placeholder="Takeaways, action items..."/></Fld>
  </Mdl>;
}
function UserModal(props){
  var editing=!!props.editUser;
  var isAdmin=props.caps.manageTeam;
  var managers=props.people.filter(function(p){return p.role==="manager";});
  var defaultRole=isAdmin?"employee":"employee";
  var defaultMgr=isAdmin?(managers[0]?managers[0].id:""):props.me.id;

  var [f,setF]=useState(editing?{name:props.editUser.name,phone:props.editUser.phone||"",title:props.editUser.title||"",role:props.editUser.role,manager:props.editUser.manager||"",reportsTo:props.editUser.reportsTo||""}:{name:"",phone:"",title:"Field Officer",role:defaultRole,manager:defaultMgr,reportsTo:"u_admin"});
  var set=function(k){return function(e){setF(function(s){return{...s,[k]:e.target.value};});};};
  var ok=f.name&&f.phone;

  return <Mdl title={editing?"Edit user":"Add user"} subtitle={isAdmin?"Create a manager or employee":"Add an employee to your team"} onClose={props.onClose} footer={<div><button className="btn btn-ghost" onClick={props.onClose}>Cancel</button> <button className="btn btn-primary" disabled={!ok} onClick={function(){if(editing){props.onSave({...props.editUser,...f});}else{props.onSave(f);}}}>{editing?"Update":"Add"}</button></div>}>
    <Fld label="Name"><input value={f.name} onChange={set("name")} placeholder="Full name"/></Fld>
    <div className="grid2"><Fld label="Phone"><input value={f.phone} onChange={set("phone")} placeholder="99xxx xxxxx"/></Fld>
      <Fld label="Title"><input value={f.title} onChange={set("title")} placeholder="e.g. Field Officer"/></Fld></div>
    {isAdmin?<Fld label="Role"><select value={f.role} onChange={set("role")}><option value="manager">Manager</option><option value="employee">Employee</option></select></Fld>:null}
    {f.role==="employee"?<Fld label="Reports to (Manager)"><select value={f.manager} onChange={set("manager")}>{managers.map(function(m){return <option key={m.id} value={m.id}>{m.name}</option>;})}{!isAdmin?<option value={props.me.id}>{props.me.name+" (you)"}</option>:null}</select></Fld>:null}
    {f.role==="manager"&&isAdmin?<Fld label="Reports to"><select value={f.reportsTo} onChange={set("reportsTo")}><option value="u_admin">Rajesh Patel (Owner)</option></select></Fld>:null}
  </Mdl>;
}

/* ====== CSS ====== */
var CSS=`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap');
.gg{--bg:#F1F5EC;--surface:#FFFFFF;--surface-2:#F7FAF3;--ink:#16281E;--ink-soft:#5A6B60;--line:#E4EBDD;--primary:#1F6B3B;--primary-d:#17542E;--accent:#7CB342;--amber:#C67A1E;--sky:#2F7FA3;--violet:#7C5CBF;--danger:#C0463B;--shadow:0 1px 2px rgba(22,40,30,.05),0 6px 20px rgba(22,40,30,.06);--font:'Inter',system-ui,sans-serif;--display:'Bricolage Grotesque',var(--font);display:flex;min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--font);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}
.gg *{box-sizing:border-box;}.gg button{font-family:inherit;cursor:pointer;}.gg input,.gg select,.gg textarea{font-family:inherit;}
.gg h1,.gg h2,.gg h3{margin:0;font-family:var(--display);letter-spacing:-.01em;}
.sidebar{width:238px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--line);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;}
.brand{display:flex;align-items:center;gap:10px;padding:17px 15px;border-bottom:1px solid var(--line);}.brand-mark{width:35px;height:35px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;}.brand-name{font-family:var(--display);font-weight:700;font-size:15.5px;line-height:1.1;}.brand-sub{font-size:10px;color:var(--ink-soft);}.drawer-x{display:none;margin-left:auto;background:none;border:none;color:var(--ink-soft);}
.nav{padding:10px 8px;display:flex;flex-direction:column;gap:1px;flex:1;overflow:auto;}.nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:none;border-radius:8px;background:none;color:var(--ink-soft);font-size:12.5px;font-weight:500;text-align:left;transition:.15s;}.nav-item:hover{background:var(--surface-2);color:var(--ink);}.nav-item.active{background:linear-gradient(90deg,rgba(31,107,59,.12),rgba(124,179,66,.06));color:var(--primary);font-weight:600;}.nav-caret{margin-left:auto;}.side-foot{padding:11px;border-top:1px solid var(--line);}.scope-note{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--ink-soft);background:var(--surface-2);padding:7px 9px;border-radius:7px;}
.main{flex:1;min-width:0;display:flex;flex-direction:column;}.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:11px;padding:11px 20px;background:rgba(241,245,236,.82);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}.page-head h1{font-size:16px;}.page-head p{font-size:11px;color:var(--ink-soft);margin-top:1px;}.role-pill{text-transform:capitalize;color:var(--primary);font-weight:600;}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:9px;}.search{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--line);padding:6px 10px;border-radius:8px;color:var(--ink-soft);}.search input{border:none;outline:none;background:none;font-size:12px;width:120px;color:var(--ink);}
.icon-btn{position:relative;width:32px;height:32px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink-soft);display:grid;place-items:center;transition:.15s;}.icon-btn:hover{color:var(--ink);}.count{position:absolute;top:-4px;right:-4px;min-width:15px;height:15px;padding:0 3px;border-radius:8px;background:var(--danger);color:#fff;font-size:9.5px;font-weight:700;display:grid;place-items:center;border:2px solid var(--bg);}
.me-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--primary-d),var(--primary));color:#fff;display:grid;place-items:center;font-weight:700;font-size:12px;}
.roleswitch{display:flex;background:var(--surface);border:1px solid var(--line);border-radius:9px;padding:2px;gap:1px;}.rs-opt{display:flex;align-items:center;gap:5px;padding:5px 9px;border:none;border-radius:6px;background:none;color:var(--ink-soft);font-size:11.5px;font-weight:600;transition:.15s;}.rs-opt:hover{color:var(--ink);}.rs-opt.on{background:var(--primary);color:#fff;}
.content{padding:22px 20px 50px;max-width:1100px;width:100%;margin:0 auto;}.stack{display:flex;flex-direction:column;gap:16px;}.stack-sm{display:flex;flex-direction:column;gap:8px;}.stack-xs{display:flex;flex-direction:column;gap:6px;}
.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;background:linear-gradient(120deg,#173F27,#245C36 60%,#2E7A44);color:#fff;padding:22px 24px;border-radius:16px;overflow:hidden;position:relative;}.hero:after{content:"";position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(124,179,66,.4),transparent 70%);}.eyebrow{font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;color:#bfe3c6;margin-bottom:5px;font-weight:600;}.hero-title{font-family:var(--display);font-size:22px;line-height:1.15;font-weight:700;max-width:500px;}.hero .btn-primary{background:#fff;color:var(--primary-d);position:relative;z-index:1;}
.rem-banner{background:linear-gradient(180deg,#FFF7EE,#FFFDF9);border:1px solid rgba(198,122,30,.28);border-radius:13px;padding:13px 15px;}.rem-head{display:flex;align-items:center;gap:7px;margin-bottom:9px;}.rem-head strong{font-family:var(--display);font-size:13.5px;}.rem-ic{width:26px;height:26px;border-radius:7px;background:rgba(198,122,30,.15);color:var(--amber);display:grid;place-items:center;}.rem-list{display:grid;grid-template-columns:1fr 1fr;gap:7px;}.rem-item{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface);border:1px solid var(--line);border-radius:9px;}.rem-item-main{flex:1;min-width:0;}.rem-item-top{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;flex-wrap:wrap;}
.crop-chip{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:#eaf3e2;font-size:17px;flex-shrink:0;}.crop-chip.lg{width:40px;height:40px;font-size:20px;}.crop-chip.sm{width:26px;height:26px;font-size:13px;border-radius:7px;}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;}.kpi{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:13px 14px;box-shadow:var(--shadow);}.kpi-ic{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;margin-bottom:9px;}.kpi-green .kpi-ic{background:rgba(31,107,59,.12);color:var(--primary);}.kpi-sky .kpi-ic{background:rgba(47,127,163,.12);color:var(--sky);}.kpi-amber .kpi-ic{background:rgba(198,122,30,.13);color:var(--amber);}.kpi-violet .kpi-ic{background:rgba(124,92,191,.13);color:var(--violet);}.kpi-num{font-family:var(--display);font-size:24px;font-weight:700;line-height:1;}.kpi-label{font-size:12px;font-weight:600;margin-top:4px;}.kpi-sub{font-size:10.5px;color:var(--ink-soft);}
.card{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:15px;box-shadow:var(--shadow);}.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;gap:7px;}.card-head.mt{margin-top:16px;}.card-head h3{font-size:14px;}.two-col{display:grid;grid-template-columns:1.3fr 1fr;gap:13px;}
.link{background:none;border:none;color:var(--primary);font-weight:600;font-size:11.5px;display:inline-flex;align-items:center;gap:3px;}.muted{color:var(--ink-soft);}.muted-sm{color:var(--ink-soft);font-size:11px;display:inline-flex;align-items:center;gap:3px;}.text-green{color:var(--primary);font-weight:600;}
.demo-row{display:flex;align-items:center;gap:11px;width:100%;text-align:left;padding:10px;border-radius:11px;border:1px solid var(--line);background:var(--surface-2);transition:.15s;}.demo-row:hover{border-color:var(--accent);background:#fff;}.demo-row-main{flex:1;min-width:0;}.demo-row-top{display:flex;align-items:center;gap:7px;margin-bottom:9px;flex-wrap:wrap;}.demo-row-top strong{font-size:12.5px;}
.track{padding:11px 5px 22px;}.track.compact{padding:3px 4px 3px;}.track-rail{position:relative;height:3px;background:var(--line);border-radius:99px;margin:0 7px;}.track-fill{position:absolute;left:0;top:0;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--primary),var(--accent));transition:width .5s;}.node{position:absolute;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;}.node-dot{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;background:var(--surface);border:2px solid var(--line);color:transparent;z-index:1;}.track.compact .node-dot{width:12px;height:12px;}.node.done .node-dot{background:var(--primary);border-color:var(--primary);color:#fff;}.node.current .node-dot{background:var(--accent);border-color:var(--accent);color:#fff;width:22px;height:22px;box-shadow:0 0 0 4px rgba(124,179,66,.2);animation:pulse 2s infinite;}.track.compact .node.current .node-dot{width:15px;height:15px;}@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(124,179,66,.2);}50%{box-shadow:0 0 0 7px rgba(124,179,66,.08);}}.node-label{position:absolute;top:22px;font-size:9.5px;color:var(--ink-soft);white-space:nowrap;font-weight:500;}.node.current .node-label{color:var(--primary);font-weight:700;}.node.done .node-label{color:var(--ink);}
.dots{display:flex;gap:3px;}.dot-mini{width:5px;height:5px;border-radius:50%;background:var(--line);}.dot-mini.done{background:var(--primary);}.dot-mini.cur{background:var(--accent);box-shadow:0 0 0 2px rgba(124,179,66,.2);}
.rem-pill{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 6px;border-radius:99px;white-space:nowrap;}.rem-pill.sm{font-size:9.5px;padding:1px 5px;}.rem-pill.soon{background:rgba(198,122,30,.14);color:var(--amber);}.rem-pill.over{background:rgba(192,70,59,.13);color:var(--danger);}

.badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:99px;white-space:nowrap;}.badge.lg{font-size:11px;padding:3px 10px;}.badge-green{background:rgba(31,107,59,.12);color:var(--primary);}.badge-amber{background:rgba(198,122,30,.14);color:var(--amber);}.badge-sky{background:rgba(47,127,163,.13);color:var(--sky);}
.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}.sh-title{font-size:19px;}.sh-sub{color:var(--ink-soft);font-size:12.5px;margin-top:3px;max-width:560px;}
.ro-note{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink-soft);margin-top:7px;background:var(--surface-2);border:1px solid var(--line);padding:3px 8px;border-radius:6px;}.ro-note.ok{color:var(--primary);background:rgba(31,107,59,.07);}
.btn{display:inline-flex;align-items:center;gap:5px;padding:8px 13px;border-radius:9px;border:1px solid transparent;font-weight:600;font-size:12.5px;transition:.15s;white-space:nowrap;}.btn-primary{background:var(--primary);color:#fff;box-shadow:0 2px 8px rgba(31,107,59,.25);}.btn-primary:hover{background:var(--primary-d);}.btn-primary:disabled{opacity:.4;cursor:not-allowed;}.btn-ghost{background:var(--surface);border-color:var(--line);color:var(--ink-soft);}.btn-ghost:hover{color:var(--ink);}.btn-sky{background:var(--sky);color:#fff;}.btn-sm{padding:5px 10px;font-size:11.5px;border-radius:7px;}.btn-danger{color:var(--danger);}.btn-danger:hover{background:rgba(192,70,59,.08);}
.chips{display:flex;gap:6px;flex-wrap:wrap;}.chip{padding:5px 11px;border-radius:99px;border:1px solid var(--line);background:var(--surface);font-size:11.5px;font-weight:600;color:var(--ink-soft);}.chip:hover{border-color:var(--accent);}.chip.on{background:var(--ink);color:#fff;border-color:var(--ink);}
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:11px;}.prod-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px;box-shadow:var(--shadow);transition:.15s;}.prod-card:hover{transform:translateY(-2px);border-color:var(--accent);}.prod-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}.prod-price{font-family:var(--display);font-weight:700;font-size:13.5px;display:inline-flex;align-items:center;}.prod-name{font-weight:700;font-size:13.5px;font-family:var(--display);}.prod-brand{font-size:11px;color:var(--ink-soft);margin-top:1px;}.prod-foot{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink-soft);margin-top:9px;padding-top:9px;border-top:1px solid var(--line);}
.crop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:13px;}.crop-card{text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:15px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:4px;transition:.15s;}.crop-card:hover{transform:translateY(-2px);border-color:var(--accent);}.crop-card-head{display:flex;align-items:center;gap:10px;margin-bottom:4px;}.crop-emoji{width:42px;height:42px;border-radius:11px;background:#eaf3e2;display:grid;place-items:center;font-size:21px;}.crop-emoji.xl{width:52px;height:52px;font-size:28px;}.crop-name{font-family:var(--display);font-weight:700;font-size:15px;}.crop-season{font-size:11px;color:var(--ink-soft);}.stage-count{margin-left:auto;font-size:10.5px;font-weight:600;color:var(--primary);background:rgba(31,107,59,.09);padding:3px 7px;border-radius:6px;}.crop-open{margin-top:7px;font-size:11.5px;font-weight:600;color:var(--primary);display:inline-flex;align-items:center;gap:3px;}
.back{background:none;border:none;color:var(--ink-soft);font-weight:600;font-size:12px;display:inline-flex;align-items:center;gap:3px;padding:0;}.back:hover{color:var(--ink);}.detail-hero{display:flex;align-items:center;gap:13px;flex-wrap:wrap;}.detail-title{font-size:20px;}.detail-sub{color:var(--ink-soft);font-size:12.5px;margin-top:2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;}.detail-hero .btn-primary,.detail-hero .badge{margin-left:auto;}
.pipe-days{display:flex;flex-direction:column;}.pd-step{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--line);}.pd-step:last-child{border-bottom:none;}.pd-num{font-family:var(--display);font-weight:700;font-size:11px;color:var(--accent);background:rgba(124,179,66,.12);width:24px;height:24px;border-radius:6px;display:grid;place-items:center;}.pd-name{font-weight:600;font-size:13px;}.pd-days{font-size:11.5px;color:var(--ink-soft);display:inline-flex;align-items:center;gap:4px;}.pd-days.ro{font-weight:600;color:var(--primary);}.pd-days input{width:48px;padding:4px 6px;border:1px solid var(--line);border-radius:6px;outline:none;font-size:12px;text-align:center;}.pd-terminal{font-size:10.5px;font-weight:600;color:var(--amber);background:rgba(198,122,30,.12);padding:3px 7px;border-radius:6px;}.add-stage{display:flex;gap:6px;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);flex-wrap:wrap;}.add-stage input{flex:1;min-width:90px;padding:8px 11px;border:1px solid var(--line);border-radius:8px;outline:none;font-size:12.5px;}.add-stage input:focus{border-color:var(--accent);}.days-in{flex:0 0 52px!important;text-align:center;}.days-lbl{font-size:11.5px;color:var(--ink-soft);}
.demo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:13px;}.demo-card{text-align:left;cursor:pointer;transition:.15s;display:flex;flex-direction:column;}.demo-card:hover{transform:translateY(-2px);border-color:var(--accent);}.demo-card-head{display:flex;align-items:center;gap:10px;margin-bottom:3px;}.demo-card-title{flex:1;min-width:0;}.demo-card-title strong{font-family:var(--display);font-size:14px;}.demo-card-foot{display:flex;gap:10px;align-items:center;padding-top:9px;margin-top:2px;border-top:1px solid var(--line);flex-wrap:wrap;}.tiny{font-size:10.5px;color:var(--ink-soft);display:inline-flex;align-items:center;gap:3px;}
.advance-bar{display:flex;align-items:center;justify-content:space-between;gap:11px;margin-top:14px;padding:13px;background:var(--surface-2);border-radius:11px;border:1px solid var(--line);flex-wrap:wrap;}.advance-label{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);font-weight:600;}.advance-stage{font-family:var(--display);font-weight:700;font-size:16px;display:flex;align-items:center;gap:6px;color:var(--primary);margin-top:2px;}.stage-due{font-family:var(--font);font-size:11px;font-weight:500;color:var(--ink-soft);}.done-pill{display:inline-flex;align-items:center;gap:5px;font-weight:600;color:var(--amber);background:rgba(198,122,30,.13);padding:7px 12px;border-radius:9px;}
.bill{border:1px solid var(--line);border-radius:10px;overflow:hidden;}.bill-row{display:grid;grid-template-columns:2fr .5fr .7fr .7fr;gap:5px;padding:8px 11px;font-size:12px;align-items:center;border-bottom:1px solid var(--line);}.bill-row:last-child{border-bottom:none;}.bill-row span:not(.bill-name){text-align:right;}.bill-head{background:var(--surface-2);font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-soft);font-weight:600;}.bill-name{display:flex;align-items:center;gap:6px;font-weight:600;text-align:left;}.dot-cat{width:6px;height:6px;border-radius:50%;flex-shrink:0;}.dot-cat.green{background:var(--primary);}.dot-cat.amber{background:var(--amber);}.dot-cat.sky{background:var(--sky);}.bill-total{background:var(--surface-2);font-weight:700;font-family:var(--display);}.bill-total span:last-child{color:var(--primary);font-size:13px;}
.mt12{margin-top:11px;}
.fd-avatar{width:44px;height:44px;border-radius:11px;background:linear-gradient(135deg,var(--sky),#3f97bd);color:#fff;display:grid;place-items:center;font-weight:700;flex-shrink:0;}.fd-avatar.owner{background:linear-gradient(135deg,var(--amber),#dd9a3f);}.fd-avatar.mgr{background:linear-gradient(135deg,var(--sky),#3f97bd);}.fd-avatar.sm{width:34px;height:34px;font-size:12px;}.fd-avatar.xs{width:26px;height:26px;font-size:10px;border-radius:7px;}.fd-avatar.xl{width:52px;height:52px;font-size:18px;border-radius:14px;}.fd-name{font-family:var(--display);font-weight:700;font-size:14.5px;}.fd-line{font-size:11.5px;color:var(--ink-soft);display:flex;align-items:center;gap:5px;margin-top:3px;}
.log{display:flex;flex-direction:column;gap:9px;}.log-item{display:flex;gap:11px;padding:10px;border:1px solid var(--line);border-radius:11px;background:var(--surface-2);}.log-photo{width:64px;height:64px;border-radius:9px;object-fit:cover;flex-shrink:0;border:1px solid var(--line);}.log-photo.none{display:grid;place-items:center;color:var(--ink-soft);background:var(--surface);}.log-main{flex:1;min-width:0;}.log-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}.log-top strong{font-family:var(--display);font-size:13px;}.log-remark{font-size:12px;color:var(--ink-soft);margin-top:4px;}
.fd-demos{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:11px;}.fd-demo{border:1px solid var(--line);border-radius:12px;padding:13px;background:var(--surface-2);}.fd-demo-head{display:flex;align-items:center;gap:9px;}.fd-demo-title{flex:1;}.fd-demo-title strong{font-family:var(--display);font-size:13.5px;}.fd-demo-actions{display:flex;gap:6px;justify-content:flex-end;align-items:center;margin-top:3px;flex-wrap:wrap;}
.farmer-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:11px;}.farmer-card{display:flex;flex-direction:column;gap:8px;transition:.15s;text-align:left;cursor:pointer;}.farmer-card:hover{transform:translateY(-2px);border-color:var(--accent);}.fc-head{display:flex;align-items:center;gap:10px;}.fc-name{font-family:var(--display);font-weight:700;font-size:14.5px;display:flex;align-items:center;gap:6px;}.fc-village{font-size:11px;color:var(--ink-soft);display:flex;align-items:center;gap:3px;margin-top:1px;}.fc-lines{display:flex;gap:12px;}.fc-lines span{font-size:11.5px;color:var(--ink-soft);display:inline-flex;align-items:center;gap:4px;}.fc-crops{display:flex;flex-wrap:wrap;gap:4px;}.crop-mini{font-size:10px;padding:2px 7px;border-radius:6px;background:rgba(31,107,59,.08);color:var(--primary);font-weight:600;}.fc-foot{font-size:10.5px;color:var(--ink-soft);padding-top:8px;border-top:1px solid var(--line);display:flex;align-items:center;gap:3px;}.fc-foot svg{margin-left:auto;}

.seg{display:flex;background:var(--surface-2);border:1px solid var(--line);border-radius:9px;padding:2px;gap:1px;}.seg.wide{align-self:flex-start;}.seg button{flex:1;padding:7px 12px;border:none;border-radius:6px;background:none;font-size:11.5px;font-weight:600;color:var(--ink-soft);display:inline-flex;align-items:center;gap:5px;justify-content:center;}.seg button.on{background:var(--primary);color:#fff;}.seg button:disabled{opacity:.4;cursor:not-allowed;}
.emp-track{display:flex;flex-direction:column;gap:12px;}.emp-track-card{padding:0;overflow:hidden;}.emp-track-head{display:flex;align-items:center;gap:11px;padding:12px 14px;background:var(--surface-2);border-bottom:1px solid var(--line);}.emp-demo-list{display:flex;flex-direction:column;}.emp-demo-row{display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid var(--line);background:none;border-left:none;border-right:none;border-top:none;text-align:left;transition:.12s;width:100%;}.emp-demo-row:last-child{border-bottom:none;}.emp-demo-row:hover{background:rgba(124,179,66,.06);}.emp-demo-main{flex:1;min-width:0;}.emp-demo-top{display:flex;align-items:center;gap:7px;}.emp-demo-top strong{font-size:12.5px;font-family:var(--display);}.emp-demo-meta{display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap;}
.legend{display:flex;align-items:center;gap:12px;font-size:11px;color:var(--ink-soft);flex-wrap:wrap;margin-bottom:4px;}.legend span{display:inline-flex;align-items:center;gap:4px;}
.matrix-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:13px;background:var(--surface);box-shadow:var(--shadow);}.matrix{border-collapse:collapse;width:100%;min-width:560px;}.matrix th,.matrix td{border-bottom:1px solid var(--line);border-right:1px solid var(--line);padding:0;}.matrix th:last-child,.matrix td:last-child{border-right:none;}.matrix tr:last-child td{border-bottom:none;}.mx-corner{background:var(--surface-2);text-align:left;padding:9px 11px;font-size:10.5px;color:var(--ink-soft);font-weight:600;position:sticky;left:0;z-index:2;}.mx-crop-head{background:var(--surface-2);padding:9px 11px;font-size:12px;font-weight:700;white-space:nowrap;}.mx-farmer{position:sticky;left:0;background:var(--surface);z-index:1;}.mx-farmer button{display:flex;align-items:center;gap:8px;padding:9px 11px;width:100%;background:none;border:none;text-align:left;}.mx-farmer button:hover{background:var(--surface-2);}.mxf-name{display:block;font-weight:600;font-size:12px;}.mxf-village{display:flex;align-items:center;gap:2px;font-size:10px;color:var(--ink-soft);margin-top:1px;}.cell{display:flex;flex-direction:column;align-items:flex-start;gap:4px;width:100%;padding:9px 11px;background:none;border:none;min-height:52px;}.cell.filled{cursor:pointer;}.cell.filled:hover{background:rgba(124,179,66,.08);}.cell.filled.done{background:rgba(198,122,30,.06);}.cell-stage{font-size:11px;font-weight:600;color:var(--ink);}.cell.done .cell-stage{color:var(--amber);}.cell-foot{display:flex;align-items:center;gap:5px;flex-wrap:wrap;}.cell.empty{align-items:center;justify-content:center;color:var(--line);}.cell.empty:hover{background:var(--surface-2);color:var(--accent);}.mx-empty{padding:24px;text-align:center;color:var(--ink-soft);}
.meet-list{display:flex;flex-direction:column;gap:9px;}.meet-card{display:flex;align-items:center;gap:13px;padding:12px 14px;cursor:pointer;text-align:left;width:100%;}.meet-card:hover{border-color:var(--accent);}.meet-date{width:48px;height:50px;border-radius:11px;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;}.meet-date.lg{width:58px;height:60px;border-radius:14px;}.meet-date span{font-family:var(--display);font-weight:700;font-size:16px;line-height:1;}.meet-date em{font-style:normal;font-size:9.5px;text-transform:uppercase;opacity:.9;}.meet-main{flex:1;}.meet-title-row{display:flex;align-items:center;gap:8px;margin-bottom:2px;flex-wrap:wrap;}.meet-title-row strong{font-family:var(--display);font-size:13.5px;}.meet-sub{font-size:11.5px;color:var(--ink-soft);display:flex;align-items:center;gap:4px;flex-wrap:wrap;}.sep{color:var(--line);}
.meet-farmer{display:flex;align-items:center;gap:9px;padding:7px;border:1px solid var(--line);border-radius:8px;background:var(--surface-2);}.mf-name{font-weight:600;font-size:12.5px;}.meet-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:7px;}.meet-photos img{width:100%;height:90px;object-fit:cover;border-radius:9px;border:1px solid var(--line);}.meet-remarks{font-size:12.5px;color:var(--ink-soft);white-space:pre-wrap;}
.status-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;}.status-cell{padding:12px;border-radius:11px;border:1px solid var(--line);text-align:center;}.status-cell.on{background:rgba(31,107,59,.06);}.status-cell.soon{background:rgba(198,122,30,.08);}.status-cell.over{background:rgba(192,70,59,.08);}.status-cell.done{background:var(--surface-2);}.sc-num{font-family:var(--display);font-weight:700;font-size:22px;}.sc-lbl{font-size:10.5px;color:var(--ink-soft);font-weight:600;}.status-cell.on .sc-num{color:var(--primary);}.status-cell.soon .sc-num{color:var(--amber);}.status-cell.over .sc-num{color:var(--danger);}
.rep-scroll{overflow-x:auto;}.rep-table{width:100%;border-collapse:collapse;min-width:660px;}.rep-table th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-soft);font-weight:600;padding:6px 9px;border-bottom:1px solid var(--line);}.rep-table td{padding:9px;font-size:12px;border-bottom:1px solid var(--line);}.rep-table tr:last-child td{border-bottom:none;}.rep-table th:nth-child(n+3),.rep-table td:nth-child(n+3){text-align:right;}.rep-name{display:flex;align-items:center;gap:7px;font-weight:600;}.rep-val{font-family:var(--display);font-weight:700;color:var(--primary);}
.owner-card{display:flex;align-items:center;gap:12px;}.mgr-block{padding:0;overflow:hidden;}.mgr-head{display:flex;align-items:center;gap:11px;padding:13px 15px;background:var(--surface-2);border-bottom:1px solid var(--line);}.mgr-count{margin-left:auto;font-size:11px;color:var(--ink-soft);font-weight:600;}.emp-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px;padding:13px 15px;}.emp-card{background:var(--surface-2);border:1px solid var(--line);border-radius:11px;padding:11px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;}.emp-name{font-weight:600;font-size:12.5px;}.emp-stats{display:flex;gap:6px;font-size:10px;color:var(--ink-soft);}.emp-stats span{background:var(--surface);border:1px solid var(--line);padding:2px 6px;border-radius:5px;}
.user-actions{display:flex;gap:4px;margin-left:auto;}.user-actions-sm{display:flex;gap:3px;margin-top:4px;}
.empty{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:34px;color:var(--ink-soft);background:var(--surface-2);border:1px dashed var(--line);border-radius:13px;text-align:center;}.empty svg{color:var(--accent);}
.overlay{position:fixed;inset:0;background:rgba(19,32,24,.5);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:5vh 14px;overflow:auto;animation:fade .2s;}@keyframes fade{from{opacity:0;}}.modal{background:var(--surface);border-radius:15px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(19,32,24,.3);animation:rise .25s;}@keyframes rise{from{transform:translateY(14px);opacity:0;}}.modal-head{display:flex;align-items:flex-start;justify-content:space-between;padding:16px 16px 4px;}.modal-head h3{font-size:16px;}.modal-head p{font-size:11.5px;color:var(--ink-soft);margin-top:2px;max-width:340px;}.modal-body{padding:11px 16px;display:flex;flex-direction:column;gap:11px;}.modal-foot{display:flex;justify-content:flex-end;align-items:center;gap:8px;padding:13px 16px;border-top:1px solid var(--line);}.modal-total{margin-right:auto;font-size:11.5px;font-weight:700;color:var(--primary);}
.field{display:flex;flex-direction:column;gap:4px;}.field-label{font-size:11px;font-weight:600;color:var(--ink-soft);}.field input,.field select,.field textarea{padding:8px 11px;border:1px solid var(--line);border-radius:8px;outline:none;font-size:12.5px;background:var(--surface);color:var(--ink);resize:vertical;}.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,179,66,.14);}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.locked-farmer{display:flex;align-items:center;gap:9px;padding:9px 11px;background:var(--surface-2);border:1px solid var(--line);border-radius:9px;}.locked-farmer strong{display:block;font-size:12.5px;}
.geo-box{display:flex;align-items:center;gap:10px;padding:11px;border-radius:11px;border:1px dashed var(--line);background:var(--surface-2);}.geo-box.ready{border-style:solid;border-color:rgba(47,127,163,.35);background:rgba(47,127,163,.06);}.geo-ic{width:34px;height:34px;border-radius:8px;background:rgba(47,127,163,.12);color:var(--sky);display:grid;place-items:center;flex-shrink:0;}.geo-box.ready .geo-ic{background:var(--sky);color:#fff;}.geo-main{flex:1;min-width:0;}.geo-title{font-weight:700;font-size:12px;}.geo-sub{font-size:10.5px;color:var(--ink-soft);}
.photo-input{display:block;border:1px dashed var(--line);border-radius:11px;background:var(--surface-2);overflow:hidden;cursor:pointer;}.photo-input:hover{border-color:var(--accent);}.photo-input.has{border-style:solid;padding:0;}.photo-input img{width:100%;height:150px;object-fit:cover;display:block;}.pi-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:100px;color:var(--ink-soft);font-size:11.5px;}.pi-empty svg{color:var(--accent);}
.multi-photo .mp-grid{display:flex;flex-wrap:wrap;gap:7px;}.mp-grid img{width:80px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--line);}.mp-add{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:80px;height:64px;border-radius:8px;border:1px dashed var(--line);background:var(--surface-2);cursor:pointer;color:var(--ink-soft);font-size:10.5px;}.mp-add:hover{border-color:var(--accent);color:var(--accent);}
.check-row{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-soft);padding:8px 10px;background:var(--surface-2);border:1px solid var(--line);border-radius:9px;cursor:pointer;}.check-row input{width:14px;height:14px;accent-color:var(--primary);}
.emoji-pick{display:flex;flex-wrap:wrap;gap:4px;}.emoji-opt{width:36px;height:36px;border-radius:8px;border:1px solid var(--line);background:var(--surface);font-size:17px;}.emoji-opt:hover{border-color:var(--accent);}.emoji-opt.on{border-color:var(--primary);background:rgba(31,107,59,.08);}
.stage-edit{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;}.stage-tag{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;padding:3px 5px 3px 8px;border-radius:6px;background:rgba(31,107,59,.08);color:var(--primary);}.stage-tag button{background:none;border:none;color:var(--primary);display:grid;place-items:center;opacity:.6;}.stage-tag button:hover{opacity:1;}.stage-add{display:flex;gap:4px;align-items:center;}.stage-add input{flex:1;padding:7px 9px;border:1px solid var(--line);border-radius:7px;outline:none;font-size:12px;}.stage-add input:focus{border-color:var(--accent);}.stage-add .days-in{flex:0 0 46px;}
.prod-pick{display:flex;flex-wrap:wrap;gap:5px;}.pick{display:inline-flex;align-items:center;gap:3px;padding:5px 9px;border-radius:7px;border:1px solid var(--line);background:var(--surface);font-size:11px;font-weight:500;color:var(--ink-soft);}.pick:hover{border-color:var(--accent);}.pick.on{background:var(--primary);color:#fff;border-color:var(--primary);font-weight:600;}
.qty-list{display:flex;flex-direction:column;gap:5px;margin-top:8px;}.qty-row{display:flex;align-items:center;gap:6px;background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:6px 8px;}.qty-name{flex:1;font-size:11.5px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qty-field{font-size:10px;color:var(--ink-soft);display:inline-flex;align-items:center;gap:2px;}.qty-field input{width:44px;padding:3px 5px;border:1px solid var(--line);border-radius:5px;outline:none;font-size:11.5px;text-align:center;}.qty-amt{font-family:var(--display);font-weight:700;font-size:11.5px;color:var(--primary);width:56px;text-align:right;}
.warn{display:flex;align-items:center;gap:7px;padding:11px;background:rgba(198,122,30,.1);border:1px solid rgba(198,122,30,.3);border-radius:9px;color:var(--amber);font-size:12px;font-weight:500;}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:200;display:flex;align-items:center;gap:7px;background:var(--ink);color:#fff;padding:10px 15px;border-radius:10px;font-size:12.5px;font-weight:500;box-shadow:0 12px 34px rgba(19,32,24,.35);animation:toast .3s;}.toast svg{color:var(--accent);}@keyframes toast{from{transform:translate(-50%,14px);opacity:0;}}
.only-mobile{display:none;}.scrim{display:none;}
@media(max-width:1000px){.two-col{grid-template-columns:1fr;}.kpi-grid{grid-template-columns:repeat(2,1fr);}.rem-list{grid-template-columns:1fr;}}
@media(max-width:820px){.sidebar{position:fixed;left:0;top:0;z-index:60;transform:translateX(-100%);transition:.28s;box-shadow:0 0 50px rgba(0,0,0,.2);}.sidebar.open{transform:none;}.drawer-x{display:block;}.scrim{display:block;position:fixed;inset:0;background:rgba(19,32,24,.4);z-index:55;}.only-mobile{display:grid;}.only-desktop{display:none;}.content{padding:16px 12px 50px;}.topbar{padding:9px 12px;}.hero{flex-direction:column;align-items:flex-start;gap:12px;}.hero-title{font-size:19px;}.section-head{flex-direction:column;}.detail-hero{flex-wrap:wrap;}.detail-hero .btn-primary,.detail-hero .badge{margin-left:0;}}
@media(max-width:520px){.kpi-grid{grid-template-columns:repeat(2,1fr);}.roleswitch .rs-opt span{display:none;}.grid2{grid-template-columns:1fr;}.node-label{font-size:8.5px;}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
`;
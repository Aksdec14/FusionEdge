(function(){
const NS='http://www.w3.org/2000/svg';
const R=72;
const T=[
 ['tick','Smart\nTicketing',212,288],['prev','Preventive\nMaintenance',212,430],
 ['chk','Digital\nChecklist',335,358],['insp','Inspect',335,500],
 ['inc','Incident\nReporting',458,288],['read','Asset\nReading\n& Logs',458,430],
 ['comp','Compliance',580,358],['sla','SLA',580,500],
 ['desk','Desk\nBooking',703,288],['vis','Visitor\nManagement',703,430],
 ['mail','Mailroom',826,358],['att','Attendance\nManagement',826,500],
 ['pan','Pantry\nManagement',949,288],['shop','Shops',949,430],
 ['fb','Feedback\n& Survey\nModule',1071,358],['cxo','CXO\nDashboard',1071,500],
 ['ten','Tenants',1194,288],['caf','Cafeteria\nManagement',1194,430],
 ['dar','Digital\nAsset\nRegister',1317,358],['aud','Asset\nAudit',1317,500],
 ['amc','Asset\nAMC\nTracker',1440,288],['hlth','Asset\nHealth\nMonitoring',1440,430],
 ['dash','Dashboard',1563,358],['po','Purchase\nOrders',1563,500],
 ['inv','Inventory\nManagement',1685,288],['ven','Vendor',1685,430]
];
const HOME={};T.forEach(t=>HOME[t[0]]=[t[2],t[3]]);
const DESK_HOME=JSON.parse(JSON.stringify(HOME));
const PURPLE=new Set(['att','cxo','dar','inv','ven','po']);
const GROUPS=[
 {k:'CMMS',n:'Computerized Maintenance Management System',c:'#2f6fe0',tx:397,ty:130,ids:['tick','prev','chk','inc','read','sla']},
 {k:'IWMS',n:'Integrated Workplace Management System',c:'#12a873',tx:949,ty:130,ids:['desk','vis','mail','pan','shop','fb','ten','caf','att']},
 {k:'CAMS',n:'Computer-Aided Maintenance System',c:'#ec7c1c',tx:1502,ty:130,ids:['hlth','amc','dash']},
 {k:'Project Management',n:'Plan, schedule and track project work',c:'#d6437a',tx:397,ty:611,ids:['insp','comp']},
 {k:'EAM',n:'Enterprise Asset Management',c:'#6a2a8a',tx:949,ty:611,ids:['dar','aud','cxo']},
 {k:'ERP',n:'Enterprise Resource Planning',c:'#0e9bb0',tx:1502,ty:611,ids:['inv','ven','po']}
];
const GROUP_OF={};GROUPS.forEach((g,i)=>g.ids.forEach(id=>GROUP_OF[id]=i));
const SHARED={prev:['CAMS'],read:['CAMS'],inv:['CMMS'],amc:['EAM'],chk:['Project Management'],sla:['Project Management']};
const GI=k=>GROUPS.findIndex(g=>g.k===k);
const IND=[
 ['Construction','If you run a construction company',['Know who’s on site before work starts.','Close safety checks on the spot.','Every material delivery is tied to its vendor and project.'],['tick','chk','att','dar','insp','read','aud','inc','po','comp','inv','vis','ven']],
 ['Manufacturing','If you run a manufacturing plant',['Catch failing machines before the line stops.','Spares are reordered before they run out.','Every breakdown has a ticket and a fix history.'],['prev','read','hlth','amc','inv','tick','sla','dar','po']],
 ['Healthcare','If you run a hospital or clinic',['Critical equipment stays audit-ready.','Visitors are logged at every entry.','Compliance checks happen on schedule, not on demand.'],['comp','hlth','sla','vis','tick','aud','chk','amc']],
 ['Hospitality','If you run a hotel or resort',['Guest complaints become tickets in seconds.','Pantry and cafeteria run on one system.','Feedback arrives after every stay.'],['tick','pan','caf','fb','sla','prev','inv']],
 ['Retail & Malls','If you run a mall or retail chain',['Tenants and shops are managed in one place.','Common areas stay clean and working.','Contracts and AMCs never lapse.'],['ten','shop','tick','fb','amc','vis','sla']],
 ['Education','If you run a school or campus',['Know who enters the campus and when.','Upkeep is planned around term breaks.','Safety incidents are reported and closed fast.'],['vis','att','prev','comp','caf','tick','inc']],
 ['Corporate Offices','If you run corporate offices',['Hybrid teams book desks in seconds.','Mail and pantry run without follow-ups.','Leadership sees every site on one screen.'],['desk','mail','pan','vis','att','cxo','fb']],
 ['Residential Communities','If you manage residential communities',['Resident requests land in one queue.','Gate entries are logged, not guessed.','Shared assets get serviced on time.'],['tick','vis','ten','fb','prev','amc','mail']],
 ['Warehousing & Logistics','If you run warehouses',['Forklifts and docks stay up.','Stock counts match the system.','Vendors are held to their SLAs.'],['inv','ven','po','hlth','prev','sla','aud']],
 ['Government & Public Sector','If you run public facilities',['Every asset is on a register you can audit.','Spending is traceable end to end.','Compliance reports are ready when asked.'],['dar','aud','comp','inc','cxo','po','chk']],
 ['IT & Tech Parks','If you run an IT or tech park',['Many tenants, one operations team.','Desks and amenities are booked, not fought over.','Asset health is visible in real time.'],['ten','desk','hlth','cxo','caf','vis','dash','sla']]
];
const ROLES=[
 ['Facility Manager',['tick','prev','chk','inc','read','insp','sla','comp','ven','amc'],['Spot SLA breaches, incidents and AMC dues before the day slips.','Every request becomes a ticket instead of a call or chat message.','Preventive maintenance, checklists and inspections stay on each asset.']],
 ['Maintenance Technician',['tick','chk','prev','read','insp','hlth'],['See today’s jobs on your phone, in priority order.','Tick off checklists without paper.','Log readings straight from the asset.']],
 ['Asset Manager',['dar','aud','amc','hlth','dash','read'],['Know what you own, where it is and what it’s worth.','Renewals and warranties never slip past.','Spot failing assets before they fail.']],
 ['Admin / Office Manager',['desk','mail','pan','caf','vis','fb'],['Desks and rooms booked in a couple of taps.','Parcels tracked from gate to desk.','Hear what employees think, every week.']],
 ['HR Manager',['att','desk','fb','caf','vis'],['Attendance you can trust, across every shift.','Pulse surveys without another tool.','Hybrid seating that matches who is in.']],
 ['Procurement Manager',['po','ven','inv','amc'],['Purchase orders approved in one flow.','Vendors scored on what they deliver.','Reorder alerts before stock runs out.']],
 ['Finance Controller',['po','dar','aud','cxo','inv'],['Committed spend visible before invoices land.','Asset values verified by audit.','Costs broken down by site.']],
 ['Security Supervisor',['vis','att','inc','chk','insp'],['Know who is on site at any moment.','Incidents reported in two taps.','Patrol rounds logged with checklists.']],
 ['Front Desk / Reception',['vis','mail','desk','pan'],['Pre-registered guests check in faster.','Recipients notified when parcels arrive.','Book rooms for visitors on the spot.']],
 ['Property Manager',['ten','shop','tick','fb','amc','sla'],['Tenant records and requests in one place.','Shared spaces maintained on schedule.','Satisfaction scores you can act on.']],
 ['EHS / Compliance Officer',['comp','inc','chk','insp','aud'],['A statutory calendar that reminds you.','Every incident traced to a root cause.','Inspections scheduled, not remembered.']],
 ['Project Manager',['insp','sla','comp','ven','po','chk'],['Snag lists closed before handover.','Contractors see their own tasks.','Budget versus actuals at a glance.']],
 ['CXO & Leadership',['cxo','dash','hlth','aud','fb','sla'],['Portfolio KPIs on a single screen.','Risk across assets, ranked.','Occupant sentiment, tracked over time.']]
];
const $=s=>document.querySelector(s);
const svg=$('#svg'),tilesG=$('#tiles'),titlesG=$('#titles');
function hexPts(r){let p=[];for(let i=0;i<6;i++){const a=Math.PI/3*i;p.push((r*Math.cos(a)).toFixed(1)+','+(r*Math.sin(a)).toFixed(1))}return p.join(' ')}
function el(tag,a,parent){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);parent&&parent.appendChild(e);return e}
const ICONS={"cxo": ["p", "<rect x=\"3\" y=\"6\" width=\"36\" height=\"30\" rx=\"5\" class=\"W sD\"/><path d=\"M3 11a5 5 0 015-5h26a5 5 0 015 5v3H3z\" class=\"D\"/><circle cx=\"8\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"11.5\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"15\" cy=\"10\" r=\"1.1\" class=\"W\"/><rect x=\"5\" y=\"16\" width=\"17\" height=\"17\" rx=\"2\" class=\"L\"/><path d=\"M7 29l4-4 3 2 6-7\" class=\"N sD\"/><rect x=\"24\" y=\"16\" width=\"10\" height=\"17\" rx=\"2\" class=\"L\"/><rect x=\"25.5\" y=\"26\" width=\"2\" height=\"5\" rx=\"0.6\" class=\"D\"/><rect x=\"28.5\" y=\"23\" width=\"2\" height=\"8\" rx=\"0.6\" class=\"D\"/><rect x=\"31.5\" y=\"20\" width=\"2\" height=\"11\" rx=\"0.6\" class=\"D\"/><g transform=\"translate(37 28) scale(1)\"><circle cx=\"0\" cy=\"0\" r=\"4.2\" class=\"D o\"/><path d=\"M-9 14c0-6 4-9 9-9s9 3 9 9z\" class=\"D o\"/></g>"], "dash": ["p", "<rect x=\"3\" y=\"6\" width=\"36\" height=\"30\" rx=\"5\" class=\"W sD\"/><path d=\"M3 11a5 5 0 015-5h26a5 5 0 015 5v3H3z\" class=\"D\"/><circle cx=\"8\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"11.5\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"15\" cy=\"10\" r=\"1.1\" class=\"W\"/><rect x=\"5\" y=\"16\" width=\"16\" height=\"17\" rx=\"2\" class=\"L\"/><rect x=\"7\" y=\"26\" width=\"3\" height=\"5\" rx=\"1\" class=\"M\"/><rect x=\"11.5\" y=\"23\" width=\"3\" height=\"8\" rx=\"1\" class=\"M\"/><rect x=\"16\" y=\"19\" width=\"3\" height=\"12\" rx=\"1\" class=\"D\"/><circle cx=\"30\" cy=\"23\" r=\"5\" class=\"N sM\" style=\"stroke-width:4\"/><circle cx=\"30\" cy=\"23\" r=\"5\" class=\"N sD\" style=\"stroke-width:4;stroke-dasharray:11 20.4\" transform=\"rotate(-90 30 23)\"/><rect x=\"24\" y=\"30\" width=\"12\" height=\"1.8\" rx=\"0.9\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "dar": ["p", "<rect x=\"3\" y=\"6\" width=\"36\" height=\"30\" rx=\"5\" class=\"W sD\"/><path d=\"M3 11a5 5 0 015-5h26a5 5 0 015 5v3H3z\" class=\"D\"/><circle cx=\"8\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"11.5\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"15\" cy=\"10\" r=\"1.1\" class=\"W\"/><rect x=\"6\" y=\"17\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"12\" y=\"17.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"12\" y=\"19.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><rect x=\"6\" y=\"23\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"12\" y=\"23.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"12\" y=\"25.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><rect x=\"6\" y=\"29\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"12\" y=\"29.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"12\" y=\"31.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><rect x=\"25\" y=\"17\" width=\"13\" height=\"18\" rx=\"2.5\" class=\"W sD\"/><rect x=\"27.5\" y=\"20\" width=\"3\" height=\"3\" rx=\"0.6\" class=\"D\"/><rect x=\"32\" y=\"20\" width=\"3\" height=\"3\" rx=\"0.6\" class=\"D\"/><rect x=\"27.5\" y=\"24.5\" width=\"3\" height=\"3\" rx=\"0.6\" class=\"D\"/><rect x=\"32\" y=\"24.5\" width=\"1.6\" height=\"1.6\" rx=\"0.3\" class=\"D\"/><rect x=\"28\" y=\"30\" width=\"7\" height=\"1.5\" rx=\"0.7\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "aud": ["p", "<rect x=\"6\" y=\"7\" width=\"28\" height=\"36\" rx=\"4\" class=\"W sD\"/><rect x=\"14\" y=\"4\" width=\"12\" height=\"7\" rx=\"3\" class=\"D\"/><circle cx=\"20\" cy=\"7.5\" r=\"1.3\" class=\"W\"/><rect x=\"10\" y=\"16\" width=\"6\" height=\"6\" rx=\"1.5\" class=\"D\"/><rect x=\"10\" y=\"25\" width=\"6\" height=\"6\" rx=\"1.5\" class=\"D\"/><rect x=\"10\" y=\"34\" width=\"6\" height=\"6\" rx=\"1.5\" class=\"L\"/><path d=\"M11.5 19l1.5 1.5 2-3M11.5 28l1.5 1.5 2-3\" class=\"N sG\" style=\"stroke-width:1.5\"/><rect x=\"19\" y=\"16\" width=\"11\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"19\" y=\"19.5\" width=\"6.6\" height=\"1.6\" rx=\"0.8\" class=\"L\"/><rect x=\"19\" y=\"25\" width=\"11\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"19\" y=\"28.5\" width=\"6.6\" height=\"1.6\" rx=\"0.8\" class=\"L\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "insp": ["p", "<rect x=\"6\" y=\"7\" width=\"28\" height=\"36\" rx=\"4\" class=\"W sD\"/><rect x=\"14\" y=\"4\" width=\"12\" height=\"7\" rx=\"3\" class=\"D\"/><circle cx=\"20\" cy=\"7.5\" r=\"1.3\" class=\"W\"/><rect x=\"10\" y=\"16\" width=\"6\" height=\"6\" rx=\"1.5\" class=\"D\"/><rect x=\"10\" y=\"25\" width=\"6\" height=\"6\" rx=\"1.5\" class=\"D\"/><path d=\"M11.5 19l1.5 1.5 2-3M11.5 28l1.5 1.5 2-3\" class=\"N sG\" style=\"stroke-width:1.5\"/><rect x=\"19\" y=\"16\" width=\"9\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"19\" y=\"19.5\" width=\"5.3999999999999995\" height=\"1.6\" rx=\"0.8\" class=\"L\"/><circle cx=\"30\" cy=\"31\" r=\"10\" class=\"L\"/><circle cx=\"30\" cy=\"31\" r=\"10\" class=\"N sD\" style=\"stroke-width:3\"/><circle cx=\"30\" cy=\"31\" r=\"4.5\" class=\"N sD\" style=\"stroke-width:2.475;stroke-dasharray:1.9 1.6\"/><circle cx=\"30\" cy=\"31\" r=\"3.8249999999999997\" class=\"D\"/><circle cx=\"30\" cy=\"31\" r=\"1.575\" class=\"W\"/><path d=\"M37.5 38.500l6 6\" class=\"N sD\" style=\"stroke-width:4\"/>"], "amc": ["p", "<rect x=\"5\" y=\"8\" width=\"34\" height=\"32\" rx=\"5\" class=\"W sD\"/><path d=\"M5 13a5 5 0 015-5h24a5 5 0 015 5v5H5z\" class=\"D\"/><rect x=\"13\" y=\"5\" width=\"3\" height=\"6\" rx=\"1.5\" class=\"K\"/><rect x=\"28\" y=\"5\" width=\"3\" height=\"6\" rx=\"1.5\" class=\"K\"/><rect x=\"10\" y=\"22\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"18\" y=\"22\" width=\"5\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"26\" y=\"22\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"10\" y=\"29\" width=\"5\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"18\" y=\"29\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "hlth": ["g2", "<rect x=\"3\" y=\"6\" width=\"36\" height=\"30\" rx=\"5\" class=\"W sD\"/><path d=\"M3 11a5 5 0 015-5h26a5 5 0 015 5v3H3z\" class=\"D\"/><circle cx=\"8\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"11.5\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"15\" cy=\"10\" r=\"1.1\" class=\"W\"/><rect x=\"5\" y=\"16\" width=\"32\" height=\"18\" rx=\"2\" class=\"L\"/><path d=\"M7 26h7l3-7 4 12 3-8 2 3h8\" class=\"N sD\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M37 41s-6-3.5-6-7.500a3.2 3.2 0 016-1.5 3.2 3.2 0 016 1.500c0 4-6 7.5-6 7.500z\" class=\"G\"/>"], "desk": ["p", "<rect x=\"3\" y=\"28\" width=\"28\" height=\"4\" rx=\"2\" class=\"D\"/><path d=\"M7 32v10M27 32v10\" class=\"N sD\"/><rect x=\"7\" y=\"7\" width=\"20\" height=\"16\" rx=\"3\" class=\"W sD\"/><rect x=\"10\" y=\"10\" width=\"14\" height=\"10\" rx=\"1.5\" class=\"L\"/><path d=\"M17 23v5\" class=\"N sD\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "mail": ["g1", "<rect x=\"3\" y=\"10\" width=\"34\" height=\"26\" rx=\"4\" class=\"W sD\"/><path d=\"M4 13l16 12 16-12\" class=\"N sD\"/><rect x=\"7\" y=\"26\" width=\"8\" height=\"2\" rx=\"1\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33 33l4-2 4 2v5l-4 2-4-2zM33 33l4 2 4-2M37 35v5\" class=\"N sG\" style=\"stroke-width:1.3\"/>"], "tick": ["p", "<path d=\"M4 14a3 3 0 013-3h26a3 3 0 013 3v4a3.5 3.5 0 000 7v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4a3.5 3.5 0 000-7z\" class=\"W sD\"/><path d=\"M26 14v16\" class=\"N sM\" style=\"stroke-dasharray:2 3\"/><rect x=\"9\" y=\"16\" width=\"12\" height=\"2\" rx=\"1\" class=\"D\"/><rect x=\"9\" y=\"21\" width=\"8\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"9\" y=\"26\" width=\"10\" height=\"2\" rx=\"1\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M38 30l-5 6.500h4l-1 5.5 5-7h-4z\" class=\"G\"/>"], "prev": ["g1", "<circle cx=\"18\" cy=\"22\" r=\"9\" class=\"N sD\" style=\"stroke-width:4.95;stroke-dasharray:3.9 3.2\"/><circle cx=\"18\" cy=\"22\" r=\"7.6499999999999995\" class=\"D\"/><circle cx=\"18\" cy=\"22\" r=\"3.15\" class=\"W\"/><path d=\"M10 40h18\" class=\"N sM\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M37 31.500V36l3 2\" class=\"N sG\"/>"], "chk": ["g2", "<rect x=\"8\" y=\"3\" width=\"24\" height=\"40\" rx=\"5\" class=\"W sD\"/><rect x=\"16\" y=\"5.5\" width=\"8\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"12\" y=\"14\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"18\" y=\"14.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"18\" y=\"16.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><rect x=\"12\" y=\"23\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"18\" y=\"23.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"18\" y=\"25.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><rect x=\"12\" y=\"32\" width=\"4\" height=\"4\" rx=\"1\" class=\"D\"/><rect x=\"18\" y=\"32.4\" width=\"10\" height=\"1.6\" rx=\"0.8\" class=\"M\"/><rect x=\"18\" y=\"34.8\" width=\"6\" height=\"1.3\" rx=\"0.6\" class=\"L\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "read": ["g1", "<rect x=\"3\" y=\"6\" width=\"36\" height=\"30\" rx=\"5\" class=\"W sD\"/><path d=\"M3 11a5 5 0 015-5h26a5 5 0 015 5v3H3z\" class=\"D\"/><circle cx=\"8\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"11.5\" cy=\"10\" r=\"1.1\" class=\"W\"/><circle cx=\"15\" cy=\"10\" r=\"1.1\" class=\"W\"/><rect x=\"5\" y=\"16\" width=\"32\" height=\"18\" rx=\"2\" class=\"L\"/><path d=\"M8 31a7 7 0 0114 0\" class=\"N sM\" style=\"stroke-width:3.5\"/><path d=\"M15 31l4-5\" class=\"N sD\"/><circle cx=\"15\" cy=\"31\" r=\"1.8\" class=\"D\"/><rect x=\"26\" y=\"20\" width=\"10\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"26\" y=\"25\" width=\"10\" height=\"2\" rx=\"1\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33 33h8M33 36h8M33 39h5\" class=\"N sG\"/>"], "att": ["p", "<rect x=\"3\" y=\"6\" width=\"26\" height=\"32\" rx=\"5\" class=\"L\"/><g transform=\"translate(16 17) scale(1.5)\"><circle cx=\"0\" cy=\"0\" r=\"4.2\" class=\"D o\"/><path d=\"M-9 14c0-6 4-9 9-9s9 3 9 9z\" class=\"D o\"/></g><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "inc": ["p", "<path d=\"M20 6c1-1.8 3-1.8 4 0l13.5 24c1 1.8-.2 3.5-2 3.500H8.500c-2 0-3-1.7-2-3.500z\" class=\"D o\"/><rect x=\"20.8\" y=\"14\" width=\"2.4\" height=\"9\" rx=\"1.2\" class=\"G\"/><circle cx=\"22\" cy=\"27\" r=\"1.5\" class=\"G\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M34 31v10M34 31h7l-2 3 2 3h-7\" class=\"N sG\" style=\"stroke-width:1.6\"/>"], "pan": ["g2", "<path d=\"M13 3v6M19 3v6M25 3v6\" class=\"N sM\"/><path d=\"M5 14h26v11a11 11 0 01-11 11h-4A11 11 0 015 25z\" class=\"W sD\"/><path d=\"M6 24h24v1a11 11 0 01-11 11h-2A11 11 0 016 25z\" class=\"D\"/><path d=\"M31 17h2a5 5 0 010 10h-3\" class=\"N sD\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M37 32v8M33 36h8\" class=\"N sG\"/>"], "shop": ["g1", "<rect x=\"7\" y=\"16\" width=\"28\" height=\"22\" rx=\"2\" class=\"W sD\"/><path d=\"M4 16l3-10h28l3 10z\" class=\"D\"/><path d=\"M12 6l-1.5 10M21 6v10M30 6l1.5 10\" class=\"N sG\" style=\"stroke-width:1.5\"/><rect x=\"11\" y=\"23\" width=\"9\" height=\"15\" rx=\"1.5\" class=\"L\"/><rect x=\"24\" y=\"23\" width=\"9\" height=\"8\" rx=\"1.5\" class=\"L\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M34 33h4.500l3 3-4.5 4.5-3-3z\" class=\"N sG\" style=\"stroke-width:1.6\"/>"], "fb": ["p", "<path d=\"M7 6h26a4 4 0 014 4v14a4 4 0 01-4 4H20l-7 6v-6H7a4 4 0 01-4-4V10a4 4 0 014-4z\" class=\"W sD\"/><polygon transform=\"translate(11 17)\" points=\"0,-4.5 1.3,-1.4 4.6,-1.2 2,1 2.8,4.2 0,2.4 -2.8,4.2 -2,1 -4.6,-1.2 -1.3,-1.4\" class=\"D\"/><polygon transform=\"translate(20 17)\" points=\"0,-4.5 1.3,-1.4 4.6,-1.2 2,1 2.8,4.2 0,2.4 -2.8,4.2 -2,1 -4.6,-1.2 -1.3,-1.4\" class=\"D\"/><polygon transform=\"translate(29 17)\" points=\"0,-4.5 1.3,-1.4 4.6,-1.2 2,1 2.8,4.2 0,2.4 -2.8,4.2 -2,1 -4.6,-1.2 -1.3,-1.4\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "inv": ["p", "<path d=\"M20 5l15 8-15 8-15-8z\" class=\"D\"/><path d=\"M5 13l15 8v17L5 30z\" class=\"M\"/><path d=\"M35 13l-15 8v17l15-8z\" class=\"L\"/><path d=\"M20 5l15 8v17l-15 8-15-8V13z\" class=\"N sD\"/><path d=\"M5 13l15 8 15-8M20 21v17\" class=\"N sD\" style=\"stroke-width:1.5\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33 33h8M33 36h8M33 39h5\" class=\"N sG\"/>"], "po": ["p", "<rect x=\"5\" y=\"4\" width=\"28\" height=\"38\" rx=\"4\" class=\"W sD\"/><rect x=\"10\" y=\"11\" width=\"12\" height=\"2.4\" rx=\"1.2\" class=\"D\"/><rect x=\"10\" y=\"17\" width=\"18\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"10\" y=\"22\" width=\"18\" height=\"2\" rx=\"1\" class=\"M\"/><rect x=\"10\" y=\"27\" width=\"12\" height=\"2\" rx=\"1\" class=\"M\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M32 31h2l1.5 6h5l1-4.500H34.5\" class=\"N sG\" style=\"stroke-width:1.6\"/><circle cx=\"36\" cy=\"40\" r=\"0.9\" class=\"G\"/><circle cx=\"40\" cy=\"40\" r=\"0.9\" class=\"G\"/>"], "ven": ["g1", "<rect x=\"3\" y=\"12\" width=\"24\" height=\"19\" rx=\"3\" class=\"W sD\"/><path d=\"M27 17h7l5 6v8H27z\" class=\"D\"/><path d=\"M30 19.500h3l2.5 3H30z\" class=\"W\"/><rect x=\"8\" y=\"17\" width=\"6\" height=\"6\" rx=\"1\" class=\"M\"/><rect x=\"15\" y=\"17\" width=\"7\" height=\"6\" rx=\"1\" class=\"L\"/><circle cx=\"11\" cy=\"33\" r=\"4.2\" class=\"W sD\"/><circle cx=\"33\" cy=\"33\" r=\"4.2\" class=\"W sD\"/><circle cx=\"11\" cy=\"33\" r=\"1.5\" class=\"D\"/><circle cx=\"33\" cy=\"33\" r=\"1.5\" class=\"D\"/>"], "vis": ["p", "<rect x=\"9\" y=\"4\" width=\"26\" height=\"36\" rx=\"4\" class=\"W sD\"/><rect x=\"18\" y=\"7\" width=\"8\" height=\"2.5\" rx=\"1.2\" class=\"M\"/><circle cx=\"22\" cy=\"19\" r=\"5\" class=\"D\"/><path d=\"M13 34c0-5.5 4-8 9-8s9 2.5 9 8z\" class=\"D\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "comp": ["g2", "<path d=\"M20 4l15 5.500v11c0 9-6.5 14-15 17.500C11.5 34.5 5 29.5 5 20.500v-11z\" class=\"D o\"/><path d=\"M13 20.500l4.5 4.5 8.5-9.5\" class=\"N sG\" style=\"stroke-width:3\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M34 31h5l2.5 2.500V41H34z\" class=\"N sG\" style=\"stroke-width:1.6\"/>"], "sla": ["p", "<rect x=\"16\" y=\"3\" width=\"8\" height=\"4\" rx=\"1.5\" class=\"D\"/><circle cx=\"20\" cy=\"25\" r=\"15\" class=\"W sD\"/><circle cx=\"20\" cy=\"25\" r=\"10.5\" class=\"N sD\" style=\"stroke-width:3;stroke-dasharray:44 22;transform-origin:20px 25px;transform:rotate(-90deg)\"/><path d=\"M20 25v-8M20 25l5 3\" class=\"N sD\"/><circle cx=\"20\" cy=\"25\" r=\"1.8\" class=\"D\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><path d=\"M33.5 36l2.5 2.5 4.5-5\" class=\"N sG\"/>"], "ten": ["p", "<rect x=\"6\" y=\"8\" width=\"22\" height=\"32\" rx=\"2\" class=\"W sD\"/><rect x=\"6\" y=\"8\" width=\"22\" height=\"6\" rx=\"2\" class=\"D\"/><rect x=\"10\" y=\"18\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"19\" y=\"18\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"10\" y=\"25\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"19\" y=\"25\" width=\"5\" height=\"4\" rx=\"1\" class=\"M\"/><rect x=\"14\" y=\"33\" width=\"6\" height=\"7\" rx=\"1\" class=\"D\"/><rect x=\"28\" y=\"20\" width=\"10\" height=\"20\" rx=\"2\" class=\"L sD\"/><circle cx=\"37\" cy=\"36\" r=\"9.5\" class=\"W\"/><circle cx=\"37\" cy=\"36\" r=\"7.8\" class=\"D\"/><circle cx=\"35\" cy=\"34.5\" r=\"2.2\" class=\"N sG\"/><path d=\"M36.5 36l4 4M39 38l1.5-1.5\" class=\"N sG\"/>"], "caf": ["p", "<circle cx=\"23\" cy=\"24\" r=\"11.5\" class=\"W sD\"/><circle cx=\"23\" cy=\"24\" r=\"7\" class=\"L\"/><circle cx=\"23\" cy=\"24\" r=\"2.4\" class=\"D\"/><path d=\"M5 8v7a3 3 0 006 0V8M8 17v21\" class=\"N sD\"/><path d=\"M40 8c-3 2.500-4 7-4 12h4v18\" class=\"N sD\"/>"]};
const TILE={};
T.forEach(([id,label,x,y])=>{
  const col=PURPLE.has(id)?'p':'g';
  const g=el('g',{class:'tile '+col},tilesG);
  g.dataset.c=col;
  g.style.transform=`translate(${x}px,${y}px)`;
  el('polygon',{class:'hex-side',points:hexPts(R),transform:'translate(0 7)'},g);
  el('polygon',{class:'hex',points:hexPts(R)},g);
  el('polygon',{class:'hex-rim',points:hexPts(R-3)},g);
  const ring=el('polygon',{class:'ring',points:hexPts(R+5),pathLength:1},g);
  const lines=label.split('\n');
  const iy=-26;
  const [ic,body]=ICONS[id];
  const sv=el('svg',{class:'icon ic '+ic,viewBox:'2 2.5 45 44',x:-21,y:iy-21,width:42,height:41},g);
  sv.innerHTML=body;
  const t=el('text',{class:'lbl',x:0,y:iy+36},g);
  lines.forEach((l,i)=>{el('tspan',{x:0,dy:i?15:0},t).textContent=l});
  const extra=(SHARED[id]||[]).map((k,n)=>{const r2=el('polygon',{class:'ring ring2',points:hexPts(R+10+n*5),pathLength:1},g);r2.dataset.g=GI(k);return r2});
  TILE[id]={g,ring,extra};
});
T.forEach(([id])=>TILE[id].g.style.setProperty('--group',GROUPS[GROUP_OF[id]].c));
T.forEach(([id])=>TILE[id].extra.forEach(r2=>r2.style.stroke=GROUPS[+r2.dataset.g].c));
GROUPS.forEach(gr=>{
  const t=el('text',{class:'gt',x:gr.tx,y:gr.ty},titlesG);t.style.setProperty('--group',gr.c);
  el('tspan',{class:'a',x:gr.tx},t).textContent=gr.k;
  el('tspan',{class:'b',x:gr.tx,dy:32},t).textContent=gr.n;
  gr.title=t;
});
function lattice(x0,y0,cols,rows=3){const s=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++)s.push([x0+123*c,y0+142*r+(c%2?71:0),c,r]);return s}
let IND_SLOTS,ROLE_SLOTS,VB_FULL,VB_CL,LAY='',CENTER=[949,410];
const legendEl=$('#legend');
GROUPS.forEach(gr=>{const sp=document.createElement('span');sp.textContent=gr.k;sp.style.setProperty('--group',gr.c);legendEl.appendChild(sp);gr.chip=sp});
const ORDER=GROUPS.flatMap(g=>g.ids);
function colGrid(counts,dx,dy){const s=[];counts.forEach((k,c)=>{for(let r=0;r<k;r++)s.push([c*dx,r*dy+(c%2?dy/2:0)])});return s}
function grid(n,count){const s=[];for(let k=0;k<count;k++){const c=k%n,r=Math.floor(k/n);s.push([c*123,r*142+(c%2?71:0)])}return s}
function relayout(){
  const root=$('#modules');
  const w=root.clientWidth, L=w>=1100?'desk':w>=620?'tab':'mob';
  if(L===LAY)return;LAY=L;root.dataset.lay=L;
  if(L==='desk'){
    Object.assign(HOME,JSON.parse(JSON.stringify(DESK_HOME)));
    VB_FULL=VB_CL='120 90 1660 620';CENTER=[949,410];
    IND_SLOTS=lattice(195,290,7,2);
    ROLE_SLOTS=lattice(580,300,7).sort((a,b)=>Math.hypot(a[0]-949,(a[1]-400)*1.9)-Math.hypot(b[0]-949,(b[1]-400)*1.9));
  }else{
    const n=L==='tab'?7:4,rows=Math.ceil(26/n),pos=n===4?colGrid([7,6,7,6],123,142):grid(n,26);
    ORDER.forEach((id,k)=>HOME[id]=pos[k]);
    const W=(n-1)*123,H=Math.max(...pos.map(p=>p[1]));
    VB_FULL=`-90 -85 ${W+180} ${H+170}`;CENTER=[W/2,H/2];
    const rc=Math.ceil(13/n),HC=(rc-1)*142+71,cc=[W/2,HC/2];
    VB_CL=`-90 -85 ${W+180} ${HC+170}`;
    IND_SLOTS=ROLE_SLOTS=grid(n,n*rc).sort((a,b)=>Math.hypot(a[0]-cc[0],a[1]-cc[1])-Math.hypot(b[0]-cc[0],b[1]-cc[1]));
  }
  svg.setAttribute('viewBox',svg.classList.contains('clustered')?VB_CL:VB_FULL);
  if(typeof computeScatter==='function')computeScatter();
  if(typeof applyPositions==='function')applyPositions();
  titlesOn(!$('#titles').classList.contains('hidden')||!legendEl.classList.contains('hidden'));
}
function titlesOn(on){show('#titles',false);show('#legend',on)}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const show=(id,on)=>$(id).classList.toggle('hidden',!on);
function setMode(m){
  svg.classList.toggle('clustered',m!=='software');
  svg.setAttribute('viewBox',m==='software'?VB_FULL:VB_CL);
  titlesOn(m==='software');
  show('#ind',m==='industries');
  ['#rtitle','#nl','#nr','#nb','#arrows'].forEach(s=>show(s,m==='roles'));
}
function homeAll(){T.forEach(([id])=>{const {g,ring,extra}=TILE[id];extra.forEach(r2=>r2.classList.remove('on'));g.style.transform=`translate(${HOME[id][0]}px,${HOME[id][1]}px)`;g.className.baseVal='tile '+g.dataset.c;ring.classList.remove('on')})}
function softwareStep(i,final){
  T.forEach(([id])=>{
    const gi=GROUP_OF[id],{g,ring}=TILE[id];
    g.className.baseVal='tile '+g.dataset.c+(final||gi<=i?'':' lo');
    ring.classList.toggle('on',!final&&gi===i);
    g.classList.toggle('act',!final&&(gi===i||TILE[id].extra.some(r2=>+r2.dataset.g===i)));
    TILE[id].extra.forEach(r2=>r2.classList.toggle('on',!final&&+r2.dataset.g===i));
  });
  GROUPS.forEach((gr,gi)=>{gr.title.classList.toggle('dim',!final&&gi>i);gr.chip.classList.toggle('dim',!final&&gi>i)});
}
let lastCl=null;
function placeArrows(ids){
  const pts=ids.map((_,k)=>ROLE_SLOTS[k]).filter(Boolean);
  if(!pts.length)return;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  pts.forEach(([x,y])=>{minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)});
  const l=minX-R,r=maxX+R,b=maxY+R+8,cy=(minY+maxY)/2,cx=(minX+maxX)/2;
  const n=v=>v.toFixed(1);
  const len=78,gap=18;
  const startL=l-14,endL=startL-len;
  const startR=r+14,endR=startR+len;
  $('#aL').setAttribute('d',`M${n(startL)} ${n(cy)} C ${n(startL-len*0.42)} ${n(cy-16)}, ${n(endL+len*0.28)} ${n(cy-6)}, ${n(endL)} ${n(cy+3)}`);
  $('#aR').setAttribute('d',`M${n(startR)} ${n(cy)} C ${n(startR+len*0.42)} ${n(cy-16)}, ${n(endR-len*0.28)} ${n(cy-6)}, ${n(endR)} ${n(cy+3)}`);
  const y1=648,y0=Math.min(b+14,y1-34);
  $('#aB').setAttribute('d',`M${n(cx-4)} ${n(y0)} C ${n(cx+14)} ${n(y0+(y1-y0)*0.4)}, ${n(cx-10)} ${n(y0+(y1-y0)*0.7)}, ${n(cx)} ${n(y1)}`);
  if(LAY==='desk'){
    const vx=120,vw=1660;
    const nl=$('#nl'),nr=$('#nr');
    nl.style.right=((1-(endL-gap-vx)/vw)*100).toFixed(2)+'%';
    nl.style.left='auto';
    nr.style.left=((endR+gap-vx)/vw*100).toFixed(2)+'%';
    nr.style.right='auto';
  }
}
function cluster(ids,kind){
  lastCl=[ids,kind];const slots=kind==='ind'?IND_SLOTS:ROLE_SLOTS;
  const sel=new Map(ids.map((id,k)=>[id,slots[k]]));
  T.forEach(([id])=>{
    const {g}=TILE[id],s=sel.get(id);
    if(s){g.style.transform=`translate(${s[0]}px,${s[1]}px)`;g.className.baseVal='tile '+g.dataset.c}
    else{g.className.baseVal='tile '+g.dataset.c+' off'}
  });
  if(kind==='role')placeArrows(ids);
  if(LAY!=='desk'){
    const pts=ids.map((_,k)=>slots[k]).filter(Boolean);
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    pts.forEach(([x,y])=>{minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)});
    const x0=minX-100,y0=minY-96,x1=maxX+100,y1=maxY+110;
    svg.setAttribute('viewBox',`${x0} ${y0} ${x1-x0} ${y1-y0}`);
  }
}
function industry(d){
  cluster(d[3],'ind');
  const p=$('#ind');p.querySelector('h2').textContent=d[0];p.querySelector('.sub').textContent=d[1];
  p.querySelector('.lines').innerHTML=d[2].map(l=>`<p class="l">${l}</p>`).join('');
}
function role(d){
  cluster(d[1],'role');
  $('#rtitle').textContent=d[0];
  ['#nl','#nr','#nb'].forEach((s,i)=>$(s).textContent=d[2][i]);
}
let run=0;
const sleep=(ms,tok)=>new Promise((res,rej)=>setTimeout(()=>tok===run?res():rej('cancel'),ms));
const status=$('#status');
function tab(v){document.querySelectorAll('#modules .tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===v))}
const VIEWS={
  async software(tok){
    tab('software');homeAll();setMode('software');
    if(reduced){softwareStep(0,true);status.textContent='';return}
    softwareStep(-1);await sleep(400,tok);
    for(let i=0;i<GROUPS.length;i++){status.textContent='Software · '+GROUPS[i].k;softwareStep(i);await sleep(2000,tok)}
    status.textContent='Software · all groups';softwareStep(0,true);await sleep(3500,tok);
  },
  async industries(tok){
    tab('industries');setMode('industries');
    if(reduced){industry(IND[0]);status.textContent='';return}
    for(const d of IND){status.textContent='Industries · '+d[0];industry(d);await sleep(3000,tok)}
  },
  async roles(tok){
    tab('roles');setMode('roles');
    if(reduced){role(ROLES[0]);status.textContent='';return}
    for(const d of ROLES){status.textContent='Roles · '+d[0];role(d);await sleep(3200,tok)}
  }
};
async function loop(){
  const tok=++run;
  try{
    if(reduced){await VIEWS.software(tok);return}
    while(true)for(const v of ['software','industries','roles'])await VIEWS[v](tok);
  }catch(e){}
}
async function playOnly(v){const tok=++run;try{await VIEWS[v](tok);if(tok===run&&!reduced)status.textContent='Done · click a tab to replay'}catch(e){}}
const fit=()=>{const r=$('#modules').getBoundingClientRect();if(LAY==='desk'&&(r.top<-4||r.bottom>innerHeight+4))$('#modules').scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'})};
document.querySelectorAll('#modules .tabs button,#modules #switch').forEach(b=>b.addEventListener('click',fit));
document.querySelectorAll('#modules .tabs button').forEach(b=>b.addEventListener('click',()=>playOnly(b.dataset.v)));
const ALT={tick:'mail',prev:'paper sheets',chk:'Printed checklists',insp:'paper clipboard',inc:'WhatsApp group',read:'excel',
 comp:'excel',sla:'email',desk:'excel',vis:'paper visitor book',mail:'paper register',att:'attendance register',
 pan:'sticky notes',fb:'google forms',caf:'paper sheets',dar:'paper register',
 aud:'Printed Asset List',amc:'email',hlth:'preprinted history card',po:'mail',inv:'Excel'};
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const SCATTER={};
function scatterAll(){T.forEach(([id])=>{const [x,y,r]=SCATTER[id];TILE[id].g.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`})}
function applyPositions(){
  if(chaosOn)scatterAll();
  else if(svg.classList.contains('clustered')&&lastCl)cluster(lastCl[0],lastCl[1]);
  else T.forEach(([id])=>{TILE[id].g.style.transform=`translate(${HOME[id][0]}px,${HOME[id][1]}px)`});
}
const imagine=$('#imagine'),sw=$('#switch');
let chaosOn=false,oneT;
function countUp(){
  $('#stats').querySelectorAll('b').forEach(b=>{
    if(b.hasAttribute('data-z'))return;
    const n=+b.dataset.n;let k=0;
    if(reduced){b.textContent=n;return}
    const t=setInterval(()=>{k++;b.textContent=Math.round(n*k/20);if(k>=20)clearInterval(t)},40);
  });
}
function setChaos(on){
  chaosOn=on;imagine.classList.toggle('on',on);sw.setAttribute('aria-checked',on);
  clearTimeout(oneT);
  run++;tab('software');setMode('software');softwareStep(0,true);
  svg.classList.toggle('chaos',on);
  show('#stats',on);titlesOn(!on);
  if(on){
    scatterAll();
    countUp();status.textContent='Imagine without FusionEdge';
  }else{
    homeAll();
    titlesOn(false);
    oneT=setTimeout(()=>titlesOn(true),reduced?0:2400);
    status.textContent='With FusionEdge';
  }
}
sw.addEventListener('click',()=>setChaos(!chaosOn));
$('#swl').addEventListener('click',()=>setChaos(!chaosOn));
document.querySelectorAll('#modules .tabs button').forEach(b=>b.addEventListener('click',()=>{
  if(chaosOn){chaosOn=false;svg.classList.remove('chaos');show('#stats',false);imagine.classList.remove('on');sw.setAttribute('aria-checked',false)}
},true));
const handG=$('#hand');let VB_SC;
computeScatter=function(){
  const d=LAY==='desk';
  T.forEach(([id],i)=>{const [x,y]=HOME[id];
    SCATTER[id]=[CENTER[0]+(x-CENTER[0])*(d?1.1:1.12)+(rnd(i)-.5)*(d?30:18),CENTER[1]+(y-CENTER[1])*(d?1.55:1.75)+(rnd(i+40)-.5)*(d?24:14),(rnd(i+80)-.5)*(d?16:12)]});
  const P=Object.values(SCATTER),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);
  const x0=Math.min(...xs)-90,x1=Math.max(...xs)+90,y0=Math.min(...ys)-(d?180:90),y1=Math.max(...ys)+160;
  VB_SC=`${x0} ${y0} ${x1-x0} ${y1-y0}`;
};
function drawAltNotes(){
  handG.innerHTML='';
  const tiles=T.map(([id])=>SCATTER[id]);
  const ys=tiles.map(p=>p[1]),mid=(Math.min(...ys)+Math.max(...ys))/2,notes=[];
  T.forEach(([id],i)=>{
    if(!ALT[id])return;
    const [tx,ty]=SCATTER[id],g=el('g',{class:'hand'},handG);g.dataset.i=i;
    g.style.setProperty('--note',GROUPS[GROUP_OF[id]].c);
    const up=ty<mid,dir=up?-1:1;
    const w=ALT[id].split(' '),lines=ALT[id].length>11&&w.length>1?[w.slice(0,Math.ceil(w.length/2)).join(' '),w.slice(Math.ceil(w.length/2)).join(' ')]:[ALT[id]];
    const ly=up?ty-120-(lines.length-1)*21:ty+136;
    const t=el('text',{x:tx,y:ly,'text-anchor':'middle'},g);
    lines.forEach((l,k)=>el('tspan',{x:tx,dy:k?21:0},t).textContent=l);
    notes.push({g,t,tx,ty,x:tx,y:ly,dir});
  });
  const place=n=>{n.t.setAttribute('x',n.x);n.t.setAttribute('y',n.y);n.t.querySelectorAll('tspan').forEach(s=>s.setAttribute('x',n.x))};
  const box=n=>{const b=n.t.getBBox();return {x:b.x,y:b.y,r:b.x+b.width,b:b.y+b.height,cx:b.x+b.width/2,cy:b.y+b.height/2}};
  const inHex=(px,py,cx,cy)=>{const x=Math.abs(px-cx)/86,y=Math.abs(py-cy)/86;return x<=1&&y<=.866&&.866*x+.5*y<=.866};
  const hit=b=>{
    const q=[[b.x,b.y],[b.r,b.y],[b.x,b.b],[b.r,b.b],[b.cx,b.y],[b.cx,b.b],[b.cx,b.cy]];
    for(const [x,y] of tiles){
      if(b.x<x&&x<b.r&&b.y<y&&y<b.b)return {x,y};
      for(const [px,py] of q)if(inHex(px,py,x,y))return {x,y};
    }
    return null;
  };
  const clearHex=steps=>{
    for(let pass=0;pass<steps;pass++){
      let moved=false;
      for(const n of notes){
        if(!hit(box(n)))continue;
        n.y+=n.dir*14;place(n);moved=true;
      }
      if(!moved)break;
    }
  };
  const separate=()=>{
    for(let pass=0;pass<14;pass++){
      let moved=false;
      const boxes=notes.map(box);
      for(let a=0;a<notes.length;a++)for(let c=a+1;c<notes.length;c++){
        const A=boxes[a],B=boxes[c];
        const ox=Math.min(A.r,B.r)-Math.max(A.x,B.x),oy=Math.min(A.b,B.b)-Math.max(A.y,B.y);
        if(ox+16<=0||oy+8<=0)continue;
        const s=A.cx<=B.cx?-1:1,p=(ox+16)/2;
        notes[a].x+=s*p;notes[c].x-=s*p;moved=true;
      }
      notes.forEach(place);
      if(!moved)break;
    }
  };
  clearHex(18);separate();clearHex(8);separate();
  notes.forEach(n=>{
    const b=box(n),by=n.ty<b.y?b.y-6:b.b+6,bx=n.x;
    const ang=Math.atan2(by-n.ty,bx-n.tx),sector=Math.PI/3,a=((ang%sector)+sector)%sector;
    const rim=72*Math.cos(Math.PI/6)/Math.cos(a-Math.PI/6)+3;
    const ax=n.tx+Math.cos(ang)*rim,ay=n.ty+Math.sin(ang)*rim,dir=by<ay?-1:1,f=v=>v.toFixed(1);
    el('path',{d:`M${f(ax)} ${f(ay)} C ${f(ax+12)} ${f(ay+dir*14)}, ${f(bx+8)} ${f(by-dir*16)}, ${f(bx)} ${f(by)}`,pathLength:1},n.g);
    el('path',{d:`M${f(bx-6)} ${f(by-dir*8)} L${f(bx)} ${f(by)} L${f(bx+6)} ${f(by-dir*8)}`,pathLength:1},n.g);
  });
}
function showAltNotes(on){[...handG.children].forEach(g=>{clearTimeout(g._t);if(on)g._t=setTimeout(()=>g.classList.add('on'),reduced?0:700+g.dataset.i*45);else g.classList.remove('on')})}
const _setChaos=setChaos;
setChaos=function(on){_setChaos(on);
  show('#stats',false);
  if(on){computeScatter();scatterAll();svg.setAttribute('viewBox',VB_SC);drawAltNotes();showAltNotes(true)}
  else{showAltNotes(false);svg.setAttribute('viewBox',VB_FULL)}};
const _apply=applyPositions;applyPositions=function(){_apply();if(chaosOn&&VB_SC){svg.setAttribute('viewBox',VB_SC);drawAltNotes();showAltNotes(true)}};
document.querySelectorAll('#modules .tabs button').forEach(b=>b.addEventListener('click',()=>showAltNotes(false),true));
function setVH(){const h=Math.min(window.innerHeight,(screen&&screen.availHeight)||9999,1100);document.documentElement.style.setProperty('--vh',h+'px')}
setVH();addEventListener('resize',setVH);
relayout();
let rz;new ResizeObserver(()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(relayout)}).observe($('#modules'));
setMode('software');softwareStep(reduced?0:-1,reduced);
let started=false;
new IntersectionObserver(es=>{if(!started&&es[0].isIntersecting){started=true;loop()}},{threshold:.35}).observe($('#modules'));
})();

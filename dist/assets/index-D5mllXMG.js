(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const _=[{id:"habit_early_bed",name:"Early Bed",icon:"🌅",category:"Health",description:"Get into bed by 10:30 PM for restorative sleep and mental clarity.",createdAt:"2026-09-01",enabled:!0,color:"#10B981"},{id:"habit_study",name:"Study",icon:"📚",category:"Study",description:"Dedicate focused time to study core concepts, books, or documentation.",createdAt:"2026-09-01",enabled:!0,color:"#3B82F6"},{id:"habit_coding",name:"Coding",icon:"💻",category:"Coding",description:"Build projects, ship features, or write clean, well-tested code.",createdAt:"2026-09-01",enabled:!0,color:"#6366F1"},{id:"habit_leetcode",name:"LeetCode",icon:"🧩",category:"Coding",description:"Solve at least 1-2 algorithm and data structure problems.",createdAt:"2026-09-01",enabled:!0,color:"#F59E0B"},{id:"habit_meditation",name:"Meditation / Nam Jap",icon:"🧘",category:"Mindfulness",description:"15-20 minutes of silent meditation, deep breathing, or Nam Jap.",createdAt:"2026-09-01",enabled:!0,color:"#8B5CF6"},{id:"habit_healthy_food",name:"Healthy Food",icon:"🥗",category:"Health",description:"Nourish your body with clean, wholesome, nutrient-rich meals.",createdAt:"2026-09-01",enabled:!0,color:"#22C55E"},{id:"habit_self_care",name:"Self Care",icon:"❤️",category:"Lifestyle",description:"Personal hygiene, stretching, hydration, and taking time to unwind.",createdAt:"2026-09-01",enabled:!0,color:"#EC4899"},{id:"habit_less_screen_time",name:"Less Screen Time",icon:"📵",category:"Productivity",description:"Limit non-work recreational social media and doomscrolling under 1 hour.",createdAt:"2026-09-01",enabled:!0,color:"#06B6D4"}],U=[{id:"Coding",label:"Coding",icon:"💻",color:"#6366F1"},{id:"Study",label:"Study",icon:"📚",color:"#3B82F6"},{id:"Health",label:"Health",icon:"🥗",color:"#10B981"},{id:"Productivity",label:"Productivity",icon:"⚡",color:"#06B6D4"},{id:"Mindfulness",label:"Mindfulness",icon:"🧘",color:"#8B5CF6"},{id:"Lifestyle",label:"Lifestyle",icon:"❤️",color:"#EC4899"}];function j(n){(!(n instanceof Date)||isNaN(n.getTime()))&&(n=new Date);const t=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${t}-${e}-${a}`}function z(n){if(!n||typeof n!="string")return new Date;const[t,e,a]=n.split("-").map(Number);return new Date(t,(e||1)-1,a||1)}function D(){return j(new Date)}function B(n=null){const t=n?z(n):new Date;return t.setDate(t.getDate()-1),j(t)}function H(n,t){const e=z(n);return e.setDate(e.getDate()+t),j(e)}function O(n,t){const e=z(n),s=z(t).getTime()-e.getTime();return Math.round(s/(1e3*60*60*24))}function L(n,t="full"){if(!n)return"";const e=z(n);return t==="short"?e.toLocaleDateString(void 0,{month:"short",day:"numeric"}):t==="month-year"?e.toLocaleDateString(void 0,{month:"long",year:"numeric"}):t==="weekday"?e.toLocaleDateString(void 0,{weekday:"short"}):e.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric",year:"numeric"})}function et(n=null){const t=n?z(n):new Date,a=6-t.getDay(),s=new Date(t);s.setDate(s.getDate()+a);const o=371,i=new Date(s);i.setDate(i.getDate()-(o-1));const r=[],l=new Date(i);for(;l<=s;){const d=j(l);r.push({date:d,dayOfWeek:l.getDay(),month:l.getMonth(),year:l.getFullYear(),isFuture:l>t}),l.setDate(l.getDate()+1)}return r}function q(n,t={},e=null,a=null){const s=a||D(),o=B(s),i=Object.keys(t).filter(x=>t[x]&&t[x][n]&&t[x][n].completed).sort(),r=new Set(i),l=i.length;let d=0;const v=r.has(s),y=r.has(o);if(v){d=1;let x=o;for(;r.has(x);)d++,x=B(x)}else if(y){d=1;let x=B(o);for(;r.has(x);)d++,x=B(x)}else d=0;let m=0;if(i.length>0){let x=0,g=null;for(const w of i){if(!g)x=1;else{const p=O(g,w);p===1?x++:p>1&&(x=1)}x>m&&(m=x),g=w}}d>m&&(m=d);const c=e&&e<=s?e:i[0]||s,u=Math.max(1,O(c,s)+1),h=Math.min(100,Math.round(l/u*100));return{currentStreak:d,longestStreak:m,totalCompletedDays:l,completionRate:h,isCompletedToday:v}}function I(n=[],t={},e=null){const a=e||D(),s=B(a),o=new Set(n.filter(g=>g.enabled!==!1).map(g=>g.id));if(o.size===0)return{currentStreak:0,longestStreak:0,totalCompletedDays:0,todayCompletedCount:0,activeHabitsCount:0,todayCompletionRate:0};const i=Object.keys(t).sort(),r=[],l={};for(const g of i){const w=t[g];if(!w)continue;let p=0;for(const f of o)w[f]&&w[f].completed&&p++;l[g]=p,p>0&&r.push(g)}const d=new Set(r);let v=0;const y=d.has(a),m=d.has(s);if(y){v=1;let g=s;for(;d.has(g);)v++,g=B(g)}else if(m){v=1;let g=B(s);for(;d.has(g);)v++,g=B(g)}else v=0;let c=0;if(r.length>0){let g=0,w=null;for(const p of r){if(!w)g=1;else{const f=O(w,p);f===1?g++:f>1&&(g=1)}g>c&&(c=g),w=p}}v>c&&(c=v);const u=l[a]||0,h=o.size,x=h>0?Math.round(u/h*100):0;return{currentStreak:v,longestStreak:c,totalCompletedDays:r.length,todayCompletedCount:u,activeHabitsCount:h,todayCompletionRate:x}}const st=[{id:"streak_3",title:"3-Day Momentum",icon:"🔥",category:"Streak",description:"Maintain a 3-day active habit streak.",target:3,check:n=>{const t=n.globalStreak.longestStreak;return{unlocked:t>=3,progress:Math.min(3,t),max:3}}},{id:"streak_7",title:"7-Day Warrior",icon:"⚡",category:"Streak",description:"Crush your habits for a full week straight.",target:7,check:n=>{const t=n.globalStreak.longestStreak;return{unlocked:t>=7,progress:Math.min(7,t),max:7}}},{id:"streak_14",title:"Fortnight Focus",icon:"🛡️",category:"Streak",description:"Keep the fire burning for 14 continuous days.",target:14,check:n=>{const t=n.globalStreak.longestStreak;return{unlocked:t>=14,progress:Math.min(14,t),max:14}}},{id:"streak_30",title:"30-Day Master",icon:"👑",category:"Streak",description:"Achieve the legendary 30-day consistency streak.",target:30,check:n=>{const t=n.globalStreak.longestStreak;return{unlocked:t>=30,progress:Math.min(30,t),max:30}}},{id:"days_50",title:"Century Halfway",icon:"🏆",category:"Milestone",description:"Complete habits across 50 active days.",target:50,check:n=>{const t=n.globalStreak.totalCompletedDays;return{unlocked:t>=50,progress:Math.min(50,t),max:50}}},{id:"days_100",title:"Centurion Club",icon:"🎖️",category:"Milestone",description:"Complete habits across 100 distinct days.",target:100,check:n=>{const t=n.globalStreak.totalCompletedDays;return{unlocked:t>=100,progress:Math.min(100,t),max:100}}},{id:"perfect_week",title:"Perfect Week",icon:"⭐",category:"Perfection",description:"Complete 100% of all active habits for 7 consecutive days.",target:7,check:n=>{let t=0,e=0;const a=Object.keys(n.records).sort(),s=n.habits.filter(i=>i.enabled!==!1);if(s.length===0)return{unlocked:!1,progress:0,max:7};let o=null;for(const i of a){const r=n.records[i]||{};s.every(d=>r[d.id]&&r[d.id].completed)?(o&&O(o,i)===1?e++:e=1,e>t&&(t=e),o=i):(e=0,o=null)}return{unlocked:t>=7,progress:Math.min(7,t),max:7}}},{id:"perfect_month",title:"Perfect Month",icon:"💎",category:"Perfection",description:"Log active habit completions for 30 consecutive days.",target:30,check:n=>{const t=n.globalStreak.longestStreak;return{unlocked:t>=30,progress:Math.min(30,t),max:30}}},{id:"ten_in_one_day",title:"Super Surge",icon:"🚀",category:"Productivity",description:"Complete 8 or more habits in a single day.",target:8,check:n=>{let t=0;for(const e in n.records){const a=n.records[e],s=Object.values(a).filter(o=>o&&o.completed).length;s>t&&(t=s)}return{unlocked:t>=8,progress:Math.min(8,t),max:8}}},{id:"first_habit_completed",title:"First Step",icon:"🌱",category:"Milestone",description:"Complete your very first habit on HabitCode.",target:1,check:n=>{let t=0;for(const e in n.records)t+=Object.values(n.records[e]).filter(a=>a&&a.completed).length;return{unlocked:t>=1,progress:Math.min(1,t),max:1}}},{id:"code_discipline",title:"Algorithm Grinder",icon:"💻",category:"Discipline",description:"Complete the LeetCode or Coding habit 10 times.",target:10,check:n=>{let t=0;for(const e in n.records){const a=n.records[e];(a.habit_coding&&a.habit_coding.completed||a.habit_leetcode&&a.habit_leetcode.completed)&&t++}return{unlocked:t>=10,progress:Math.min(10,t),max:10}}},{id:"zen_mind",title:"Inner Peace",icon:"🧘",category:"Mindfulness",description:"Complete the Meditation / Nam Jap habit 7 times.",target:7,check:n=>{let t=0;for(const e in n.records){const a=n.records[e];a.habit_meditation&&a.habit_meditation.completed&&t++}return{unlocked:t>=7,progress:Math.min(7,t),max:7}}}];function Z(n,t={}){var s;const e=[],a=[];for(const o of st){const i=o.check(n),r=!!t[o.id];let l=((s=t[o.id])==null?void 0:s.unlockedAt)||null;i.unlocked&&!r&&(l=new Date().toISOString(),a.push({...o,unlockedAt:l})),e.push({...o,unlocked:i.unlocked||r,progress:i.progress,max:i.max,unlockedAt:l||(r?t[o.id].unlockedAt:null)})}return{badges:e,newlyUnlocked:a}}const R={HABITS:"habitcode_habits_v1",RECORDS:"habitcode_records_v1",SETTINGS:"habitcode_settings_v1",ACHIEVEMENTS:"habitcode_achievements_v1"};class at{constructor(){this.listeners=new Set,this.habits=[],this.records={},this.settings={theme:"dark",soundEnabled:!0,notificationsEnabled:!1},this.achievements={},this.init()}init(){try{const t=localStorage.getItem(R.HABITS);t?this.habits=JSON.parse(t):(this.habits=JSON.parse(JSON.stringify(_)),this.saveHabits());const e=localStorage.getItem(R.RECORDS);e?this.records=JSON.parse(e):(this.records={},this.saveRecords());const a=localStorage.getItem(R.SETTINGS);a?this.settings={...this.settings,...JSON.parse(a)}:this.saveSettings();const s=localStorage.getItem(R.ACHIEVEMENTS);s?this.achievements=JSON.parse(s):this.achievements={},document.documentElement.setAttribute("data-theme",this.settings.theme)}catch(t){console.error("Failed to load HabitCode data from localStorage:",t),this.habits=JSON.parse(JSON.stringify(_)),this.records={}}}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(t,e={}){for(const a of this.listeners)try{a(t,e)}catch(s){console.error("Store listener error:",s)}}saveHabits(){localStorage.setItem(R.HABITS,JSON.stringify(this.habits))}saveRecords(){localStorage.setItem(R.RECORDS,JSON.stringify(this.records))}saveSettings(){localStorage.setItem(R.SETTINGS,JSON.stringify(this.settings)),document.documentElement.setAttribute("data-theme",this.settings.theme)}saveAchievements(){localStorage.setItem(R.ACHIEVEMENTS,JSON.stringify(this.achievements))}getHabits(){return[...this.habits]}getActiveHabits(){return this.habits.filter(t=>t.enabled!==!1)}getRecords(){return{...this.records}}getSettings(){return{...this.settings}}getAchievements(){return{...this.achievements}}toggleHabitCompletion(t,e=null){var l;const a=e||D();this.records[a]||(this.records[a]={});const o=!!!((l=this.records[a][t])!=null&&l.completed);this.records[a][t]={completed:o,updatedAt:new Date().toISOString()},Object.values(this.records[a]).some(d=>d&&d.completed)||delete this.records[a],this.saveRecords();const r=this.checkAchievements();return this.notify("HABIT_TOGGLED",{habitId:t,date:a,completed:o,newAchievements:r.newlyUnlocked}),{completed:o,newAchievements:r.newlyUnlocked}}checkAchievements(){const t=I(this.habits,this.records),e={habits:this.habits,records:this.records,globalStreak:t},a=Z(e,this.achievements);if(a.newlyUnlocked.length>0){for(const s of a.newlyUnlocked)this.achievements[s.id]={unlockedAt:s.unlockedAt};this.saveAchievements(),this.notify("ACHIEVEMENTS_UPDATED",{newlyUnlocked:a.newlyUnlocked})}return a}addHabit(t){var a;const e={id:`habit_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,name:t.name.trim(),icon:t.icon||"🎯",category:t.category||"Productivity",description:((a=t.description)==null?void 0:a.trim())||"",color:t.color||"#6366F1",createdAt:D(),enabled:!0};return this.habits.push(e),this.saveHabits(),this.notify("HABIT_ADDED",{habit:e}),e}updateHabit(t,e){const a=this.habits.findIndex(s=>s.id===t);return a===-1?null:(this.habits[a]={...this.habits[a],...e,name:e.name?e.name.trim():this.habits[a].name,description:e.description!==void 0?e.description.trim():this.habits[a].description},this.saveHabits(),this.notify("HABIT_UPDATED",{habit:this.habits[a]}),this.habits[a])}deleteHabit(t){this.habits=this.habits.filter(e=>e.id!==t);for(const e in this.records)this.records[e][t]&&(delete this.records[e][t],Object.keys(this.records[e]).length===0&&delete this.records[e]);this.saveHabits(),this.saveRecords(),this.notify("HABIT_DELETED",{habitId:t})}toggleHabitEnabled(t){const e=this.habits.find(a=>a.id===t);e&&(e.enabled=!e.enabled,this.saveHabits(),this.notify("HABIT_UPDATED",{habit:e}))}updateSettings(t){this.settings={...this.settings,...t},this.saveSettings(),this.notify("SETTINGS_UPDATED",{settings:this.settings})}resetTodayProgress(){const t=D();this.records[t]&&(delete this.records[t],this.saveRecords(),this.notify("DATA_CHANGED",{reason:"RESET_TODAY"}))}clearAllData(){this.habits=JSON.parse(JSON.stringify(_)),this.records={},this.achievements={},this.saveHabits(),this.saveRecords(),this.saveAchievements(),this.notify("DATA_CHANGED",{reason:"CLEAR_ALL"})}exportData(){const t={version:"1.0",exportDate:new Date().toISOString(),habits:this.habits,records:this.records,achievements:this.achievements,settings:this.settings};return JSON.stringify(t,null,2)}importData(t){try{const e=JSON.parse(t);if(!e.habits||!Array.isArray(e.habits))throw new Error("Invalid format: missing habits array");return this.habits=e.habits,this.records=e.records||{},this.achievements=e.achievements||{},e.settings&&(this.settings={...this.settings,...e.settings}),this.saveHabits(),this.saveRecords(),this.saveAchievements(),this.saveSettings(),this.checkAchievements(),this.notify("DATA_CHANGED",{reason:"IMPORT"}),{success:!0}}catch(e){return{success:!1,error:e.message}}}loadSampleData(){const t=D(),e=this.habits.map(s=>s.id),a={};for(let s=35;s>=0;s--){const o=H(t,-s);a[o]={},e.forEach((i,r)=>{(s===0?r<6:Math.random()>.15||r<5)&&(a[o][i]={completed:!0,updatedAt:`${o}T20:00:00.000Z`})})}this.records=a,this.saveRecords(),this.checkAchievements(),this.notify("DATA_CHANGED",{reason:"SAMPLE_LOADED"})}}const b=new at,J=[{id:"dashboard",label:"Dashboard",icon:"🏠"},{id:"my-habits",label:"My Habits",icon:"✅"},{id:"calendar",label:"Calendar",icon:"📅"},{id:"history",label:"History",icon:"📜"},{id:"statistics",label:"Statistics",icon:"📊"},{id:"achievements",label:"Achievements",icon:"🏆"},{id:"settings",label:"Settings",icon:"⚙️"}];class it{constructor({onNavigate:t}){this.onNavigate=t,this.currentView="dashboard",this.initListeners()}initListeners(){b.subscribe(()=>{this.updateHeaderStats()})}renderSidebar(t){const e=b.getHabits(),a=b.getRecords(),s=I(e,a),o=J.map(i=>`
      <button class="nav-item ${this.currentView===i.id?"active":""}" data-view="${i.id}" id="nav-btn-${i.id}">
        <span class="nav-icon">${i.icon}</span>
        <span>${i.label}</span>
      </button>
    `).join("");t.innerHTML=`
      <div class="sidebar-header">
        <div class="brand-logo">
          <div class="brand-icon">⚡</div>
          <span>HabitCode</span>
          <span class="brand-badge">PRO</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${o}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-streak-card">
          <span class="sidebar-streak-icon">🔥</span>
          <div class="sidebar-streak-info">
            <span class="sidebar-streak-label">Global Streak</span>
            <span class="sidebar-streak-value font-mono" id="sidebar-streak-count">${s.currentStreak} Days</span>
          </div>
        </div>
      </div>
    `,t.querySelectorAll(".nav-item").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.view;this.navigateTo(r)})})}renderMobileBottomBar(t){const a=J.filter(s=>["dashboard","my-habits","calendar","statistics","achievements"].includes(s.id)).map(s=>`
      <button class="mobile-nav-item ${this.currentView===s.id?"active":""}" data-view="${s.id}">
        <span class="nav-icon">${s.icon}</span>
        <span>${s.label}</span>
      </button>
    `).join("");t.innerHTML=a,t.querySelectorAll(".mobile-nav-item").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.view;this.navigateTo(o)})})}renderTopBar(t){const e=b.getHabits(),a=b.getRecords(),s=I(e,a),o=D(),i=L(o,"full"),r=b.getSettings();t.innerHTML=`
      <div class="topbar-left">
        <div class="topbar-date">
          <span>📅</span>
          <span class="font-mono font-medium">${i}</span>
        </div>
      </div>

      <div class="topbar-right">
        <div class="topbar-stat-pill" title="Today's habit completion ratio">
          <span>🎯</span>
          <span class="font-mono" id="topbar-completion-ratio">${s.todayCompletedCount}/${s.activeHabitsCount}</span>
        </div>

        <div class="topbar-stat-pill" title="Current global active streak">
          <span class="streak-icon">🔥</span>
          <span class="font-mono" id="topbar-streak-count">${s.currentStreak}d</span>
        </div>

        <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle theme">
          ${r.theme==="dark"?"☀️":"🌙"}
        </button>
      </div>
    `;const l=t.querySelector("#theme-toggle-btn");l&&l.addEventListener("click",()=>{const v=b.getSettings().theme==="dark"?"light":"dark";b.updateSettings({theme:v}),l.innerHTML=v==="dark"?"☀️":"🌙"})}updateHeaderStats(){const t=b.getHabits(),e=b.getRecords(),a=I(t,e),s=document.getElementById("topbar-completion-ratio");s&&(s.textContent=`${a.todayCompletedCount}/${a.activeHabitsCount}`);const o=document.getElementById("topbar-streak-count");o&&(o.textContent=`${a.currentStreak}d`);const i=document.getElementById("sidebar-streak-count");i&&(i.textContent=`${a.currentStreak} Days`)}navigateTo(t){this.currentView=t,document.querySelectorAll(".nav-item").forEach(e=>{e.classList.toggle("active",e.dataset.view===t)}),document.querySelectorAll(".mobile-nav-item").forEach(e=>{e.classList.toggle("active",e.dataset.view===t)}),this.onNavigate&&this.onNavigate(t)}}function ot({todayCompleted:n,totalActive:t,currentStreak:e,longestStreak:a}){if(t===0)return{message:"Create your first habit to begin your journey!",subtext:"Every master started with a single step.",level:"Getting Started"};const s=t>0?n/t:0;return n===0?e>0?{message:`Your ${e}-day streak is waiting for you! 🔥`,subtext:"Check off your first habit to keep the momentum going.",level:"Streak at Risk"}:{message:"Start today and build your first streak 🔥",subtext:"Small daily actions compound into extraordinary results.",level:"Day Zero"}:s===1?{message:"Flawless execution! 100% Day Completed! 💎",subtext:`You crushed all ${t} habits today. Rest well tonight!`,level:"God Mode"}:n===t-1?{message:"Today is almost perfect! Just 1 habit left! ⭐",subtext:"One more push to achieve 100% completion.",level:"Near Perfection"}:s>=.75?{message:`Outstanding rhythm! ${n}/${t} habits done. 🚀`,subtext:"Finish strong today!",level:"High Momentum"}:s>=.5?{message:"You're building unstoppable consistency! 🔥",subtext:`Over halfway through today (${n}/${t}).`,level:"Halfway There"}:{message:"Great start! Complete one more habit.",subtext:`${t-n} habits left to unlock full potential.`,level:"Warming Up"}}function nt(n,t,e=null){const a=e||D(),s=n.filter(c=>c.enabled!==!1),o=s.length;if(o===0)return{daily:0,weeklyAvg:0,monthlyAvg:0};const i=new Set(s.map(c=>c.id)),r=c=>{const u=t[c];if(!u)return 0;let h=0;for(const x of i)u[x]&&u[x].completed&&h++;return Math.round(h/o*100)},l=r(a);let d=0;for(let c=0;c<7;c++){const u=H(a,-c);d+=r(u)}const v=Math.round(d/7);let y=0;for(let c=0;c<30;c++){const u=H(a,-c);y+=r(u)}const m=Math.round(y/30);return{daily:l,weeklyAvg:v,monthlyAvg:m}}function Q(n,t,e=null){const a=e||D(),s=n.filter(p=>p.enabled!==!1),o=s.length,i=n.map(p=>{const f=q(p.id,t,p.createdAt,a);return{id:p.id,name:p.name,icon:p.icon,category:p.category,color:p.color||"#6366F1",enabled:p.enabled!==!1,...f}});let r=null,l=-1,d=-1;for(const p of i)(p.totalCompletedDays>d||p.totalCompletedDays===d&&p.completionRate>l)&&(d=p.totalCompletedDays,l=p.completionRate,r=p);const v=[];for(let p=6;p>=0;p--){const f=H(a,-p),S=t[f]||{};let C=0;s.forEach(k=>{S[k.id]&&S[k.id].completed&&C++});const $=o>0?Math.round(C/o*100):0;v.push({date:f,label:L(f,"weekday"),shortDate:L(f,"short"),completed:C,total:o,percentage:$})}const y=[];for(let p=3;p>=0;p--){let f=0,S=0;const C=H(a,-(p*7+6)),$=H(a,-(p*7));for(let A=0;A<7;A++){const T=H(C,A),G=t[T]||{};s.forEach(W=>{G[W.id]&&G[W.id].completed&&f++}),S+=o}const k=S>0?Math.round(f/S*100):0;y.push({label:`Week ${4-p}`,dateRange:`${L(C,"short")} - ${L($,"short")}`,completed:f,total:S,percentage:k})}let m=0;for(const p in t){const f=t[p]||{};for(const S in f)f[S]&&f[S].completed&&m++}const c=I(n,t,a),u=Object.keys(t).sort(),h=u.length>0?u[0]:a,g=Math.max(1,O(h,a)+1)*o,w=g>0?Math.min(100,Math.round(m/g*100)):0;return{habitStats:i,mostConsistentHabit:r,weeklyChartData:v,monthlyWeeksData:y,totalCompletionsCount:m,globalStreaks:c,overallConsistencyRate:w,activeHabitsCount:o}}class rt{constructor(){this.ctx=null}getAudioContext(){if(!this.ctx&&(window.AudioContext||window.webkitAudioContext)){const t=window.AudioContext||window.webkitAudioContext;this.ctx=new t}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}playComplete(){try{const t=this.getAudioContext();if(!t)return;const e=t.currentTime;[698.46,880].forEach((s,o)=>{const i=t.createOscillator(),r=t.createGain();i.type="sine",i.frequency.setValueAtTime(s,e+o*.07),r.gain.setValueAtTime(0,e+o*.07),r.gain.linearRampToValueAtTime(.15,e+o*.07+.02),r.gain.exponentialRampToValueAtTime(.001,e+o*.07+.35),i.connect(r),r.connect(t.destination),i.start(e+o*.07),i.stop(e+o*.07+.36)})}catch{}}playUncheck(){try{const t=this.getAudioContext();if(!t)return;const e=t.currentTime,a=t.createOscillator(),s=t.createGain();a.type="sine",a.frequency.setValueAtTime(329.63,e),a.frequency.exponentialRampToValueAtTime(261.63,e+.12),s.gain.setValueAtTime(.1,e),s.gain.exponentialRampToValueAtTime(.001,e+.12),a.connect(s),s.connect(t.destination),a.start(e),a.stop(e+.13)}catch{}}playAchievement(){try{const t=this.getAudioContext();if(!t)return;const e=t.currentTime;[523.25,659.25,783.99,1046.5].forEach((s,o)=>{const i=t.createOscillator(),r=t.createGain();i.type="triangle",i.frequency.setValueAtTime(s,e+o*.09),r.gain.setValueAtTime(0,e+o*.09),r.gain.linearRampToValueAtTime(.18,e+o*.09+.02),r.gain.exponentialRampToValueAtTime(.001,e+o*.09+.45),i.connect(r),r.connect(t.destination),i.start(e+o*.09),i.stop(e+o*.09+.46)})}catch{}}}const P=new rt;let E=null,M=null,N=[],F=null;function lt(){E||(E=document.createElement("canvas"),E.id="confetti-canvas",E.style.position="fixed",E.style.top="0",E.style.left="0",E.style.width="100vw",E.style.height="100vh",E.style.pointerEvents="none",E.style.zIndex="99999",document.body.appendChild(E),M=E.getContext("2d"),Y(),window.addEventListener("resize",Y))}function Y(){E&&(E.width=window.innerWidth*window.devicePixelRatio,E.height=window.innerHeight*window.devicePixelRatio,M.scale(window.devicePixelRatio,window.devicePixelRatio))}const K=["#10B981","#3B82F6","#6366F1","#F59E0B","#EC4899","#8B5CF6","#14B8A6","#F43F5E"];function X(n=null,t=null,e=40){lt();const a=n!==null?n:window.innerWidth/2,s=t!==null?t:window.innerHeight/2;for(let o=0;o<e;o++){const i=Math.PI*2*Math.random(),r=4+Math.random()*8,l=K[Math.floor(Math.random()*K.length)];N.push({x:a,y:s,vx:Math.cos(i)*r,vy:Math.sin(i)*r-2,gravity:.25,color:l,size:4+Math.random()*6,rotation:Math.random()*360,rotSpeed:(Math.random()-.5)*12,alpha:1,decay:.015+Math.random()*.015})}F||tt()}function tt(){M.clearRect(0,0,window.innerWidth,window.innerHeight);for(let n=N.length-1;n>=0;n--){const t=N[n];if(t.x+=t.vx,t.y+=t.vy,t.vy+=t.gravity,t.rotation+=t.rotSpeed,t.alpha-=t.decay,t.alpha<=0){N.splice(n,1);continue}M.save(),M.translate(t.x,t.y),M.rotate(t.rotation*Math.PI/180),M.globalAlpha=Math.max(0,t.alpha),M.fillStyle=t.color,M.fillRect(-t.size/2,-t.size/2,t.size,t.size),M.restore()}N.length>0?F=requestAnimationFrame(tt):(F=null,M.clearRect(0,0,window.innerWidth,window.innerHeight))}function ct(n,t,e){const a=q(n.id,t,n.createdAt,e),s=a.isCompletedToday,o=document.createElement("div");o.className=`habit-card ${s?"completed":""}`,o.style.setProperty("--habit-color",n.color||"var(--accent-indigo)"),o.id=`habit-card-${n.id}`,o.innerHTML=`
    <div class="habit-card-top">
      <div class="habit-title-area">
        <div class="habit-icon-box" style="border-color: ${s?"var(--accent-emerald)":"var(--border-subtle)"}">
          ${n.icon}
        </div>
        <div class="habit-info">
          <span class="habit-name">${n.name}</span>
          <span class="badge-category" style="--cat-color: ${n.color||"var(--accent-indigo)"}">
            ${n.category}
          </span>
        </div>
      </div>
    </div>

    <p class="habit-description">${n.description||"Consistency beats intensity."}</p>

    <div class="habit-card-bottom">
      <div class="habit-stats-pills">
        <div class="streak-tag ${a.currentStreak>0?"pulse":""}" title="Current continuous streak">
          <span>🔥</span>
          <span class="font-mono">${a.currentStreak}d</span>
        </div>
        <span class="best-streak-tag font-mono" title="Longest streak achieved">
          ★ Best: ${a.longestStreak}d
        </span>
        <span class="completion-rate-tag font-mono" title="Historical completion percentage">
          ${a.completionRate}%
        </span>
      </div>

      <button class="btn-toggle-habit ${s?"is-completed":""}" id="btn-toggle-${n.id}">
        <span class="btn-toggle-icon">
          ${s?"✓":""}
        </span>
        <span class="btn-toggle-label">${s?"Completed":"Complete"}</span>
      </button>
    </div>
  `;const i=o.querySelector(`#btn-toggle-${n.id}`);return i.addEventListener("click",r=>{const l=i.getBoundingClientRect(),d=b.toggleHabitCompletion(n.id,e),v=b.getSettings();d.completed?(v.soundEnabled&&P.playComplete(),X(l.left+l.width/2,l.top+l.height/2,28),o.classList.add("anim-pop"),setTimeout(()=>o.classList.remove("anim-pop"),400)):v.soundEnabled&&P.playUncheck()}),o}class dt{constructor({onAddHabit:t,onOpenHabitModal:e}){this.onAddHabit=t,this.onOpenHabitModal=e,this.selectedCategory="All"}render(t){const e=b.getHabits(),a=e.filter(c=>c.enabled!==!1),s=b.getRecords(),o=D(),i=I(e,s,o),r=nt(e,s,o),l=Q(e,s,o),d=ot({todayCompleted:i.todayCompletedCount,totalActive:i.activeHabitsCount,currentStreak:i.currentStreak,longestStreak:i.longestStreak}),v=2*Math.PI*26,y=v-r.daily/100*v;t.innerHTML=`
      <!-- Motivational Hero Banner -->
      <div class="hero-motivation-banner anim-fade-in">
        <div class="motivation-content">
          <div class="motivation-tag">
            <span>✨</span>
            <span>${d.level}</span>
          </div>
          <h2 class="motivation-title">${d.message}</h2>
          <p class="motivation-subtext">${d.subtext}</p>
        </div>

        <div class="motivation-score-widget" title="Daily Productivity Score (% of today's habits completed)">
          <div class="score-circular">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-medium)" stroke-width="5" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent-emerald)" stroke-width="5"
                      stroke-dasharray="${v}" stroke-dashoffset="${y}"
                      stroke-linecap="round" transform="rotate(-90 32 32)"
                      style="transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);" />
            </svg>
            <span class="score-text font-mono">${r.daily}%</span>
          </div>
          <div class="score-info">
            <span class="score-title">Productivity Score</span>
            <span class="score-sub font-mono">Week: ${r.weeklyAvg}% · Month: ${r.monthlyAvg}%</span>
          </div>
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Current Streak</span>
            <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono" id="metric-current-streak">${i.currentStreak}</span>
            <span class="metric-sub">consecutive days</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Longest Streak</span>
            <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">🏆</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono" id="metric-longest-streak">${i.longestStreak}</span>
            <span class="metric-sub">days personal best</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Today's Completion</span>
            <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.12);">🎯</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${i.todayCompletedCount}/${i.activeHabitsCount}</span>
            <span class="metric-sub">${i.todayCompletionRate}% completed</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Overall Completion</span>
            <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">📈</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${l.overallConsistencyRate}%</span>
            <span class="metric-sub">lifetime consistency</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Total Habit Logs</span>
            <span class="metric-icon" style="color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12);">⚡</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${l.totalCompletionsCount}</span>
            <span class="metric-sub">habits crushed</span>
          </div>
        </div>
      </div>

      <!-- Today's Habits Section -->
      <div class="section-header">
        <h3 class="section-title">
          <span>⚡</span>
          <span>Today's Habits</span>
          <span class="brand-badge font-mono">${a.length} Active</span>
        </h3>

        <div class="section-actions">
          <button class="btn btn-primary" id="btn-quick-add-habit">
            <span>+</span>
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-chips" style="margin-bottom: 20px;">
        ${["All","Coding","Study","Health","Productivity","Mindfulness","Lifestyle"].map(c=>`
          <button class="category-chip ${this.selectedCategory===c?"selected":""}" data-cat="${c}">
            ${c}
          </button>
        `).join("")}
      </div>

      <!-- Habit Cards Container -->
      <div class="habits-grid" id="dashboard-habits-grid">
        <!-- Rendered dynamically -->
      </div>
    `,t.querySelectorAll(".category-chip").forEach(c=>{c.addEventListener("click",()=>{this.selectedCategory=c.dataset.cat,t.querySelectorAll(".category-chip").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),this.renderHabitsList(t,a,s,o)})});const m=t.querySelector("#btn-quick-add-habit");m&&this.onOpenHabitModal&&m.addEventListener("click",()=>this.onOpenHabitModal()),this.renderHabitsList(t,a,s,o)}renderHabitsList(t,e,a,s){const o=t.querySelector("#dashboard-habits-grid");if(!o)return;o.innerHTML="";const i=this.selectedCategory==="All"?e:e.filter(r=>r.category.toLowerCase()===this.selectedCategory.toLowerCase());if(i.length===0){o.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-icon">🎯</span>
          <h4 class="empty-title">No habits found in "${this.selectedCategory}"</h4>
          <p class="empty-text">Create your first habit to begin tracking your consistency.</p>
        </div>
      `;return}i.forEach(r=>{const l=ct(r,a,s);o.appendChild(l)})}}class pt{constructor(){this.tooltipEl=null,this.ensureTooltip()}ensureTooltip(){let t=document.getElementById("heatmap-global-tooltip");t||(t=document.createElement("div"),t.id="heatmap-global-tooltip",t.className="heatmap-tooltip",document.body.appendChild(t)),this.tooltipEl=t}render(t){const a=b.getHabits().filter(h=>h.enabled!==!1),s=b.getRecords(),o=D(),i=et(o),r=a.length,l=h=>h===0?0:h<=2?1:h<=4?2:h<=6?3:4,d=[];let v=-1;i.forEach((h,x)=>{const g=Math.floor(x/7);(h.dayOfWeek===0||x===0)&&h.month!==v&&(d.push({name:new Date(h.year,h.month,1).toLocaleDateString(void 0,{month:"short"}),colIndex:g}),v=h.month)});const y=d.map(h=>`
      <span class="heatmap-month-label" style="left: ${h.colIndex*16.5}px;">${h.name}</span>
    `).join(""),m=i.map(h=>{const x=s[h.date]||{};let g=0;a.forEach(S=>{x[S.id]&&x[S.id].completed&&g++});const w=h.isFuture?0:l(g),p=r>0?Math.round(g/r*100):0,f=L(h.date,"full");return`
        <div class="heatmap-cell level-${w} ${h.isFuture?"future-day":""}"
             data-date="${h.date}"
             data-count="${g}"
             data-total="${r}"
             data-percentage="${p}"
             data-readable="${f}"
             tabindex="0"
             role="gridcell"
             aria-label="${f}: ${g} of ${r} habits completed">
        </div>
      `}).join("");t.innerHTML=`
      <div class="heatmap-card anim-fade-in">
        <div class="heatmap-header">
          <div class="heatmap-title-group">
            <h3 class="heatmap-title">
              <span>📅</span>
              <span>12-Month Consistency Heatmap</span>
            </h3>
            <p class="heatmap-subtitle">Your coding & habit activity over the past 365 days</p>
          </div>

          <div class="heatmap-legend">
            <span>Less</span>
            <div class="legend-swatch level-0"></div>
            <div class="legend-swatch level-1"></div>
            <div class="legend-swatch level-2"></div>
            <div class="legend-swatch level-3"></div>
            <div class="legend-swatch level-4"></div>
            <span>More</span>
          </div>
        </div>

        <div class="heatmap-scroll-container" id="heatmap-scroll">
          <div class="heatmap-container">
            <div class="heatmap-months-row">
              ${y}
            </div>

            <div class="heatmap-body">
              <div class="heatmap-weekdays-col">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div class="heatmap-grid" role="grid">
                ${m}
              </div>
            </div>
          </div>
        </div>

        <div class="heatmap-footer">
          <span>💡 Tip: Hover or click any day to inspect completed habits.</span>
          <span class="font-mono">Total tracked habits: ${r}</span>
        </div>
      </div>

      <!-- Day Details Modal (Container) -->
      <div id="day-inspect-modal-root"></div>
    `;const c=t.querySelector("#heatmap-scroll");c&&setTimeout(()=>{c.scrollLeft=c.scrollWidth},50),t.querySelectorAll(".heatmap-cell:not(.future-day)").forEach(h=>{h.addEventListener("mouseenter",x=>this.showTooltip(x,h)),h.addEventListener("mouseleave",()=>this.hideTooltip()),h.addEventListener("click",()=>this.openDayModal(h.dataset.date))})}showTooltip(t,e){const{date:a,count:s,total:o,percentage:i,readable:r}=e.dataset;if(!this.tooltipEl)return;this.tooltipEl.innerHTML=`
      <div class="tooltip-date">${r}</div>
      <div class="tooltip-stats">${s} / ${o} habits completed (${i}%)</div>
    `;const l=e.getBoundingClientRect();this.tooltipEl.style.left=`${l.left+l.width/2}px`,this.tooltipEl.style.top=`${l.top-8}px`,this.tooltipEl.classList.add("visible")}hideTooltip(){this.tooltipEl&&this.tooltipEl.classList.remove("visible")}openDayModal(t){this.hideTooltip();const e=b.getActiveHabits(),s=b.getRecords()[t]||{},o=L(t,"full"),i=document.getElementById("day-inspect-modal-root");if(!i)return;const r=e.map(m=>{var u;const c=!!((u=s[m.id])!=null&&u.completed);return`
        <div class="habit-stat-row" style="margin-bottom: 8px;">
          <div class="stat-habit-info">
            <span class="stat-habit-icon">${m.icon}</span>
            <span class="stat-habit-title">${m.name}</span>
          </div>
          <button class="btn ${c?"btn-primary":"btn-secondary"} btn-day-toggle font-mono" 
                  data-habit-id="${m.id}" 
                  style="font-size: 0.85rem; padding: 6px 14px;">
            ${c?"✓ Completed":"Mark Done"}
          </button>
        </div>
      `}).join("");i.innerHTML=`
      <div class="modal-overlay active" id="day-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Activity on ${o}</h3>
              <span class="font-mono font-medium" style="color: var(--text-muted); font-size: 0.85rem;">Date: ${t}</span>
            </div>
            <button class="icon-btn" id="btn-close-day-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px;">
              Inspect or update habit records for this date:
            </p>
            ${r}
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="btn-done-day-modal">Done</button>
          </div>
        </div>
      </div>
    `;const l=i.querySelector("#day-modal-overlay"),d=i.querySelector("#btn-close-day-modal"),v=i.querySelector("#btn-done-day-modal"),y=()=>{l.classList.remove("active"),setTimeout(()=>{i.innerHTML=""},200)};d.addEventListener("click",y),v.addEventListener("click",y),l.addEventListener("click",m=>{m.target===l&&y()}),i.querySelectorAll(".btn-day-toggle").forEach(m=>{m.addEventListener("click",()=>{const c=m.dataset.habitId;b.toggleHabitCompletion(c,t),this.openDayModal(t)})})}}class mt{constructor(){this.selectedHabitId="all",this.selectedTimeframe="this-month"}render(t){var c,u,h,x,g,w;const e=b.getHabits(),a=b.getRecords(),s=D();let o=30;if(this.selectedTimeframe==="today")o=1;else if(this.selectedTimeframe==="this-week")o=7;else if(this.selectedTimeframe==="this-month")o=30;else if(this.selectedTimeframe==="last-3-months")o=90;else if(this.selectedTimeframe==="all-time"){const p=Object.keys(a).sort(),f=p.length>0?p[0]:s;o=Math.max(30,O(f,s)+1)}let i=0,r=0,l=0,d=0,v=0;if(this.selectedHabitId==="all"){const p=I(e,a,s);i=p.currentStreak,r=p.longestStreak;for(const k in a)for(const A in a[k])(c=a[k][A])!=null&&c.completed&&l++;let f=0,S=7*Math.max(1,e.length);for(let k=0;k<7;k++){const A=H(s,-k);a[A]&&(f+=Object.values(a[A]).filter(T=>T&&T.completed).length)}d=Math.min(100,Math.round(f/S*100));let C=0,$=30*Math.max(1,e.length);for(let k=0;k<30;k++){const A=H(s,-k);a[A]&&(C+=Object.values(a[A]).filter(T=>T&&T.completed).length)}v=Math.min(100,Math.round(C/$*100))}else{const p=e.find(f=>f.id===this.selectedHabitId);if(p){const f=q(p.id,a,p.createdAt,s);i=f.currentStreak,r=f.longestStreak,l=f.totalCompletedDays;let S=0;for(let $=0;$<7;$++){const k=H(s,-$);(h=(u=a[k])==null?void 0:u[p.id])!=null&&h.completed&&S++}d=Math.round(S/7*100);let C=0;for(let $=0;$<30;$++){const k=H(s,-$);(g=(x=a[k])==null?void 0:x[p.id])!=null&&g.completed&&C++}v=Math.round(C/30*100)}}const y=[];for(let p=0;p<o;p++){const f=H(s,-p),S=a[f]||{},C=L(f,"full");if(this.selectedHabitId==="all"){const $=e.filter(A=>{var T;return(T=S[A.id])==null?void 0:T.completed}),k=$.length;y.push({date:f,readable:C,isCompleted:k>0,count:k,total:e.length,habits:$})}else{const $=!!((w=S[this.selectedHabitId])!=null&&w.completed);y.push({date:f,readable:C,isCompleted:$,count:$?1:0,total:1,habits:[]})}}t.innerHTML=`
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>📜</span>
              <span>Habit Completion History</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Review your historical track record and consistency trends.
            </p>
          </div>

          <!-- Habit Selector Dropdown -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <label class="form-label" style="margin-bottom: 0;">Habit:</label>
            <select class="form-select font-mono" id="history-habit-select" style="min-width: 180px;">
              <option value="all" ${this.selectedHabitId==="all"?"selected":""}>🌟 All Habits</option>
              ${e.map(p=>`
                <option value="${p.id}" ${this.selectedHabitId===p.id?"selected":""}>
                  ${p.icon} ${p.name}
                </option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="history-filters-bar">
          <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; margin-right: 4px;">Timeframe:</span>
          ${[{id:"today",label:"Today"},{id:"this-week",label:"This Week"},{id:"this-month",label:"This Month"},{id:"last-3-months",label:"Last 3 Months"},{id:"all-time",label:"All Time"}].map(p=>`
            <button class="filter-btn ${this.selectedTimeframe===p.id?"active":""}" data-timeframe="${p.id}">
              ${p.label}
            </button>
          `).join("")}
        </div>

        <!-- History Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Current Streak</span>
              <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${i}</span>
              <span class="metric-sub">days</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Longest Streak</span>
              <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">🏆</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${r}</span>
              <span class="metric-sub">days personal best</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Total Completions</span>
              <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.12);">✓</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${l}</span>
              <span class="metric-sub">logged entries</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Weekly Rate</span>
              <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">📊</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${d}%</span>
              <span class="metric-sub">last 7 days</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Monthly Rate</span>
              <span class="metric-icon" style="color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12);">📈</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${v}%</span>
              <span class="metric-sub">last 30 days</span>
            </div>
          </div>
        </div>

        <!-- History Log Table / Cards -->
        <div class="card" style="padding: 20px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">
            Daily Activity Log
          </h3>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${y.length===0?`
              <div class="empty-state">
                <span class="empty-icon">📜</span>
                <h4 class="empty-title">No history records found</h4>
                <p class="empty-text">Start completing habits today to see your historical timeline.</p>
              </div>
            `:y.map(p=>`
              <div class="habit-stat-row">
                <div style="display: flex; align-items: center; gap: 14px; min-width: 220px;">
                  <span style="font-size: 1.1rem;">${p.isCompleted?"🟢":"⚪"}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${p.readable}</div>
                    <div class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${p.date}</div>
                  </div>
                </div>

                <div style="flex: 1; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  ${this.selectedHabitId==="all"?p.habits.length>0?p.habits.map(f=>`
                      <span class="badge-category font-mono" style="--cat-color: ${f.color||"#6366F1"}; font-size: 0.75rem;">
                        ${f.icon} ${f.name}
                      </span>
                    `).join(""):'<span style="color: var(--text-muted); font-size: 0.85rem;">No habits completed</span>':p.isCompleted?'<span class="badge-category font-mono" style="--cat-color: #10B981;">Completed</span>':'<span style="color: var(--text-muted); font-size: 0.85rem;">Missed</span>'}
                </div>

                <div class="font-mono" style="font-weight: 700; font-size: 0.9rem; color: ${p.isCompleted?"var(--accent-emerald)":"var(--text-muted)"}; min-width: 60px; text-align: right;">
                  ${this.selectedHabitId==="all"?`${p.count}/${p.total}`:p.isCompleted?"100%":"0%"}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;const m=t.querySelector("#history-habit-select");m&&m.addEventListener("change",p=>{this.selectedHabitId=p.target.value,this.render(t)}),t.querySelectorAll(".filter-btn").forEach(p=>{p.addEventListener("click",()=>{this.selectedTimeframe=p.dataset.timeframe,this.render(t)})})}}function ht(n,t){if(!n)return;n.innerHTML="";const e=600,a=240,s={top:30,right:20,bottom:40,left:40},o=e-s.left-s.right,i=a-s.top-s.bottom,r=Math.min(42,Math.floor(o/t.length)-16),l=Math.floor((o-r*t.length)/(t.length+1));let d="",v="";[0,25,50,75,100].forEach(m=>{const c=s.top+i-m/100*i;v+=`
      <line x1="${s.left}" y1="${c}" x2="${e-s.right}" y2="${c}" 
            stroke="var(--border-subtle)" stroke-dasharray="${m===0?"none":"4 4"}" stroke-width="1" />
      <text x="${s.left-8}" y="${c+4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">${m}%</text>
    `}),t.forEach((m,c)=>{const u=s.left+l+c*(r+l),h=Math.max(4,m.percentage/100*i),x=s.top+i-h,g=c===t.length-1,w=g?"url(#barGradientActive)":"url(#barGradientNormal)";d+=`
      <g class="chart-bar-group" data-tooltip="${m.shortDate}: ${m.completed}/${m.total} habits (${m.percentage}%)">
        <!-- Background track -->
        <rect x="${u}" y="${s.top}" width="${r}" height="${i}" rx="6" fill="var(--surface-hover)" opacity="0.5" />
        <!-- Filled bar -->
        <rect class="bar-rect" x="${u}" y="${x}" width="${r}" height="${h}" rx="6" fill="${w}">
          <animate attributeName="height" from="0" to="${h}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="y" from="${s.top+i}" to="${x}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </rect>
        <!-- Value label on top -->
        <text x="${u+r/2}" y="${x-8}" fill="${g?"var(--accent-primary)":"var(--text-secondary)"}" 
              font-size="11" font-weight="600" text-anchor="middle" font-family="var(--font-mono)">
          ${m.percentage}%
        </text>
        <!-- X-axis label -->
        <text x="${u+r/2}" y="${a-s.bottom+20}" fill="${g?"var(--accent-primary)":"var(--text-muted)"}" 
              font-size="12" font-weight="${g?"700":"500"}" text-anchor="middle">
          ${m.label}
        </text>
      </g>
    `});const y=`
    <svg viewBox="0 0 ${e} ${a}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#1D4ED8" />
        </linearGradient>
        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      ${v}
      ${d}
    </svg>
  `;n.innerHTML=y}function vt(n,t){if(!n)return;n.innerHTML="";const e=600,a=220,s={top:30,right:30,bottom:40,left:45},o=e-s.left-s.right,i=a-s.top-s.bottom;let r="";if([0,50,100].forEach(c=>{const u=s.top+i-c/100*i;r+=`
      <line x1="${s.left}" y1="${u}" x2="${e-s.right}" y2="${u}" 
            stroke="var(--border-subtle)" stroke-dasharray="${c===0?"none":"4 4"}" stroke-width="1" />
      <text x="${s.left-8}" y="${u+4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">${c}%</text>
    `}),t.length===0)return;const l=t.map((c,u)=>{const h=s.left+u/Math.max(1,t.length-1)*o,x=s.top+i-c.percentage/100*i;return{x:h,y:x,data:c}});let d=`M ${l[0].x} ${l[0].y}`;for(let c=0;c<l.length-1;c++){const u=l[c],h=l[c+1],x=u.x+(h.x-u.x)/2,g=u.y,w=u.x+(h.x-u.x)/2,p=h.y;d+=` C ${x} ${g}, ${w} ${p}, ${h.x} ${h.y}`}const v=`${d} L ${l[l.length-1].x} ${s.top+i} L ${l[0].x} ${s.top+i} Z`;let y="";l.forEach((c,u)=>{y+=`
      <circle cx="${c.x}" cy="${c.y}" r="5" fill="var(--accent-indigo)" stroke="var(--surface-primary)" stroke-width="2.5" />
      <text x="${c.x}" y="${c.y-12}" fill="var(--text-primary)" font-size="11" font-weight="600" text-anchor="middle" font-family="var(--font-mono)">
        ${c.data.percentage}%
      </text>
      <text x="${c.x}" y="${a-s.bottom+20}" fill="var(--text-muted)" font-size="12" text-anchor="middle">
        ${c.data.label}
      </text>
    `});const m=`
    <svg viewBox="0 0 ${e} ${a}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#6366F1" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${r}
      <path d="${v}" fill="url(#areaGradient)" />
      <path d="${d}" fill="none" stroke="#6366F1" stroke-width="3.5" stroke-linecap="round" />
      ${y}
    </svg>
  `;n.innerHTML=m}function ut(n,t){if(!n)return;n.innerHTML="";const e=t.map(a=>`
      <div class="habit-stat-row">
        <div class="stat-habit-info">
          <span class="stat-habit-icon">${a.icon}</span>
          <div class="stat-habit-names">
            <span class="stat-habit-title">${a.name}</span>
            <span class="stat-habit-category badge-category" style="--cat-color: ${a.color}">${a.category}</span>
          </div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-progress-bar">
            <div class="stat-progress-fill" style="width: ${a.completionRate}%; background-color: ${a.color}"></div>
          </div>
          <span class="stat-percentage font-mono">${a.completionRate}%</span>
        </div>

        <div class="stat-streak-pill">
          <span class="streak-icon">🔥</span>
          <span class="font-mono">${a.currentStreak}d</span>
          <span class="best-badge font-mono" title="Best streak">★ ${a.longestStreak}</span>
        </div>
      </div>
    `).join("");n.innerHTML=e}class yt{render(t){const e=b.getHabits(),a=b.getRecords(),s=D(),o=Q(e,a,s),i=o.mostConsistentHabit;t.innerHTML=`
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>📊</span>
              <span>Performance Analytics</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Data-driven insights on your daily discipline and habit consistency.
            </p>
          </div>
        </div>

        <!-- Highlight & Key Insights Cards -->
        <div class="metrics-grid">
          <!-- Most Consistent Habit Card -->
          <div class="metric-card card-hover" style="border-color: rgba(16, 185, 129, 0.35); background: linear-gradient(135deg, var(--surface-primary) 0%, rgba(16, 185, 129, 0.06) 100%);">
            <div class="metric-header">
              <span class="metric-label">Most Consistent Habit</span>
              <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.15);">💎</span>
            </div>
            <div style="margin-top: 4px;">
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span>${i?i.icon:"🎯"}</span>
                <span>${i?i.name:"No data yet"}</span>
              </div>
              <span class="metric-sub font-mono">
                ${i?`${i.totalCompletedDays} days · ${i.completionRate}% rate`:"Start tracking"}
              </span>
            </div>
          </div>

          <!-- Total Active Days -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Total Active Days</span>
              <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">📅</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${o.globalStreaks.totalCompletedDays}</span>
              <span class="metric-sub">distinct days logged</span>
            </div>
          </div>

          <!-- Current vs Best Streak -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Current vs Best Streak</span>
              <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${o.globalStreaks.currentStreak}d</span>
              <span class="metric-sub font-mono">/ ★ ${o.globalStreaks.longestStreak}d best</span>
            </div>
          </div>

          <!-- Overall Consistency -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Overall Consistency</span>
              <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">🎯</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${o.overallConsistencyRate}%</span>
              <span class="metric-sub">completion ratio</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid (2 columns on desktop) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <!-- Weekly Completion Chart -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Weekly Completion Rate</h3>
                <span style="font-size: 0.82rem; color: var(--text-secondary);">Daily percentage over the past 7 days</span>
              </div>
              <span class="badge-category font-mono" style="--cat-color: var(--accent-emerald);">Last 7 Days</span>
            </div>
            <div id="chart-weekly-container" style="width: 100%;"></div>
          </div>

          <!-- Monthly Trendline Chart -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">4-Week Consistency Trend</h3>
                <span style="font-size: 0.82rem; color: var(--text-secondary);">Weekly aggregate performance trajectory</span>
              </div>
              <span class="badge-category font-mono" style="--cat-color: var(--accent-indigo);">Past 4 Weeks</span>
            </div>
            <div id="chart-monthly-container" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Habit-wise Completion Breakdown -->
        <div class="card" style="padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Habit-Wise Completion Breakdown</h3>
              <span style="font-size: 0.85rem; color: var(--text-secondary);">Compare completion percentage and streaks across all habits</span>
            </div>
            <span class="font-mono" style="font-size: 0.85rem; color: var(--text-muted);">${e.length} Habits</span>
          </div>

          <div id="chart-habits-breakdown"></div>
        </div>
      </div>
    `;const r=t.querySelector("#chart-weekly-container");r&&ht(r,o.weeklyChartData);const l=t.querySelector("#chart-monthly-container");l&&vt(l,o.monthlyWeeksData);const d=t.querySelector("#chart-habits-breakdown");d&&ut(d,o.habitStats)}}class gt{constructor(){this.selectedCategory="All"}render(t){const e=b.getHabits(),a=b.getRecords(),s=b.getAchievements(),o=I(e,a),{badges:i}=Z({habits:e,records:a,globalStreak:o},s),r=i.filter(m=>m.unlocked).length,l=i.length,d=Math.round(r/l*100),v=["All","Streak","Milestone","Perfection","Discipline"],y=this.selectedCategory==="All"?i:i.filter(m=>m.category===this.selectedCategory);t.innerHTML=`
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>🏆</span>
              <span>Achievements & Milestones</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Unlock badges and level up your consistency discipline.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="topbar-stat-pill font-mono" style="font-size: 0.95rem; border-color: rgba(245, 158, 11, 0.4);">
              <span>🔥</span>
              <span>${r} / ${l} Unlocked (${d}%)</span>
            </div>
          </div>
        </div>

        <!-- Overall Badge Progress Bar -->
        <div class="card" style="padding: 18px 24px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Mastery Progress</span>
            <span class="font-mono" style="font-size: 0.85rem; font-weight: 700; color: var(--accent-amber);">${d}%</span>
          </div>
          <div class="stat-progress-bar" style="height: 10px;">
            <div class="stat-progress-fill" style="width: ${d}%; background: linear-gradient(90deg, #F59E0B 0%, #10B981 100%);"></div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="category-chips" style="margin-bottom: 24px;">
          ${v.map(m=>`
            <button class="category-chip ${this.selectedCategory===m?"selected":""}" data-cat="${m}">
              ${m}
            </button>
          `).join("")}
        </div>

        <!-- Badges Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;">
          ${y.map(m=>{const c=m.unlocked,u=Math.min(100,Math.round(m.progress/m.max*100));return`
              <div class="card card-hover" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; border-color: ${c?"rgba(245, 158, 11, 0.4)":"var(--border-subtle)"}; background: ${c?"linear-gradient(135deg, var(--surface-primary) 0%, rgba(245, 158, 11, 0.05) 100%)":"var(--surface-primary)"}; opacity: ${c?"1":"0.85"};">
                <div style="display: flex; align-items: flex-start; gap: 14px;">
                  <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: ${c?"rgba(245, 158, 11, 0.15)":"var(--surface-secondary)"}; border: 1.5px solid ${c?"var(--accent-amber)":"var(--border-subtle)"}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; filter: ${c?"none":"grayscale(1) opacity(0.5)"}; box-shadow: ${c?"0 4px 12px rgba(245, 158, 11, 0.25)":"none"};">
                    ${m.icon}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${m.title}</h4>
                      ${c?'<span style="color: var(--accent-amber); font-size: 0.9rem;">✓</span>':""}
                    </div>
                    <span class="badge-category font-mono" style="--cat-color: #6366F1; font-size: 0.7rem;">${m.category}</span>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${m.description}</p>
                  </div>
                </div>

                <!-- Progress / Status Footer -->
                <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                  ${c?`
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span class="badge-category font-mono" style="--cat-color: var(--accent-amber); background: rgba(245, 158, 11, 0.12); font-size: 0.75rem;">
                        UNLOCKED 🏆
                      </span>
                      <span class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">
                        ${m.unlockedAt?L(m.unlockedAt.split("T")[0],"short"):"Achieved"}
                      </span>
                    </div>
                  `:`
                    <div>
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">In Progress</span>
                        <span class="font-mono" style="font-size: 0.75rem; color: var(--text-secondary);">${m.progress} / ${m.max}</span>
                      </div>
                      <div class="stat-progress-bar" style="height: 6px;">
                        <div class="stat-progress-fill" style="width: ${u}%; background-color: var(--accent-indigo);"></div>
                      </div>
                    </div>
                  `}
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,t.querySelectorAll(".category-chip").forEach(m=>{m.addEventListener("click",()=>{this.selectedCategory=m.dataset.cat,this.render(t)})})}}const bt=["💻","📚","🌅","🧘","🥗","❤️","📵","💧","🏃","🏋️","🎯","⚡","🧠","🧩","🚀","📝","🥑","🚴","📖","✨"];class ft{constructor(){this.root=null,this.currentEditingId=null,this.selectedEmoji="🎯",this.selectedCategory="Coding",this.selectedColor="#6366F1",this.ensureRoot()}ensureRoot(){let t=document.getElementById("habit-modal-root");t||(t=document.createElement("div"),t.id="habit-modal-root",document.body.appendChild(t)),this.root=t}open(t=null){this.currentEditingId=t?t.id:null,this.selectedEmoji=t?t.icon:"🎯",this.selectedCategory=t?t.category:"Coding",this.selectedColor=t&&t.color||"#6366F1";const e=!!t,a=e?"Edit Habit":"Create New Habit";this.root.innerHTML=`
      <div class="modal-overlay active" id="habit-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">${a}</h3>
            <button class="icon-btn" id="btn-close-modal">✕</button>
          </div>

          <form id="habit-form">
            <div class="modal-body">
              <!-- Habit Name -->
              <div class="form-group">
                <label class="form-label" for="input-habit-name">Habit Name *</label>
                <input type="text" id="input-habit-name" class="form-input" 
                       placeholder="e.g. Read 20 Pages, Drink 3L Water" required 
                       value="${t?t.name:""}" />
              </div>

              <!-- Emoji Selection -->
              <div class="form-group">
                <label class="form-label">Icon / Emoji</label>
                <div class="emoji-picker-row" id="emoji-picker-row">
                  ${bt.map(d=>`
                    <button type="button" class="emoji-opt-btn ${this.selectedEmoji===d?"selected":""}" data-emoji="${d}">
                      ${d}
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label" for="select-habit-category">Category</label>
                <select id="select-habit-category" class="form-select">
                  ${U.map(d=>`
                    <option value="${d.id}" ${this.selectedCategory===d.id?"selected":""}>
                      ${d.icon} ${d.label}
                    </option>
                  `).join("")}
                </select>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label" for="textarea-habit-desc">Short Description / Cue</label>
                <textarea id="textarea-habit-desc" class="form-textarea" rows="2" 
                          placeholder="Why is this habit important? When will you do it?">${t&&t.description||""}</textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-habit">
                ${e?"Save Changes":"Create Habit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;const s=this.root.querySelector("#habit-modal-overlay"),o=this.root.querySelector("#btn-close-modal"),i=this.root.querySelector("#btn-cancel-modal"),r=this.root.querySelector("#habit-form"),l=()=>{s.classList.remove("active"),setTimeout(()=>{this.root.innerHTML=""},200)};o.addEventListener("click",l),i.addEventListener("click",l),s.addEventListener("click",d=>{d.target===s&&l()}),this.root.querySelectorAll(".emoji-opt-btn").forEach(d=>{d.addEventListener("click",()=>{this.selectedEmoji=d.dataset.emoji,this.root.querySelectorAll(".emoji-opt-btn").forEach(v=>v.classList.remove("selected")),d.classList.add("selected")})}),r.addEventListener("submit",d=>{d.preventDefault();const v=this.root.querySelector("#input-habit-name").value.trim(),y=this.root.querySelector("#textarea-habit-desc").value.trim(),m=this.root.querySelector("#select-habit-category").value;if(!v)return;const c=U.find(h=>h.id===m),u=c?c.color:"#6366F1";this.currentEditingId?b.updateHabit(this.currentEditingId,{name:v,icon:this.selectedEmoji,category:m,description:y,color:u}):b.addHabit({name:v,icon:this.selectedEmoji,category:m,description:y,color:u}),l()}),setTimeout(()=>{const d=this.root.querySelector("#input-habit-name");d&&d.focus()},100)}}const V=new ft;class xt{render(t){const e=b.getHabits(),a=b.getRecords(),s=D();t.innerHTML=`
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>✅</span>
              <span>Manage Habits</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Customize your daily routine, enable/disable habits, or add new challenges.
            </p>
          </div>

          <button class="btn btn-primary" id="btn-manage-add-habit">
            <span>+</span>
            <span>New Habit</span>
          </button>
        </div>

        <!-- Habits List Container -->
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 20px;">
          ${e.length===0?`
            <div class="empty-state">
              <span class="empty-icon">🌱</span>
              <h4 class="empty-title">No habits created yet</h4>
              <p class="empty-text">Click "New Habit" above to add your first daily discipline.</p>
            </div>
          `:e.map(i=>{const r=q(i.id,a,i.createdAt,s),l=i.enabled!==!1;return`
              <div class="card card-hover" style="padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-left: 4px solid ${i.color||"var(--accent-indigo)"}; opacity: ${l?"1":"0.6"};">
                <div style="display: flex; align-items: center; gap: 16px; min-width: 260px;">
                  <div class="habit-icon-box" style="font-size: 1.5rem;">
                    ${i.icon}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${i.name}</h4>
                      <span class="badge-category" style="--cat-color: ${i.color||"var(--accent-indigo)"}; font-size: 0.72rem;">
                        ${i.category}
                      </span>
                      ${l?"":'<span class="badge-category font-mono" style="--cat-color: #64748B; background: rgba(100, 116, 139, 0.15);">Disabled</span>'}
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${i.description||"No description provided."}</p>
                  </div>
                </div>

                <!-- Stats summary -->
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="streak-tag ${r.currentStreak>0?"pulse":""}" title="Current Streak">
                    <span>🔥</span>
                    <span class="font-mono">${r.currentStreak}d</span>
                  </div>

                  <span class="font-mono" style="font-size: 0.82rem; color: var(--text-muted);" title="Best Streak">
                    ★ Best: ${r.longestStreak}d
                  </span>

                  <span class="font-mono" style="font-size: 0.82rem; color: var(--text-secondary);" title="Total Completed Days">
                    ✓ ${r.totalCompletedDays} days
                  </span>
                </div>

                <!-- Actions -->
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn btn-secondary btn-edit-habit" data-id="${i.id}" title="Edit habit details">
                    ✏️ Edit
                  </button>

                  <button class="btn btn-secondary btn-toggle-enable-habit" data-id="${i.id}" title="${l?"Disable habit temporarily":"Enable habit"}">
                    ${l?"⏸️ Pause":"▶️ Resume"}
                  </button>

                  <button class="btn btn-danger btn-delete-habit" data-id="${i.id}" data-name="${i.name}" title="Delete habit and history">
                    🗑️
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- Delete Confirmation Modal Root -->
      <div id="delete-confirm-root"></div>
    `;const o=t.querySelector("#btn-manage-add-habit");o&&o.addEventListener("click",()=>V.open()),t.querySelectorAll(".btn-edit-habit").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id,l=e.find(d=>d.id===r);l&&V.open(l)})}),t.querySelectorAll(".btn-toggle-enable-habit").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id;b.toggleHabitEnabled(r)})}),t.querySelectorAll(".btn-delete-habit").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.id,l=i.dataset.name;this.confirmDelete(r,l)})})}confirmDelete(t,e){const a=document.getElementById("delete-confirm-root");if(!a)return;a.innerHTML=`
      <div class="modal-overlay active" id="delete-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title" style="color: var(--accent-rose);">Delete Habit</h3>
            <button class="icon-btn" id="btn-close-delete-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-primary); font-size: 1rem;">
              Are you sure you want to permanently delete <strong>"${e}"</strong>?
            </p>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 8px;">
              This will remove all historical streak and completion records for this habit. This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-delete">Cancel</button>
            <button class="btn btn-danger" id="btn-confirm-delete">Yes, Delete Habit</button>
          </div>
        </div>
      </div>
    `;const s=a.querySelector("#delete-modal-overlay"),o=a.querySelector("#btn-close-delete-modal"),i=a.querySelector("#btn-cancel-delete"),r=a.querySelector("#btn-confirm-delete"),l=()=>{s.classList.remove("active"),setTimeout(()=>{a.innerHTML=""},200)};o.addEventListener("click",l),i.addEventListener("click",l),s.addEventListener("click",d=>{d.target===s&&l()}),r.addEventListener("click",()=>{b.deleteHabit(t),l()})}}class kt{render(t){const e=b.getSettings();t.innerHTML=`
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>⚙️</span>
              <span>Preferences & Data Management</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Manage your appearance, notifications, backup, and storage.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
          <!-- Appearance & Audio Card -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);">
              Appearance & Feedback
            </h3>

            <!-- Theme Switcher -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Application Theme</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Toggle between Carbon Dark and Slate Light mode</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn ${e.theme==="dark"?"btn-primary":"btn-secondary"} btn-theme-choice font-mono" data-theme="dark">
                  🌙 Dark Mode
                </button>
                <button class="btn ${e.theme==="light"?"btn-primary":"btn-secondary"} btn-theme-choice font-mono" data-theme="light">
                  ☀️ Light Mode
                </button>
              </div>
            </div>

            <!-- Sound Effects Switch -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Productivity Audio Effects</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Synthesized crystal chimes on habit completion and achievements</div>
              </div>
              <button class="btn ${e.soundEnabled?"btn-primary":"btn-secondary"} font-mono" id="btn-toggle-sound">
                ${e.soundEnabled?"🔔 Enabled":"🔕 Muted"}
              </button>
            </div>

            <!-- Notifications Preference -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Daily Consistency Reminders</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Receive in-browser reminders to protect your active streaks</div>
              </div>
              <button class="btn ${e.notificationsEnabled?"btn-primary":"btn-secondary"} font-mono" id="btn-toggle-notifs">
                ${e.notificationsEnabled?"✓ Enabled":"✕ Disabled"}
              </button>
            </div>
          </div>

          <!-- Quick Sample Demo Data Card -->
          <div class="card" style="padding: 24px; border-color: rgba(99, 102, 241, 0.3); background: linear-gradient(135deg, var(--surface-primary) 0%, rgba(99, 102, 241, 0.04) 100%);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                  <span>🚀</span>
                  <span>Explore Demo Consistency Data</span>
                </div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
                  Instantly populate 35 days of active habit data to preview the full contribution calendar heatmap, weekly/monthly analytics, and unlock gamified badges.
                </div>
              </div>

              <button class="btn btn-primary font-mono" id="btn-load-sample-data" style="flex-shrink: 0;">
                Load 35-Day Demo Data
              </button>
            </div>
          </div>

          <!-- Backup & Migration Card -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);">
              Backup & Restore
            </h3>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Export Data (JSON)</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Download a complete backup of your habits, records, streaks, and settings</div>
              </div>
              <button class="btn btn-secondary font-mono" id="btn-export-data">
                📥 Export Backup
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Import Data (JSON)</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Restore your habit history from a previously saved JSON file</div>
              </div>
              <div>
                <input type="file" id="input-import-file" accept=".json" style="display: none;" />
                <button class="btn btn-secondary font-mono" id="btn-trigger-import">
                  📤 Import Backup
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone Card -->
          <div class="card" style="padding: 24px; border-color: rgba(244, 63, 94, 0.35);">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--accent-rose);">
              Danger Zone
            </h3>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Reset Today's Progress</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Clear all completions logged for today without losing your historical streaks</div>
              </div>
              <button class="btn btn-danger font-mono" id="btn-reset-today">
                Reset Today
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Clear All Application Data</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Reset all habits, streaks, history, and achievements back to initial defaults</div>
              </div>
              <button class="btn btn-danger font-mono" id="btn-clear-all">
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Confirmation Modal Root -->
      <div id="settings-confirm-root"></div>
    `,t.querySelectorAll(".btn-theme-choice").forEach(y=>{y.addEventListener("click",()=>{const m=y.dataset.theme;b.updateSettings({theme:m}),this.render(t)})});const a=t.querySelector("#btn-toggle-sound");a&&a.addEventListener("click",()=>{const y=b.getSettings().soundEnabled;b.updateSettings({soundEnabled:!y}),this.render(t)});const s=t.querySelector("#btn-toggle-notifs");s&&s.addEventListener("click",()=>{const y=b.getSettings().notificationsEnabled;!y&&"Notification"in window?Notification.requestPermission().then(m=>{b.updateSettings({notificationsEnabled:m==="granted"}),this.render(t)}):(b.updateSettings({notificationsEnabled:!y}),this.render(t))});const o=t.querySelector("#btn-load-sample-data");o&&o.addEventListener("click",()=>{b.loadSampleData(),alert("🎉 35 days of consistency data loaded! Check out your Calendar Heatmap and Statistics!")});const i=t.querySelector("#btn-export-data");i&&i.addEventListener("click",()=>{const y=b.exportData(),m=new Blob([y],{type:"application/json"}),c=URL.createObjectURL(m),u=document.createElement("a");u.href=c,u.download=`habitcode-backup-${new Date().toISOString().split("T")[0]}.json`,u.click(),URL.revokeObjectURL(c)});const r=t.querySelector("#btn-trigger-import"),l=t.querySelector("#input-import-file");r&&l&&(r.addEventListener("click",()=>l.click()),l.addEventListener("change",y=>{const m=y.target.files[0];if(!m)return;const c=new FileReader;c.onload=u=>{const h=b.importData(u.target.result);h.success?(alert("✓ HabitCode data imported successfully!"),this.render(t)):alert("✕ Error importing file: "+h.error)},c.readAsText(m)}));const d=t.querySelector("#btn-reset-today");d&&d.addEventListener("click",()=>{this.openConfirmModal({title:"Reset Today's Progress",message:"Are you sure you want to uncheck all habits completed today?",confirmText:"Yes, Reset Today",onConfirm:()=>b.resetTodayProgress()})});const v=t.querySelector("#btn-clear-all");v&&v.addEventListener("click",()=>{this.openConfirmModal({title:"Clear All Application Data",message:"Warning: This will permanently delete all your habit logs, streaks, and achievements. Return to factory state?",confirmText:"Yes, Clear Everything",onConfirm:()=>b.clearAllData()})})}openConfirmModal({title:t,message:e,confirmText:a,onConfirm:s}){const o=document.getElementById("settings-confirm-root");if(!o)return;o.innerHTML=`
      <div class="modal-overlay active" id="settings-confirm-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title" style="color: var(--accent-rose);">${t}</h3>
            <button class="icon-btn" id="btn-close-settings-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-primary); font-size: 0.95rem;">${e}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-settings">Cancel</button>
            <button class="btn btn-danger" id="btn-action-settings">${a}</button>
          </div>
        </div>
      </div>
    `;const i=o.querySelector("#settings-confirm-overlay"),r=o.querySelector("#btn-close-settings-modal"),l=o.querySelector("#btn-cancel-settings"),d=o.querySelector("#btn-action-settings"),v=()=>{i.classList.remove("active"),setTimeout(()=>{o.innerHTML=""},200)};r.addEventListener("click",v),l.addEventListener("click",v),i.addEventListener("click",y=>{y.target===i&&v()}),d.addEventListener("click",()=>{s(),v()})}}class wt{constructor(){this.currentViewId="dashboard",this.views={dashboard:new dt({onOpenHabitModal:()=>V.open()}),"my-habits":new xt,calendar:new pt,history:new mt,statistics:new yt,achievements:new gt,settings:new kt},this.navComponent=new it({onNavigate:t=>this.switchView(t)}),this.init()}init(){const t=document.getElementById("sidebar-container"),e=document.getElementById("mobile-nav-container"),a=document.getElementById("topbar-container");t&&this.navComponent.renderSidebar(t),e&&this.navComponent.renderMobileBottomBar(e),a&&this.navComponent.renderTopBar(a);const s=window.location.hash.replace("#","");s&&this.views[s]&&(this.currentViewId=s),this.renderCurrentView(),window.addEventListener("hashchange",()=>{const o=window.location.hash.replace("#","");o&&this.views[o]&&o!==this.currentViewId&&this.switchView(o,!1)}),b.subscribe((o,i)=>{this.renderCurrentView(),a&&this.navComponent.renderTopBar(a),t&&this.navComponent.updateHeaderStats(),i!=null&&i.newAchievements&&i.newAchievements.length>0&&i.newAchievements.forEach(r=>this.showAchievementToast(r)),o==="ACHIEVEMENTS_UPDATED"&&(i!=null&&i.newlyUnlocked)&&i.newlyUnlocked.forEach(r=>this.showAchievementToast(r))})}switchView(t,e=!0){this.views[t]&&(this.currentViewId=t,e&&(window.location.hash=t),this.renderCurrentView())}renderCurrentView(){const t=document.getElementById("content-viewport");if(!t)return;const e=this.views[this.currentViewId];e&&typeof e.render=="function"&&e.render(t)}showAchievementToast(t){b.getSettings().soundEnabled&&P.playAchievement(),X(window.innerWidth/2,window.innerHeight/3,50);let a=document.getElementById("global-toast-container");a||(a=document.createElement("div"),a.id="global-toast-container",a.className="toast-container",document.body.appendChild(a));const s=document.createElement("div");s.className="toast-item toast-achievement",s.innerHTML=`
      <div style="font-size: 1.8rem;">${t.icon}</div>
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-amber); text-transform: uppercase;">
          Achievement Unlocked! 🏆
        </div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">
          ${t.title}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          ${t.description}
        </div>
      </div>
    `,a.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(20px)",s.style.transition="all 0.3s ease",setTimeout(()=>s.remove(),300)},4500)}}window.addEventListener("DOMContentLoaded",()=>{new wt});

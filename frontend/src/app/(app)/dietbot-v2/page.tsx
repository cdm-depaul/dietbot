'use client';

import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import { ChatBox } from '../_components/ChatBox'; // uses your existing component
import { Chat } from '../_components/Chat';

export default function UpdatePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // When a user sends a message, append to "Recent" and bump the goal bar a bit.
  const handleSubmitQuery = useCallback((query: string, _uuid: string) => {
    const root = rootRef.current;
    if (!root) return;

    const recent = root.querySelector<HTMLDivElement>('#recentItems');
    if (recent) {
      const line = document.createElement('div');
      line.textContent = '• ' + query;
      recent.appendChild(line);
    }

    const calNow = root.querySelector<HTMLSpanElement>('#calNow');
    const goalFill = root.querySelector<HTMLDivElement>('#goalFill');
    if (calNow && goalFill) {
      const next = (parseInt(calNow.textContent || '0', 10) || 0) + 200; // light nudge
      calNow.textContent = String(next);
      const pct = Math.min((next / 1850) * 100, 100);
      goalFill.style.width = `${pct.toFixed(0)}%`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current!;
    const byId = (id: string) => root.querySelector<HTMLElement>('#' + id)!;

    // ====== Dynamic greeting ======
    const greet = byId('greet');
    const title = byId('titleTime');
    const h = new Date().getHours();
    let txt = 'Welcome!'; let titleTxt = 'What should we eat?';
    if (h < 12) { txt = 'Good morning ☀️'; titleTxt = 'Breakfast ideas?'; }
    else if (h < 18) { txt = 'Good afternoon 🌤️'; titleTxt = 'Lunch or snacks?'; }
    else { txt = 'Good evening 🌙'; titleTxt = 'Dinner plans?'; }
    greet.textContent = txt; title.textContent = titleTxt;

    // ====== Tabs (history/favorites) ======
    root.querySelectorAll<HTMLDivElement>('.tab').forEach(t => {
      t.addEventListener('click', () => {
        root.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        root.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        root.querySelector<HTMLElement>(`#${t.dataset.tab}Panel`)?.classList.add('active');
      });
    });

    // ====== Theme controls ======
    const accentPicker = root.querySelector<HTMLInputElement>('#accentPicker')!;
    const darkToggle = root.querySelector<HTMLButtonElement>('#darkToggle')!;
    accentPicker.addEventListener('input', (e: any) => {
      document.documentElement.style.setProperty('--brand', e.target.value);
    });
    darkToggle.addEventListener('click', () => {
      const on = darkToggle.classList.toggle('on');
      darkToggle.textContent = on ? 'Light' : 'Dark';
      document.documentElement.style.setProperty('--bubble-user', on ? '#0b1220' : '#1f2937');
      document.documentElement.style.setProperty('--ink', on ? '#f3f4f6' : '#1a1a1a');
      document.body.style.filter = on ? 'invert(0.02) hue-rotate(0deg)' : 'none';
    });

    // ====== Clickable logo -> simple reset (page refresh) + bounce ======
    const homeLogo = root.querySelector<HTMLDivElement>('#homeLogo')!;
    const bounceOnce = () => {
      homeLogo.classList.add('bounce');
      setTimeout(() => {
        homeLogo.classList.remove('bounce');
        window.location.reload();
      }, 450);
    };
    homeLogo.addEventListener('click', bounceOnce);

    return () => {
      homeLogo.removeEventListener('click', bounceOnce);
    };
  }, []);

  return (
    <div ref={rootRef} className="update-root">
      <div className="app" id="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand">
            <div className="logo" id="homeLogo" title="DietBot – click to reset" aria-label="DietBot robot chef logo">
              {/* Robot Chef Head (DePaul-inspired) */}
              <svg viewBox="0 0 120 120" role="img" aria-label="DietBot robot chef logo">
                <defs>
                  <linearGradient id="hatGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#C60C30"/>
                    <stop offset="100%" stopColor="#FF7A59"/>
                  </linearGradient>
                </defs>
                <rect x="18" y="40" rx="20" ry="20" width="84" height="58" fill="#0A2A52"/>
                <rect x="22" y="45" rx="16" ry="16" width="76" height="48" fill="#0E3A75"/>
                <rect x="8" y="55" rx="8" ry="8" width="16" height="24" fill="#0A2A52"/>
                <rect x="96" y="55" rx="8" ry="8" width="16" height="24" fill="#0A2A52"/>
                <line x1="18" y1="45" x2="10" y2="30" stroke="#0A2A52" strokeWidth={6} strokeLinecap="round"/>
                <circle cx="10" cy="30" r="5" fill="#0A2A52"/>
                <line x1="102" y1="45" x2="110" y2="30" stroke="#0A2A52" strokeWidth={6} strokeLinecap="round"/>
                <circle cx="110" cy="30" r="5" fill="#0A2A52"/>
                <path d="M30 40 C 30 22, 90 22, 90 40 L 90 42 L 30 42 Z" fill="url(#hatGrad)" stroke="#0A2A52" strokeWidth={4}/>
                <path d="M44 66 c 8 -18, 20 12, 0 16 c 3 -5, 3 -7, 0 -16 z" fill="#C60C30" stroke="#0A2A52" strokeWidth={2}/>
                <ellipse cx="76" cy="76" rx="10" ry="12" fill="#5AC18E" stroke="#0A2A52" strokeWidth={2}/>
                <circle cx="76" cy="76" r="4" fill="#0A2A52"/>
                <path d="M50 88 q 10 8 20 0" stroke="#0A2A52" strokeWidth={4} fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1>DietBot</h1>
              <div className="tag" id="greet">Welcome!</div>
            </div>
          </div>

          <div className="tabs">
            <div className="tab active" data-tab="history">History</div>
            <div className="tab" data-tab="favorites">Favorites</div>
          </div>
          <div className="panels">
            <div className="panel active" id="historyPanel">
              <div className="card">
                <h3>Popular Categories</h3>
                <div className="chiprow">
                  <div className="chip" data-cat="Quick & Easy">⚡ Quick & Easy</div>
                  <div className="chip" data-cat="Hearty & Flavorful">🍲 Hearty</div>
                  <div className="chip" data-cat="Light & Fresh">🥗 Light & Fresh</div>
                  <div className="chip" data-cat="High Protein">💪 High Protein</div>
                  <div className="chip" data-cat="Vegetarian">🌿 Vegetarian</div>
                </div>
              </div>
              <div className="card" id="historyList">
                <h3>Recent</h3>
                <div id="recentItems" style={{fontSize:'.9rem',color:'var(--sub)'}}>No chats yet.</div>
              </div>
            </div>
            <div className="panel" id="favoritesPanel">
              <div className="card">
                <h3>Saved Meals</h3>
                <div id="favItems" style={{fontSize:'.9rem',color:'var(--sub)'}}>No favorites yet. Tap ♡ on a meal.</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="profile">
              <div className="avatar"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&auto=format&fit=crop" alt="user"/></div>
              <div>
                <strong>Alex Johnson</strong>
                <div className="statline">
                  <span className="pillstat">Age 34</span>
                  <span className="pillstat">BMI 22.5</span>
                  <span className="pillstat">Hydration 70%</span>
                </div>
              </div>
            </div>
            <div className="goalWrap">
              <small style={{color:'var(--sub)'}}>Daily calories</small>
              <div className="goalBar"><div className="goalFill" id="goalFill" style={{width:'35%'}}/></div>
              <div style={{display:'flex',justifyContent:'space-between',color:'var(--sub)',fontSize:'.8rem',marginTop:4}}>
                <span><b id="calNow">650</b>/1850 kcal</span>
                <span id="macroNow">P 35g • C 80g • F 22g</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT */}
        <section className="main">
          <header>
            <div className="h-left">
              <div className="status-dot" aria-hidden="true"/>
              <div>
                <div className="title" id="titleTime">What should we eat?</div>
                <div className="sub">I’ll tailor ideas to time, taste, and goals.</div>
              </div>
            </div>
            <div className="themeRow">
              <input type="color" id="accentPicker" className="color" title="Accent" defaultValue="#C60C30"/>
              <button className="btn" id="darkToggle">Dark</button>
            </div>
          </header>

          {/* subtle watermark mascot */}
          <svg className="mascot" viewBox="0 0 120 120" aria-hidden="true">
            <rect x="18" y="40" rx="20" ry="20" width="84" height="58" fill="#004B8D" opacity="0.06"/>
            <path d="M30 40 C 30 22, 90 22, 90 40 L 90 42 L 30 42 Z" fill="#C60C30" opacity="0.07"/>
            <circle cx="76" cy="76" r="10" fill="#00A3E0" opacity="0.06"/>
          </svg>

          {/* Chat list + composer inside Suspense to satisfy useSearchParams in ChatBox */}
          <Suspense fallback={<div style={{padding:16}}>Loading chat…</div>}>
            <div className="chat" style={{padding:0}}>
              <Chat className="w-full h-full" />
            </div>

            <ChatBox
              className="dietbot-v2-chat"
              disableNavigate
              onSubmitQuery={handleSubmitQuery}
            />
          </Suspense>
        </section>
      </div>

      {/* Global styles (unchanged) */}
      <style jsx global>{`
        :root{
          --dep-blue:#004B8D; --dep-navy:#0A2A52; --dep-red:#C60C30; --dep-light:#E8F1FB;
          --ink:#0e1621; --sub:#475569; --brand:var(--dep-red); --brand-2:var(--dep-blue); --accent:#00A3E0;
          --card:#ffffff; --bubble-user:#0b1220; --bubble-bot:#ffffff; --shadow: 0 10px 25px rgba(0,0,0,.12); --radius: 18px;
          --bg1:var(--dep-light); --bg2:#CFE6FF;
        }
        .update-root, .update-root * { box-sizing: border-box; }
        .update-root { min-height: 100vh; display: grid; place-items: center; color: var(--ink); }
        .update-root { background:
          radial-gradient(1200px 800px at -10% -10%, var(--bg2), transparent 60%),
          radial-gradient(1400px 900px at 110% -20%, #b7d8ff, transparent 60%),
          radial-gradient(1200px 1000px at 50% 120%, var(--dep-light), #f7fbff 60%);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji";
        }
        .app{ width:min(1200px,96vw); height: min(890px, 96vh); display:grid; grid-template-columns: 310px 1fr; gap:18px; padding:18px; }
        .sidebar{ background: linear-gradient(145deg, #fff, #f2f7ff); border-radius: var(--radius); box-shadow: var(--shadow); display:flex; flex-direction:column; padding:18px; gap:16px; overflow:hidden}
        .brand{display:flex; align-items:center; gap:12px}
        .logo{width:64px;height:64px; border-radius:14px; display:grid; place-items:center; background:#fff; box-shadow: inset 0 0 0 2px #e6eef9, 0 6px 16px rgba(10,42,82,.18); cursor:pointer;}
        .logo svg{width:56px;height:56px;}
        .brand h1{font-size:1.2rem; margin:0}
        .tag{font-size:.86rem;color:var(--sub)}
        .logo:hover{transform: translateY(-2px)}
        .bounce{animation: bounce .5s ease}
        @keyframes bounce{ 0%{transform:translateY(0)} 40%{transform:translateY(-6px)} 70%{transform:translateY(0)} 85%{transform:translateY(-3px)} 100%{transform:translateY(0)} }
        .tabs{display:flex; gap:8px;}
        .tab{flex:1; text-align:center; padding:10px; border-radius:12px; background:#fff; border:1px solid #0001; cursor:pointer; font-weight:600}
        .tab.active{background:linear-gradient(135deg,#fff,#edf4ff); border-color:#cfe0ff}
        .panels{position:relative; flex:1; overflow:auto}
        .panel{display:none}
        .panel.active{display:block}
        .chiprow{display:flex; flex-wrap:wrap; gap:10px; margin-top:8px}
        .chip{padding:8px 12px; border-radius:999px; background:#fff; border:1px dashed var(--dep-blue); cursor:pointer; transition:transform .12s ease, box-shadow .12s ease; box-shadow:0 6px 14px rgba(0,75,141,.12)}
        .chip:hover{transform:translateY(-2px)}
        .card{ background:#fff; border-radius:14px; padding:14px; box-shadow: var(--shadow); margin-top:12px }
        .card h3{margin:.2rem 0 .6rem;font-size:.95rem}
        .profile{display:flex; align-items:center; gap:12px}
        .avatar{width:56px;height:56px;border-radius:50%;overflow:hidden;border:2px solid var(--dep-blue)}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .statline{display:flex; gap:6px; flex-wrap:wrap; margin-top:6px}
        .pillstat{background:#edf4ff; padding:4px 8px; border-radius:999px; font-size:.78rem; color:var(--sub)}
        .goalWrap{margin-top:10px}
        .goalBar{height:10px; background:#0001; border-radius:999px; overflow:hidden}
        .goalFill{height:100%; width:40%; background:linear-gradient(90deg,var(--dep-red),var(--dep-blue));}
        .main{ background: rgba(255,255,255,.7); backdrop-filter: blur(6px); border-radius: var(--radius); box-shadow: var(--shadow); display:grid; grid-template-rows: auto 1fr auto; overflow:hidden; position:relative}
        header{display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid #00000010; background:linear-gradient(180deg,#f7fbff,#eaf2ff)}
        .h-left{display:flex; gap:12px; align-items:center}
        header .title{font-weight:700}
        header .sub{color:var(--sub); font-size:.9rem}
        .status-dot{width:10px;height:10px;border-radius:50%;background:var(--accent); box-shadow:0 0 0 4px #00a3e033}
        .btn{all:unset; background:var(--dep-blue); color:#fff; padding:10px 14px; border-radius:12px; cursor:pointer; box-shadow:0 8px 18px rgba(0,0,0,.12); font-weight:700}
        .themeRow{display:flex; gap:8px; align-items:center}
        .color{width:36px;height:36px;border:1px solid #0002;border-radius:10px;}
        .chat{padding:18px; overflow:auto}
        .msg{max-width:78%; padding:12px 14px; border-radius:16px; margin: 8px 0; box-shadow:0 8px 18px rgba(0,0,0,.08);} 
        .bot{background:var(--bubble-bot); border:1px solid #00000010}
        .user{background:var(--bubble-user); color:#fff; margin-left:auto}
        .time{display:block; font-size:.72rem; color:var(--sub); margin-top:6px}
        .composer{display:grid; grid-template-columns: auto 1fr auto; gap:10px; padding:14px; background:#fff; border-top:1px solid #00000012}
        .voice{all:unset; padding:0 12px; height:48px; display:grid; place-items:center; border:1px solid #0001; border-radius:14px; background:#fff}
        .composer input{height:48px; border-radius:14px; border:1px solid #00000012; padding:0 14px; font-size:1rem; outline: none; box-shadow: inset 0 1px 0 #fff6}
        .send{all:unset; background:linear-gradient(135deg,var(--dep-red),var(--dep-blue)); color:#fff; padding:0 18px; border-radius:14px; display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:700}
        .send svg{width:18px; height:18px; fill:#fff}
        .diag{padding:12px 14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size:.82rem; background:#fff; border-top:1px dashed #0002}
        @media (max-width: 1000px){ .app{grid-template-columns: 1fr; height: 100dvh;} .sidebar{display:none} }
        .mascot{position:absolute; right:14px; top:74px; width:120px; height:120px; pointer-events:none}
      `}</style>
    </div>
  );
}

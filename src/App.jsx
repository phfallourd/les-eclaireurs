import { useState, useEffect } from "react";

/* ─────────── FONTS & CSS ─────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
${FONTS}
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --white:#fff; --bg:#f4f6fb; --bg2:#eef1f8; --card:#fff;
  --blue:#1a56db; --blue-dk:#1341b5; --blue-lt:#e8effe; --blue-md:#c7d7fb;
  --violet:#7c3aed; --violet-lt:#ede9fe;
  --cyan:#0ea5e9; --cyan-lt:#e0f2fe;
  --green:#16a34a; --green-lt:#dcfce7; --green-md:#86efac;
  --orange:#f97316; --orange-lt:#fff7ed; --orange-md:#fed7aa;
  --red:#dc2626; --red-lt:#fee2e2;
  --yellow:#ca8a04; --yellow-lt:#fefce8; --yellow-md:#fde68a;
  --text:#111827; --text2:#6b7280; --text3:#9ca3af;
  --border:#e5e7eb; --border2:#d1d5db;
  --sh:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05);
  --sh-md:0 4px 6px -1px rgba(0,0,0,.10),0 2px 4px -1px rgba(0,0,0,.06);
  --sh-lg:0 10px 15px -3px rgba(0,0,0,.10),0 4px 6px -2px rgba(0,0,0,.05);
  --sh-xl:0 20px 25px -5px rgba(0,0,0,.10),0 10px 10px -5px rgba(0,0,0,.04);
  --r:12px; --rl:20px; --rf:9999px;
}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;}

/* accessibility */
:focus-visible{outline:3px solid var(--blue);outline-offset:3px;border-radius:4px;}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
a.skip-link{position:absolute;top:-100px;left:1rem;background:var(--blue);color:white;padding:.5rem 1.2rem;border-radius:var(--r);z-index:9999;font-weight:700;transition:top .2s;text-decoration:none;font-size:.9rem;}
a.skip-link:focus{top:1rem;}
::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--blue-md);border-radius:3px;}

/* keyframes */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes gshift{0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}

/* ── NAV ── */
.nav{position:fixed;top:0;inset-inline:0;z-index:200;height:68px;
  display:flex;align-items:center;justify-content:space-between;padding:0 2rem;
  background:rgba(255,255,255,.96);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);box-shadow:var(--sh);}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;background:none;border:none;}
.logo-mark{display:flex;align-items:center;}
.logo-svg{width:40px;height:40px;flex-shrink:0;}
.logo-name{font-weight:800;font-size:1.15rem;color:var(--text);letter-spacing:-.02em;}
.logo-name span{color:var(--blue);}
.nav-links{display:flex;gap:.25rem;}
.nav-btn{background:none;border:none;padding:7px 13px;border-radius:8px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;font-size:.875rem;
  color:var(--text2);cursor:pointer;transition:all .2s;}
.nav-btn:hover{background:var(--bg);color:var(--text);}
.nav-btn.active{background:var(--blue-lt);color:var(--blue);font-weight:700;}
.nav-cta{background:var(--blue);color:white;border:none;padding:9px 20px;border-radius:9px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.875rem;
  cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(26,86,219,.28);}
.nav-cta:hover{background:var(--blue-dk);transform:translateY(-1px);}
.nav-count{background:var(--blue-lt);color:var(--blue);font-family:'DM Mono',monospace;
  font-size:.65rem;font-weight:600;padding:2px 9px;border-radius:var(--rf);margin-left:4px;}

/* ── HERO ── */
.hero{padding:118px 2rem 80px;position:relative;overflow:hidden;
  background:linear-gradient(160deg,#fff 0%,#eef2ff 45%,#f0fdf4 80%,#fff 100%);
  background-size:300% 300%;animation:gshift 12s ease infinite;}
.blob{position:absolute;border-radius:50%;pointer-events:none;}
.blob-1{width:600px;height:600px;top:-150px;right:-100px;
  background:radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%);}
.blob-2{width:500px;height:500px;bottom:-200px;left:-100px;
  background:radial-gradient(circle,rgba(26,86,219,.06) 0%,transparent 70%);}
.hero-inner{max-width:1280px;margin:0 auto;display:grid;
  grid-template-columns:1fr 1fr;gap:5rem;align-items:center;position:relative;z-index:1;}
.hero-left{animation:fadeUp .7s ease both;}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:var(--green-lt);
  color:var(--green);border:1px solid var(--green-md);border-radius:var(--rf);
  padding:5px 14px;font-size:.78rem;font-weight:700;margin-bottom:1.5rem;}
.live-dot{width:7px;height:7px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.hero-h1{font-size:clamp(2.2rem,4vw,3.5rem);font-weight:800;line-height:1.1;
  letter-spacing:-.03em;margin-bottom:1.25rem;}
.hero-h1 .grad{background:linear-gradient(135deg,var(--blue),var(--violet));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero-desc{font-size:1.05rem;color:var(--text2);line-height:1.75;max-width:500px;margin-bottom:2rem;}
.hero-stats{display:flex;gap:0;margin-bottom:2.5rem;background:white;
  border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);}
.stat-item{flex:1;padding:1rem 1.25rem;text-align:center;border-right:1px solid var(--border);}
.stat-item:last-child{border-right:none;}
.stat-num{font-size:1.6rem;font-weight:800;letter-spacing:-.03em;
  background:linear-gradient(135deg,var(--blue),var(--violet));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.stat-label{font-size:.68rem;color:var(--text2);font-weight:500;margin-top:2px;line-height:1.3;}
.hero-btns{display:flex;gap:1rem;flex-wrap:wrap;}
.trust-bar{display:flex;align-items:center;gap:.9rem;flex-wrap:wrap;margin-top:1.2rem;}
.trust-item{display:flex;align-items:center;gap:.42rem;font-size:.78rem;color:var(--text2);}
.trust-item strong{color:var(--text);font-weight:800;}
.trust-sep{width:1px;height:16px;background:var(--border);flex-shrink:0;}
.trust-excellent{font-weight:800;font-size:.78rem;color:var(--text);text-decoration:underline;text-underline-offset:2px;}
.trust-stars{display:flex;align-items:center;gap:1px;}
.trust-star{font-size:.95rem;line-height:1;}
.trust-star.full{color:#00B67A;}
.trust-star.half{color:var(--border2);position:relative;display:inline-block;}
.trust-star.half::after{content:'★';position:absolute;left:0;top:0;color:#00B67A;clip-path:inset(0 45% 0 0);}
.btn-primary{background:linear-gradient(135deg,var(--blue),var(--blue-dk));color:white;
  border:none;padding:13px 28px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:.95rem;cursor:pointer;transition:all .25s;
  display:inline-flex;align-items:center;gap:8px;
  box-shadow:0 4px 15px rgba(26,86,219,.35);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(26,86,219,.45);}
.btn-secondary{background:white;color:var(--text);border:1.5px solid var(--border2);
  padding:13px 28px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:600;font-size:.95rem;cursor:pointer;transition:all .25s;}
.btn-secondary:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-lt);}

/* hero photo */
.hero-right{position:relative;animation:fadeUp .7s ease .15s both;}
.hero-photo-wrap{position:relative;border-radius:var(--rl);overflow:visible;}
.hero-img{width:100%;height:430px;object-fit:cover;border-radius:var(--rl);
  box-shadow:var(--sh-xl);display:block;}
.corner{position:absolute;width:44px;height:44px;z-index:2;}
.corner-tl{top:-10px;left:-10px;border-top:3px solid var(--blue);border-left:3px solid var(--blue);border-radius:6px 0 0 0;}
.corner-br{bottom:-10px;right:-10px;border-bottom:3px solid var(--violet);border-right:3px solid var(--violet);border-radius:0 0 6px 0;}
.fcard{position:absolute;z-index:3;background:white;border-radius:var(--r);
  padding:.9rem 1.1rem;box-shadow:var(--sh-xl);border:1.5px solid var(--border);
  animation:float 4s ease-in-out infinite;}
.fc1{bottom:16px;left:-28px;width:200px;}
.fc2{top:16px;left:-28px;width:180px;animation-delay:.8s;}
.fc3{bottom:16px;right:-28px;width:160px;animation-delay:1.6s;}
.fc-head{display:flex;align-items:center;gap:7px;margin-bottom:5px;}
.fc-ico{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.85rem;}
.fc-lbl{font-size:.61rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;}
.fc-val{font-weight:800;font-size:1.3rem;color:var(--text);line-height:1;}
.fc-sub{font-size:.62rem;color:var(--text2);margin-top:2px;}
.fc-bar{height:4px;background:var(--bg2);border-radius:2px;margin-top:8px;overflow:hidden;}
.fc-fill{height:100%;border-radius:2px;}
.fc-live-row{display:flex;align-items:center;gap:6px;}
.fc-live-dot{width:8px;height:8px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}

/* ── LOGOS BAND ── */
.logos-band{background:white;border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  padding:1.4rem 2rem;}
.logos-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;
  gap:2rem;flex-wrap:wrap;}
.logos-label{font-size:.7rem;font-weight:700;color:var(--text2);white-space:nowrap;
  flex-shrink:0;text-transform:uppercase;letter-spacing:.07em;}
.logos-sep{width:1px;height:28px;background:var(--border);flex-shrink:0;}
.logos-row{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
.logo-pill{display:flex;align-items:center;gap:8px;padding:7px 16px;
  border-radius:var(--rf);border:1.5px solid var(--border);cursor:pointer;
  transition:all .2s;background:white;min-height:40px;}
.logo-pill:hover{border-color:var(--blue);background:var(--blue-lt);box-shadow:var(--sh);}
.logo-pill img{height:22px;width:auto;object-fit:contain;max-width:90px;}
.logo-pill-txt{font-size:.7rem;font-weight:700;color:var(--text2);}
.logo-pill:hover .logo-pill-txt{color:var(--blue);}

/* ── PAGE BANNER ── */
.page-banner{padding:100px 2rem 60px;
  background:linear-gradient(135deg,#1a56db 0%,#7c3aed 55%,#0ea5e9 100%);
  background-size:200% 200%;animation:gshift 8s ease infinite;
  position:relative;overflow:hidden;}
.page-banner::before{content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px);
  background-size:28px 28px;pointer-events:none;}
.page-banner::after{content:'';position:absolute;bottom:0;left:0;right:0;
  height:40px;background:var(--bg);clip-path:ellipse(55% 100% at 50% 100%);}
.banner-inner{max-width:1280px;margin:0 auto;position:relative;z-index:1;}
.banner-chip{display:inline-flex;align-items:center;gap:6px;
  background:rgba(255,255,255,.15);backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.25);border-radius:var(--rf);
  color:white;font-size:.7rem;font-weight:700;padding:5px 14px;margin-bottom:1.2rem;
  letter-spacing:.05em;text-transform:uppercase;}
.banner-dot{width:6px;height:6px;background:rgba(255,255,255,.85);border-radius:50%;}
.banner-h1{font-size:clamp(1.9rem,3.5vw,2.9rem);font-weight:800;color:white;
  letter-spacing:-.03em;margin-bottom:.6rem;line-height:1.1;}
.banner-sub{font-size:.95rem;color:rgba(255,255,255,.82);max-width:580px;line-height:1.65;}
.banner-wcag{margin-top:1.2rem;display:inline-flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.14);border-radius:var(--rf);
  border:1px solid rgba(255,255,255,.22);padding:5px 14px;
  font-size:.72rem;color:rgba(255,255,255,.92);font-weight:500;}
.wcag-tag{background:white;color:var(--blue);font-family:'DM Mono',monospace;
  font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.03em;}
.wcag-todo{background:var(--yellow-lt);color:#92400e;font-family:'DM Mono',monospace;
  font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:4px;}

/* ── SECTIONS ── */
.section{padding:4rem 2rem;}
.section-inner{max-width:1280px;margin:0 auto;}
.s-chip{display:inline-flex;align-items:center;gap:6px;background:var(--blue-lt);
  color:var(--blue);border-radius:var(--rf);padding:4px 12px;
  font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-bottom:.75rem;}
.s-title{font-size:1.9rem;font-weight:800;color:var(--text);letter-spacing:-.03em;margin-bottom:.5rem;}
.s-desc{font-size:.95rem;color:var(--text2);line-height:1.7;max-width:560px;}
.section-head{margin-bottom:2.5rem;}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;}

/* ── COURSE CARDS ── */
.ccard{background:white;border-radius:var(--rl);border:1.5px solid var(--border);
  overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;
  animation:fadeUp .5s ease both;}
.ccard:hover{transform:translateY(-6px);box-shadow:var(--sh-xl);border-color:var(--blue-md);}
.ccard-thumb{height:148px;display:flex;align-items:center;justify-content:center;
  font-size:3rem;position:relative;overflow:hidden;}
.ccard-thumb-badge{position:absolute;top:10px;left:10px;background:rgba(255,255,255,.95);
  border-radius:var(--rf);padding:4px 10px;font-size:.62rem;font-weight:700;
  display:flex;align-items:center;gap:5px;box-shadow:var(--sh);}
.ccard-body{padding:1.25rem;}
.ccard-source-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;}
.source-mini{display:flex;align-items:center;gap:6px;background:var(--bg);
  border-radius:8px;padding:4px 10px;}
.source-mini span{font-size:.65rem;font-weight:600;color:var(--text2);}
.source-mini img{height:16px;width:auto;object-fit:contain;max-width:60px;}
.level-tag{font-size:.62rem;font-weight:700;padding:3px 10px;border-radius:var(--rf);}
.ccard-title{font-size:.95rem;font-weight:700;color:var(--text);margin-bottom:.4rem;line-height:1.3;}
.ccard-desc{font-size:.78rem;color:var(--text2);line-height:1.55;margin-bottom:1rem;}
.ccard-footer{display:flex;align-items:center;justify-content:space-between;
  padding-top:.85rem;border-top:1px solid var(--border);}
.cbadges{display:flex;gap:.4rem;flex-wrap:wrap;}
.cbadge{font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:4px;}
.cb-cpf{background:var(--green-lt);color:#15803d;}
.cb-cert{background:var(--blue-lt);color:var(--blue);}
.cb-free{background:var(--yellow-lt);color:#92400e;}
.cb-xp{background:var(--orange-lt);color:#c2410c;}
.cdur{font-size:.68rem;color:var(--text3);font-family:'DM Mono',monospace;}
.cadd{background:var(--blue-lt);color:var(--blue);border:none;padding:6px 14px;
  border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.72rem;
  font-weight:700;cursor:pointer;transition:all .2s;}
.cadd:hover{background:var(--blue);color:white;}

/* ── SEARCH ── */
.search-wrap{background:white;border-radius:var(--rl);border:1.5px solid var(--border);
  padding:1.5rem;margin-bottom:2rem;box-shadow:var(--sh);}
.search-row{display:flex;gap:.75rem;margin-bottom:1.25rem;}
.search-input{flex:1;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
  color:var(--text);padding:11px 16px 11px 42px;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.9rem;outline:none;transition:all .2s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:14px center;}
.search-input:focus{border-color:var(--blue);background-color:white;box-shadow:0 0 0 3px rgba(26,86,219,.1);}
.search-input::placeholder{color:var(--text3);}
.search-btn{background:var(--blue);color:white;border:none;border-radius:10px;
  padding:11px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
  font-size:.875rem;cursor:pointer;transition:all .2s;white-space:nowrap;}
.search-btn:hover{background:var(--blue-dk);}
.frow{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin-bottom:.5rem;}
.flabel{font-size:.7rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.05em;flex-shrink:0;}
.fchip{background:var(--bg);border:1.5px solid var(--border);border-radius:var(--rf);
  color:var(--text2);padding:5px 14px;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.72rem;font-weight:500;cursor:pointer;transition:all .2s;background:none;white-space:nowrap;}
.fchip:hover{border-color:var(--blue);color:var(--blue);}
.fchip.active{background:var(--blue);border-color:var(--blue);color:white;font-weight:700;}
.src-chips{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1.5rem;}
.sc{display:flex;align-items:center;gap:7px;padding:7px 14px;border-radius:var(--rf);
  border:1.5px solid var(--border);cursor:pointer;transition:all .2s;background:white;
  font-size:.72rem;font-weight:600;color:var(--text2);}
.sc:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-lt);}
.sc.active{background:var(--blue);border-color:var(--blue);color:white;}
.sc img{height:18px;width:auto;object-fit:contain;max-width:70px;}
.sc.active img{filter:brightness(0) invert(1);}

/* ── PARCOURS ── */
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.pcard{background:white;border-radius:var(--rl);border:1.5px solid var(--border);
  padding:1.75rem;position:relative;overflow:hidden;cursor:pointer;transition:all .3s;}
.pcard:hover{transform:translateY(-5px);box-shadow:var(--sh-xl);border-color:var(--blue-md);}
.pcard-bar{height:4px;border-radius:0 0 0 0;position:absolute;top:0;left:0;right:0;border-radius:var(--rl) var(--rl) 0 0;}
.pcard-num{position:absolute;right:18px;top:14px;font-size:3.5rem;font-weight:800;line-height:1;opacity:.06;color:var(--blue);}
.pcard-ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1rem;}
.pcard-title{font-size:1.1rem;font-weight:800;color:var(--text);margin-bottom:.3rem;letter-spacing:-.02em;}
.pcard-sub{font-size:.78rem;color:var(--text2);margin-bottom:1.2rem;}
.ptopics{list-style:none;display:flex;flex-direction:column;gap:.4rem;}
.ptopic{display:flex;align-items:center;gap:8px;font-size:.77rem;color:var(--text2);}
.pbullet{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.pfoot{display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);}
.pcount{font-family:'DM Mono',monospace;font-size:.64rem;color:var(--text2);}
.pcta{background:var(--blue);color:white;border:none;padding:7px 18px;border-radius:8px;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.78rem;cursor:pointer;transition:all .2s;}
.pcta:hover{filter:brightness(1.1);}

/* ── LIVE BLOCK ── */
.live-block{background:linear-gradient(135deg,var(--blue) 0%,var(--violet) 100%);
  border-radius:var(--rl);padding:2.75rem 3rem;position:relative;overflow:hidden;}
.live-block::before{content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:24px 24px;}
.live-inner{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;position:relative;z-index:1;}
.live-badge{display:inline-flex;align-items:center;gap:7px;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);
  border-radius:var(--rf);color:white;font-size:.72rem;font-weight:700;padding:5px 14px;margin-bottom:1rem;}
.ldot{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pulse 1.5s infinite;}
.live-h2{font-size:1.75rem;font-weight:800;color:white;margin-bottom:.75rem;letter-spacing:-.03em;line-height:1.2;}
.live-desc{font-size:.88rem;color:rgba(255,255,255,.82);line-height:1.7;margin-bottom:1.5rem;}
.live-feats{display:flex;flex-direction:column;gap:.7rem;}
.lfeat{display:flex;align-items:center;gap:10px;font-size:.82rem;color:rgba(255,255,255,.85);}
.lcheck{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.2);
  border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;
  justify-content:center;font-size:.7rem;flex-shrink:0;}
.terminal{background:#0f172a;border-radius:var(--r);padding:1.5rem;font-family:'DM Mono',monospace;font-size:.72rem;border:1px solid rgba(255,255,255,.1);}
.t-header{display:flex;gap:6px;margin-bottom:1rem;align-items:center;}
.t-dot{width:10px;height:10px;border-radius:50%;}
.t-name{font-size:.6rem;color:rgba(255,255,255,.35);margin-left:8px;}
.tl{margin-bottom:.35rem;line-height:1.6;}
.tl-acc{color:#60a5fa;}
.tl-grn{color:#4ade80;}
.tl-cyn{color:#67e8f9;}
.tl-dim{color:rgba(255,255,255,.4);}
.cursor{display:inline-block;width:7px;height:14px;background:#60a5fa;animation:pulse .9s infinite;vertical-align:text-bottom;}

/* ── FIN CARDS ── */
.fcard-fin{background:white;border-radius:var(--rl);border:1.5px solid var(--border);
  padding:1.75rem;transition:all .2s;}
.fcard-fin:hover{border-color:var(--blue-md);box-shadow:var(--sh-md);}
.fi-ico{font-size:2rem;margin-bottom:.75rem;}
.fi-title{font-size:1rem;font-weight:800;color:var(--text);margin-bottom:.5rem;}
.fi-desc{font-size:.8rem;color:var(--text2);line-height:1.65;}
.fi-amt{display:inline-block;margin-top:.75rem;font-family:'DM Mono',monospace;
  font-size:.78rem;font-weight:500;color:var(--blue);background:var(--blue-lt);padding:3px 10px;border-radius:6px;}

/* ── A11Y BLOCK ── */
.a11y-block{background:var(--blue-lt);border:1.5px solid var(--blue-md);border-radius:var(--r);
  padding:1.25rem 1.5rem;display:flex;align-items:flex-start;gap:1rem;margin-bottom:2rem;}
.a11y-ico{font-size:1.5rem;flex-shrink:0;margin-top:2px;}
.a11y-title{font-weight:800;color:var(--blue);font-size:.9rem;margin-bottom:.3rem;}
.a11y-desc{font-size:.78rem;color:var(--text2);line-height:1.6;}
.a11y-tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem;}
.atag{font-family:'DM Mono',monospace;font-size:.6rem;font-weight:600;padding:3px 8px;border-radius:4px;border:1px solid;}
.at-ok{background:var(--green-lt);color:#15803d;border-color:var(--green-md);}
.at-warn{background:var(--yellow-lt);color:#92400e;border-color:var(--yellow-md);}
.at-info{background:var(--blue-lt);color:var(--blue);border-color:var(--blue-md);}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);
  z-index:300;display:flex;align-items:center;justify-content:center;padding:2rem;}
.modal{background:white;border-radius:var(--rl);max-width:680px;width:100%;
  max-height:88vh;overflow-y:auto;box-shadow:var(--sh-xl);}
.modal-head{padding:1.5rem 2rem;border-bottom:1px solid var(--border);
  display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;}
.modal-close{background:var(--bg);border:none;color:var(--text2);width:32px;height:32px;
  border-radius:8px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:1.2rem;transition:all .2s;flex-shrink:0;}
.modal-close:hover{background:var(--border);color:var(--text);}
.modal-body{padding:2rem;}
.modal-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;}
.mstat{background:var(--bg);padding:.85rem;border-radius:var(--r);border:1px solid var(--border);}
.mstat-k{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--text2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;}
.mstat-v{font-weight:800;font-size:.95rem;color:var(--text);}
.m-section-title{font-family:'DM Mono',monospace;font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text2);margin-bottom:.6rem;}
.m-obj{display:flex;gap:8px;font-size:.82rem;color:var(--text2);margin-bottom:.4rem;}
.m-obj::before{content:'→';color:var(--blue);flex-shrink:0;}
.m-actions{display:flex;gap:1rem;margin-top:2rem;}

/* ── PROFIL ── */
.profile-grid{display:grid;grid-template-columns:280px 1fr;gap:2rem;align-items:start;}
.profile-card{background:white;border-radius:var(--rl);border:1.5px solid var(--border);padding:2rem;}
.profile-avatar{width:72px;height:72px;border-radius:var(--rf);
  background:linear-gradient(135deg,var(--blue),var(--violet));
  display:flex;align-items:center;justify-content:center;font-size:2rem;
  margin:0 auto 1rem;box-shadow:0 4px 14px rgba(26,86,219,.3);}
.profile-name{font-weight:800;font-size:1.1rem;text-align:center;color:var(--text);}
.profile-role{font-size:.72rem;color:var(--text2);text-align:center;margin-top:.25rem;margin-bottom:1rem;}
.skill-row{margin-bottom:.75rem;}
.skill-top{display:flex;justify-content:space-between;margin-bottom:4px;font-size:.78rem;}
.skill-pct{font-family:'DM Mono',monospace;font-size:.65rem;color:var(--blue);font-weight:600;}
.skill-track{height:6px;background:var(--bg2);border-radius:3px;overflow:hidden;}
.skill-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--violet));}
.kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;}
.kpi-box{background:white;border-radius:var(--r);border:1.5px solid var(--border);padding:1.25rem;text-align:center;}
.kpi-val{font-size:2rem;font-weight:800;background:linear-gradient(135deg,var(--blue),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.kpi-lbl{font-size:.7rem;color:var(--text2);margin-top:4px;}

/* ── TOAST ── */
.toast{position:fixed;bottom:2rem;right:2rem;z-index:400;
  background:var(--text);color:white;border-radius:var(--r);
  padding:.9rem 1.5rem;font-size:.82rem;font-weight:600;
  display:flex;align-items:center;gap:10px;animation:fadeUp .3s ease;
  max-width:360px;box-shadow:var(--sh-xl);}
.toast-dot{width:8px;height:8px;background:var(--green);border-radius:50%;flex-shrink:0;}

/* ── FOOTER ── */
footer{background:white;border-top:1px solid var(--border);padding:3.5rem 2rem 2rem;}
.footer-inner{max-width:1280px;margin:0 auto;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:2.5rem;}
.footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:.75rem;}
.footer-desc{font-size:.8rem;color:var(--text2);line-height:1.7;max-width:280px;margin-bottom:1.5rem;}
.footer-logos-row{display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;}
.footer-logo-item{opacity:.45;transition:opacity .2s;cursor:pointer;}
.footer-logo-item:hover{opacity:.85;}
.footer-logo-item img{height:20px;width:auto;object-fit:contain;filter:grayscale(100%);}
.footer-col-title{font-size:.7rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:1rem;}
.flinks{display:flex;flex-direction:column;gap:.5rem;}
.flink{font-size:.8rem;color:var(--text2);cursor:pointer;transition:color .2s;background:none;border:none;text-align:left;}
.flink:hover{color:var(--blue);}
.footer-bottom{padding-top:1.5rem;border-top:1px solid var(--border);
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
.footer-copy{font-size:.72rem;color:var(--text3);}
.footer-partners{display:flex;gap:.75rem;flex-wrap:wrap;}
.fpartner{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--text2);
  border:1px solid var(--border);padding:3px 8px;border-radius:4px;}

/* ── FORUM ── */
.forum-grid{display:grid;grid-template-columns:280px 1fr;gap:1.5rem;align-items:start;}
.forum-cats{background:white;border-radius:var(--rl);border:1.5px solid var(--border);overflow:hidden;position:sticky;top:88px;}
.fc-cat-title{padding:1rem 1.25rem;font-weight:800;font-size:.8rem;color:var(--text2);text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--border);}
.fc-cat-item{display:flex;align-items:center;gap:10px;padding:.85rem 1.25rem;cursor:pointer;transition:all .2s;border-bottom:1px solid var(--border);background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;}
.fc-cat-item:last-child{border-bottom:none;}
.fc-cat-item:hover{background:var(--bg);}
.fc-cat-item.active{background:var(--blue-lt);border-right:3px solid var(--blue);}
.fc-cat-ico{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
.fc-cat-name{font-size:.78rem;font-weight:600;color:var(--text);line-height:1.3;}
.fc-cat-meta{font-size:.62rem;color:var(--text2);margin-top:1px;}
.fc-cat-count{margin-left:auto;font-family:'DM Mono',monospace;font-size:.65rem;font-weight:700;background:var(--bg2);color:var(--text2);padding:2px 8px;border-radius:var(--rf);flex-shrink:0;}
.forum-posts{display:flex;flex-direction:column;gap:1rem;}
.fpost{background:white;border-radius:var(--rl);border:1.5px solid var(--border);padding:1.5rem;cursor:pointer;transition:all .3s;}
.fpost:hover{border-color:var(--blue-md);box-shadow:var(--sh-md);transform:translateY(-2px);}
.fpost.solved{border-left:4px solid var(--green);}
.fp-head{display:flex;align-items:center;gap:10px;margin-bottom:.85rem;}
.fp-avatar{width:38px;height:38px;border-radius:var(--rf);background:linear-gradient(135deg,var(--blue),var(--violet));display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
.fp-author{font-weight:700;font-size:.85rem;color:var(--text);}
.fp-role{font-size:.65rem;color:var(--text2);}
.fp-time{margin-left:auto;font-size:.65rem;color:var(--text3);font-family:'DM Mono',monospace;}
.fp-solved{background:var(--green-lt);color:var(--green);font-size:.62rem;font-weight:700;padding:3px 10px;border-radius:var(--rf);margin-left:.5rem;flex-shrink:0;}
.fp-title{font-size:1rem;font-weight:800;color:var(--text);margin-bottom:.5rem;letter-spacing:-.02em;line-height:1.3;}
.fp-body{font-size:.82rem;color:var(--text2);line-height:1.65;margin-bottom:.85rem;}
.fp-tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.85rem;}
.fp-tag{font-size:.62rem;font-weight:600;padding:3px 10px;border-radius:var(--rf);background:var(--bg2);color:var(--text2);border:1px solid var(--border);}
.fp-footer{display:flex;align-items:center;gap:1rem;padding-top:.75rem;border-top:1px solid var(--border);}
.fp-stat{display:flex;align-items:center;gap:5px;font-size:.72rem;color:var(--text2);}
.fp-stat-ico{font-size:.85rem;}
.fp-reply-btn{margin-left:auto;background:var(--blue-lt);color:var(--blue);border:none;padding:6px 16px;border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.75rem;font-weight:700;cursor:pointer;transition:all .2s;}
.fp-reply-btn:hover{background:var(--blue);color:white;}
/* answers */
.fanswers{margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:.75rem;}
.fanswer{background:var(--bg);border-radius:var(--r);padding:1rem;border:1px solid var(--border);}
.fanswer.best{background:var(--green-lt);border-color:var(--green-md);}
.fa-head{display:flex;align-items:center;gap:8px;margin-bottom:.5rem;}
.fa-best{font-size:.62rem;font-weight:700;color:var(--green);background:white;border:1px solid var(--green-md);padding:2px 8px;border-radius:var(--rf);}
.fa-body{font-size:.8rem;color:var(--text2);line-height:1.6;}
.fa-likes{display:flex;align-items:center;gap:4px;font-size:.68rem;color:var(--text2);margin-top:.5rem;}
/* new post */
.new-post-btn{background:linear-gradient(135deg,var(--blue),var(--violet));color:white;border:none;padding:11px 22px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.875rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(26,86,219,.3);}
.new-post-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(26,86,219,.4);}
/* community illustration */
.community-illo{background:white;border-radius:var(--rl);border:1.5px solid var(--border);padding:1.5rem;margin-bottom:1rem;}

/* ── BURGER MENU ── */
.burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;border-radius:8px;transition:background .2s;}
.burger:hover{background:var(--bg);}
.burger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px;transition:all .3s;}
.burger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.burger.open span:nth-child(2){opacity:0;}
.burger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
.nav-mobile{display:none;position:fixed;top:68px;left:0;right:0;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:199;padding:1rem;box-shadow:0 8px 24px rgba(0,0,0,.12);}
.nav-mobile.open{display:flex;flex-direction:column;gap:.25rem;}
.nav-mobile .nav-btn{text-align:left;padding:12px 16px;border-radius:10px;font-size:.95rem;}
.nav-mobile .nav-cta{margin-top:.5rem;width:100%;justify-content:center;display:flex;align-items:center;padding:13px;}

/* ── LAPTOP (≤1280px) ── */
@media(max-width:1280px){
  .hero-inner{gap:3rem;}
  .hero-h1{font-size:clamp(2rem,3.5vw,3rem);}
  .footer-grid{gap:2rem;}
}

/* ── TABLET (≤1024px) ── */
@media(max-width:1024px){
  .hero-inner{gap:2.5rem;}
  .grid3{grid-template-columns:1fr 1fr;}
  .grid4{grid-template-columns:repeat(2,1fr);}
  .footer-grid{grid-template-columns:1fr 1fr;gap:1.5rem;}
  .fc1{left:4px;width:175px;} .fc2{left:4px;width:165px;} .fc3{right:4px;width:150px;}
  .live-block{padding:2rem;}
  .section{padding:3rem 1.5rem;}
}

/* ── MOBILE (≤860px) ── */
@media(max-width:860px){
  .nav-links{display:none;}
  .nav-cta{display:none;}
  .nav .nav-count{display:none;}
  .burger{display:flex;}
  .hero{padding:100px 1.5rem 60px;}
  .hero-inner{grid-template-columns:1fr; gap:2.5rem;}
  .hero-right{max-width:480px;margin:0 auto;}
  .hero-h1{font-size:clamp(1.9rem,6vw,2.8rem);}
  .hero-desc{font-size:.95rem;}
  .hero-stats{flex-wrap:wrap;}
  .stat-item{flex:1;min-width:120px;}
  .fc1,.fc2,.fc3{display:none;}
  .corner{display:none;}
  .hero-img{height:300px;}
  .logos-inner{gap:1rem;}
  .logos-row{gap:.6rem;}
  .logos-sep{display:none;}
  .logos-label{width:100%;}
  .grid3{grid-template-columns:1fr 1fr;}
  .grid4{grid-template-columns:1fr 1fr;}
  .pgrid{grid-template-columns:1fr 1fr;}
  .live-inner{grid-template-columns:1fr; gap:2rem;}
  .profile-grid{grid-template-columns:1fr;}
  .kpi-row{grid-template-columns:repeat(3,1fr);}
  .footer-grid{grid-template-columns:1fr 1fr; gap:1.5rem;}
  .forum-grid{grid-template-columns:1fr;}
  .forum-cats{position:static;}
  .section{padding:2.5rem 1.25rem;}
  .s-title{font-size:1.6rem;}
  .banner-h1{font-size:clamp(1.6rem,5vw,2.4rem);}
  .page-banner{padding:90px 1.5rem 50px;}
  .modal{margin:0;border-radius:var(--rl) var(--rl) 0 0;max-height:95vh;}
  .overlay{align-items:flex-end;padding:0;}
  .terminal{display:none;}
  .live-block{padding:1.75rem 1.5rem;}
  .live-h2{font-size:1.4rem;}
  .footer-inner{padding:0;}
  .search-row{flex-direction:column;}
  .search-btn{width:100%;}
  .frow{gap:.4rem;}
  .src-chips{gap:.4rem;}
}

/* ── SMALL MOBILE (≤640px) ── */
@media(max-width:640px){
  .nav{padding:0 1rem;height:60px;}
  .logo-name{font-size:1rem;}
  .hero{padding:88px 1rem 50px;}
  .hero-h1{font-size:clamp(1.7rem,8vw,2.4rem);}
  .hero-stats{flex-direction:column;gap:.4rem;}
  .stat-item{border-right:none;border-bottom:1px solid var(--border);padding:.75rem 1rem;}
  .stat-item:last-child{border-bottom:none;}
  .stat-num{font-size:1.3rem;}
  .hero-btns{flex-direction:column;}
  .btn-primary,.btn-secondary{width:100%;justify-content:center;}
  .grid3{grid-template-columns:1fr;}
  .grid4{grid-template-columns:1fr 1fr;}
  .pgrid{grid-template-columns:1fr;}
  .footer-grid{grid-template-columns:1fr;}
  .footer-bottom{flex-direction:column;text-align:center;}
  .kpi-row{grid-template-columns:1fr 1fr;}
  .modal-grid3{grid-template-columns:1fr 1fr;}
  .live-block{padding:1.5rem 1rem;}
  .live-h2{font-size:1.25rem;}
  .live-desc{font-size:.82rem;}
  .section{padding:2rem 1rem;}
  .s-title{font-size:1.45rem;}
  .page-banner{padding:80px 1rem 45px;}
  .banner-h1{font-size:clamp(1.4rem,7vw,2rem);}
  .banner-sub{font-size:.85rem;}
  .logos-inner{padding:.8rem 1rem;}
  .logo-pill{padding:5px 12px;}
  .new-post-btn{width:100%;justify-content:center;}
  .fp-title{font-size:.92rem;}
  .fp-body{font-size:.78rem;}
  .fc-cat-item{padding:.7rem 1rem;}
  .search-wrap{padding:1rem;}
  .fchip{padding:4px 10px;font-size:.68rem;}
  .ccard-body{padding:1rem;}
  .ccard-title{font-size:.88rem;}
  .pcard{padding:1.25rem;}
  .hero-img{height:240px;}
  .nav-mobile{top:60px;}
}

/* ── TINY MOBILE (≤375px) ── */
@media(max-width:375px){
  .hero-h1{font-size:1.6rem;}
  .stat-num{font-size:1.2rem;}
  .grid4{grid-template-columns:1fr;}
  .kpi-row{grid-template-columns:1fr;}
  .modal-grid3{grid-template-columns:1fr;}
  .logo-pill img{max-width:60px;}
  .logo-pill-txt{display:none;}
  .logo-name{display:none;}
  .nav{padding:0 .75rem;}
}
/* ── CO2 IMPACT ── */
.co2-banner{background:linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%);
  border-radius:var(--rl);padding:1.75rem 2rem;position:relative;overflow:hidden;margin-bottom:2.5rem;}
.co2-banner::before{content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(74,222,128,.06) 1px,transparent 1px);background-size:20px 20px;}
.co2-inner{display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center;position:relative;z-index:1;}
.co2-left{}
.co2-chip{display:inline-flex;align-items:center;gap:6px;
  background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3);
  border-radius:var(--rf);color:#4ade80;font-size:.7rem;font-weight:700;
  padding:4px 12px;margin-bottom:.75rem;letter-spacing:.05em;text-transform:uppercase;}
.co2-title{font-size:1.5rem;font-weight:800;color:white;letter-spacing:-.03em;margin-bottom:.35rem;line-height:1.2;}
.co2-title .co2-num{font-size:2.2rem;background:linear-gradient(90deg,#4ade80,#22d3ee);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.co2-sub{font-size:.82rem;color:rgba(255,255,255,.7);line-height:1.6;max-width:460px;}
.co2-metrics{display:flex;gap:1.5rem;flex-shrink:0;}
.co2-metric{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  border-radius:var(--r);padding:.85rem 1.1rem;text-align:center;min-width:90px;}
.co2-metric-val{font-size:1.4rem;font-weight:800;color:#4ade80;font-family:'DM Mono',monospace;line-height:1;}
.co2-metric-lbl{font-size:.6rem;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.3;text-transform:uppercase;letter-spacing:.05em;}
.co2-progress{margin-top:1rem;}
.co2-prog-head{display:flex;justify-content:space-between;margin-bottom:5px;}
.co2-prog-label{font-size:.68rem;color:rgba(255,255,255,.6);font-weight:500;}
.co2-prog-pct{font-size:.68rem;color:#4ade80;font-family:'DM Mono',monospace;font-weight:700;}
.co2-track{height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;}
.co2-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#4ade80,#22d3ee);
  animation:co2grow 2s ease both;}
@keyframes co2grow{from{width:0}to{width:var(--w)}}

/* CO2 profile card */
.co2-profile{background:linear-gradient(135deg,#052e16,#14532d);border-radius:var(--rl);
  padding:1.5rem;margin-bottom:1rem;position:relative;overflow:hidden;}
.co2-profile::before{content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(74,222,128,.05) 1px,transparent 1px);background-size:18px 18px;}
.co2-profile-inner{position:relative;z-index:1;}
.co2-profile-title{font-size:.75rem;font-weight:800;color:#4ade80;text-transform:uppercase;
  letter-spacing:.07em;margin-bottom:1rem;display:flex;align-items:center;gap:6px;}
.co2-big{font-size:2.8rem;font-weight:800;color:white;line-height:1;letter-spacing:-.03em;
  margin-bottom:.25rem;}
.co2-big span{font-size:1.2rem;color:#4ade80;font-weight:600;margin-left:4px;}
.co2-equiv{font-size:.78rem;color:rgba(255,255,255,.65);margin-bottom:1.25rem;}
.co2-breakdown{display:flex;flex-direction:column;gap:.6rem;}
.co2-row{display:flex;align-items:center;gap:10px;}
.co2-row-ico{font-size:.9rem;width:20px;text-align:center;flex-shrink:0;}
.co2-row-label{font-size:.72rem;color:rgba(255,255,255,.7);flex:1;}
.co2-row-val{font-family:'DM Mono',monospace;font-size:.7rem;color:#4ade80;font-weight:700;}
@media(max-width:860px){
  .co2-inner{grid-template-columns:1fr;}
  .co2-metrics{gap:1rem;}
  .co2-metric{min-width:70px;padding:.7rem .85rem;}
  .co2-metric-val{font-size:1.2rem;}
}
@media(max-width:640px){
  .co2-metrics{display:grid;grid-template-columns:1fr 1fr;width:100%;}
  .co2-metric{min-width:unset;}
  .co2-title .co2-num{font-size:1.8rem;}
  .co2-title{font-size:1.2rem;}
}

/* ── WIZARD UPLOAD ── */
.wizard-wrap{display:grid;grid-template-columns:300px 1fr;gap:2rem;align-items:start;}
.wizard-steps{background:white;border-radius:var(--rl);border:1.5px solid var(--border);overflow:hidden;position:sticky;top:88px;}
.ws-header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);font-weight:800;font-size:.85rem;color:var(--text2);text-transform:uppercase;letter-spacing:.07em;}
.ws-item{display:flex;align-items:flex-start;gap:12px;padding:1rem 1.5rem;border-bottom:1px solid var(--border);cursor:pointer;transition:all .2s;background:none;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;}
.ws-item:last-child{border-bottom:none;}
.ws-item.active{background:var(--blue-lt);border-right:3px solid var(--blue);}
.ws-item.done{background:var(--green-lt);}
.ws-num{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;flex-shrink:0;background:var(--bg2);color:var(--text2);border:2px solid var(--border);}
.ws-item.active .ws-num{background:var(--blue);color:white;border-color:var(--blue);}
.ws-item.done .ws-num{background:var(--green);color:white;border-color:var(--green);}
.ws-label{font-size:.82rem;font-weight:700;color:var(--text);line-height:1.2;}
.ws-item.active .ws-label{color:var(--blue);}
.ws-item.done .ws-label{color:#15803d;}
.ws-sub{font-size:.68rem;color:var(--text2);margin-top:2px;line-height:1.4;}
.ws-connector{width:2px;height:16px;background:var(--border);margin-left:14px;}
.wizard-tip{margin:1.25rem 1.5rem;background:var(--blue-lt);border:1.5px solid var(--blue-md);border-radius:var(--r);padding:1rem 1.25rem;}
.wtip-title{font-size:.72rem;font-weight:800;color:var(--blue);display:flex;align-items:center;gap:6px;margin-bottom:.4rem;}
.wtip-body{font-size:.72rem;color:var(--text2);line-height:1.65;}
.wtip-body strong{color:var(--blue);}

.wizard-panel{background:white;border-radius:var(--rl);border:1.5px solid var(--border);}
.wp-head{padding:1.5rem 2rem;border-bottom:1px solid var(--border);}
.wp-chip{display:inline-flex;align-items:center;gap:6px;background:var(--blue-lt);color:var(--blue);border-radius:var(--rf);padding:3px 10px;font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.75rem;}
.wp-title{font-size:1.25rem;font-weight:800;color:var(--text);letter-spacing:-.02em;}
.wp-sub{font-size:.8rem;color:var(--text2);margin-top:.25rem;}
.wp-prog{margin-top:1rem;display:flex;gap:4px;}
.wp-prog-seg{height:4px;flex:1;border-radius:2px;background:var(--bg2);overflow:hidden;}
.wp-prog-seg.active{background:var(--blue);}
.wp-prog-seg.done{background:var(--green);}
.wp-body{padding:2rem;}
.wfield{margin-bottom:1.5rem;}
.wlabel{font-size:.72rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem;display:flex;align-items:center;gap:4px;}
.wreq{color:var(--red);font-size:.8rem;}
.winput{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;outline:none;transition:all .2s;}
.winput:focus{border-color:var(--blue);background:white;box-shadow:0 0 0 3px rgba(26,86,219,.1);}
.winput::placeholder{color:var(--text3);}
.wselect{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;transition:all .2s;}
.wselect:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,86,219,.1);}
.wgrid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.wtextarea{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;color:var(--text);padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;outline:none;resize:vertical;min-height:100px;transition:all .2s;}
.wtextarea:focus{border-color:var(--blue);background:white;box-shadow:0 0 0 3px rgba(26,86,219,.1);}

/* Upload zones */
.wupload{border:2px dashed var(--border2);border-radius:var(--r);padding:2rem;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg);}
.wupload:hover{border-color:var(--blue);background:var(--blue-lt);}
.wupload.has-file{border-color:var(--green);background:var(--green-lt);border-style:solid;}
.wupload-ico{font-size:2.5rem;margin-bottom:.75rem;}
.wupload-label{font-size:.85rem;font-weight:700;color:var(--text);margin-bottom:.25rem;}
.wupload-sub{font-size:.72rem;color:var(--text2);}
.wupload-badge{display:inline-flex;align-items:center;gap:6px;background:var(--green-lt);border:1px solid var(--green-md);border-radius:var(--rf);padding:4px 12px;font-size:.7rem;font-weight:700;color:#15803d;margin-top:.75rem;}

/* Video URL input */
.wvideo-wrap{border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;}
.wvideo-tabs{display:flex;border-bottom:1px solid var(--border);}
.wvtab{flex:1;padding:.7rem;background:none;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:.75rem;font-weight:600;color:var(--text2);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;}
.wvtab.active{background:var(--blue-lt);color:var(--blue);font-weight:700;border-bottom:2px solid var(--blue);}
.wvideo-body{padding:1.25rem;}

/* Preview card */
.wpreview{background:var(--bg);border-radius:var(--r);border:1.5px solid var(--border);overflow:hidden;}
.wpreview-thumb{height:120px;background:linear-gradient(135deg,var(--blue-lt),var(--violet-lt));display:flex;align-items:center;justify-content:center;font-size:3rem;}
.wpreview-body{padding:1rem;}
.wpreview-title{font-size:.88rem;font-weight:800;color:var(--text);margin-bottom:.25rem;}
.wpreview-meta{font-size:.7rem;color:var(--text2);display:flex;gap:.75rem;flex-wrap:wrap;}

/* Confirm step */
.wconfirm-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
.wconfirm-section{background:var(--bg);border-radius:var(--r);padding:1.25rem;border:1px solid var(--border);}
.wconfirm-title{font-size:.65rem;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.85rem;}
.wconfirm-row{display:flex;flex-direction:column;gap:.2rem;margin-bottom:.75rem;}
.wconfirm-key{font-size:.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;font-weight:600;}
.wconfirm-val{font-size:.82rem;font-weight:600;color:var(--text);}
.wcgm-badge{display:inline-flex;align-items:center;gap:4px;background:var(--yellow-lt);border:1px solid var(--yellow-md);border-radius:var(--rf);padding:3px 10px;font-size:.65rem;font-weight:700;color:#92400e;margin-top:.5rem;}

/* Nav buttons */
.wp-nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;border-top:1px solid var(--border);}
.wp-back{background:none;border:1.5px solid var(--border2);border-radius:10px;padding:10px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:.88rem;color:var(--text2);cursor:pointer;transition:all .2s;}
.wp-back:hover{border-color:var(--blue);color:var(--blue);}
.wp-next{background:linear-gradient(135deg,var(--blue),var(--blue-dk));color:white;border:none;border-radius:10px;padding:11px 28px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(26,86,219,.3);}
.wp-next:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(26,86,219,.4);}
.wp-next.submit{background:linear-gradient(135deg,var(--green),#15803d);}
.wp-next.submit:hover{box-shadow:0 8px 22px rgba(22,163,74,.4);}

/* Success screen */
.wsuccess{text-align:center;padding:4rem 2rem;}
.wsuccess-ico{font-size:4rem;margin-bottom:1.5rem;animation:fadeUp .5s ease both;}
.wsuccess-title{font-size:1.8rem;font-weight:800;color:var(--text);margin-bottom:.5rem;letter-spacing:-.03em;}
.wsuccess-sub{font-size:.95rem;color:var(--text2);max-width:480px;margin:0 auto 2rem;line-height:1.7;}
.wsuccess-badges{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;margin-bottom:2.5rem;}

/* Tag chips */
.wtag-wrap{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;}
.wtag{display:inline-flex;align-items:center;gap:5px;background:var(--blue-lt);color:var(--blue);border-radius:var(--rf);padding:4px 12px;font-size:.72rem;font-weight:600;}
.wtag-remove{background:none;border:none;cursor:pointer;color:var(--blue);font-size:.9rem;padding:0;line-height:1;opacity:.7;}
.wtag-remove:hover{opacity:1;}

@media(max-width:860px){.wizard-wrap{grid-template-columns:1fr;} .wizard-steps{position:static;}}
@media(max-width:640px){.wgrid2{grid-template-columns:1fr;} .wconfirm-grid{grid-template-columns:1fr;} .wp-body{padding:1.25rem;} .wp-nav{padding:1rem 1.25rem;}}


/* ── EVENTS VIGNETTES ── */
.evt-page{padding:0 2rem 4rem;}
.evt-filters{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.75rem;}
.evt-filter-btn{background:white;border:1.5px solid var(--border);color:var(--text2);padding:6px 14px;border-radius:var(--rf);font-family:'Plus Jakarta Sans',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s;}
.evt-filter-btn:hover,.evt-filter-btn.active{background:var(--blue-lt);color:var(--blue);border-color:var(--blue-md);}
.evt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;}
.evt-card{background:white;border-radius:18px;border:1.5px solid var(--border);box-shadow:var(--sh);transition:all .3s cubic-bezier(.34,1.2,.64,1);overflow:hidden;display:flex;flex-direction:column;position:relative;}
.evt-card:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(0,0,0,.12);border-color:transparent;}
.evt-card-header{height:118px;position:relative;flex-shrink:0;overflow:hidden;display:flex;align-items:flex-end;padding:.75rem;}
.evt-card-header-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.35) 1.5px,transparent 1.5px);background-size:22px 22px;}
.evt-card-header-glow{position:absolute;bottom:-20px;right:-20px;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.15);}
.evt-card-header-emoji{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:3.8rem;opacity:.22;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.15));}
.evt-date-badge{background:rgba(255,255,255,.96);border-radius:12px;padding:6px 11px;text-align:center;min-width:50px;box-shadow:0 3px 10px rgba(0,0,0,.15);z-index:1;position:relative;border:1.5px solid rgba(255,255,255,.5);}
.evt-date-day{font-size:1.3rem;font-weight:800;color:var(--text);line-height:1;font-family:'DM Mono',monospace;}
.evt-date-month{font-size:.55rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;}
.evt-type-chip-hdr{position:absolute;top:10px;left:10px;display:inline-flex;align-items:center;gap:3px;font-size:.6rem;font-weight:700;background:rgba(255,255,255,.88);backdrop-filter:blur(6px);color:var(--text);padding:3px 9px;border-radius:var(--rf);box-shadow:0 1px 4px rgba(0,0,0,.1);z-index:1;}
.evt-card-body{padding:1rem 1rem .65rem;flex:1;}
.evt-title{font-size:.88rem;font-weight:800;color:var(--text);line-height:1.35;margin-bottom:.5rem;}
.evt-orga-pill{display:inline-flex;align-items:center;gap:5px;font-size:.65rem;font-weight:700;padding:3px 10px;border-radius:var(--rf);margin-bottom:.65rem;}
.evt-info-row{display:flex;align-items:center;gap:4px;font-size:.67rem;color:var(--text3);margin-bottom:.25rem;}
.evt-info-row strong{color:var(--text2);}
.evt-tags{display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.55rem;}
.evt-tag{font-size:.57rem;font-weight:600;background:var(--blue-lt);color:var(--blue);padding:2px 6px;border-radius:var(--rf);}
.evt-places-wrap{margin-top:.65rem;}
.evt-places-label{display:flex;justify-content:space-between;font-size:.6rem;color:var(--text3);margin-bottom:3px;}
.evt-places-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden;}
.evt-places-fill{height:100%;border-radius:2px;background:var(--green);transition:width .5s;}
.evt-places-fill.low{background:var(--orange);}
.evt-places-fill.urgent{background:var(--red);}
.evt-urgent-label{font-size:.58rem;color:var(--red);font-weight:700;margin-top:2px;}
.evt-card-footer{padding:.75rem 1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:.5rem;background:var(--bg);}
.evt-gratuit-badge{font-size:.62rem;font-weight:700;color:var(--green);background:var(--green-lt);padding:2px 9px;border-radius:var(--rf);}
.evt-prix-badge{background:var(--orange-lt);color:var(--orange);font-size:.62rem;font-weight:700;padding:2px 9px;border-radius:var(--rf);}
.evt-cta{font-size:.72rem;font-weight:700;padding:7px 16px;border-radius:9px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
.evt-cta.primary{background:var(--blue);color:white;}
.evt-cta.primary:hover{background:var(--blue-dk);transform:translateY(-1px);}
.evt-registered{font-size:.68rem;color:var(--green);font-weight:700;display:flex;align-items:center;gap:4px;}
.evt-registered-dot{width:14px;height:14px;background:var(--green);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:.5rem;}
@media(max-width:640px){.evt-grid{grid-template-columns:1fr;}.evt-card-header{height:100px;}}
/* ── ECO WIFI BANNER ── */
.eco-wifi-banner{display:flex;align-items:center;gap:1.25rem;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:var(--rl);padding:1rem 1.5rem;position:relative;overflow:hidden;}
.eco-wifi-banner::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(134,239,172,.25);border-radius:50%;}
.eco-wifi-icon{font-size:2rem;flex-shrink:0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.1));}
.eco-wifi-body{flex:1;min-width:0;}
.eco-wifi-title{font-size:.7rem;font-weight:800;color:#15803d;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.2rem;}
.eco-wifi-text{font-size:.8rem;color:#166534;line-height:1.55;}
.eco-wifi-text strong{color:#14532d;}
.eco-wifi-badge{display:flex;flex-direction:column;align-items:center;gap:1px;background:white;border:1.5px solid #86efac;border-radius:12px;padding:.5rem .85rem;flex-shrink:0;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.06);}
.eco-wifi-leaf{font-size:1rem;line-height:1;}
.eco-wifi-badge span:nth-child(2){font-size:.95rem;font-weight:800;color:#15803d;font-family:'DM Mono',monospace;line-height:1;}
@media(max-width:640px){.eco-wifi-banner{flex-wrap:wrap;gap:.75rem;}.eco-wifi-badge{flex-direction:row;gap:.4rem;}}`;

/* ─────────── LOGO COMPONENT ─────────── */
const LOGOS = {
  schneider:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Schneider_Electric_2007.svg/240px-Schneider_Electric_2007.svg.png",
  legrand:  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Legrand_logo.svg/240px-Legrand_logo.svg.png",
  hager:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Hager_Group_Logo.svg/240px-Hager_Group_Logo.svg.png",
  siemens:  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/240px-Siemens-logo.svg.png",
  rexel:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rexel_logo.svg/240px-Rexel_logo.svg.png",
  sonepar:  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sonepar_logo.svg/240px-Sonepar_logo.svg.png",
  ademe:    "https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_ADEME.svg/240px-Logo_ADEME.svg.png",
  enedis:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Logo_Enedis.svg/240px-Logo_Enedis.svg.png",
  edf:      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/EDF_logo.svg/160px-EDF_logo.svg.png",
  rte:      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/RTE_logo.svg/240px-RTE_logo.svg.png",
};
const FALLBACK = {schneider:"Schneider Electric",legrand:"Legrand",hager:"Hager",siemens:"Siemens",rexel:"Rexel",sonepar:"Sonepar",ademe:"ADEME",enedis:"Enedis",edf:"EDF",rte:"RTE"};

function Logo({id, h=22, grey=false}) {
  const [err,setErr]=useState(false);
  if(err||!LOGOS[id]) return <span style={{fontWeight:800,fontSize:".75rem",color:"var(--text2)"}}>{FALLBACK[id]||id}</span>;
  return <img src={LOGOS[id]} alt={FALLBACK[id]||id} style={{height:h,width:"auto",objectFit:"contain",filter:grey?"grayscale(1) opacity(.5)":"none"}} onError={()=>setErr(true)}/>;
}

/* ─────────── DATA ─────────── */
const SOURCES=[
  {id:"all",label:"Toutes"},
  {id:"schneider",label:"Schneider Electric",color:"#3db83d"},
  {id:"legrand",label:"Legrand",color:"#e05a0c"},
  {id:"hager",label:"Hager",color:"#c8000a"},
  {id:"siemens",label:"Siemens",color:"#009999"},
  {id:"rexel",label:"Rexel",color:"#0046ad"},
];
const THEMES=["Tous","IRVE","Domotique / Wiser","TGBT Intelligent","Solaire PV","GTB / GTC","Efficacité énergie","PME Supervision","IoT / Réseau"];
const FORMATS=["Tous","Micro-learning","Vidéo","Blended","Présentiel","Webinar"];
const REGIONS=[
  {id:"all",label:"Toute la France",ico:"🇫🇷"},
  {id:"idf",label:"Île-de-France",ico:"🗼"},
  {id:"ara",label:"Auvergne-Rhône-Alpes",ico:"🏔️"},
  {id:"occ",label:"Occitanie",ico:"☀️"},
  {id:"pdl",label:"Pays de la Loire",ico:"🌊"},
  {id:"paca",label:"PACA",ico:"🌿"},
  {id:"naq",label:"Nouvelle-Aquitaine",ico:"🍷"},
  {id:"bfc",label:"Bourgogne-Franche-Comté",ico:"🏛️"},
  {id:"hdf",label:"Hauts-de-France",ico:"🏭"},
  {id:"bre",label:"Bretagne",ico:"⚓"},
];

const COURSES=[
  {id:1,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"⚡",thumbBg:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
    title:"TGBT Intelligent — PowerTags & Smartlink",
    desc:"Configurer un tableau général basse tension intelligent avec capteurs PowerTags pour la supervision énergétique en tertiaire.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"3h30",format:"Blended",badges:[{t:"EcoXpert",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["TGBT Intelligent","Efficacité énergie"],regions:["idf","ara","hdf"],
    objectives:["Câbler et configurer PowerTags SE sur un TGBT","Paramétrer la communication Smartlink","Connecter au logiciel PME pour la supervision","Analyser les données de consommation en temps réel"]},
  {id:2,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"🏠",thumbBg:"linear-gradient(135deg,#e0f2fe,#bae6fd)",
    title:"Wiser Home — Domotique résidentielle complète",
    desc:"Maîtriser l'écosystème Wiser pour la domotique : volets, éclairage, thermostats, pilotage via app mobile.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"2h",format:"Vidéo",badges:[{t:"Initiation",c:"cb-free"}],
    themes:["Domotique / Wiser"],regions:["all"],
    objectives:["Architecture système Wiser","Installation et appairage des modules","Configuration scènes et automatisations","Paramétrage app client iOS/Android"]},
  {id:3,source:"enedis",sourceLabel:"Enedis",sourceColor:"#0072bc",
    emoji:"☀️",thumbBg:"linear-gradient(135deg,#fef9c3,#fde68a)",
    title:"Installation Photovoltaïque — Certification QUALIFELEC",
    desc:"Formation complète dimensionnement, installation et mise en service d'une installation solaire résidentielle et tertiaire.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"5 jours",format:"Présentiel",badges:[{t:"QUALIFELEC",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["Solaire PV"],regions:["paca","occ","naq"],
    objectives:["Dimensionner un système PV","Maîtriser les raccordements AC/DC","Configurer onduleur et monitoring","Réaliser les démarches administratives"]},
  {id:4,source:"legrand",sourceLabel:"Legrand",sourceColor:"#e2001a",
    emoji:"📺",thumbBg:"linear-gradient(135deg,#fee2e2,#fecaca)",
    title:"IRVE — Borne de recharge : installation pas à pas",
    desc:"Tutoriel communautaire pour installer une borne de recharge VE en maison individuelle et collectif.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"45 min",format:"Micro-learning",badges:[{t:"Gratuit",c:"cb-free"}],
    themes:["IRVE"],regions:["all"],
    objectives:["Normes NF C 15-100 IRVE","Choix de la bonne borne","Câblage et sécurisation","Mise en service et test"]},
  {id:5,source:"hager",sourceLabel:"Hager",sourceColor:"#c8000a",
    emoji:"🔌",thumbBg:"linear-gradient(135deg,#ffe4e6,#fecdd3)",
    title:"domovea — GTB résidentielle KNX",
    desc:"Intégrer le système domotique domovea dans une installation existante. Configuration KNX et protocoles de communication.",
    level:"Niv. 3",lvlBg:"var(--orange-lt)",lvlColor:"var(--orange)",
    duration:"6h",format:"Blended",badges:[{t:"KNX",c:"cb-xp"},{t:"Expert",c:"cb-xp"}],
    themes:["GTB / GTC","Domotique / Wiser"],regions:["idf","ara","bfc"],
    objectives:["Programmer un bus KNX","Intégrer domovea","Créer interfaces supervision","Diagnostiquer pannes réseau"]},
  {id:6,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"📊",thumbBg:"linear-gradient(135deg,#dcfce7,#a7f3d0)",
    title:"Power Monitoring Expert — Cas Boulangerie",
    desc:"Déployer PME pour surveiller et optimiser la consommation d'une boulangerie avec TGBT intelligent.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"4h",format:"Blended",badges:[{t:"EcoXpert",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["PME Supervision","TGBT Intelligent","Efficacité énergie"],regions:["idf","pdl","hdf"],
    objectives:["Déployer EcoStruxure Power Monitoring","Créer tableaux de bord énergie","Paramétrer alertes de surconsommation","Générer rapports réglementaires"]},
  {id:7,source:"legrand",sourceLabel:"Legrand",sourceColor:"#e05a0c",
    emoji:"🌐",thumbBg:"linear-gradient(135deg,#fff7ed,#fed7aa)",
    title:"Gamme connectée Legrand — IoT Habitat & Tertiaire",
    desc:"Prises, interrupteurs et systèmes connectés Legrand pour l'habitat et le tertiaire.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"1h30",format:"Vidéo",badges:[{t:"Initiation",c:"cb-free"}],
    themes:["IoT / Réseau","Domotique / Wiser"],regions:["all"],
    objectives:["Présentation gamme connectée","Installation et config sans fil","Intégration assistants vocaux","Programmation de scénarios"]},
  {id:8,source:"siemens",sourceLabel:"Siemens",sourceColor:"#009999",
    emoji:"🏢",thumbBg:"linear-gradient(135deg,#cffafe,#a5f3fc)",
    title:"Desigo CC — Gestion technique du bâtiment",
    desc:"Maîtriser le système GTB Desigo CC pour la gestion centralisée CVC, éclairage et sécurité tertiaire.",
    level:"Niv. 3",lvlBg:"var(--orange-lt)",lvlColor:"var(--orange)",
    duration:"3 jours",format:"Présentiel",badges:[{t:"Certification",c:"cb-cert"},{t:"Expert",c:"cb-xp"}],
    themes:["GTB / GTC"],regions:["idf","ara","bre"],
    objectives:["Architecture Desigo CC","Intégration BACnet/Modbus","Programmation automates","Maintenance et diagnostics distants"]},
  {id:9,source:"hager",sourceLabel:"Hager",sourceColor:"#e55e0a",
    emoji:"🎓",thumbBg:"linear-gradient(135deg,#f3f4f6,#e5e7eb)",
    title:"Micro-learning : lire un schéma électrique tertiaire",
    desc:"10 minutes pour (re)maîtriser la lecture des plans et schémas de tableaux électriques.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"10 min",format:"Micro-learning",badges:[{t:"Gratuit",c:"cb-free"}],
    themes:["TGBT Intelligent"],regions:["all"],
    objectives:["Symboles normalisés","Lecture schéma unifilaire","Identification des protections","Conformité NF C 15-100"]},
];
const PARCOURS=[
  {num:"00",icon:"🌱",bg:"var(--green-lt)",iconBg:"#dcfce7",barColor:"var(--green)",
    title:"Passerelle Reconversion",sub:"Tu n'es pas électricien — mais tu pourrais le devenir.",
    topics:["Comprendre les bases de l'électricité","Les métiers de la filière électrique","Débouchés et formations diplômantes","Financer sa reconversion (CPF, Pôle emploi)","Premiers gestes de sécurité électrique"],
    count:"6 formations · 8h · Accès libre"},
  {num:"01",icon:"⚡",bg:"var(--blue-lt)",iconBg:"#dbeafe",barColor:"var(--blue)",
    title:"Familiarisation Électrique",sub:"Prendre en main les produits essentiels",
    topics:["Disjoncteurs et protection","Variateurs de vitesse","IHM et afficheurs","Bases domotique","Introduction TGBT"],
    count:"12 formations · 18h"},
  {num:"02",icon:"🔧",bg:"var(--violet-lt)",iconBg:"#ede9fe",barColor:"var(--violet)",
    title:"Solutions Tertiaires",sub:"Assembler et configurer des systèmes complets",
    topics:["TGBT intelligent PowerTags","Supervision PME","Efficacité énergétique","Installation IRVE","GTB/GTC basique"],
    count:"18 formations · 42h"},
  {num:"03",icon:"🚀",bg:"var(--orange-lt)",iconBg:"#ffedd5",barColor:"var(--orange)",
    title:"Expertise & Numérique",sub:"Maîtriser les technologies avancées",
    topics:["Cybersécurité des réseaux","Cobotique / automatisation","Réseaux IoT industriels","Analyse données énergie","Interopérabilité systèmes"],
    count:"9 formations · 35h"},
];
const FINANCEMENT=[
  {icon:"💳",title:"CPF — Compte Personnel Formation",desc:"Toutes les formations certifiantes éligibles au CPF sont directement accessibles depuis la plateforme. Dépôt simplifié et accompagnement inclus.",amount:"Jusqu'à 1 500 €/an"},
  {icon:"🏢",title:"OPCO — Financement entreprise",desc:"Vos cotisations financent vos formations via votre OPCO. Accompagnement dans les démarches administratives inclus.",amount:"Prise en charge totale possible"},
  {icon:"🗺️",title:"Aides Régionales & ADEME",desc:"Dispositifs régionaux et aides ADEME pour la transition énergétique. Cartographie des aides disponibles par département.",amount:"Variables selon territoire"},
];

/* ─────────── MODAL ─────────── */

const EVENTS = [
  {id:1,
   orga:"2 Watts",orga_type:"association",orga_color:"#f97316",orga_icon:"⚡",
   title:"Meetup électriciens connectés — Paris",
   desc:"Rencontre informelle entre électriciens installateurs spécialisés solutions connectées. Retours terrain, démo produits et échanges entre pairs.",
   date:"2026-04-05",time:"09h00",duration:"3h",
   format:"Présentiel",lieu:"Paris 11e — 42 rue de la Roquette",
   places:30,places_dispo:8,
   themes:["Domotique","IRVE","Smart Home"],
   type:"meetup",gratuit:true},
  {id:2,
   orga:"CentraleSupélec",orga_type:"école",orga_color:"#1a56db",orga_icon:"🎓",
   title:"Conférence : IA et réseaux électriques intelligents",
   desc:"Les applications de l'intelligence artificielle pour la supervision et la gestion prédictive des réseaux électriques. Intervenants : chercheurs et industriels.",
   date:"2026-04-12",time:"14h00",duration:"2h",
   format:"Hybride (présentiel + live)",lieu:"CentraleSupélec — Gif-sur-Yvette",
   places:120,places_dispo:45,
   themes:["Réseaux","GTB/GTC","IA","Smart Grid"],
   type:"conference",gratuit:true},
  {id:3,
   orga:"LP Léonard de Vinci",orga_type:"lycée pro",orga_color:"#7c3aed",orga_icon:"🏫",
   title:"Journée portes ouvertes — BAC PRO MELEC",
   desc:"Découvrez la formation BAC PRO Métiers de l'Électricité et de ses Environnements Connectés. Visite des ateliers, rencontre avec les enseignants et les élèves.",
   date:"2026-04-19",time:"09h00",duration:"6h",
   format:"Présentiel",lieu:"LP Léonard de Vinci — Melun (77)",
   places:60,places_dispo:22,
   themes:["Formation initiale","MELEC","Apprentissage"],
   type:"portes_ouvertes",gratuit:true},
  {id:4,
   orga:"2 Watts",orga_type:"association",orga_color:"#f97316",orga_icon:"⚡",
   title:"Atelier pratique : TGBT intelligent & PowerTags",
   desc:"Session hands-on sur l'installation et la configuration d'un tableau général basse tension connecté avec capteurs PowerTags Schneider Electric. Matériel fourni.",
   date:"2026-04-26",time:"09h00",duration:"4h",
   format:"Présentiel",lieu:"Espace Coworking La Forge — Lyon 2e",
   places:16,places_dispo:3,
   themes:["TGBT","PowerTags","EcoStruxure"],
   type:"atelier",gratuit:false,prix:"35€"},
  {id:5,
   orga:"INSA Lyon",orga_type:"école",orga_color:"#0ea5e9",orga_icon:"🎓",
   title:"Webinaire : Cybersécurité des systèmes SCADA et GTB",
   desc:"Les vulnérabilités des systèmes de supervision industrielle et bâtimentaire. Bonnes pratiques et cas réels d'incidents. Accès libre sur inscription.",
   date:"2026-05-06",time:"10h00",duration:"1h30",
   format:"Distanciel (Zoom)",lieu:"En ligne",
   places:200,places_dispo:112,
   themes:["Cybersécurité","SCADA","GTB/GTC"],
   type:"webinaire",gratuit:true},
  {id:6,
   orga:"LP Paul Bert",orga_type:"lycée pro",orga_color:"#7c3aed",orga_icon:"🏫",
   title:"Forum des métiers de l'électricité & transition énergétique",
   desc:"Rencontre entre lycéens, apprentis, professionnels et recruteurs autour des métiers de l'électricité. Stands, témoignages, offres d'alternance.",
   date:"2026-05-14",time:"09h30",duration:"5h",
   format:"Présentiel",lieu:"LP Paul Bert — Paris 11e",
   places:200,places_dispo:80,
   themes:["Orientation","Recrutement","Alternance"],
   type:"forum_metiers",gratuit:true},
  {id:7,
   orga:"Association CAPEB",orga_type:"association",orga_color:"#16a34a",orga_icon:"🤝",
   title:"Réunion régionale : nouvelles normes IRVE 2026",
   desc:"Point sur les évolutions réglementaires des installations IRVE applicables depuis janvier 2026. Questions/réponses avec les experts de la fédération.",
   date:"2026-05-20",time:"18h00",duration:"2h",
   format:"Hybride",lieu:"Siège CAPEB Île-de-France — Paris 15e",
   places:80,places_dispo:35,
   themes:["IRVE","Réglementation","NF C 15-100"],
   type:"reunion",gratuit:true},
  {id:8,
   orga:"2 Watts",orga_type:"association",orga_color:"#f97316",orga_icon:"⚡",
   title:"Hackathon : solutions connectées pour le petit tertiaire",
   desc:"48h pour concevoir des solutions innovantes d'efficacité énergétique pour le petit tertiaire (boulangeries, commerces, PME). En équipes de 3 à 5.",
   date:"2026-06-06",time:"09h00",duration:"48h",
   format:"Présentiel",lieu:"Station F — Paris 13e",
   places:100,places_dispo:52,
   themes:["Innovation","Tertiaire","Efficacité énergie"],
   type:"hackathon",gratuit:true},
];

const EVT_TYPE_LABELS = {meetup:"Meetup",conference:"Conférence",atelier:"Atelier pratique",webinaire:"Webinaire",portes_ouvertes:"Portes ouvertes",forum_metiers:"Forum métiers",reunion:"Réunion",hackathon:"Hackathon"};
const EVT_TYPE_ICONS = {meetup:"🤝",conference:"🎤",atelier:"🔧",webinaire:"💻",portes_ouvertes:"🚪",forum_metiers:"💼",reunion:"📋",hackathon:"💡"};

function fmtDate(d){
  if(!d) return "";
  const [y,m,day]=d.split("-");
  const months=["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}
function daysUntil(d){
  const now=new Date(); const ev=new Date(d);
  return Math.ceil((ev-now)/(1000*60*60*24));
}

function CourseModal({course,onClose,onAdd}){
  if(!course)return null;
  return(
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
              <Logo id={course.source} h={18}/>
              <span style={{fontSize:".68rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:".06em"}}>{course.sourceLabel}</span>
            </div>
            <h2 id="modal-title" style={{fontWeight:800,fontSize:"1.3rem",color:"var(--text)",lineHeight:1.2,letterSpacing:"-.02em"}}>{course.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid3">
            {[["Format",course.format],["Durée",course.duration],["Niveau",course.level]].map(([k,v])=>(
              <div key={k} className="mstat"><div className="mstat-k">{k}</div><div className="mstat-v">{v}</div></div>
            ))}
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <div className="m-section-title">Description</div>
            <p style={{fontSize:".85rem",color:"var(--text2)",lineHeight:1.7}}>{course.desc}</p>
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <div className="m-section-title">Objectifs pédagogiques</div>
            {course.objectives.map((o,i)=><div key={i} className="m-obj">{o}</div>)}
          </div>
          <div style={{marginBottom:"1rem"}}>
            <div className="m-section-title">Badges & Certifications</div>
            <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
              {course.badges.map(b=><span key={b.t} className={`cbadge ${b.c}`}>{b.t}</span>)}
            </div>
          </div>
          <div className="m-actions">
            <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{onAdd(course);onClose();}}>
              + Ajouter au parcours
            </button>
            <button className="btn-secondary" onClick={onClose}>Accéder à la formation →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── PAGE BANNER ─────────── */
function PageBanner({tag,title,sub,showA11y=false}){
  return(
    <div className="page-banner" role="banner">
      <div className="banner-inner">
        <div className="banner-chip"><span className="banner-dot"/>{tag}</div>
        <h1 className="banner-h1">{title}</h1>
        {sub&&<p className="banner-sub">{sub}</p>}
        {showA11y&&(
          <div className="banner-wcag" aria-label="Conformité accessibilité">
            <span className="wcag-tag">WCAG 2.1 AA</span>
            <span style={{color:"rgba(255,255,255,.7)"}}>|</span>
            <span className="wcag-todo">RGAA — Vérification en cours</span>
            <span style={{marginLeft:"4px",fontSize:".72rem"}}>Accessibilité numérique</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── HERO VISUAL ─────────── */
function HeroRight(){
  return(
    <div className="hero-right">
      <div className="hero-photo-wrap">
        <div className="corner corner-tl" aria-hidden="true"/>
        <div className="corner corner-br" aria-hidden="true"/>
        {/* ── Photo réelle : électricien installant une borne IRVE ── */}
        <img
          src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA5LjEtYzAwMiA3OS5iN2M2NGNjZjksIDIwMjQvMDcvMTYtMTI6Mzk6MDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNi4xIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCOTMwQ0E2RkM2QkMxMUVGQjIwQ0I5MzU1ODc1RUZCNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCOTMwQ0E3MEM2QkMxMUVGQjIwQ0I5MzU1ODc1RUZCNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI5MzBDQTZEQzZCQzExRUZCMjBDQjkzNTU4NzVFRkI0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI5MzBDQTZFQzZCQzExRUZCMjBDQjkzNTU4NzVFRkI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAEAsLCwwLEAwMEBcPDQ8X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"
          alt="Électricienne en tenue de chantier travaillant sur un tableau électrique industriel"
          style={{
            width:"100%",
            height:430,
            objectFit:"cover",
            objectPosition:"center top",
            borderRadius:"var(--rl)",
            boxShadow:"var(--sh-xl)",
            display:"block"
          }}
        />
        {/* Card 1 — Prochain événement */}
        <div className="fcard fc1" style={{width:210}} aria-hidden="true">
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
            <div style={{width:26,height:26,borderRadius:7,background:"#f97316" + "20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",flexShrink:0}}>⚡</div>
            <div style={{fontSize:".56rem",fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".06em"}}>Prochain événement</div>
          </div>
          <div style={{fontSize:".78rem",fontWeight:800,color:"var(--text)",lineHeight:1.25,marginBottom:5}}>Meetup électriciens connectés</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
            <span style={{fontSize:".62rem",fontWeight:700,color:"#f97316",background:"#f9731610",padding:"2px 7px",borderRadius:5}}>2 Watts</span>
          </div>
          <div style={{fontSize:".62rem",color:"var(--text3)",marginBottom:8}}>📅 5 avr · 09h00 · Paris 11e</div>
          <button style={{width:"100%",background:"#f97316",color:"white",border:"none",borderRadius:7,padding:"5px 0",fontSize:".65rem",fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Voir & s'inscrire →
          </button>
        </div>
        {/* Card 2 — Certif */}
        <div className="fcard fc2" aria-hidden="true">
          <div className="fc-head">
            <div className="fc-ico" style={{background:"var(--blue-lt)"}}>🏅</div>
            <div className="fc-lbl">Certification</div>
          </div>
          <div className="fc-val">IRVE</div>
          <div className="fc-sub">QUALIFELEC · CPF éligible</div>
        </div>
        {/* Card 3 — Expert live */}
        <div className="fcard fc3" aria-hidden="true">
          <div className="fc-live-row">
            <div className="fc-live-dot"/>
            <div className="fc-lbl">Expert disponible</div>
          </div>
          <div style={{fontSize:".78rem",color:"var(--text2)",marginTop:"5px"}}>Attente : <strong style={{color:"var(--text)"}}>~2 min</strong></div>
          <div style={{fontSize:".65rem",color:"var(--text3)",marginTop:"3px"}}>Support chantier en direct</div>
        </div>
      </div>
    </div>
  );
}


/* ─────────── CO2 IMPACT COMPONENT ─────────── */
function CO2Banner(){
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(n=>n+1),3000);return()=>clearInterval(t);},[]);
  
  // Simulated live counter: grows slowly
  const baseKg = 142800; // kg CO2 évités cumulés depuis lancement
  const liveKg = baseKg + tick * 7; // +7kg toutes les 3s (nouvelles formations)
  const tonnes = (liveKg/1000).toFixed(1);
  
  const metrics = [
    {val:"3 840", lbl:"Électriciens formés"},
    {val:"12 600", lbl:"Installations vertes"},
    {val:"142 t", lbl:"CO₂ évités"},
    {val:"€2.4M", lbl:"Économies clients"},
  ];
  
  const progress = [
    {label:"Objectif 2026 — 500 t CO₂ évités", pct:28},
    {label:"Électriciens certifiés IRVE", pct:62},
  ];

  return(
    <div className="co2-banner" role="region" aria-label="Impact environnemental de la plateforme">
      <div className="co2-inner">
        <div className="co2-left">
          <div className="co2-chip">
            <span>🌱</span> Impact en temps réel
          </div>
          <div className="co2-title">
            <span className="co2-num">{(liveKg/1000).toFixed(1)} t</span> CO₂ évités
          </div>
          <div className="co2-sub">
            Grâce aux formations suivies sur Les Éclaireurs!, les électriciens accélèrent
            l'électrification — chaque compétence acquise réduit les émissions.
          </div>
          <div className="co2-progress">
            {progress.map(p=>(
              <div key={p.label} style={{marginBottom:"10px"}}>
                <div className="co2-prog-head">
                  <span className="co2-prog-label">{p.label}</span>
                  <span className="co2-prog-pct">{p.pct}%</span>
                </div>
                <div className="co2-track">
                  <div className="co2-fill" style={{"--w":`${p.pct}%`,width:`${p.pct}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="co2-metrics">
          {metrics.map(m=>(
            <div key={m.lbl} className="co2-metric">
              <div className="co2-metric-val">{m.val}</div>
              <div className="co2-metric-lbl">{m.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── FORUM DATA ─────────── */
const FORUM_CATS=[
  {id:"all",icon:"💬",label:"Tous les sujets",color:"var(--blue)",bg:"var(--blue-lt)",count:200,last:"Il y a 2 min"},
  {id:"irve",icon:"🔌",label:"IRVE & Bornes de recharge",color:"var(--blue)",bg:"var(--blue-lt)",count:42,last:"Il y a 12 min"},
  {id:"solaire",icon:"☀️",label:"Solaire PV & Autoconsommation",color:"var(--yellow)",bg:"var(--yellow-lt)",count:31,last:"Il y a 34 min"},
  {id:"domotique",icon:"🏠",label:"Domotique & Wiser",color:"var(--violet)",bg:"var(--violet-lt)",count:58,last:"Il y a 2h"},
  {id:"tgbt",icon:"⚡",label:"TGBT & Tableaux intelligents",color:"var(--green)",bg:"var(--green-lt)",count:27,last:"Il y a 1h"},
  {id:"gtb",icon:"🏢",label:"GTB / GTC & Supervision",color:"var(--cyan)",bg:"var(--cyan-lt)",count:19,last:"Il y a 3h"},
  {id:"reseaux",icon:"🌐",label:"Réseaux & IoT",color:"var(--orange)",bg:"var(--orange-lt)",count:23,last:"Il y a 5h"},
];
const FORUM_POSTS=[
  {id:1,cat:"irve",author:"Antoine G.",avatar:"👷",role:"Électricien installateur",time:"Il y a 12 min",
    title:"Borne Schneider EVlink Pro AC — erreur E4 au démarrage",
    body:"Bonjour à tous, j'ai installé une EVlink Pro AC hier chez un client, tout s'est bien passé mais au premier démarrage j'ai une erreur E4. J'ai vérifié le câblage, tout est bon. Quelqu'un a déjà eu ce problème ?",
    tags:["IRVE","Schneider Electric","EVlink"],replies:8,likes:12,solved:false,
    answers:[
      {author:"Marc D.",avatar:"🧑‍🔧",role:"EcoXpert Schneider Electric",time:"Il y a 8 min",body:"E4 c'est généralement une erreur de communication avec le compteur. Vérifie que le câble Modbus est bien branché sur les bornes A/B du tableau. As-tu configuré l'adresse Modbus dans le menu ?",likes:7,best:true},
      {author:"Sophie L.",avatar:"👩‍🔧",role:"Électricienne",time:"Il y a 5 min",body:"J'ai eu la même chose ! Chez moi c'était un problème de phase. Vérifie que la phase N est bien présente.",likes:3,best:false},
    ]},
  {id:2,cat:"solaire",author:"Pierre M.",avatar:"🧑‍💼",role:"Installateur PV",time:"Il y a 34 min",
    title:"Dimensionnement onduleur pour installation 9 kWc en autoconsommation totale",
    body:"Je dois installer 9 kWc sur une maison avec une conso annuelle de 12 000 kWh. Le client veut de l'autoconsommation totale avec stockage. Quelqu'un a des retours sur les onduleurs hybrides Fronius vs SMA ?",
    tags:["Solaire PV","Onduleur","Stockage"],replies:5,likes:9,solved:true,
    answers:[
      {author:"Jean-Paul R.",avatar:"👨‍🔧",role:"Expert Solaire",time:"Il y a 20 min",body:"Pour 9 kWc en autoconso totale je recommande le SMA Sunny Tripower Smart Energy. Très bon retour d'expérience sur 2 ans. Le Fronius Gen24 est bien aussi mais plus cher. Tu veux que je te partage ma fiche de dimensionnement ?",likes:11,best:true},
    ]},
  {id:3,cat:"domotique",author:"Lucie B.",avatar:"👩‍💼",role:"Électricienne",time:"Il y a 2h",
    title:"Wiser — impossible de connecter les thermostats en ZigBee après mise à jour",
    body:"Depuis la dernière mise à jour de l'app Wiser, mes thermostats ne se connectent plus au hub. J'ai essayé de les réinitialiser mais rien ne change. Quelqu'un a une solution ?",
    tags:["Wiser","Domotique","ZigBee"],replies:12,likes:6,solved:true,
    answers:[
      {author:"Thomas K.",avatar:"🧑‍🔧",role:"Technicien Schneider Electric",time:"Il y a 1h30",body:"Problème connu avec la v2.8.1 ! Il faut faire une réinitialisation complète du hub : maintenir le bouton reset 10 secondes, puis réappairer les thermostats un par un. Schneider a publié un patch ce matin.",likes:18,best:true},
    ]},
  {id:4,cat:"tgbt",author:"Karim A.",avatar:"👨‍💼",role:"Tableautier",time:"Il y a 1h",
    title:"PowerTag E — pas de remontée de données dans PME après configuration",
    body:"J'ai installé 6 PowerTag E sur un TGBT pour un client tertiaire. La config réseau est OK, les LEDs clignotent bien mais dans PME je ne vois aucune donnée remonter. J'ai suivi le guide Schneider à la lettre.",
    tags:["PowerTag","PME","TGBT"],replies:3,likes:4,solved:false,
    answers:[
      {author:"Nadia F.",avatar:"👩‍🔧",role:"EcoXpert Schneider Electric",time:"Il y a 45 min",body:"Vérifie l'adresse IP de ton Smartlink SI et assure-toi qu'il est bien sur le même sous-réseau que PME. Aussi, dans PME va dans Paramètres > Sources > Smartlink et rafraîchis la découverte automatique.",likes:5,best:false},
    ]},
  {id:5,cat:"reseaux",author:"Romain S.",avatar:"🧑‍💻",role:"Intégrateur systèmes",time:"Il y a 3h",
    title:"Protocole KNX vs Modbus pour GTB tertiaire — retours d'expérience",
    body:"Je dois proposer une solution GTB pour un immeuble de bureaux 2000m². Mon client hésite entre KNX et Modbus TCP. Des retours d'expérience sur les deux dans ce type de projet ?",
    tags:["KNX","Modbus","GTB"],replies:7,likes:15,solved:false,
    answers:[
      {author:"Claire V.",avatar:"👩‍💼",role:"Ingénieure GTB",time:"Il y a 2h",body:"Pour du tertiaire neuf de cette taille, je recommande KNX pour la partie éclairage/stores/CVC et Modbus TCP pour les équipements électriques (TGBT, compteurs). Les deux protocoles sont complémentaires.",likes:9,best:true},
    ]},
];

/* ── Community SVG Illustration ── */
function CommunityIllo(){
  return(
    <div className="community-illo" aria-hidden="true">
      <svg width="100%" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#eff6ff"/><stop offset="100%" stopColor="#f5f3ff"/>
          </linearGradient>
        </defs>
        <rect width="600" height="160" fill="url(#bg2)" rx="12"/>

        {/* Person 1 — left */}
        <g transform="translate(60,20)">
          <circle cx="30" cy="28" r="22" fill="#dbeafe"/>
          <circle cx="30" cy="20" r="10" fill="#f5d0a9"/>
          <path d="M18 28 Q18 14 30 14 Q42 14 42 28" fill="#f5d0a9"/>
          <rect x="18" y="28" width="24" height="28" rx="6" fill="#1a56db"/>
          <rect x="6" y="30" width="10" height="18" rx="4" fill="#1a56db"/>
          <rect x="44" y="30" width="10" height="18" rx="4" fill="#1a56db"/>
          <rect x="20" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <rect x="31" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <rect x="16" y="13" width="28" height="10" rx="5" fill="#f59e0b"/>
          <text x="30" y="95" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="700">Antoine</text>
          <text x="30" y="106" textAnchor="middle" fill="#6b7280" fontSize="7">Électricien</text>
        </g>

        {/* Person 2 — center left */}
        <g transform="translate(170,15)">
          <circle cx="30" cy="28" r="22" fill="#dcfce7"/>
          <circle cx="30" cy="20" r="10" fill="#c8a882"/>
          <path d="M18 28 Q18 14 30 14 Q42 14 42 28" fill="#c8a882"/>
          <rect x="18" y="28" width="24" height="28" rx="6" fill="#16a34a"/>
          <rect x="6" y="30" width="10" height="18" rx="4" fill="#16a34a"/>
          <rect x="44" y="30" width="10" height="18" rx="4" fill="#16a34a"/>
          <rect x="20" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <rect x="31" y="56" width="9" height="20" rx="4" fill="#374151"/>
          {/* long hair */}
          <path d="M18 14 Q14 30 16 40" stroke="#4a2" strokeWidth="4" fill="none"/>
          <path d="M42 14 Q46 30 44 40" stroke="#4a2" strokeWidth="4" fill="none"/>
          <text x="30" y="95" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="700">Sophie</text>
          <text x="30" y="106" textAnchor="middle" fill="#6b7280" fontSize="7">Installatrice PV</text>
        </g>

        {/* Person 3 — center */}
        <g transform="translate(280,10)">
          <circle cx="30" cy="32" r="26" fill="#ede9fe"/>
          <circle cx="30" cy="22" r="12" fill="#f5d0a9"/>
          <path d="M16 32 Q16 16 30 16 Q44 16 44 32" fill="#f5d0a9"/>
          <rect x="16" y="32" width="28" height="32" rx="7" fill="#7c3aed"/>
          <rect x="4" y="34" width="11" height="20" rx="4" fill="#7c3aed"/>
          <rect x="45" y="34" width="11" height="20" rx="4" fill="#7c3aed"/>
          <rect x="18" y="64" width="10" height="22" rx="4" fill="#374151"/>
          <rect x="32" y="64" width="10" height="22" rx="4" fill="#374151"/>
          <rect x="17" y="14" width="26" height="11" rx="5" fill="#f59e0b"/>
          <circle cx="30" cy="12" r="4" fill="#d97706"/>
          <text x="30" y="105" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="700">Marc</text>
          <text x="30" y="116" textAnchor="middle" fill="#6b7280" fontSize="7">EcoXpert</text>
        </g>

        {/* Person 4 — center right */}
        <g transform="translate(390,15)">
          <circle cx="30" cy="28" r="22" fill="#fff7ed"/>
          <circle cx="30" cy="20" r="10" fill="#e8b88a"/>
          <path d="M18 28 Q18 14 30 14 Q42 14 42 28" fill="#e8b88a"/>
          <rect x="18" y="28" width="24" height="28" rx="6" fill="#f97316"/>
          <rect x="6" y="30" width="10" height="18" rx="4" fill="#f97316"/>
          <rect x="44" y="30" width="10" height="18" rx="4" fill="#f97316"/>
          <rect x="20" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <rect x="31" y="56" width="9" height="20" rx="4" fill="#374151"/>
          {/* long hair */}
          <path d="M18 14 Q12 28 14 42" stroke="#b45309" strokeWidth="5" fill="none"/>
          <path d="M42 14 Q48 28 46 42" stroke="#b45309" strokeWidth="5" fill="none"/>
          <text x="30" y="95" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="700">Lucie</text>
          <text x="30" y="106" textAnchor="middle" fill="#6b7280" fontSize="7">Tableautière</text>
        </g>

        {/* Person 5 — right */}
        <g transform="translate(500,20)">
          <circle cx="30" cy="28" r="22" fill="#e0f2fe"/>
          <circle cx="30" cy="20" r="10" fill="#a07850"/>
          <path d="M18 28 Q18 14 30 14 Q42 14 42 28" fill="#a07850"/>
          <rect x="18" y="28" width="24" height="28" rx="6" fill="#0ea5e9"/>
          <rect x="6" y="30" width="10" height="18" rx="4" fill="#0ea5e9"/>
          <rect x="44" y="30" width="10" height="18" rx="4" fill="#0ea5e9"/>
          <rect x="20" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <rect x="31" y="56" width="9" height="20" rx="4" fill="#374151"/>
          <text x="30" y="95" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="700">Karim</text>
          <text x="30" y="106" textAnchor="middle" fill="#6b7280" fontSize="7">Intégrateur</text>
        </g>

        {/* Speech bubbles */}
        <g>
          <rect x="78" y="2" width="70" height="20" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <polygon points="88,22 95,22 91,28" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <text x="113" y="16" textAnchor="middle" fill="#1a56db" fontSize="7" fontWeight="700">Erreur E4 ? 🤔</text>
        </g>
        <g>
          <rect x="250" y="0" width="90" height="20" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <polygon points="260,20 267,20 263,26" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <text x="295" y="14" textAnchor="middle" fill="#16a34a" fontSize="7" fontWeight="700">✓ Résolu ! Merci 🙌</text>
        </g>
        <g>
          <rect x="430" y="2" width="90" height="20" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <polygon points="440,22 447,22 443,28" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
          <text x="475" y="16" textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="700">KNX ou Modbus ?</text>
        </g>

        {/* Connection lines */}
        <line x1="120" y1="80" x2="200" y2="80" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4,3"/>
        <line x1="230" y1="80" x2="310" y2="80" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4,3"/>
        <line x1="340" y1="80" x2="420" y2="80" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4,3"/>
        <line x1="450" y1="80" x2="530" y2="80" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4,3"/>
        {/* center hub */}
        <circle cx="300" cy="80" r="8" fill="white" stroke="var(--blue-md)" strokeWidth="2"/>
        <text x="300" y="84" textAnchor="middle" fontSize="8">⚡</text>
      </svg>
    </div>
  );
}

/* ─────────── APP ─────────── */
/* ─────────── DEPOT WIZARD COMPONENT ─────────── */
const WIZARD_STEPS = [
  {num:1, label:"Informations générales", sub:"Titre, domaine, niveau et durée", icon:"📋"},
  {num:2, label:"Description & objectifs", sub:"Contenu, prérequis, compétences visées", icon:"📝"},
  {num:3, label:"Vidéo & documents", sub:"Lien vidéo, PDF, supports pédagogiques", icon:"🎬"},
  {num:4, label:"Confirmation", sub:"Relisez et soumettez votre tuto", icon:"✅"},
];
const DOMAINES_DEPOT = ["Photovoltaïque","IRVE / Bornes de recharge","Domotique / Wiser","GTB / GTC","TGBT intelligent","Réseaux électriques","Gestion de l'énergie","Cybersécurité","Autre"];
const NIVEAUX_DEPOT = ["Débutant","Intermédiaire","Avancé","Expert"];

function DepotWizard(){
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [videoTab, setVideoTab] = useState("youtube");
  const [tagInput, setTagInput] = useState("");

  // Form state
  const [form, setForm] = useState({
    titre:"", domaine:"", niveau:"", duree:"", prix:"", tags:[],
    description:"", objectifs:"", prerequis:"", competences:"",
    videoUrl:"", videoPlatform:"youtube", pdfName:"", coverName:"",
  });

  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const addTag = e => {
    if((e.key==="Enter"||e.key===",") && tagInput.trim()){
      e.preventDefault();
      if(!form.tags.includes(tagInput.trim())) upd("tags",[...form.tags,tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = t => upd("tags", form.tags.filter(x=>x!==t));

  const canNext = () => {
    if(step===1) return form.titre.trim()&&form.domaine&&form.niveau;
    if(step===2) return form.description.trim().length>30;
    if(step===3) return form.videoUrl.trim()||form.pdfName;
    return true;
  };

  const getVideoEmbed = () => {
    const url = form.videoUrl;
    if(!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
    if(ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return null;
  };

  if(submitted) return (
    <div className="section"><div className="section-inner">
      <div className="wsuccess">
        <div className="wsuccess-ico">🎉</div>
        <h2 className="wsuccess-title">Tuto soumis avec succès !</h2>
        <p className="wsuccess-sub">Votre formation <strong>"{form.titre}"</strong> a bien été reçue. Notre équipe pédagogique la vérifiera sous <strong>48h ouvrées</strong> avant publication sur la plateforme.</p>
        <div className="wsuccess-badges">
          <span style={{background:"var(--green-lt)",color:"var(--green)",border:"1px solid var(--green-md)",borderRadius:"var(--rf)",padding:"6px 16px",fontSize:".78rem",fontWeight:700}}>✅ Soumission enregistrée</span>
          <span style={{background:"var(--blue-lt)",color:"var(--blue)",border:"1px solid var(--blue-md)",borderRadius:"var(--rf)",padding:"6px 16px",fontSize:".78rem",fontWeight:700}}>📧 Email de confirmation envoyé</span>
          <span style={{background:"var(--yellow-lt)",color:"#92400e",border:"1px solid var(--yellow-md)",borderRadius:"var(--rf)",padding:"6px 16px",fontSize:".78rem",fontWeight:700}}>⏳ Vérification sous 48h</span>
        </div>
        <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
          <button className="cta-btn" onClick={()=>{setSubmitted(false);setStep(1);setForm({titre:"",domaine:"",niveau:"",duree:"",prix:"",tags:[],description:"",objectifs:"",prerequis:"",competences:"",videoUrl:"",videoPlatform:"youtube",pdfName:"",coverName:""});}}>
            + Soumettre un autre tuto
          </button>
          <button className="cta-outline" onClick={()=>{}}>Voir mes soumissions</button>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="section" style={{paddingTop:0}}>
      <PageBanner tag="📤 Partage de savoir" title="Déposer un tutoriel" sub="Partagez votre expertise avec la communauté. Chaque tuto publié renforce les compétences de la filière électrique." showA11y/>
      <div className="section-inner" style={{paddingTop:"2rem"}}>
        <div className="wizard-wrap">

          {/* ── Sidebar steps ── */}
          <aside>
            <div className="wizard-steps" role="navigation" aria-label="Étapes du dépôt">
              <div className="ws-header">Progression</div>
              {WIZARD_STEPS.map((s,i)=>(
                <div key={s.num}>
                  <button
                    className={`ws-item ${step===s.num?"active":""} ${step>s.num?"done":""}`}
                    onClick={()=>step>s.num&&setStep(s.num)}
                    aria-current={step===s.num?"step":undefined}
                    aria-label={`Étape ${s.num} : ${s.label}${step>s.num?" (complétée)":""}`}
                  >
                    <div className="ws-num">
                      {step>s.num ? "✓" : s.num}
                    </div>
                    <div>
                      <div className="ws-label">{s.icon} {s.label}</div>
                      <div className="ws-sub">{s.sub}</div>
                    </div>
                  </button>
                  {i<WIZARD_STEPS.length-1&&<div className="ws-connector"/>}
                </div>
              ))}
            </div>

            {/* Tip box */}
            <div className="wizard-tip">
              <div className="wtip-title">ℹ️ Bon à savoir</div>
              <div className="wtip-body">
                Les tutos déposés sont vérifiés par notre équipe pédagogique avant publication.<br/><br/>
                Délai : <strong>48h ouvrées</strong><br/>
                Formats vidéo : <strong>YouTube, Vimeo, lien direct</strong><br/>
                Formats docs : <strong>PDF, DOCX, MP4, ZIP</strong>
              </div>
            </div>
          </aside>

          {/* ── Main panel ── */}
          <div className="wizard-panel" role="main" aria-label={`Étape ${step} sur 4`}>

            {/* Panel header */}
            <div className="wp-head">
              <div className="wp-chip">Étape {step} sur 4 — {WIZARD_STEPS[step-1].label}</div>
              <div className="wp-title">
                {step===1&&"Informations générales"}
                {step===2&&"Description & objectifs"}
                {step===3&&"Vidéo & documents"}
                {step===4&&"Confirmation finale"}
              </div>
              <div className="wp-sub">
                {step===1&&"Les informations de base pour référencer votre formation dans le catalogue."}
                {step===2&&"Décrivez le contenu, les objectifs pédagogiques et les prérequis."}
                {step===3&&"Ajoutez le lien vidéo (YouTube, Vimeo...) et vos documents supports."}
                {step===4&&"Vérifiez tout avant de soumettre. Vous pouvez revenir en arrière pour corriger."}
              </div>
              {/* Progress bar */}
              <div className="wp-prog" aria-label={`Progression : étape ${step} sur 4`}>
                {[1,2,3,4].map(n=>(
                  <div key={n} className={`wp-prog-seg ${step===n?"active":""} ${step>n?"done":""}`}/>
                ))}
              </div>
            </div>

            {/* ── Step 1 : General info ── */}
            {step===1&&(
              <div className="wp-body">
                <div className="wfield">
                  <label className="wlabel">Titre de la formation <span className="wreq">*</span></label>
                  <input className="winput" placeholder="Ex : Installation d'une borne IRVE Schneider EVlink" value={form.titre} onChange={e=>upd("titre",e.target.value)} aria-required="true"/>
                </div>
                <div className="wgrid2">
                  <div className="wfield">
                    <label className="wlabel">Domaine <span className="wreq">*</span></label>
                    <select className="wselect" value={form.domaine} onChange={e=>upd("domaine",e.target.value)} aria-required="true">
                      <option value="">Choisir...</option>
                      {DOMAINES_DEPOT.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="wfield">
                    <label className="wlabel">Niveau <span className="wreq">*</span></label>
                    <select className="wselect" value={form.niveau} onChange={e=>upd("niveau",e.target.value)} aria-required="true">
                      <option value="">Choisir...</option>
                      {NIVEAUX_DEPOT.map(n=><option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="wgrid2">
                  <div className="wfield">
                    <label className="wlabel">Durée (minutes)</label>
                    <input className="winput" type="number" placeholder="Ex : 25" min="1" max="300" value={form.duree} onChange={e=>upd("duree",e.target.value)}/>
                  </div>
                  <div className="wfield">
                    <label className="wlabel">Prix (€) <span style={{fontSize:".65rem",color:"var(--text3)",fontWeight:400,textTransform:"none"}}>— 0 = gratuit</span></label>
                    <input className="winput" type="number" placeholder="0" min="0" value={form.prix} onChange={e=>upd("prix",e.target.value)}/>
                  </div>
                </div>
                <div className="wfield">
                  <label className="wlabel">Tags / Mots-clés <span style={{fontSize:".65rem",color:"var(--text3)",fontWeight:400,textTransform:"none"}}>— Appuyez Entrée pour valider</span></label>
                  <input className="winput" placeholder="Ex : IRVE, Schneider, installation..." value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={addTag}/>
                  {form.tags.length>0&&(
                    <div className="wtag-wrap" role="list" aria-label="Tags ajoutés">
                      {form.tags.map(t=>(
                        <span key={t} className="wtag" role="listitem">
                          {t}
                          <button className="wtag-remove" onClick={()=>removeTag(t)} aria-label={`Supprimer le tag ${t}`}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2 : Description ── */}
            {step===2&&(
              <div className="wp-body">
                <div className="wfield">
                  <label className="wlabel">Description du tuto <span className="wreq">*</span></label>
                  <textarea className="wtextarea" rows={4} placeholder="Décrivez en quelques phrases ce que l'électricien va apprendre, le contexte et l'intérêt pratique de ce tuto..." value={form.description} onChange={e=>upd("description",e.target.value)} aria-required="true" style={{minHeight:120}}/>
                  <div style={{fontSize:".65rem",color:form.description.length>30?"var(--green)":"var(--text3)",marginTop:"4px",textAlign:"right"}}>{form.description.length} / 30 min</div>
                </div>
                <div className="wfield">
                  <label className="wlabel">Objectifs pédagogiques</label>
                  <textarea className="wtextarea" rows={3} placeholder="À l'issue de ce tuto, l'apprenant saura...&#10;• Configurer une borne IRVE&#10;• Utiliser le logiciel de supervision..." value={form.objectifs} onChange={e=>upd("objectifs",e.target.value)} style={{minHeight:100}}/>
                </div>
                <div className="wgrid2">
                  <div className="wfield">
                    <label className="wlabel">Prérequis</label>
                    <textarea className="wtextarea" rows={3} placeholder="Connaissances ou matériel nécessaires avant ce tuto..." value={form.prerequis} onChange={e=>upd("prerequis",e.target.value)} style={{minHeight:80}}/>
                  </div>
                  <div className="wfield">
                    <label className="wlabel">Compétences visées</label>
                    <textarea className="wtextarea" rows={3} placeholder="Habilitations, certifications ou gestes techniques maîtrisés après ce tuto..." value={form.competences} onChange={e=>upd("competences",e.target.value)} style={{minHeight:80}}/>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3 : Media ── */}
            {step===3&&(
              <div className="wp-body">
                <div className="wfield">
                  <label className="wlabel">🎬 Vidéo du tutoriel <span className="wreq">*</span><span style={{fontSize:".65rem",color:"var(--text3)",fontWeight:400,textTransform:"none"}}> ou document PDF</span></label>
                  <div className="wvideo-wrap">
                    <div className="wvideo-tabs" role="tablist">
                      {[["youtube","▶ YouTube"],["vimeo","🎞 Vimeo"],["direct","🔗 Lien direct"]].map(([id,label])=>(
                        <button key={id} role="tab" aria-selected={videoTab===id} className={`wvtab ${videoTab===id?"active":""}`} onClick={()=>setVideoTab(id)}>{label}</button>
                      ))}
                    </div>
                    <div className="wvideo-body">
                      {videoTab==="youtube"&&<>
                        <label className="wlabel" style={{marginBottom:"8px"}}>URL YouTube</label>
                        <input className="winput" placeholder="https://www.youtube.com/watch?v=..." value={form.videoUrl} onChange={e=>upd("videoUrl",e.target.value)}/>
                        {form.videoUrl&&getVideoEmbed()&&(
                          <div style={{marginTop:"1rem",borderRadius:"10px",overflow:"hidden",maxHeight:160}}>
                            <img src={getVideoEmbed()} alt="Aperçu YouTube" style={{width:"100%",objectFit:"cover",borderRadius:10}}/>
                          </div>
                        )}
                        <p style={{fontSize:".72rem",color:"var(--text2)",marginTop:".5rem"}}>Collez l'URL de votre vidéo YouTube publiée ou non listée. Elle sera intégrée directement dans la fiche formation.</p>
                      </>}
                      {videoTab==="vimeo"&&<>
                        <label className="wlabel" style={{marginBottom:"8px"}}>URL Vimeo</label>
                        <input className="winput" placeholder="https://vimeo.com/123456789" value={form.videoUrl} onChange={e=>upd("videoUrl",e.target.value)}/>
                        <p style={{fontSize:".72rem",color:"var(--text2)",marginTop:".5rem"}}>Assurez-vous que la vidéo est publique ou accessible via lien.</p>
                      </>}
                      {videoTab==="direct"&&<>
                        <label className="wlabel" style={{marginBottom:"8px"}}>Lien direct vers la vidéo (MP4, MOV...)</label>
                        <input className="winput" placeholder="https://monsite.com/tuto-irve.mp4" value={form.videoUrl} onChange={e=>upd("videoUrl",e.target.value)}/>
                        <p style={{fontSize:".72rem",color:"var(--text2)",marginTop:".5rem"}}>Le fichier doit être accessible publiquement. Formats : MP4, MOV, WebM.</p>
                      </>}
                    </div>
                  </div>
                </div>

                <div className="wgrid2">
                  <div className="wfield">
                    <label className="wlabel">📄 Document support (PDF)</label>
                    <label className={`wupload ${form.pdfName?"has-file":""}`} style={{display:"block",cursor:"pointer"}}>
                      <input type="file" accept=".pdf,.docx,.zip" style={{display:"none"}} onChange={e=>upd("pdfName",e.target.files[0]?.name||"")}/>
                      <div className="wupload-ico">{form.pdfName?"📄":"📁"}</div>
                      <div className="wupload-label">{form.pdfName?"Document ajouté":"Glissez ou cliquez pour importer"}</div>
                      <div className="wupload-sub">PDF, DOCX, ZIP — max 20 Mo</div>
                      {form.pdfName&&<div className="wupload-badge">✓ {form.pdfName}</div>}
                    </label>
                  </div>
                  <div className="wfield">
                    <label className="wlabel">🖼 Image de couverture</label>
                    <label className={`wupload ${form.coverName?"has-file":""}`} style={{display:"block",cursor:"pointer"}}>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>upd("coverName",e.target.files[0]?.name||"")}/>
                      <div className="wupload-ico">{form.coverName?"🖼":"🖼"}</div>
                      <div className="wupload-label">{form.coverName?"Image ajoutée":"Glissez ou cliquez pour importer"}</div>
                      <div className="wupload-sub">JPG, PNG, WebP — max 5 Mo</div>
                      {form.coverName&&<div className="wupload-badge">✓ {form.coverName}</div>}
                    </label>
                  </div>
                </div>

                {/* Preview card */}
                {(form.titre||form.videoUrl)&&(
                  <div className="wfield">
                    <label className="wlabel">👁 Aperçu de la fiche</label>
                    <div className="wpreview">
                      <div className="wpreview-thumb">
                        {getVideoEmbed()
                          ? <img src={getVideoEmbed()} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                          : <span>🎬</span>
                        }
                      </div>
                      <div className="wpreview-body">
                        <div className="wpreview-title">{form.titre||"Titre de votre tuto"}</div>
                        <div className="wpreview-meta">
                          {form.domaine&&<span>🏷 {form.domaine}</span>}
                          {form.niveau&&<span>📊 {form.niveau}</span>}
                          {form.duree&&<span>⏱ {form.duree} min</span>}
                          {form.prix!==undefined&&form.prix!==""&&<span>💶 {form.prix==="0"||form.prix===""?"Gratuit":`${form.prix}€`}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 4 : Confirm ── */}
            {step===4&&(
              <div className="wp-body">
                <div style={{background:"var(--blue-lt)",border:"1.5px solid var(--blue-md)",borderRadius:"var(--r)",padding:"1rem 1.25rem",marginBottom:"1.5rem",display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:"1.2rem"}}>ℹ️</span>
                  <div style={{fontSize:".8rem",color:"var(--text2)",lineHeight:1.65}}>Vérifiez les informations ci-dessous avant de soumettre. Votre tuto sera examiné par notre équipe pédagogique sous <strong style={{color:"var(--blue)"}}>48h ouvrées</strong>.</div>
                </div>
                <div className="wconfirm-grid">
                  <div className="wconfirm-section">
                    <div className="wconfirm-title">📋 Informations générales</div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Titre</div><div className="wconfirm-val">{form.titre||"—"}</div></div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Domaine</div><div className="wconfirm-val">{form.domaine||"—"}</div></div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Niveau</div><div className="wconfirm-val">{form.niveau||"—"}</div></div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Durée</div><div className="wconfirm-val">{form.duree?`${form.duree} min`:"—"}</div></div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Prix</div><div className="wconfirm-val">{form.prix===""||form.prix==="0"?"Gratuit":`${form.prix}€`}</div></div>
                    {form.tags.length>0&&<div className="wconfirm-row"><div className="wconfirm-key">Tags</div><div className="wtag-wrap" style={{marginTop:4}}>{form.tags.map(t=><span key={t} className="wtag">{t}</span>)}</div></div>}
                  </div>
                  <div className="wconfirm-section">
                    <div className="wconfirm-title">📝 Description</div>
                    <div className="wconfirm-row"><div className="wconfirm-key">Description</div><div className="wconfirm-val" style={{fontSize:".78rem",lineHeight:1.6}}>{form.description||"—"}</div></div>
                    {form.objectifs&&<div className="wconfirm-row"><div className="wconfirm-key">Objectifs</div><div className="wconfirm-val" style={{fontSize:".78rem",lineHeight:1.6,whiteSpace:"pre-line"}}>{form.objectifs}</div></div>}
                    {form.prerequis&&<div className="wconfirm-row"><div className="wconfirm-key">Prérequis</div><div className="wconfirm-val" style={{fontSize:".78rem"}}>{form.prerequis}</div></div>}
                  </div>
                  <div className="wconfirm-section" style={{gridColumn:"1/-1"}}>
                    <div className="wconfirm-title">🎬 Média & Documents</div>
                    <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                      <div className="wconfirm-row" style={{flex:1}}><div className="wconfirm-key">Vidéo ({videoTab})</div><div className="wconfirm-val" style={{fontSize:".75rem",wordBreak:"break-all"}}>{form.videoUrl||"—"}</div></div>
                      <div className="wconfirm-row" style={{flex:1}}><div className="wconfirm-key">Document PDF</div><div className="wconfirm-val">{form.pdfName||"Aucun"}</div></div>
                      <div className="wconfirm-row" style={{flex:1}}><div className="wconfirm-key">Image couverture</div><div className="wconfirm-val">{form.coverName||"Aucune"}</div></div>
                    </div>
                  </div>
                </div>
                <div style={{background:"#fefce8",border:"1.5px solid #fde68a",borderRadius:"var(--r)",padding:".85rem 1.1rem",marginTop:"1rem",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span>⚠️</span>
                  <div style={{fontSize:".75rem",color:"#92400e",lineHeight:1.65}}>En soumettant ce tuto, vous certifiez être l'auteur du contenu et acceptez qu'il soit publié sous licence Creative Commons (CC BY-NC) sur la plateforme Les Éclaireurs! après validation.</div>
                </div>
              </div>
            )}

            {/* ── Nav buttons ── */}
            <div className="wp-nav">
              <button className="wp-back" onClick={()=>setStep(s=>Math.max(1,s-1))} style={{visibility:step===1?"hidden":"visible"}} aria-label="Étape précédente">← Retour</button>
              <div style={{fontSize:".72rem",color:"var(--text2)"}}>Étape {step} / 4</div>
              {step<4
                ? <button className="wp-next" onClick={()=>setStep(s=>s+1)} disabled={!canNext()} aria-label="Étape suivante" style={{opacity:canNext()?1:.45,cursor:canNext()?"pointer":"not-allowed"}}>
                    Suivant →
                  </button>
                : <button className="wp-next submit" onClick={()=>setSubmitted(true)} aria-label="Soumettre le tutoriel">
                    🚀 Soumettre le tuto
                  </button>
              }
            </div>

          </div>{/* wizard-panel */}
        </div>{/* wizard-wrap */}
      </div>
    </div>
  );
}


/* ─────────── EVENTS PAGE ─────────── */
function EventsPage({showToast}){
  const [typeFilter,setTypeFilter]=useState("all");
  const [orgaFilter,setOrgaFilter]=useState("all");
  const [registeredIds,setRegisteredIds]=useState([]);
  const [modalEvt,setModalEvt]=useState(null);

  const types=[
    {id:"all",label:"Tous les types"},
    {id:"meetup",label:"Meetups"},
    {id:"atelier",label:"Ateliers pratiques"},
    {id:"webinaire",label:"Webinaires"},
    {id:"conference",label:"Conférences"},
    {id:"portes_ouvertes",label:"Portes ouvertes"},
    {id:"forum_metiers",label:"Forums métiers"},
  ];
  const orgas=[
    {id:"all",label:"Tous les organisateurs"},
    {id:"association",label:"Associations"},
    {id:"école",label:"Grandes écoles"},
    {id:"lycée pro",label:"Lycées professionnels"},
  ];

  const filtered=EVENTS.filter(e=>
    (typeFilter==="all"||e.type===typeFilter)&&
    (orgaFilter==="all"||e.orga_type===orgaFilter)
  );

  function register(evt){
    if(registeredIds.includes(evt.id)){
      showToast("Vous êtes déjà inscrit(e) à cet événement !");
      return;
    }
    setRegisteredIds(ids=>[...ids,evt.id]);
    showToast(`✓ Inscription confirmée — ${evt.title.slice(0,35)}…`);
    setModalEvt(null);
  }

  return(
    <>
      <PageBanner tag="📅 Événements" title="Événements de la filière" sub="Meetups d'associations, conférences d'écoles, ateliers pratiques et portes ouvertes — rejoignez la communauté."/>
      <div className="evt-page">
        <div className="section-inner">
          {/* Filters */}
          <div style={{marginBottom:"1.5rem"}}>
            <div className="evt-filters" role="group" aria-label="Filtrer par type">
              {types.map(t=>(
                <button key={t.id} className={"evt-filter-btn "+(typeFilter===t.id?"active":"")}
                  onClick={()=>setTypeFilter(t.id)} aria-pressed={typeFilter===t.id}>
                  {t.id!=="all"&&EVT_TYPE_ICONS[t.id]+" "}{t.label}
                </button>
              ))}
            </div>
            <div className="evt-filters" role="group" aria-label="Filtrer par organisateur">
              {orgas.map(o=>(
                <button key={o.id} className={"evt-filter-btn "+(orgaFilter===o.id?"active":"")} style={{fontSize:".72rem"}}
                  onClick={()=>setOrgaFilter(o.id)} aria-pressed={orgaFilter===o.id}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"4rem 2rem",color:"var(--text2)"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📭</div>
              <div style={{fontWeight:700,color:"var(--text)"}}>Aucun événement pour ces filtres</div>
            </div>
          ):(
            <div className="evt-grid" role="list">
              {filtered.map(evt=>{
                const d=daysUntil(evt.date);
                const pctDispo=evt.places_dispo/evt.places;
                const fillClass=pctDispo<=0.1?"urgent":pctDispo<=0.25?"low":"";
                const isReg=registeredIds.includes(evt.id);
                const [evtY,evtM,evtD]=evt.date.split("-");
                const months=["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];
                return(
                  <article key={evt.id} className="evt-card" role="listitem" aria-label={"Événement : "+evt.title}
                    onClick={()=>setModalEvt(evt)}>
                    {/* ── VIGNETTE HEADER ── */}
                    <div className="evt-card-header" style={{background:"linear-gradient(135deg,"+evt.orga_color+"dd,"+evt.orga_color+"88)"}}>
                      <div className="evt-card-header-dots"/>
                      <div className="evt-card-header-glow"/>
                      <div className="evt-card-header-emoji">{evt.orga_icon}</div>
                      {/* Type chip top-left */}
                      <div className="evt-type-chip-hdr">
                        {EVT_TYPE_ICONS[evt.type]} {EVT_TYPE_LABELS[evt.type]}
                      </div>
                      {/* Date badge bottom-left */}
                      <div className="evt-date-badge">
                        <div className="evt-date-day">{parseInt(evtD)}</div>
                        <div className="evt-date-month">{months[parseInt(evtM)-1]}</div>
                      </div>
                      {/* Urgency tag top-right */}
                      {d<=7&&d>0&&(
                        <div style={{position:"absolute",top:10,right:10,background:"var(--red)",color:"white",fontSize:".58rem",fontWeight:700,padding:"3px 8px",borderRadius:"var(--rf)",zIndex:1}}>
                          ⚠️ J-{d}
                        </div>
                      )}
                    </div>
                    {/* ── BODY ── */}
                    <div className="evt-card-body">
                      <div className="evt-orga-pill" style={{color:evt.orga_color,background:evt.orga_color+"14",border:"1.5px solid "+evt.orga_color+"30"}}>
                        {evt.orga_icon} {evt.orga}
                        <span style={{fontWeight:500,opacity:.65,fontSize:".58rem"}}>· {evt.orga_type}</span>
                      </div>
                      <div className="evt-title">{evt.title}</div>
                      <div className="evt-info-row">⏰ <strong>{evt.time}</strong>&nbsp;·&nbsp;{evt.duration}&nbsp;·&nbsp;{evt.format}</div>
                      <div className="evt-info-row">📍 <strong style={{maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}}>{evt.lieu}</strong></div>
                      <div className="evt-tags">
                        {evt.themes.map(t=><span key={t} className="evt-tag">{t}</span>)}
                      </div>
                      <div className="evt-places-wrap">
                        <div className="evt-places-label">
                          <span style={{fontWeight:600,color:fillClass==="urgent"?"var(--red)":fillClass==="low"?"var(--orange)":"var(--text3)"}}>
                            {evt.places_dispo} place{evt.places_dispo>1?"s":""} restante{evt.places_dispo>1?"s":""}
                          </span>
                          <span>{Math.round((1-pctDispo)*100)}% complet</span>
                        </div>
                        <div className="evt-places-bar">
                          <div className={"evt-places-fill "+fillClass} style={{width:Math.round((1-pctDispo)*100)+"%"}}/>
                        </div>
                      </div>
                    </div>
                    {/* ── FOOTER ── */}
                    <div className="evt-card-footer">
                      {evt.gratuit
                        ?<span className="evt-gratuit-badge">✓ Gratuit</span>
                        :<span className="evt-prix-badge">💶 {evt.prix}</span>}
                      {isReg?(
                        <span className="evt-registered">
                          <span className="evt-registered-dot">✓</span>Inscrit(e)
                        </span>
                      ):(
                        <button className="evt-cta primary"
                          onClick={e=>{e.stopPropagation();setModalEvt(evt);}}
                          aria-label={"S'inscrire à "+evt.title}>
                          S'inscrire →
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Propose an event */}
          <div style={{marginTop:"2.5rem",background:"linear-gradient(135deg,var(--blue-lt),var(--violet-lt))",border:"1.5px solid var(--blue-md)",borderRadius:"var(--rl)",padding:"1.5rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <div style={{fontWeight:800,fontSize:"1rem",color:"var(--text)",marginBottom:".3rem"}}>📣 Proposer un événement</div>
              <div style={{fontSize:".8rem",color:"var(--text2)"}}>Association, école, lycée professionnel — publiez vos événements et touchons ensemble la communauté des électriciens.</div>
            </div>
            <button className="btn-primary" style={{whiteSpace:"nowrap"}}>Soumettre un événement →</button>
          </div>
        </div>
      </div>

      {/* INSCRIPTION MODAL */}
      {modalEvt&&(
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="evt-modal-title"
          onClick={e=>{if(e.target===e.currentTarget)setModalEvt(null);}}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <span className="evt-orga-badge" style={{color:modalEvt.orga_color,borderColor:modalEvt.orga_color+"44",background:modalEvt.orga_color+"12",display:"inline-flex",marginBottom:".5rem"}}>
                  {modalEvt.orga_icon} {modalEvt.orga}
                </span>
                <h2 id="evt-modal-title" style={{fontWeight:800,fontSize:"1.15rem",color:"var(--text)",lineHeight:1.25}}>{modalEvt.title}</h2>
              </div>
              <button className="modal-close" onClick={()=>setModalEvt(null)} aria-label="Fermer">×</button>
            </div>
            <div className="modal-body">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".75rem",marginBottom:"1.25rem"}}>
                {[["Date",fmtDate(modalEvt.date)],["Heure",modalEvt.time],["Durée",modalEvt.duration]].map(([k,v])=>(
                  <div key={k} className="mstat"><div className="mstat-k">{k}</div><div className="mstat-v">{v}</div></div>
                ))}
              </div>
              <div style={{marginBottom:"1rem"}}>
                <div className="m-section-title">Lieu</div>
                <p style={{fontSize:".85rem",color:"var(--text2)"}}>{modalEvt.format} · {modalEvt.lieu}</p>
              </div>
              <div style={{marginBottom:"1rem"}}>
                <div className="m-section-title">Description</div>
                <p style={{fontSize:".85rem",color:"var(--text2)",lineHeight:1.7}}>{modalEvt.desc}</p>
              </div>
              <div style={{marginBottom:"1rem"}}>
                <div className="m-section-title">Thèmes</div>
                <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                  {modalEvt.themes.map(t=><span key={t} className="evt-tag">{t}</span>)}
                </div>
              </div>
              <div style={{marginBottom:"1.25rem",background:"var(--bg)",borderRadius:"var(--r)",padding:".75rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:".8rem",color:"var(--text2)"}}>Places restantes : <strong style={{color:"var(--text)"}}>{modalEvt.places_dispo} / {modalEvt.places}</strong></span>
                {modalEvt.gratuit?(
                  <span style={{fontWeight:700,color:"var(--green)",fontSize:".82rem"}}>✓ Gratuit</span>
                ):(
                  <span style={{fontWeight:700,color:"var(--orange)",fontSize:".82rem"}}>💶 {modalEvt.prix}</span>
                )}
              </div>
              <div style={{display:"flex",gap:".75rem",flexWrap:"wrap"}}>
                <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>register(modalEvt)}>
                  ✓ Confirmer mon inscription
                </button>
                <button className="btn-secondary" onClick={()=>setModalEvt(null)}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const LOGO_SRC="data:image/png;base64,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";
export default function App(){
  const [page,setPage]=useState("accueil");
  const [src,setSrc]=useState("all");
  const [theme,setTheme]=useState("Tous");
  const [fmt,setFmt]=useState("Tous");
  const [region,setRegion]=useState("all");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [parcours,setParcours]=useState([]);
  const [toast,setToast]=useState(null);
  const [termStep,setTermStep]=useState(0);
  const [forumCat,setForumCat]=useState("all");
  const [expandedPost,setExpandedPost]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);

  useEffect(()=>{
    if(termStep<5){const t=setTimeout(()=>setTermStep(s=>s+1),900);return()=>clearTimeout(t);}
  },[termStep]);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),3200);};
  const addToParcours=c=>{
    if(!parcours.find(x=>x.id===c.id)){setParcours(p=>[...p,c]);showToast(`"${c.title}" ajouté !`);}
    else showToast("Déjà dans votre parcours.");
  };

  const filtered=COURSES.filter(c=>{
    const sOk=src==="all"||c.source===src;
    const tOk=theme==="Tous"||c.themes.includes(theme);
    const fOk=fmt==="Tous"||c.format===fmt;
    const rOk=region==="all"||c.regions.includes("all")||c.regions.includes(region);
    const qOk=!search||c.title.toLowerCase().includes(search.toLowerCase())||c.desc.toLowerCase().includes(search.toLowerCase());
    return sOk&&tOk&&fOk&&rOk&&qOk;
  });

  const termLines=[
    {text:"$ connect --platform les-eclaireurs",cls:"tl-acc"},
    {text:"> Connexion sécurisée ✓  WCAG 2.1 AA",cls:"tl-grn"},
    {text:"> Sources: Schneider Electric · Legrand · Hager · Siemens · Rexel",cls:"tl-dim"},
    {text:"> 760 000 postes/an filière électrique",cls:"tl-cyn"},
    {text:"> Expert disponible — attente: 2 min ✓",cls:"tl-grn"},
  ];

  const nav=id=>{setPage(id);window.scrollTo({top:0,behavior:"smooth"});};

  return(
    <>
      <style>{CSS}</style>
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      {/* ── NAV ── */}
      <header>
        <nav className="nav" role="navigation" aria-label="Navigation principale">
          <button className="nav-logo" onClick={()=>nav("accueil")} aria-label="Les Éclaireurs! — Accueil">
            <div className="logo-mark" aria-hidden="true">
              <img src={LOGO_SRC} alt="" className="logo-svg" style={{width:40,height:40,objectFit:"contain"}}/>
            </div>
            <div className="logo-name">Les <span>Éclaireurs!</span></div>
          </button>
          <nav className="nav-links" aria-label="Menu principal">
            {[["accueil","Accueil"],["formations","Formations"],["parcours","Parcours"],["forum","Communauté 💬"],["evenements","📅 Événements"],["financement","Financement"],["depot","📤 Déposer"],["about","À propos"],["profil","Mon Profil"]].map(([id,label])=>(
              <button key={id} className={`nav-btn ${page===id?"active":""}`} onClick={()=>nav(id)} aria-current={page===id?"page":undefined}>{label}</button>
            ))}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            {parcours.length>0&&<span className="nav-count" aria-live="polite">{parcours.length} formation{parcours.length>1?"s":""}</span>}
            <button className="nav-cta" onClick={()=>nav("formations")}>Commencer</button>
            <button className={`burger ${menuOpen?"open":""}`} onClick={()=>setMenuOpen(o=>!o)} aria-expanded={menuOpen} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </div>
        </nav>
      </header>
      {/* Mobile nav */}
      <div className={`nav-mobile ${menuOpen?"open":""}`} aria-hidden={!menuOpen}>
        {[["accueil","Accueil 🏠"],["formations","Formations 📚"],["parcours","Parcours 🎯"],["forum","Communauté 💬"],["evenements","📅 Événements"],["financement","Financement 💰"],["depot","📤 Déposer"],["about","ℹ️ À propos"],["profil","Mon Profil 👤"]].map(([id,label])=>(
          <button key={id} className={`nav-btn ${page===id?"active":""}`}
            onClick={()=>{nav(id);setMenuOpen(false);}}
            aria-current={page===id?"page":undefined}>{label}</button>
        ))}
        <button className="nav-cta" onClick={()=>{nav("formations");setMenuOpen(false);}}>Commencer →</button>
      </div>

      <main id="main-content">

      {/* ══════════ ACCUEIL ══════════ */}
      {page==="accueil"&&(
        <>
          {/* HERO */}
          <section className="hero" aria-labelledby="hero-title">
            <div className="blob blob-1" aria-hidden="true"/>
            <div className="blob blob-2" aria-hidden="true"/>
            <div className="hero-inner">
              <div className="hero-left">
                <div className="hero-badge" role="status">
                  <span className="live-dot" aria-hidden="true"/>
                  Plateforme nationale · Transition énergétique 2050
                </div>
                <h1 id="hero-title" className="hero-h1">
                  Formez-vous pour<br/><span className="grad">électrifier</span> demain.
                </h1>
                <p className="hero-desc">
                  Le portail de formation multi-sources et agnostique marque pour les électriciens.
                  Schneider Electric, Legrand, Hager, Siemens, Rexel, Sonepar — réunis, organisés par compétences,
                  finançables via CPF et OPCO.
                </p>
                <div className="hero-stats" role="list" aria-label="Chiffres clés">
                  {[["3 352","Personnes formées"],["109+","Formations disponibles"],["142t","CO₂ évités ↓"]].map(([n,l])=>(
                    <div key={n} className="stat-item" role="listitem">
                      <div className="stat-num" aria-label={n}>{n}</div>
                      <div className="stat-label">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={()=>nav("formations")}>Explorer les formations <span aria-hidden="true">→</span></button>
                  <button className="btn-secondary" onClick={()=>nav("parcours")}>Voir les parcours</button>
                </div>

                {/* TRUST INDICATORS */}
                <div className="trust-bar" role="complementary" aria-label="Indicateurs de confiance">
                  <div className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{flexShrink:0}}>
                      <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5Z" fill="#16a34a" stroke="#16a34a" strokeWidth="0.5" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>85%</strong> des électriciens recommandent ce site</span>
                  </div>
                  <div className="trust-sep" aria-hidden="true"/>
                  <div className="trust-item trust-trustpilot">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{flexShrink:0}}>
                      <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5Z" fill="#16a34a" stroke="#16a34a" strokeWidth="0.5" strokeLinejoin="round"/>
                    </svg>
                    <span className="trust-excellent">Excellent</span>
                    <span className="trust-stars" aria-label="4,5 étoiles sur 5">
                      {[1,2,3,4].map(i=>(
                        <span key={i} className="trust-star full" aria-hidden="true">★</span>
                      ))}
                      <span className="trust-star half" aria-hidden="true">★</span>
                    </span>
                    <svg width="72" height="18" viewBox="0 0 72 18" fill="none" aria-label="Trustpilot" role="img">
                      <rect width="72" height="18" rx="2" fill="#00B67A"/>
                      <text x="36" y="13" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8.5" fontWeight="700" fill="white" letterSpacing="0.3">Trustpilot</text>
                    </svg>
                  </div>
                </div>
              </div>
              <HeroRight/>
            </div>
          </section>

          {/* LOGOS */}
          <div className="logos-band" role="complementary" aria-label="Sources de contenu partenaires">
            <div className="logos-inner">
              <span className="logos-label">Sources de contenu</span>
              <div className="logos-sep" aria-hidden="true"/>
              <div className="logos-row">
                {[{id:"schneider"},{id:"legrand"},{id:"hager"},{id:"siemens"},{id:"rexel"},{id:"sonepar"},{id:"ademe"},{id:"enedis"}].map(({id})=>(
                  <button key={id} className="logo-pill" onClick={()=>{setSrc(id);nav("formations");}} aria-label={`Filtrer par ${FALLBACK[id]}`}>
                    <Logo id={id} h={22}/>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ANCRAGE TERRITORIAL */}
          <section className="section" style={{background:"var(--bg2)"}} aria-labelledby="territoire-title">
            <div className="section-inner">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center"}}>

                {/* Gauche — argumentaire */}
                <div>
                  <div className="s-chip" style={{background:"#ede9fe",color:"var(--violet)",marginBottom:"1rem"}}>📍 Ancrage territorial</div>
                  <h2 id="territoire-title" style={{fontSize:"1.8rem",fontWeight:800,color:"var(--text)",lineHeight:1.25,marginBottom:"1.1rem"}}>
                    Des formations et des financements <span style={{color:"var(--violet)"}}>près de chez vous</span>
                  </h2>
                  <p style={{fontSize:"1rem",color:"var(--text2)",lineHeight:1.75,marginBottom:"1.5rem"}}>
                    La transition énergétique se gagne sur le terrain. Les Éclaireurs! cartographie les formations présentielles disponibles dans votre région et les aides locales pour les financer — parce qu'un électricien dans la Creuse n'a pas les mêmes options qu'un électricien à Lyon.
                  </p>
                  <div style={{display:"flex",flexDirection:"column",gap:".75rem",marginBottom:"1.75rem"}}>
                    {[
                      {ico:"🏫",txt:"Centres de formation agréés par région",col:"var(--blue)"},
                      {ico:"💶",txt:"Aides régionales : Conseil régional, OPCO territoriaux, ADEME locale",col:"var(--green)"},
                      {ico:"🤝",txt:"Réseau d'électriciens partenaires pour la pratique terrain",col:"var(--violet)"},
                      {ico:"📡",txt:"100 000 emplois ruraux à pourvoir d'ici 2030 — offre digitale incluse",col:"var(--orange)"},
                    ].map(({ico,txt,col})=>(
                      <div key={txt} style={{display:"flex",gap:".75rem",alignItems:"flex-start"}}>
                        <div style={{width:32,height:32,borderRadius:8,background:col+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"1rem"}}>{ico}</div>
                        <span style={{fontSize:".88rem",color:"var(--text)",lineHeight:1.6,paddingTop:4}}>{txt}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{background:"var(--violet)",borderColor:"var(--violet)"}}
                    onClick={()=>{setRegion("idf");nav("formations");}}>
                    Trouver des formations près de moi →
                  </button>
                </div>

                {/* Droite — carte régions interactives */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
                  {REGIONS.filter(r=>r.id!=="all").map(r=>{
                    const count=COURSES.filter(c=>c.regions.includes("all")||c.regions.includes(r.id)).length;
                    return(
                      <button key={r.id}
                        onClick={()=>{setRegion(r.id);nav("formations");}}
                        style={{background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--rl)",
                          padding:".9rem 1rem",textAlign:"left",cursor:"pointer",transition:"all .18s",
                          boxShadow:"var(--sh)"}
                        }
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--violet)";e.currentTarget.style.transform="translateY(-2px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="none";}}>
                        <div style={{fontSize:"1.3rem",marginBottom:".3rem"}}>{r.ico}</div>
                        <div style={{fontWeight:700,fontSize:".78rem",color:"var(--text)",lineHeight:1.3,marginBottom:".25rem"}}>{r.label}</div>
                        <div style={{fontSize:".7rem",color:"var(--violet)",fontWeight:600}}>{count} formation{count>1?"s":""}</div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>

          {/* PARCOURS */}
          <section className="section" aria-labelledby="parcours-title">
            <div className="section-inner">
              <div className="section-head">
                <div className="s-chip" aria-hidden="true">Parcours pédagogiques</div>
                <h2 id="parcours-title" className="s-title">4 niveaux de maîtrise</h2>
                <p className="s-desc">De la reconversion au terrain, jusqu'à l'expertise numérique — un parcours structuré pour chaque profil.</p>
              </div>

              {/* Teaser sas reconversion */}
              <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"2px solid #86efac",borderRadius:"var(--rl)",padding:"1.25rem 1.75rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"1.25rem",cursor:"pointer"}}
                onClick={()=>nav("parcours")} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&nav("parcours")}
                aria-label="Découvrir la passerelle reconversion">
                <div style={{fontSize:"2rem",flexShrink:0}}>🌱</div>
                <div style={{flex:1}}>
                  <div style={{display:"inline-flex",background:"#16a34a",color:"white",fontSize:".64rem",fontWeight:700,padding:"2px 10px",borderRadius:"var(--rf)",marginBottom:".35rem",letterSpacing:".04em",textTransform:"uppercase"}}>Niveau Initial · Nouveau</div>
                  <div style={{fontWeight:800,fontSize:".95rem",color:"#14532d"}}>Tu n'es pas électricien — mais tu pourrais le devenir.</div>
                  <div style={{fontSize:".78rem",color:"#166534",marginTop:".2rem"}}>6 modules libres · Aucun prérequis · Financement CPF disponible</div>
                </div>
                <div style={{fontSize:".8rem",fontWeight:700,color:"#16a34a",flexShrink:0}}>Commencer →</div>
              </div>

              <div className="pgrid">
                {PARCOURS.filter(p=>p.num!=="00").map(p=>(
                  <article key={p.num} className="pcard" onClick={()=>nav("parcours")} role="button" tabIndex={0}
                    onKeyDown={e=>e.key==="Enter"&&nav("parcours")} aria-label={`Parcours ${p.title}`}>
                    <div className="pcard-bar" style={{background:p.barColor}} aria-hidden="true"/>
                    <div className="pcard-num" aria-hidden="true">{p.num}</div>
                    <div className="pcard-ico" style={{background:p.iconBg}} aria-hidden="true">{p.icon}</div>
                    <h3 className="pcard-title">{p.title}</h3>
                    <p className="pcard-sub">{p.sub}</p>
                    <ul className="ptopics" aria-label="Thèmes abordés">
                      {p.topics.map(t=>(
                        <li key={t} className="ptopic">
                          <span className="pbullet" style={{background:p.barColor}} aria-hidden="true"/>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="pfoot">
                      <span className="pcount">{p.count}</span>
                      <button className="pcta" style={{background:p.barColor}} onClick={e=>{e.stopPropagation();nav("parcours");}}>Démarrer</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* LIVE */}
          <section className="section" style={{paddingTop:0}}>
            <div className="section-inner">
              <div className="live-block" role="complementary" aria-label="Support technique live">
                <div className="live-inner">
                  <div>
                    <div className="live-badge"><span className="ldot" aria-hidden="true"/>Support live disponible</div>
                    <h2 className="live-h2">Assistance technique<br/>en temps réel</h2>
                    <p className="live-desc">Bloqué sur une installation ? Un expert vous accompagne en direct par visio depuis le chantier. Mini-formation, aide technique et support produit combinés.</p>
                    <div className="live-feats">
                      {["Visio directement depuis le chantier","Experts Schneider Electric, Legrand, Hager disponibles","Compte comme session de formation courte","Rapport d'intervention généré automatiquement"].map(f=>(
                        <div key={f} className="lfeat"><div className="lcheck" aria-hidden="true">✓</div>{f}</div>
                      ))}
                    </div>
                    <button className="btn-primary" style={{marginTop:"1.5rem",background:"rgba(255,255,255,.2)",backdropFilter:"blur(10px)",border:"1.5px solid rgba(255,255,255,.35)"}}>
                      📞 Demander une assistance live
                    </button>
                  </div>
                  <div className="terminal" role="log" aria-live="polite" aria-label="Connexion plateforme">
                    <div className="t-header" aria-hidden="true">
                      <span className="t-dot" style={{background:"#ff5f56"}}/><span className="t-dot" style={{background:"#febc2e"}}/><span className="t-dot" style={{background:"#28c840"}}/>
                      <span className="t-name">eclaireurs-connect.sh</span>
                    </div>
                    {termLines.slice(0,termStep).map((l,i)=>(
                      <div key={i} className={`tl ${l.cls}`} aria-hidden={i<termStep-1}>{l.text}</div>
                    ))}
                    {termStep>0&&termStep<=termLines.length&&<div className="tl tl-dim">{">"} <span className="cursor" aria-hidden="true"/></div>}
                    {termStep>=termLines.length&&(
                      <>
                        <div style={{height:"1rem"}}/>
                        <div className="tl tl-grn">✓ Session prête · Expert connecté</div>
                        <div className="tl tl-dim" style={{marginTop:".5rem"}}>{"$"} <span className="cursor" aria-hidden="true"/></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PARTENAIRES INSTITUTIONNELS */}
          <section className="section" style={{paddingTop:0}} aria-labelledby="partners-title">
            <div className="section-inner">
              <div className="section-head">
                <div className="s-chip" aria-hidden="true">Partenaires institutionnels</div>
                <h2 id="partners-title" className="s-title">Un écosystème national</h2>
              </div>
              <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
                {[{id:"ademe",label:"ADEME"},{id:"enedis",label:"Enedis"},{id:"edf",label:"EDF"},{id:"rte",label:"RTE"}].map(({id,label})=>(
                  <div key={id} style={{background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--r)",padding:"1rem 2rem",display:"flex",alignItems:"center",gap:"12px",boxShadow:"var(--sh)",transition:"all .2s",cursor:"pointer"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue-md)";e.currentTarget.style.boxShadow="var(--sh-md)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="var(--sh)";}}>
                    <Logo id={id} h={32}/>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CO2 IMPACT */}
          <section className="section" aria-labelledby="co2-section-title">
            <div className="section-inner">
              <div className="section-head">
                <div className="s-chip" style={{background:"var(--green-lt)",color:"var(--green)"}}>🌱 Impact Environnemental</div>
                <h2 className="s-title" id="co2-section-title">La compétence, moteur de la décarbonation</h2>
                <p className="s-desc">Chaque électricien formé accélère l'électrification et réduit les émissions. Voici l'impact mesurable de la plateforme.</p>
              </div>
              <CO2Banner/>
              <div className="eco-wifi-banner" role="note" aria-label="Conseil éco-responsable" style={{marginTop:"1.5rem"}}>
                <div className="eco-wifi-icon" aria-hidden="true">📶</div>
                <div className="eco-wifi-body">
                  <div className="eco-wifi-title">Geste éco-responsable</div>
                  <div className="eco-wifi-text">Privilégiez le <strong>Wi-Fi</strong> à la 4G/5G pour consulter la plateforme — cela consomme jusqu'à <strong>23× moins d'énergie</strong> et réduit votre empreinte carbone numérique.</div>
                </div>
                <div className="eco-wifi-badge" aria-hidden="true">
                  <span className="eco-wifi-leaf">🌿</span>
                  <span>–23×</span>
                  <span style={{fontSize:".6rem",fontWeight:500,opacity:.8}}>CO₂</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ══════════ FORMATIONS ══════════ */}
      {page==="formations"&&(
        <>
          <PageBanner tag="Catalogue de formations" title={`${filtered.length} formation${filtered.length>1?"s":""} disponible${filtered.length>1?"s":""}`} sub="Multi-sources, filtrable par fabricant, thème et format. Tous financements éligibles." showA11y/>
          <div className="section">
            <div className="section-inner">
              <div className="src-chips" role="group" aria-label="Filtrer par source">
                {SOURCES.map(s=>(
                  <button key={s.id} className={`sc ${src===s.id?"active":""}`} onClick={()=>setSrc(s.id)} aria-pressed={src===s.id}>
                    {s.id!=="all"&&<Logo id={s.id} h={16}/>}
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="search-wrap" role="search">
                <div className="search-row">
                  <label htmlFor="search-input" className="sr-only">Rechercher une formation</label>
                  <input id="search-input" className="search-input" placeholder="Rechercher : IRVE, PME, Wiser, TGBT, GTB, Solaire..." value={search} onChange={e=>setSearch(e.target.value)} aria-label="Rechercher une formation"/>
                  <button className="search-btn" aria-label="Lancer la recherche">Rechercher</button>
                </div>
                <div className="frow" role="group" aria-label="Filtrer par thème">
                  <span className="flabel" id="theme-label">Thème</span>
                  {THEMES.map(t=><button key={t} className={`fchip ${theme===t?"active":""}`} onClick={()=>setTheme(t)} aria-pressed={theme===t} aria-labelledby="theme-label">{t}</button>)}
                </div>
                <div className="frow" style={{marginTop:".5rem"}} role="group" aria-label="Filtrer par format">
                  <span className="flabel" id="fmt-label">Format</span>
                  {FORMATS.map(f=><button key={f} className={`fchip ${fmt===f?"active":""}`} onClick={()=>setFmt(f)} aria-pressed={fmt===f} aria-labelledby="fmt-label">{f}</button>)}
                </div>
                <div className="frow" style={{marginTop:".5rem"}} role="group" aria-label="Filtrer par région">
                  <span className="flabel" id="region-label" style={{display:"flex",alignItems:"center",gap:4}}>
                    <span>📍</span> Région
                  </span>
                  {REGIONS.map(r=>(
                    <button key={r.id} className={`fchip ${region===r.id?"active":""}`}
                      onClick={()=>setRegion(r.id)} aria-pressed={region===r.id} aria-labelledby="region-label"
                      style={region===r.id?{background:"var(--violet)",borderColor:"var(--violet)"}:{}}>
                      {r.ico} {r.label}
                    </button>
                  ))}
                </div>
                {region!=="all"&&(
                  <div style={{marginTop:".75rem",padding:".6rem 1rem",background:"#ede9fe",border:"1.5px solid #c4b5fd",borderRadius:"var(--rl)",display:"flex",alignItems:"center",gap:".5rem",fontSize:".8rem",color:"var(--violet)"}}>
                    <span>📍</span>
                    <span><strong>{REGIONS.find(r=>r.id===region)?.label}</strong> — formations présentielles disponibles + aides régionales spécifiques.</span>
                    <button onClick={()=>setRegion("all")} style={{marginLeft:"auto",background:"none",border:"none",color:"var(--violet)",cursor:"pointer",fontWeight:700,fontSize:".8rem"}}>✕ Effacer</button>
                  </div>
                )}
              </div>
              {filtered.length===0?(
                <div style={{textAlign:"center",padding:"4rem",color:"var(--text2)"}} role="alert">
                  <div style={{fontSize:"3rem",marginBottom:"1rem"}} aria-hidden="true">🔍</div>
                  <div style={{fontWeight:800,fontSize:"1.2rem",color:"var(--text)",marginBottom:".5rem"}}>Aucun résultat</div>
                  <div style={{fontSize:".85rem"}}>Essayez d'autres filtres ou effacez votre recherche.</div>
                </div>
              ):(
                <div className="grid3" role="list" aria-label="Liste des formations">
                  {filtered.map((c,i)=>(
                    <article key={c.id} className="ccard" role="listitem" style={{animationDelay:`${i*.05}s`}}
                      onClick={()=>setSelected(c)} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setSelected(c)}
                      aria-label={`Formation : ${c.title}`}>
                      <div className="ccard-thumb" style={{background:c.thumbBg}} aria-hidden="true">
                        <span style={{fontSize:"3rem"}}>{c.emoji}</span>
                        <div className="ccard-thumb-badge">
                          <Logo id={c.source} h={12}/>
                        </div>
                      </div>
                      <div className="ccard-body">
                        <div className="ccard-source-row">
                          <div className="source-mini"><Logo id={c.source} h={14}/></div>
                          <span className="level-tag" style={{background:c.lvlBg,color:c.lvlColor}}>{c.level}</span>
                        </div>
                        <h3 className="ccard-title">{c.title}</h3>
                        <p className="ccard-desc">{c.desc}</p>
                        <div className="ccard-footer">
                          <div>
                            <div className="cbadges">{c.badges.slice(0,2).map(b=><span key={b.t} className={`cbadge ${b.c}`}>{b.t}</span>)}</div>
                            <div className="cdur" style={{marginTop:"5px"}}>⏱ {c.duration} · {c.format}</div>
                          </div>
                          <button className="cadd" onClick={e=>{e.stopPropagation();addToParcours(c);}} aria-label={`Ajouter ${c.title} au parcours`}>+ Parcours</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════ PARCOURS ══════════ */}
      {page==="parcours"&&(
        <>
          <PageBanner tag="Parcours métiers" title="4 niveaux de maîtrise" sub="De la reconversion aux technologies avancées — un chemin structuré pour chaque profil." showA11y/>
          <div className="section">
            <div className="section-inner">

              {/* SAS RECONVERSION */}
              <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"2px solid #86efac",borderRadius:"var(--rl)",padding:"2rem 2.5rem",marginBottom:"2.5rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(134,239,172,.18)"}} aria-hidden="true"/>
                <div style={{position:"absolute",bottom:-20,right:80,width:80,height:80,borderRadius:"50%",background:"rgba(134,239,172,.12)"}} aria-hidden="true"/>
                <div style={{display:"flex",alignItems:"flex-start",gap:"1.5rem",flexWrap:"wrap",position:"relative"}}>
                  <div style={{fontSize:"2.8rem",lineHeight:1,flexShrink:0}}>🌱</div>
                  <div style={{flex:1,minWidth:280}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#16a34a",color:"white",fontSize:".68rem",fontWeight:700,padding:"3px 12px",borderRadius:"var(--rf)",marginBottom:".6rem",letterSpacing:".04em",textTransform:"uppercase"}}>
                      Niveau Initial · Passerelle Reconversion
                    </div>
                    <h2 style={{fontWeight:800,fontSize:"1.35rem",color:"#14532d",lineHeight:1.3,marginBottom:".6rem"}}>
                      Tu n'es pas électricien — mais tu pourrais le devenir.
                    </h2>
                    <p style={{fontSize:".9rem",color:"#166534",lineHeight:1.7,maxWidth:580,marginBottom:"1.25rem"}}>
                      La filière électrique recrute massivement. Que tu sois en reconversion, demandeur d'emploi, ou simplement curieux, ce sas est fait pour toi. Découvre les métiers, les formations diplômantes et comment financer ton parcours — sans prérequis.
                    </p>
                    <div style={{display:"flex",gap:".75rem",flexWrap:"wrap",marginBottom:"1.25rem"}}>
                      {["6 modules libres","Aucun prérequis","Financement CPF & Pôle emploi","Débouchés concrets"].map(tag=>(
                        <span key={tag} style={{background:"white",border:"1.5px solid #86efac",borderRadius:"var(--rf)",padding:"4px 12px",fontSize:".75rem",fontWeight:600,color:"#15803d"}}>{tag}</span>
                      ))}
                    </div>
                    <button className="btn-primary" style={{background:"#16a34a",borderColor:"#16a34a"}} onClick={()=>nav("formations")}>
                      Commencer par ici →
                    </button>
                  </div>
                  <div style={{background:"white",borderRadius:"var(--rl)",padding:"1.25rem",minWidth:200,boxShadow:"0 4px 16px rgba(0,0,0,.07)",flexShrink:0}}>
                    <div style={{fontSize:".7rem",fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:".05em",marginBottom:".75rem"}}>Par où commencer ?</div>
                    {["Comprendre les bases de l'électricité","Les métiers de la filière","Débouchés & formations diplômantes","Financer sa reconversion","Premiers gestes de sécurité"].map((t,i)=>(
                      <div key={t} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:".5rem",fontSize:".78rem",color:"#166534"}}>
                        <span style={{background:"#16a34a",color:"white",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</span>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SÉPARATEUR */}
              <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
                <div style={{flex:1,height:1,background:"var(--border)"}}/>
                <span style={{fontSize:".72rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>Déjà électricien ? Continue avec les niveaux suivants</span>
                <div style={{flex:1,height:1,background:"var(--border)"}}/>
              </div>

              {/* 3 NIVEAUX ÉLECTRICIENS */}
              <div className="pgrid" style={{marginBottom:"3rem"}}>
                {PARCOURS.filter(p=>p.num!=="00").map(p=>(
                  <article key={p.num} className="pcard">
                    <div className="pcard-bar" style={{background:p.barColor}}/>
                    <div className="pcard-num" aria-hidden="true">{p.num}</div>
                    <div className="pcard-ico" style={{background:p.iconBg}}>{p.icon}</div>
                    <h2 className="pcard-title" style={{color:p.barColor==="var(--blue)"?"var(--blue)":p.barColor==="var(--violet)"?"var(--violet)":"var(--orange)"}}>{p.title}</h2>
                    <p className="pcard-sub">{p.sub}</p>
                    <ul className="ptopics">{p.topics.map(t=><li key={t} className="ptopic"><span className="pbullet" style={{background:p.barColor}}/>{t}</li>)}</ul>
                    <div className="pfoot"><span className="pcount">{p.count}</span><button className="pcta" style={{background:p.barColor}}>Démarrer</button></div>
                  </article>
                ))}
              </div>

              <div className="section-head">
                <div className="s-chip">Mon parcours</div>
                <h2 className="s-title">{parcours.length>0?`${parcours.length} formation${parcours.length>1?"s":""} sélectionnée${parcours.length>1?"s":""}`:""}</h2>
              </div>
              {parcours.length===0?(
                <div style={{textAlign:"center",padding:"3rem",background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--rl)"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📋</div>
                  <p style={{fontSize:".85rem",color:"var(--text2)",marginBottom:"1.5rem"}}>Ajoutez des formations depuis le catalogue.</p>
                  <button className="btn-primary" onClick={()=>nav("formations")}>Explorer le catalogue →</button>
                </div>
              ):(
                <div className="grid3">
                  {parcours.map((c,i)=>(
                    <article key={c.id} className="ccard" style={{animationDelay:`${i*.05}s`,borderColor:"var(--blue-md)"}}>
                      <div className="ccard-thumb" style={{background:c.thumbBg}}><span style={{fontSize:"3rem"}}>{c.emoji}</span></div>
                      <div className="ccard-body">
                        <div className="ccard-source-row">
                          <div className="source-mini"><Logo id={c.source} h={14}/></div>
                          <span className="level-tag" style={{background:c.lvlBg,color:c.lvlColor}}>{c.level}</span>
                        </div>
                        <h3 className="ccard-title">{c.title}</h3>
                        <div className="ccard-footer">
                          <span className="cdur">⏱ {c.duration}</span>
                          <button className="cadd" style={{background:"var(--red-lt)",color:"var(--red)"}} onClick={()=>setParcours(p=>p.filter(x=>x.id!==c.id))} aria-label={`Retirer ${c.title} du parcours`}>Retirer</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════ FINANCEMENT ══════════ */}
      {page==="financement"&&(
        <>
          <PageBanner tag="Financement" title="Le frein n'est pas l'argent" sub="Des dispositifs permettent une prise en charge quasi-totale des formations." showA11y/>
          <div className="section">
            <div className="section-inner">
              <div className="grid3" style={{marginBottom:"3rem"}}>
                {FINANCEMENT.map(f=>(
                  <div key={f.title} className="fcard-fin">
                    <div className="fi-ico" aria-hidden="true">{f.icon}</div>
                    <h2 className="fi-title">{f.title}</h2>
                    <p className="fi-desc">{f.desc}</p>
                    <span className="fi-amt">{f.amount}</span>
                  </div>
                ))}
              </div>
              <div className="live-block">
                <div style={{maxWidth:"600px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
                  <div className="s-chip" style={{background:"rgba(255,255,255,.2)",color:"white",margin:"0 auto .75rem"}}>Simulateur financement</div>
                  <h2 style={{fontWeight:800,fontSize:"1.75rem",color:"white",marginBottom:".75rem",letterSpacing:"-.03em"}}>Trouvez le bon dispositif</h2>
                  <p style={{fontSize:".88rem",color:"rgba(255,255,255,.82)",lineHeight:1.7,marginBottom:"1.5rem"}}>Répondez à 3 questions pour identifier les aides disponibles pour votre situation professionnelle.</p>
                  <div style={{display:"flex",gap:".75rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.5rem"}} role="group" aria-label="Votre situation">
                    {["Je suis salarié","Je suis indépendant","Je suis demandeur d'emploi"].map(s=>(
                      <button key={s} style={{background:"rgba(255,255,255,.15)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:"var(--rf)",color:"white",padding:"8px 18px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:".8rem",fontWeight:600,cursor:"pointer",transition:"all .2s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.3)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.15)";}}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary" style={{background:"white",color:"var(--blue)"}}>Calculer mes aides →</button>
                </div>
              </div>
              <div style={{marginTop:"3rem"}}>
                <div className="section-head"><div className="s-chip">Organismes partenaires</div><h2 className="s-title">Nos garants institutionnels</h2></div>
                <div style={{display:"flex",gap:"1.25rem",flexWrap:"wrap"}}>
                  {[{id:"ademe",l:"ADEME"},{id:"enedis",l:"Enedis"},{id:"edf",l:"EDF"},{id:"rte",l:"RTE"}].map(({id,l})=>(
                    <div key={id} style={{background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--r)",padding:"1rem 1.75rem",display:"flex",alignItems:"center",gap:"12px",boxShadow:"var(--sh)"}}>
                      <Logo id={id} h={30}/><span style={{fontWeight:700,color:"var(--text2)"}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AIDES RÉGIONALES */}
              <div style={{marginTop:"3rem"}}>
                <div className="section-head">
                  <div className="s-chip" style={{background:"#ede9fe",color:"var(--violet)"}}>📍 Aides régionales</div>
                  <h2 className="s-title">Des financements ancrés dans votre territoire</h2>
                  <p className="s-desc">En complément du CPF et des OPCO nationaux, chaque région propose ses propres dispositifs pour les formations liées à la transition énergétique.</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
                  {[
                    {reg:"Île-de-France",ico:"🗼",col:"var(--blue)",bg:"var(--blue-lt)",
                      items:["Chèque formation IdF — jusqu'à 1 200 €","PRIF OPCO Île-de-France","Aide à la VAE bâtiment & énergie"]},
                    {reg:"Auvergne-Rhône-Alpes",ico:"🏔️",col:"var(--green)",bg:"var(--green-lt)",
                      items:["Plan régional de formation ARA","Contrats de professionnalisation renforcés","Campus Énergie Durable (lauréat AMI CMA)"]},
                    {reg:"Pays de la Loire",ico:"🌊",col:"var(--violet)",bg:"var(--violet-lt)",
                      items:["AMI CMA France 2030 — lauréat 2024","Parcours certifiants IRVE subventionnés","Fonds régional montée en compétences énergie"]},
                    {reg:"Occitanie",ico:"☀️",col:"var(--orange)",bg:"var(--orange-lt)",
                      items:["Soleil & Compétences — formations PV aidées","OPCO Constructys territorial","Subvention régionale reconversion"]},
                    {reg:"Nouvelle-Aquitaine",ico:"🍷",col:"var(--blue)",bg:"var(--blue-lt)",
                      items:["Chèque compétences transition énergétique","Aide à la reconversion BTP/Énergie","Réseau CFA partenaires agréés"]},
                    {reg:"Hauts-de-France",ico:"🏭",col:"var(--green)",bg:"var(--green-lt)",
                      items:["Plan régional emploi industriel","CEE territoriaux formations énergie","OPCO 2i dispositif régional"]},
                  ].map(({reg,ico,col,bg,items})=>(
                    <div key={reg} style={{background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--rl)",padding:"1.25rem",boxShadow:"var(--sh)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".75rem"}}>
                        <span style={{fontSize:"1.3rem"}}>{ico}</span>
                        <div style={{background:bg,color:col,fontWeight:700,fontSize:".7rem",padding:"3px 10px",borderRadius:"var(--rf)"}}>{reg}</div>
                      </div>
                      <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:".45rem"}}>
                        {items.map(it=>(
                          <li key={it} style={{display:"flex",gap:6,fontSize:".78rem",color:"var(--text)",alignItems:"flex-start"}}>
                            <span style={{color:col,fontWeight:800,flexShrink:0,marginTop:1}}>→</span>{it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div style={{background:"linear-gradient(135deg,#ede9fe,#ddd6fe)",border:"1.5px solid #c4b5fd",borderRadius:"var(--rl)",padding:"1.25rem 1.75rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                  <span style={{fontSize:"1.5rem"}}>💡</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:".9rem",color:"var(--violet)",marginBottom:".25rem"}}>Votre région n'est pas listée ?</div>
                    <div style={{fontSize:".82rem",color:"#5b21b6",lineHeight:1.6}}>Les Éclaireurs! référence les dispositifs de l'ensemble des 13 régions métropolitaines. Sélectionnez votre région dans le catalogue pour voir les aides disponibles.</div>
                  </div>
                  <button className="btn-primary" style={{background:"var(--violet)",borderColor:"var(--violet)",whiteSpace:"nowrap"}}
                    onClick={()=>nav("formations")}>Voir le catalogue régional →</button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ══════════ FORUM ══════════ */}
      {page==="forum"&&(
        <>
          <PageBanner tag="Communauté" title="Forum des Éclaireurs!" sub="Posez vos questions, partagez vos bonnes pratiques, aidez vos confrères électriciens." showA11y/>
          <div className="section">
            <div className="section-inner">
              <CommunityIllo/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
                <div>
                  <div className="s-chip">Entraide professionnelle</div>
                  <h2 className="s-title" style={{marginBottom:0}}>
                    {forumCat==="all"?"Tous les sujets":FORUM_CATS.find(c=>c.id===forumCat)?.label}
                  </h2>
                </div>
                <button className="new-post-btn" onClick={()=>showToast("Création de sujet bientôt disponible !")}>
                  ✏️ Nouveau sujet
                </button>
              </div>
              <div className="forum-grid">
                {/* Categories sidebar */}
                <nav className="forum-cats" aria-label="Catégories du forum">
                  <div className="fc-cat-title">Catégories</div>
                  {FORUM_CATS.map(cat=>(
                    <button key={cat.id} className={`fc-cat-item ${forumCat===cat.id?"active":""}`}
                      onClick={()=>setForumCat(cat.id)} aria-pressed={forumCat===cat.id}>
                      <div className="fc-cat-ico" style={{background:cat.bg}}>{cat.icon}</div>
                      <div>
                        <div className="fc-cat-name">{cat.label}</div>
                        <div className="fc-cat-meta">{cat.last}</div>
                      </div>
                      <span className="fc-cat-count">{cat.count}</span>
                    </button>
                  ))}
                </nav>
                {/* Posts list */}
                <div className="forum-posts" role="list" aria-label="Sujets du forum">
                  {FORUM_POSTS.filter(p=>forumCat==="all"||p.cat===forumCat).map(post=>(
                    <article key={post.id} className={`fpost ${post.solved?"solved":""}`} role="listitem">
                      <div className="fp-head">
                        <div className="fp-avatar">{post.avatar}</div>
                        <div>
                          <div className="fp-author">{post.author}</div>
                          <div className="fp-role">{post.role}</div>
                        </div>
                        <span className="fp-time">{post.time}</span>
                        {post.solved&&<span className="fp-solved">✓ Résolu</span>}
                      </div>
                      <h3 className="fp-title" onClick={()=>setExpandedPost(expandedPost===post.id?null:post.id)} style={{cursor:"pointer"}}>
                        {post.title}
                      </h3>
                      <p className="fp-body">{post.body}</p>
                      <div className="fp-tags">{post.tags.map(t=><span key={t} className="fp-tag">{t}</span>)}</div>
                      <div className="fp-footer">
                        <div className="fp-stat"><span className="fp-stat-ico">💬</span>{post.replies} réponses</div>
                        <div className="fp-stat"><span className="fp-stat-ico">👍</span>{post.likes}</div>
                        <button className="fp-reply-btn" onClick={()=>setExpandedPost(expandedPost===post.id?null:post.id)}>
                          {expandedPost===post.id?"Masquer ▲":"Voir les réponses ▼"}
                        </button>
                      </div>
                      {expandedPost===post.id&&(
                        <div className="fanswers">
                          {post.answers.map((a,i)=>(
                            <div key={i} className={`fanswer ${a.best?"best":""}`}>
                              <div className="fa-head">
                                <div className="fp-avatar" style={{width:30,height:30,fontSize:".85rem"}}>{a.avatar}</div>
                                <div>
                                  <div className="fp-author" style={{fontSize:".78rem"}}>{a.author}</div>
                                  <div className="fp-role">{a.role}</div>
                                </div>
                                {a.best&&<span className="fa-best">✓ Meilleure réponse</span>}
                                <span className="fp-time" style={{marginLeft:"auto"}}>{a.time}</span>
                              </div>
                              <p className="fa-body">{a.body}</p>
                              <div className="fa-likes">👍 {a.likes} personnes ont trouvé ça utile</div>
                            </div>
                          ))}
                          <button style={{background:"var(--blue-lt)",color:"var(--blue)",border:"1.5px dashed var(--blue-md)",borderRadius:"var(--r)",padding:"10px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:".8rem",fontWeight:700,cursor:"pointer",width:"100%"}}
                            onClick={()=>showToast("Réponse bientôt disponible !")}>
                            ✏️ Ajouter une réponse
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                  {FORUM_POSTS.filter(p=>forumCat==="all"||p.cat===forumCat).length===0&&(
                    <div style={{textAlign:"center",padding:"3rem",background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--rl)"}}>
                      <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🔍</div>
                      <p style={{color:"var(--text2)"}}>Aucun sujet dans cette catégorie pour l'instant.</p>
                      <button className="new-post-btn" style={{margin:"1rem auto 0"}} onClick={()=>showToast("Création de sujet bientôt disponible !")}>
                        Être le premier à poster ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ PROFIL ══════════ */}
      {page==="profil"&&(
        <>
          <PageBanner tag="Mon espace" title="Tableau de bord" sub="Suivez vos formations, vos badges et construisez votre parcours." showA11y/>
          <div className="section">
            <div className="section-inner">
              <div className="profile-grid">
                <div>
                  {/* CO2 personal impact */}
                  <div className="co2-profile" style={{marginBottom:"1rem"}}>
                    <div className="co2-profile-inner">
                      <div className="co2-profile-title">
                        <span>🌱</span> Ma contribution CO₂
                      </div>
                      <div className="co2-big">2<span>t CO₂</span></div>
                      <div className="co2-equiv">≈ 12 000 km en voiture évités</div>
                      <div className="co2-breakdown">
                        {[
                          {ico:"🔌",label:"Bornes IRVE installées (×8)",val:"-840 kg"},
                          {ico:"☀️",label:"Installations solaires (×3)",val:"-620 kg"},
                          {ico:"🏠",label:"Domotique & efficacité (×12)",val:"-380 kg"},
                          {ico:"⚡",label:"TGBT intelligents (×2)",val:"-160 kg"},
                        ].map(r=>(
                          <div key={r.label} className="co2-row">
                            <span className="co2-row-ico">{r.ico}</span>
                            <span className="co2-row-label">{r.label}</span>
                            <span className="co2-row-val">{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="profile-card" style={{textAlign:"center",marginBottom:"1rem"}}>
                    <div className="profile-avatar" aria-hidden="true">👷</div>
                    <div className="profile-name">Antoine E.</div>
                    <div className="profile-role">Électricien installateur</div>
                    <div style={{display:"flex",justifyContent:"center",gap:".5rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
                      <span className="cbadge cb-cert">EcoXpert</span>
                      <span className="cbadge cb-cpf">CPF</span>
                      <span className="cbadge cb-xp">QUALIFELEC</span>
                    </div>
                    <h3 style={{fontWeight:800,fontSize:".9rem",color:"var(--text)",marginBottom:"1rem",textAlign:"left"}}>Compétences acquises</h3>
                    {[["IRVE",85],["Domotique / Wiser",62],["TGBT Intelligent",40],["Solaire PV",71],["GTB / GTC",25]].map(([s,p])=>(
                      <div key={s} className="skill-row">
                        <div className="skill-top"><span>{s}</span><span className="skill-pct">{p}%</span></div>
                        <div className="skill-track"><div className="skill-fill" style={{width:`${p}%`}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="kpi-row">
                    {[["⚡","12","Formations suivies"],["🏅","4","Badges obtenus"],["🌱","2t","CO₂ évités"]].map(([ico,val,lbl])=>(
                      <div key={lbl} className="kpi-box">
                        <div style={{fontSize:"2rem",marginBottom:".5rem"}} aria-hidden="true">{ico}</div>
                        <div className="kpi-val" aria-label={val} style={ico==="🌱"?{background:"linear-gradient(135deg,#16a34a,#0ea5e9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{}}>{val}</div>
                        <div className="kpi-lbl">{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="fcard-fin">
                    <h2 className="fi-title" style={{marginBottom:"1.25rem"}}>
                      Parcours actif — {2+parcours.length} formation{2+parcours.length>1?"s":""}
                    </h2>

                    {/* Formation réalisée */}
                    <div style={{marginBottom:".5rem",fontSize:".6rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em"}}>✅ Réalisée</div>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",padding:".75rem",marginBottom:".75rem",background:"var(--green-lt)",borderRadius:"var(--r)",border:"1.5px solid #86efac"}}>
                      <span style={{fontSize:"1.4rem"}} aria-hidden="true">🔌</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>Installation & mise en service des IRVE</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--text2)"}}>2 jours · Présentiel · Terminé le 14 janv. 2026</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <Logo id="schneider" h={14}/>
                        <span style={{fontSize:".55rem",fontWeight:700,color:"var(--green)",background:"white",padding:"1px 6px",borderRadius:4,border:"1px solid #86efac"}}>Certifié</span>
                      </div>
                    </div>

                    {/* Formation en cours */}
                    <div style={{marginBottom:".5rem",fontSize:".6rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em"}}>⏳ En cours</div>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",padding:".75rem",marginBottom:"1rem",background:"var(--blue-lt)",borderRadius:"var(--r)",border:"1.5px solid var(--blue-md)"}}>
                      <span style={{fontSize:"1.4rem"}} aria-hidden="true">🏠</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>Solutions connectées Wiser — Domotique</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--text2)",marginBottom:5}}>1 jour · Blended · Démarré le 3 mars 2026</div>
                        <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
                          <div style={{width:"65%",height:"100%",background:"linear-gradient(90deg,var(--blue),var(--violet))",borderRadius:2}}/>
                        </div>
                        <div style={{fontSize:".55rem",color:"var(--blue)",fontWeight:700,marginTop:2}}>65% complété</div>
                      </div>
                      <Logo id="schneider" h={14}/>
                    </div>

                    {/* Formations ajoutées dynamiquement */}
                    {parcours.length>0&&(
                      <>
                        <div style={{marginBottom:".5rem",fontSize:".6rem",fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em"}}>📌 Sélectionnées</div>
                        {parcours.map(c=>(
                          <div key={c.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:".75rem 0",borderBottom:"1px solid var(--border)"}}>
                            <span style={{fontSize:"1.4rem"}} aria-hidden="true">{c.emoji}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>{c.title}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--text2)"}}>{c.duration} · {c.format}</div>
                            </div>
                            <Logo id={c.source} h={16}/>
                          </div>
                        ))}
                      </>
                    )}
                    {parcours.length===0&&(
                      <div style={{textAlign:"center",padding:".5rem 0 .25rem"}}>
                        <p style={{fontSize:".78rem",color:"var(--text2)",marginBottom:".75rem"}}>Explorez le catalogue pour ajouter d'autres formations.</p>
                        <button className="btn-secondary" style={{fontSize:".78rem"}} onClick={()=>nav("formations")}>Parcourir le catalogue</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ DÉPÔT DE TUTO ══════════ */}
      {page==="evenements"&&<EventsPage showToast={showToast}/>}
      {page==="depot"&&<DepotWizard/>}

      {page==="about"&&(
        <>
          <PageBanner tag="ℹ️ À propos" title="Les Éclaireurs!" sub="La plateforme nationale de référence pour la montée en compétences de la filière électrique française — neutre, ouverte, ancrée dans les territoires." showA11y/>

          <div className="section">
            <div className="section-inner">

              {/* VISION */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2.5rem",alignItems:"center",marginBottom:"4rem"}}>
                <div>
                  <div className="s-chip" style={{background:"var(--blue-lt)",color:"var(--blue)",marginBottom:"1rem"}}>Notre vision</div>
                  <h2 className="s-title" style={{marginBottom:"1.25rem"}}>La technologie est prête.<br/>Les compétences, pas encore.</h2>
                  <p style={{fontSize:"1rem",color:"var(--text2)",lineHeight:1.8,marginBottom:"1rem"}}>
                    La part de l'électricité dans le mix énergétique mondial doit passer de <strong>20 % à 50 % d'ici 2050</strong>. Pour y parvenir, il faut former massivement les professionnels du terrain — électriciens, tableautiers, installateurs — aux solutions connectées, à l'efficacité énergétique et au numérique.
                  </p>
                  <p style={{fontSize:"1rem",color:"var(--text2)",lineHeight:1.8}}>
                    Les Éclaireurs! est né de ce constat : <strong>des dizaines de milliers de formations existent</strong>, portées par les industriels, les organismes certifiants et les associations. Mais elles sont dispersées, difficiles à trouver, et souvent déconnectées des besoins terrain.
                  </p>
                </div>
                <div style={{background:"linear-gradient(135deg,var(--blue),var(--violet))",borderRadius:"var(--rl)",padding:"2.5rem",color:"white",boxShadow:"var(--sh-xl)"}}>
                  <div style={{fontSize:"3rem",fontWeight:800,letterSpacing:"-.04em",marginBottom:".25rem"}}>760 000</div>
                  <div style={{fontSize:".85rem",opacity:.85,marginBottom:"2rem"}}>postes à pourvoir dans la filière électrique d'ici 2030</div>
                  <div style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-.04em",marginBottom:".25rem"}}>200 000</div>
                  <div style={{fontSize:".85rem",opacity:.85,marginBottom:"2rem"}}>emplois supplémentaires dans l'industrie d'ici 2028</div>
                  <div style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-.04em",marginBottom:".25rem"}}>34,3 %</div>
                  <div style={{fontSize:".85rem",opacity:.85}}>des professionnels sans compétences logicielles de base</div>
                </div>
              </div>

              {/* CE QUE NOUS FAISONS */}
              <div style={{marginBottom:"4rem"}}>
                <div className="section-head">
                  <div className="s-chip" style={{background:"var(--violet-lt)",color:"var(--violet)"}}>Ce que nous faisons</div>
                  <h2 className="s-title">Un hub neutre, multi-sources, ouvert</h2>
                  <p className="s-desc">Nous n'imposons pas de contenu — nous agrégeons, organisons et rendons accessibles les meilleures ressources de formation de la filière.</p>
                </div>
                <div className="grid3">
                  {[
                    {ico:"🔍",col:"var(--blue)",bg:"var(--blue-lt)",title:"Agréger",desc:"109+ formations indexées, multi-marques, multi-formats (e-learning, présentiel, blended). Schneider, Legrand, Hager, Siemens et bien d'autres — réunis en un seul endroit."},
                    {ico:"🎯",col:"var(--violet)",bg:"var(--violet-lt)",title:"Personnaliser",desc:"Trois niveaux de parcours — Familiarisation, Solutions, Expertise — pour progresser à son rythme, selon son profil et ses besoins terrain immédiats."},
                    {ico:"💳",col:"var(--green)",bg:"var(--green-lt)",title:"Financer",desc:"100 % des formations sont finançables : CPF, OPCO, aides régionales, ADEME. Nous accompagnons les démarches administratives pour lever le frein financier."},
                    {ico:"💬",col:"var(--orange)",bg:"var(--orange-lt)",title:"Connecter",desc:"Un forum communautaire pour que les électriciens s'entraident, partagent leurs expériences terrain et créent un réseau de compétences vivant."},
                    {ico:"📤",col:"var(--blue)",bg:"var(--blue-lt)",title:"Contribuer",desc:"Organismes de formation, industriels, associations — déposez vos ressources, tutoriels et événements pour enrichir l'écosystème commun."},
                    {ico:"🌱",col:"var(--green)",bg:"var(--green-lt)",title:"Mesurer l'impact",desc:"Chaque électricien formé contribue à la décarbonation. Nous mesurons et rendons visible la contribution CO₂ évités à l'échelle individuelle et collective."},
                  ].map(item=>(
                    <div key={item.title} className="fcard-fin" style={{borderTop:`3px solid ${item.col}`}}>
                      <div style={{width:44,height:44,borderRadius:11,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",marginBottom:"1rem"}}>{item.ico}</div>
                      <h3 className="fi-title">{item.title}</h3>
                      <p className="fi-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GOUVERNANCE */}
              <div style={{marginBottom:"4rem"}}>
                <div className="section-head">
                  <div className="s-chip" style={{background:"var(--green-lt)",color:"var(--green)"}}>🤝 Gouvernance</div>
                  <h2 className="s-title">Un consortium public-privé</h2>
                  <p className="s-desc">Les Éclaireurs! est une initiative collective. Aucun acteur ne domine — la plateforme est agnostique marque, neutre et ouverte.</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"2rem"}}>
                  {[
                    {tag:"Industriels & distributeurs",col:"var(--blue)",logos:["schneider","legrand","hager","siemens","rexel","sonepar"],desc:"Fournissent les contenus techniques, les ressources pédagogiques et cofinancent la plateforme."},
                    {tag:"Partenaires institutionnels",col:"var(--green)",logos:["ademe","enedis","edf","rte"],desc:"Apportent légitimité, financement public et ancrage territorial à travers les régions et branches professionnelles."},
                  ].map(bloc=>(
                    <div key={bloc.tag} style={{background:"white",border:"1.5px solid var(--border)",borderRadius:"var(--rl)",padding:"1.75rem",boxShadow:"var(--sh)"}}>
                      <div className="s-chip" style={{background:bloc.col==="var(--blue)"?"var(--blue-lt)":"var(--green-lt)",color:bloc.col,marginBottom:"1rem"}}>{bloc.tag}</div>
                      <div style={{display:"flex",gap:".75rem",flexWrap:"wrap",marginBottom:"1rem"}}>
                        {bloc.logos.map(id=><div key={id} style={{background:"var(--bg)",borderRadius:"var(--r)",padding:".5rem .85rem",border:"1px solid var(--border)"}}><Logo id={id} h={22}/></div>)}
                      </div>
                      <p style={{fontSize:".82rem",color:"var(--text2)",lineHeight:1.6}}>{bloc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ÉQUIPE & VALEURS */}
              <div style={{marginBottom:"4rem"}}>
                <div className="section-head">
                  <div className="s-chip">Nos engagements</div>
                  <h2 className="s-title">Ce en quoi nous croyons</h2>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem"}}>
                  {[
                    {ico:"🔓",val:"Neutralité",desc:"Aucun favoritisme de marque. Toutes les ressources sont évaluées sur leurs mérites pédagogiques."},
                    {ico:"🌍",val:"Inclusion",desc:"Du CAP au Bac+5, pour tous les profils, partout en France. La formation ne doit pas être un privilège."},
                    {ico:"🌿",val:"Sobriété",desc:"Architecture Green IT, hébergement bas-carbone, contenu éco-conçu. La forme cohérente avec le fond."},
                    {ico:"🔒",val:"Souveraineté",desc:"Données hébergées en France, conformité RGPD, pas de dépendance aux plateformes étrangères."},
                  ].map(v=>(
                    <div key={v.val} style={{background:"var(--bg)",borderRadius:"var(--rl)",padding:"1.5rem",textAlign:"center",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"2rem",marginBottom:".75rem"}}>{v.ico}</div>
                      <div style={{fontWeight:800,fontSize:".95rem",color:"var(--text)",marginBottom:".5rem"}}>{v.val}</div>
                      <p style={{fontSize:".78rem",color:"var(--text2)",lineHeight:1.6}}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT CTA */}
              <div style={{background:"var(--bg2)",borderRadius:"var(--rl)",padding:"3rem",textAlign:"center",border:"1px solid var(--border)"}}>
                <div className="s-chip" style={{background:"var(--blue-lt)",color:"var(--blue)",margin:"0 auto 1rem"}}>Nous rejoindre</div>
                <h2 style={{fontWeight:800,fontSize:"1.6rem",color:"var(--text)",marginBottom:".75rem",letterSpacing:"-.02em"}}>Vous souhaitez contribuer ?</h2>
                <p style={{fontSize:".95rem",color:"var(--text2)",lineHeight:1.75,maxWidth:"560px",margin:"0 auto 2rem"}}>Organisme de formation, industriel, association professionnelle, région, collectivité — rejoignez le consortium et contribuez à former les électriciens de demain.</p>
                <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="btn-primary" onClick={()=>nav("depot")}>📤 Déposer une formation</button>
                  <button className="btn-secondary" onClick={()=>nav("formations")}>Explorer le catalogue →</button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <img src={LOGO_SRC} alt="" width="32" height="32" style={{objectFit:"contain"}} aria-hidden="true"/>
                <span style={{fontWeight:800,fontSize:"1.05rem",color:"var(--text)"}}>Les <span style={{color:"var(--blue)"}}>Éclaireurs!</span></span>
              </div>
              <p className="footer-desc">La plateforme nationale de référence pour la montée en compétences de la filière électrique française. Agnostique marque, neutre, ouverte.</p>
              <div className="footer-logos-row">
                {["schneider","legrand","siemens","hager"].map(id=>(
                  <div key={id} className="footer-logo-item"><Logo id={id} h={18} grey/></div>
                ))}
              </div>
            </div>
            {[
              ["Formations",["Catalogue","Niveau 1","Niveau 2","Niveau 3","Certifications"]],
              ["Sources",["Schneider Electric","Legrand","Hager","Siemens","Rexel","Sonepar"]],
              ["Financement",["Compte CPF","OPCO","Aides régionales","ADEME","France Compétences"]],
            ].map(([title,links])=>(
              <div key={title}>
                <div className="footer-col-title">{title}</div>
                <nav className="flinks" aria-label={`Liens ${title}`}>
                  {links.map(l=><button key={l} className="flink">{l}</button>)}
                </nav>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Les Éclaireurs! · Consortium Public-Privé · WCAG 2.1 AA · RGAA en cours</span>
            <div className="footer-partners">
              {["France Stratégie","ADEME","Régions","OPCO2I","France Compétences"].map(p=>(
                <span key={p} className="fpartner">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {selected&&<CourseModal course={selected} onClose={()=>setSelected(null)} onAdd={addToParcours}/>}

      {/* ── TOAST ── */}
      {toast&&(
        <div className="toast" role="alert" aria-live="assertive">
          <span className="toast-dot" aria-hidden="true"/>
          {toast}
        </div>
      )}
    </>
  );
}

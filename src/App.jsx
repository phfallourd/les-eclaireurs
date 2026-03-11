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
.logo-mark{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--violet));
  border-radius:10px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 14px rgba(26,86,219,.32);}
.logo-bolt{fill:white;width:20px;height:20px;}
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

`;

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

const COURSES=[
  {id:1,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"⚡",thumbBg:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
    title:"TGBT Intelligent — PowerTags & Smartlink",
    desc:"Configurer un tableau général basse tension intelligent avec capteurs PowerTags pour la supervision énergétique en tertiaire.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"3h30",format:"Blended",badges:[{t:"EcoXpert",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["TGBT Intelligent","Efficacité énergie"],
    objectives:["Câbler et configurer PowerTags SE sur un TGBT","Paramétrer la communication Smartlink","Connecter au logiciel PME pour la supervision","Analyser les données de consommation en temps réel"]},
  {id:2,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"🏠",thumbBg:"linear-gradient(135deg,#e0f2fe,#bae6fd)",
    title:"Wiser Home — Domotique résidentielle complète",
    desc:"Maîtriser l'écosystème Wiser pour la domotique : volets, éclairage, thermostats, pilotage via app mobile.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"2h",format:"Vidéo",badges:[{t:"Initiation",c:"cb-free"}],
    themes:["Domotique / Wiser"],
    objectives:["Architecture système Wiser","Installation et appairage des modules","Configuration scènes et automatisations","Paramétrage app client iOS/Android"]},
  {id:3,source:"enedis",sourceLabel:"Enedis",sourceColor:"#0072bc",
    emoji:"☀️",thumbBg:"linear-gradient(135deg,#fef9c3,#fde68a)",
    title:"Installation Photovoltaïque — Certification QUALIFELEC",
    desc:"Formation complète dimensionnement, installation et mise en service d'une installation solaire résidentielle et tertiaire.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"5 jours",format:"Présentiel",badges:[{t:"QUALIFELEC",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["Solaire PV"],
    objectives:["Dimensionner un système PV","Maîtriser les raccordements AC/DC","Configurer onduleur et monitoring","Réaliser les démarches administratives"]},
  {id:4,source:"legrand",sourceLabel:"Legrand",sourceColor:"#e2001a",
    emoji:"📺",thumbBg:"linear-gradient(135deg,#fee2e2,#fecaca)",
    title:"IRVE — Borne de recharge : installation pas à pas",
    desc:"Tutoriel communautaire pour installer une borne de recharge VE en maison individuelle et collectif.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"45 min",format:"Micro-learning",badges:[{t:"Gratuit",c:"cb-free"}],
    themes:["IRVE"],
    objectives:["Normes NF C 15-100 IRVE","Choix de la bonne borne","Câblage et sécurisation","Mise en service et test"]},
  {id:5,source:"hager",sourceLabel:"Hager",sourceColor:"#c8000a",
    emoji:"🔌",thumbBg:"linear-gradient(135deg,#ffe4e6,#fecdd3)",
    title:"domovea — GTB résidentielle KNX",
    desc:"Intégrer le système domotique domovea dans une installation existante. Configuration KNX et protocoles de communication.",
    level:"Niv. 3",lvlBg:"var(--orange-lt)",lvlColor:"var(--orange)",
    duration:"6h",format:"Blended",badges:[{t:"KNX",c:"cb-xp"},{t:"Expert",c:"cb-xp"}],
    themes:["GTB / GTC","Domotique / Wiser"],
    objectives:["Programmer un bus KNX","Intégrer domovea","Créer interfaces supervision","Diagnostiquer pannes réseau"]},
  {id:6,source:"schneider",sourceLabel:"Schneider Electric",sourceColor:"#3db83d",
    emoji:"📊",thumbBg:"linear-gradient(135deg,#dcfce7,#a7f3d0)",
    title:"Power Monitoring Expert — Cas Boulangerie",
    desc:"Déployer PME pour surveiller et optimiser la consommation d'une boulangerie avec TGBT intelligent.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"4h",format:"Blended",badges:[{t:"EcoXpert",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["PME Supervision","TGBT Intelligent","Efficacité énergie"],
    objectives:["Déployer EcoStruxure Power Monitoring","Créer tableaux de bord énergie","Paramétrer alertes de surconsommation","Générer rapports réglementaires"]},
  {id:7,source:"legrand",sourceLabel:"Legrand",sourceColor:"#e05a0c",
    emoji:"🌐",thumbBg:"linear-gradient(135deg,#fff7ed,#fed7aa)",
    title:"Gamme connectée Legrand — IoT Habitat & Tertiaire",
    desc:"Prises, interrupteurs et systèmes connectés Legrand pour l'habitat et le tertiaire.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"1h30",format:"Vidéo",badges:[{t:"Initiation",c:"cb-free"}],
    themes:["IoT / Réseau","Domotique / Wiser"],
    objectives:["Présentation gamme connectée","Installation et config sans fil","Intégration assistants vocaux","Programmation de scénarios"]},
  {id:8,source:"siemens",sourceLabel:"Siemens",sourceColor:"#009999",
    emoji:"🏢",thumbBg:"linear-gradient(135deg,#cffafe,#a5f3fc)",
    title:"Desigo CC — Gestion technique du bâtiment",
    desc:"Maîtriser le système GTB Desigo CC pour la gestion centralisée CVC, éclairage et sécurité tertiaire.",
    level:"Niv. 3",lvlBg:"var(--orange-lt)",lvlColor:"var(--orange)",
    duration:"3 jours",format:"Présentiel",badges:[{t:"Certification",c:"cb-cert"},{t:"Expert",c:"cb-xp"}],
    themes:["GTB / GTC"],
    objectives:["Architecture Desigo CC","Intégration BACnet/Modbus","Programmation automates","Maintenance et diagnostics distants"]},
  {id:9,source:"hager",sourceLabel:"Hager",sourceColor:"#e55e0a",
    emoji:"🎓",thumbBg:"linear-gradient(135deg,#f3f4f6,#e5e7eb)",
    title:"Micro-learning : lire un schéma électrique tertiaire",
    desc:"10 minutes pour (re)maîtriser la lecture des plans et schémas de tableaux électriques.",
    level:"Niv. 1",lvlBg:"var(--green-lt)",lvlColor:"var(--green)",
    duration:"10 min",format:"Micro-learning",badges:[{t:"Gratuit",c:"cb-free"}],
    themes:["TGBT Intelligent"],
    objectives:["Symboles normalisés","Lecture schéma unifilaire","Identification des protections","Conformité NF C 15-100"]},
];
const PARCOURS=[
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
  {icon:"💳",title:"CPF — Compte Personnel Formation",desc:"Toutes les formations certifiantes éligibles au CPF sont directement accessibles depuis la plateforme. Dépôt simplifié et accompagnement inclus.",amount:"Jusqu'à 5 000 €/an"},
  {icon:"🏢",title:"OPCO — Financement entreprise",desc:"Vos cotisations financent vos formations via votre OPCO. Accompagnement dans les démarches administratives inclus.",amount:"Prise en charge totale possible"},
  {icon:"🗺️",title:"Aides Régionales & ADEME",desc:"Dispositifs régionaux et aides ADEME pour la transition énergétique. Cartographie des aides disponibles par département.",amount:"Variables selon territoire"},
];

/* ─────────── MODAL ─────────── */
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
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(n=>(n+1)%100),1800);return()=>clearInterval(t);},[]);
  const kwVal=(7.2+Math.sin(tick*0.6)*0.8).toFixed(1);
  const pct=Math.round(68+Math.sin(tick*0.4)*8);

  return(
    <div className="hero-right">
      <div className="hero-photo-wrap">
        <div className="corner corner-tl" aria-hidden="true"/>
        <div className="corner corner-br" aria-hidden="true"/>
        {/* ── Photo réelle : électricien installant une borne IRVE ── */}
        <img
          src="data:image/png;base64,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"
          alt="Électricien en tenue de chantier configurant une borne de recharge véhicule électrique avec son laptop, famille en arrière-plan"
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
        {/* Card 1 — Charge en cours */}
        <div className="fcard fc1" aria-hidden="true">
          <div className="fc-head">
            <div className="fc-ico" style={{background:"var(--green-lt)"}}>🔌</div>
            <div className="fc-lbl">Charge en cours</div>
          </div>
          <div className="fc-val">{pct}<span style={{fontSize:".75rem",fontWeight:600,color:"var(--text2)"}}>%</span></div>
          <div className="fc-sub">{kwVal} kW · IRVE 22kW AC</div>
          <div className="fc-bar"><div className="fc-fill" style={{width:`${pct}%`,background:"linear-gradient(90deg,var(--green),#22c55e)"}}/></div>
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

export default function App(){
  const [page,setPage]=useState("accueil");
  const [src,setSrc]=useState("all");
  const [theme,setTheme]=useState("Tous");
  const [fmt,setFmt]=useState("Tous");
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
    const qOk=!search||c.title.toLowerCase().includes(search.toLowerCase())||c.desc.toLowerCase().includes(search.toLowerCase());
    return sOk&&tOk&&fOk&&qOk;
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
              <svg className="logo-bolt" viewBox="0 0 32 32"><path d="M20 2L8 18h10l-6 12L28 14H18L20 2z"/></svg>
            </div>
            <div className="logo-name">Les <span>Éclaireurs!</span></div>
          </button>
          <nav className="nav-links" aria-label="Menu principal">
            {[["accueil","Accueil"],["formations","Formations"],["parcours","Parcours"],["forum","Communauté 💬"],["financement","Financement"],["depot","📤 Déposer"],["profil","Mon Profil"]].map(([id,label])=>(
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
        {[["accueil","Accueil 🏠"],["formations","Formations 📚"],["parcours","Parcours 🎯"],["forum","Communauté 💬"],["financement","Financement 💰"],["depot","📤 Déposer"],["profil","Mon Profil 👤"]].map(([id,label])=>(
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

          {/* PARCOURS */}
          <section className="section" aria-labelledby="parcours-title">
            <div className="section-inner">
              <div className="section-head">
                <div className="s-chip" aria-hidden="true">Parcours pédagogiques</div>
                <h2 id="parcours-title" className="s-title">Trois niveaux de maîtrise</h2>
                <p className="s-desc">De la prise en main des produits à l'expertise numérique — un parcours structuré pour chaque profil.</p>
              </div>
              <div className="pgrid">
                {PARCOURS.map(p=>(
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
          <PageBanner tag="Parcours métiers" title="Montée en compétences structurée" sub="Trois niveaux progressifs pour passer de la familiarisation à l'expertise numérique et énergétique." showA11y/>
          <div className="section">
            <div className="section-inner">
              <div className="pgrid" style={{marginBottom:"3rem"}}>
                {PARCOURS.map(p=>(
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
                    <h2 className="fi-title" style={{marginBottom:"1rem"}}>
                      {parcours.length>0?`Parcours actif — ${parcours.length} formation${parcours.length>1?"s":""}`:
                      "Aucune formation dans le parcours actif"}
                    </h2>
                    {parcours.length===0?(
                      <div style={{textAlign:"center",padding:"1.5rem 0"}}>
                        <p style={{fontSize:".82rem",color:"var(--text2)",marginBottom:"1rem"}}>Explorez le catalogue pour construire votre parcours.</p>
                        <button className="btn-primary" onClick={()=>nav("formations")}>Parcourir le catalogue</button>
                      </div>
                    ):parcours.map(c=>(
                      <div key={c.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:".75rem 0",borderBottom:"1px solid var(--border)"}}>
                        <span style={{fontSize:"1.4rem"}} aria-hidden="true">{c.emoji}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:".82rem",fontWeight:700,color:"var(--text)"}}>{c.title}</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",color:"var(--text2)"}}>{c.duration} · {c.format}</div>
                        </div>
                        <Logo id={c.source} h={16}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ DÉPÔT DE TUTO ══════════ */}
      {page==="depot"&&<DepotWizard/>}

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="logo-mark" style={{width:30,height:30}} aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="17" height="17" style={{fill:"white"}}><path d="M20 2L8 18h10l-6 12L28 14H18L20 2z"/></svg>
                </div>
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
            <span className="footer-copy">© 2026 Les Éclaireurs! · SAS initiée par Schneider Electric · WCAG 2.1 AA · RGAA en cours</span>
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

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
.fc1{bottom:32px;left:-52px;width:210px;}
.fc2{top:28px;right:-42px;width:186px;animation-delay:.8s;}
.fc3{bottom:120px;right:-42px;width:170px;animation-delay:1.6s;}
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

@media(max-width:860px){.forum-grid{grid-template-columns:1fr;} .forum-cats{position:static;}}
  .hero-inner{grid-template-columns:1fr 1fr;gap:2rem;}
  .fc1{left:-20px;width:190px;} .fc2{right:-20px;width:170px;} .fc3{right:-20px;width:155px;}
}
@media(max-width:860px){
  .hero-inner{grid-template-columns:1fr;} .hero-right{max-width:500px;margin:0 auto;}
  .grid3{grid-template-columns:1fr 1fr;} .pgrid{grid-template-columns:1fr;}
  .live-inner{grid-template-columns:1fr;} .profile-grid{grid-template-columns:1fr;}
  .footer-grid{grid-template-columns:1fr 1fr;} .nav-links{display:none;}
}
@media(max-width:640px){
  .grid3{grid-template-columns:1fr;} .grid4{grid-template-columns:1fr 1fr;}
  .footer-grid{grid-template-columns:1fr;} .hero-stats{flex-direction:column;gap:.5rem;}
  .stat-item{border-right:none;border-bottom:1px solid var(--border);}
}
`;

/* ─────────── LOGO COMPONENT ─────────── */
const LOGOS = {
  schneider:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Schneider_Electric_2007.svg/240px-Schneider_Electric_2007.svg.png",
  legrand:  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Legrand_logo.svg/240px-Legrand_logo.svg.png",
  hager:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Hager_Group_Logo.svg/240px-Hager_Group_Logo.svg.png",
  siemens:  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/240px-Siemens-logo.svg.png",
  rexel:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rexel_logo.svg/240px-Rexel_logo.svg.png",
  sonepar:  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sonepar_logo.svg/240px-Sonepar_logo.svg.png",
  ines:     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/INES_LOGO.png/240px-INES_LOGO.png",
  ademe:    "https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_ADEME.svg/240px-Logo_ADEME.svg.png",
  enedis:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Logo_Enedis.svg/240px-Logo_Enedis.svg.png",
  edf:      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/EDF_logo.svg/160px-EDF_logo.svg.png",
  rte:      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/RTE_logo.svg/240px-RTE_logo.svg.png",
  youtube:  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png",
};
const FALLBACK = {schneider:"Schneider",legrand:"Legrand",hager:"Hager",siemens:"Siemens",rexel:"Rexel",sonepar:"Sonepar",ines:"INES",ademe:"ADEME",enedis:"Enedis",edf:"EDF",rte:"RTE",youtube:"YouTube"};

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
  {id:"youtube",label:"YouTube / Web",color:"#ff0000"},
  {id:"ines",label:"INES Solar",color:"#ca8a04"},
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
  {id:3,source:"ines",sourceLabel:"INES Solar",sourceColor:"#ca8a04",
    emoji:"☀️",thumbBg:"linear-gradient(135deg,#fef9c3,#fde68a)",
    title:"Installation Photovoltaïque — Certification QUALIFELEC",
    desc:"Formation complète dimensionnement, installation et mise en service d'une installation solaire résidentielle et tertiaire.",
    level:"Niv. 2",lvlBg:"var(--blue-lt)",lvlColor:"var(--blue)",
    duration:"5 jours",format:"Présentiel",badges:[{t:"QUALIFELEC",c:"cb-cert"},{t:"CPF",c:"cb-cpf"}],
    themes:["Solaire PV"],
    objectives:["Dimensionner un système PV","Maîtriser les raccordements AC/DC","Configurer onduleur et monitoring","Réaliser les démarches administratives"]},
  {id:4,source:"youtube",sourceLabel:"YouTube / Communauté",sourceColor:"#ff0000",
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
  {id:9,source:"youtube",sourceLabel:"YouTube / Communauté",sourceColor:"#ff0000",
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
        {/* ── SVG Electrician + EV Charger scene ── */}
        <div role="img" aria-label="Électricien installant une borne de recharge rapide pour véhicule électrique"
          style={{width:"100%",height:430,borderRadius:"var(--rl)",overflow:"hidden",
            background:"linear-gradient(160deg,#e8f4fd 0%,#f0f9ff 40%,#e8f0fe 100%)",
            boxShadow:"var(--sh-xl)",position:"relative"}}>
          <svg width="100%" height="100%" viewBox="0 0 480 430" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dbeafe"/><stop offset="100%" stopColor="#eff6ff"/>
              </linearGradient>
              <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d1d5db"/><stop offset="100%" stopColor="#9ca3af"/>
              </linearGradient>
              <linearGradient id="carG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1e40af"/><stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
              <linearGradient id="screenG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a"/><stop offset="100%" stopColor="#1e3a5f"/>
              </linearGradient>
              <filter id="carShadow"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,.2)"/></filter>
              <filter id="personShadow"><feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,.15)"/></filter>
              <filter id="glow2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Sky */}
            <rect width="480" height="430" fill="url(#skyG)"/>

            {/* Clouds */}
            <ellipse cx="80" cy="60" rx="45" ry="18" fill="white" opacity=".7"/>
            <ellipse cx="110" cy="52" rx="35" ry="22" fill="white" opacity=".7"/>
            <ellipse cx="55" cy="65" rx="30" ry="15" fill="white" opacity=".6"/>
            <ellipse cx="360" cy="45" rx="50" ry="16" fill="white" opacity=".5"/>
            <ellipse cx="395" cy="38" rx="38" ry="20" fill="white" opacity=".5"/>

            {/* Sun */}
            <circle cx="420" cy="70" r="28" fill="#fde68a" opacity=".8"/>
            <circle cx="420" cy="70" r="20" fill="#fbbf24"/>
            {[0,45,90,135,180,225,270,315].map((a,i)=>(
              <line key={i}
                x1={420+Math.cos(a*Math.PI/180)*24} y1={70+Math.sin(a*Math.PI/180)*24}
                x2={420+Math.cos(a*Math.PI/180)*34} y2={70+Math.sin(a*Math.PI/180)*34}
                stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
            ))}

            {/* Building background */}
            <rect x="300" y="80" width="140" height="250" rx="4" fill="#e2e8f0"/>
            <rect x="300" y="80" width="140" height="12" rx="2" fill="#cbd5e1"/>
            {[0,1,2,3].map(row=>[0,1,2].map(col=>(
              <rect key={`w${row}${col}`} x={315+col*40} y={105+row*48} width="28" height="32" rx="3"
                fill={row===0&&col===1?"#bfdbfe":"#dde6f0"} stroke="#cbd5e1" strokeWidth="1"/>
            )))}
            {/* Parking sign */}
            <rect x="370" y="340" width="36" height="48" rx="3" fill="#1a56db"/>
            <text x="388" y="370" textAnchor="middle" fill="white" fontSize="22" fontWeight="900">P</text>
            <rect x="382" y="388" width="12" height="30" rx="2" fill="#6b7280"/>

            {/* Floor / ground */}
            <rect x="0" y="340" width="480" height="90" fill="url(#floorG)"/>
            <rect x="0" y="340" width="480" height="4" fill="#9ca3af"/>
            {/* Parking lines */}
            {[80,160,260,360].map(x=>(
              <line key={x} x1={x} y1="344" x2={x} y2="390" stroke="white" strokeWidth="2" opacity=".5" strokeDasharray="8,6"/>
            ))}

            {/* ── ELECTRIC CAR ── */}
            <g transform="translate(160,260)" filter="url(#carShadow)">
              {/* car body */}
              <rect x="0" y="40" width="190" height="65" rx="8" fill="url(#carG)"/>
              {/* roof */}
              <path d="M30 40 Q50 10 80 8 L140 8 Q165 10 175 40 Z" fill="#1d4ed8"/>
              {/* windshield */}
              <path d="M45 38 Q55 14 80 12 L130 12 Q152 14 158 38 Z" fill="#bfdbfe" opacity=".85"/>
              {/* side window */}
              <rect x="32" y="14" width="35" height="24" rx="3" fill="#bfdbfe" opacity=".7"/>
              {/* door line */}
              <line x1="95" y1="40" x2="95" y2="105" stroke="#1d4ed8" strokeWidth="1.5"/>
              {/* headlight */}
              <ellipse cx="182" cy="65" rx="7" ry="10" fill="#fde68a" opacity=".9">
                <animate attributeName="opacity" values=".9;.5;.9" dur="3s" repeatCount="indefinite"/>
              </ellipse>
              {/* taillight */}
              <rect x="2" y="58" width="8" height="16" rx="2" fill="#ef4444" opacity=".8"/>
              {/* wheels */}
              <circle cx="40" cy="108" r="20" fill="#1f2937"/><circle cx="40" cy="108" r="12" fill="#374151"/><circle cx="40" cy="108" r="5" fill="#9ca3af"/>
              <circle cx="148" cy="108" r="20" fill="#1f2937"/><circle cx="148" cy="108" r="12" fill="#374151"/><circle cx="148" cy="108" r="5" fill="#9ca3af"/>
              {/* EV badge */}
              <rect x="155" y="72" width="28" height="14" rx="3" fill="#10b981"/>
              <text x="169" y="82" textAnchor="middle" fill="white" fontSize="7" fontWeight="800">EV</text>
              {/* charge port open */}
              <rect x="0" y="68" width="14" height="18" rx="2" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1"/>
              <circle cx="7" cy="77" r="4" fill="#60a5fa"/>
            </g>

            {/* ── CHARGING CABLE ── */}
            <path d="M 130 315 Q 115 310 108 290 Q 100 270 105 250" stroke="#1a56db" strokeWidth="5" fill="none" strokeLinecap="round">
              <animate attributeName="d" values="M 130 315 Q 115 310 108 290 Q 100 270 105 250;M 130 315 Q 118 308 110 288 Q 102 268 107 248;M 130 315 Q 115 310 108 290 Q 100 270 105 250" dur="2s" repeatCount="indefinite"/>
            </path>

            {/* ── EV CHARGER STATION ── */}
            <g transform="translate(60,190)">
              {/* pole */}
              <rect x="18" y="100" width="8" height="80" rx="3" fill="#6b7280"/>
              {/* charger box */}
              <rect x="0" y="20" width="44" height="80" rx="8" fill="#1e3a5f" stroke="#1a56db" strokeWidth="2"/>
              {/* screen */}
              <rect x="6" y="26" width="32" height="38" rx="4" fill="url(#screenG)" stroke="#0ea5e9" strokeWidth="1"/>
              {/* animated charging % */}
              <text x="22" y="42" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="700">{pct}%</text>
              <text x="22" y="54" textAnchor="middle" fill="#67e8f9" fontSize="6" fontFamily="monospace">{kwVal} kW</text>
              <rect x="8" y="57" width="28" height="4" rx="2" fill="#1f2937"/>
              <rect x="8" y="57" width={28*pct/100} height="4" rx="2" fill="#4ade80">
                <animate attributeName="width" values={`${28*pct/100};${28*(pct+3)/100};${28*pct/100}`} dur="2s" repeatCount="indefinite"/>
              </rect>
              {/* charge LED */}
              <circle cx="22" cy="70" r="4" fill="#4ade80"><animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite"/></circle>
              {/* connector socket */}
              <rect x="14" y="82" width="16" height="12" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1"/>
              {/* brand */}
              <rect x="6" y="96" width="32" height="10" rx="2" fill="rgba(26,86,219,.4)"/>
              <text x="22" y="104" textAnchor="middle" fill="#90bfff" fontSize="5" fontFamily="monospace" fontWeight="700">SCHNEIDER</text>
            </g>

            {/* ── ELECTRICIAN CHARACTER ── */}
            <g transform="translate(118,170)" filter="url(#personShadow)">
              {/* legs */}
              <rect x="14" y="105" width="12" height="50" rx="5" fill="#374151"/>
              <rect x="30" y="105" width="12" height="50" rx="5" fill="#374151"/>
              {/* boots */}
              <rect x="11" y="148" width="16" height="12" rx="4" fill="#1f2937"/>
              <rect x="27" y="148" width="16" height="12" rx="4" fill="#1f2937"/>
              {/* body / vest */}
              <rect x="10" y="60" width="36" height="50" rx="8" fill="#f97316"/>
              {/* vest stripes */}
              <rect x="10" y="73" width="36" height="5" fill="#fbbf24" opacity=".8"/>
              <rect x="10" y="95" width="36" height="5" fill="#fbbf24" opacity=".8"/>
              {/* left arm — raised toward charger */}
              <path d="M10 70 Q-5 65 -8 50 Q-10 38 -2 32" stroke="#f97316" strokeWidth="11" fill="none" strokeLinecap="round"/>
              {/* right arm — holding tablet */}
              <path d="M46 70 Q62 68 66 58 Q70 48 65 42" stroke="#f97316" strokeWidth="11" fill="none" strokeLinecap="round"/>
              {/* tablet */}
              <rect x="58" y="30" width="24" height="18" rx="3" fill="#1e3a5f" stroke="#0ea5e9" strokeWidth="1.5"/>
              <rect x="60" y="32" width="20" height="14" rx="2" fill="#0f172a"/>
              {[0,1,2].map(i=><rect key={i} x={62} y={34+i*4} width={16} height="2" rx="1" fill="#60a5fa" opacity=".7"/>)}
              {/* head */}
              <circle cx="28" cy="46" r="16" fill="#f5d0a9"/>
              {/* helmet */}
              <path d="M13 44 Q14 24 28 22 Q42 24 43 44 Z" fill="#f59e0b"/>
              <rect x="12" y="42" width="32" height="5" rx="2" fill="#d97706"/>
              {/* face */}
              <circle cx="23" cy="48" r="2" fill="#374151"/>
              <circle cx="33" cy="48" r="2" fill="#374151"/>
              <path d="M22 55 Q28 59 34 55" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              {/* safety glasses */}
              <rect x="19" y="44" width="9" height="6" rx="2" fill="#bfdbfe" opacity=".7"/>
              <rect x="30" y="44" width="9" height="6" rx="2" fill="#bfdbfe" opacity=".7"/>
              <line x1="28" y1="47" x2="30" y2="47" stroke="#374151" strokeWidth="1"/>
            </g>

            {/* ── ENERGY FLOW ANIMATION ── */}
            {[0,1,2].map(i=>(
              <circle key={i} r="4" fill="#4ade80" opacity=".8">
                <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${i*0.6}s`}
                  path="M 104 250 Q 100 270 108 290 Q 115 310 130 315"/>
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin={`${i*0.6}s`}/>
              </circle>
            ))}

            {/* ── WIFI/SIGNAL WAVES from charger ── */}
            {[1,2,3].map(i=>(
              <circle key={i} cx="82" cy="205" r={i*12} fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity={.5/i}>
                <animate attributeName="r" values={`${i*8};${i*14};${i*8}`} dur="2s" repeatCount="indefinite" begin={`${i*0.3}s`}/>
                <animate attributeName="opacity" values={`${.6/i};${.1/i};${.6/i}`} dur="2s" repeatCount="indefinite" begin={`${i*0.3}s`}/>
              </circle>
            ))}

            {/* ── INFO BADGE top left ── */}
            <rect x="16" y="16" width="140" height="28" rx="8" fill="white" opacity=".9" filter="url(#carShadow)"/>
            <circle cx="30" cy="30" r="7" fill="#dcfce7"/>
            <text x="30" y="34" textAnchor="middle" fontSize="9">⚡</text>
            <text x="44" y="27" fill="#374151" fontSize="8" fontWeight="700">Borne IRVE rapide</text>
            <text x="44" y="38" fill="#6b7280" fontSize="7">22 kW AC · Type 2</text>
          </svg>
        </div>

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
    tags:["IRVE","Schneider","EVlink"],replies:8,likes:12,solved:false,
    answers:[
      {author:"Marc D.",avatar:"🧑‍🔧",role:"EcoXpert Schneider",time:"Il y a 8 min",body:"E4 c'est généralement une erreur de communication avec le compteur. Vérifie que le câble Modbus est bien branché sur les bornes A/B du tableau. As-tu configuré l'adresse Modbus dans le menu ?",likes:7,best:true},
      {author:"Sophie L.",avatar:"👩‍🔧",role:"Électricienne",time:"Il y a 5 min",body:"J'ai eu la même chose ! Chez moi c'était un problème de phase. Vérifie que la phase N est bien présente.",likes:3,best:false},
    ]},
  {id:2,cat:"solaire",author:"Pierre M.",avatar:"🧑‍💼",role:"Installateur PV",time:"Il y a 34 min",
    title:"Dimensionnement onduleur pour installation 9 kWc en autoconsommation totale",
    body:"Je dois installer 9 kWc sur une maison avec une conso annuelle de 12 000 kWh. Le client veut de l'autoconsommation totale avec stockage. Quelqu'un a des retours sur les onduleurs hybrides Fronius vs SMA ?",
    tags:["Solaire PV","Onduleur","Stockage"],replies:5,likes:9,solved:true,
    answers:[
      {author:"Jean-Paul R.",avatar:"👨‍🔧",role:"Expert PV INES",time:"Il y a 20 min",body:"Pour 9 kWc en autoconso totale je recommande le SMA Sunny Tripower Smart Energy. Très bon retour d'expérience sur 2 ans. Le Fronius Gen24 est bien aussi mais plus cher. Tu veux que je te partage ma fiche de dimensionnement ?",likes:11,best:true},
    ]},
  {id:3,cat:"domotique",author:"Lucie B.",avatar:"👩‍💼",role:"Électricienne",time:"Il y a 2h",
    title:"Wiser — impossible de connecter les thermostats en ZigBee après mise à jour",
    body:"Depuis la dernière mise à jour de l'app Wiser, mes thermostats ne se connectent plus au hub. J'ai essayé de les réinitialiser mais rien ne change. Quelqu'un a une solution ?",
    tags:["Wiser","Domotique","ZigBee"],replies:12,likes:6,solved:true,
    answers:[
      {author:"Thomas K.",avatar:"🧑‍🔧",role:"Technicien Schneider",time:"Il y a 1h30",body:"Problème connu avec la v2.8.1 ! Il faut faire une réinitialisation complète du hub : maintenir le bouton reset 10 secondes, puis réappairer les thermostats un par un. Schneider a publié un patch ce matin.",likes:18,best:true},
    ]},
  {id:4,cat:"tgbt",author:"Karim A.",avatar:"👨‍💼",role:"Tableautier",time:"Il y a 1h",
    title:"PowerTag E — pas de remontée de données dans PME après configuration",
    body:"J'ai installé 6 PowerTag E sur un TGBT pour un client tertiaire. La config réseau est OK, les LEDs clignotent bien mais dans PME je ne vois aucune donnée remonter. J'ai suivi le guide Schneider à la lettre.",
    tags:["PowerTag","PME","TGBT"],replies:3,likes:4,solved:false,
    answers:[
      {author:"Nadia F.",avatar:"👩‍🔧",role:"EcoXpert Schneider",time:"Il y a 45 min",body:"Vérifie l'adresse IP de ton Smartlink SI et assure-toi qu'il est bien sur le même sous-réseau que PME. Aussi, dans PME va dans Paramètres > Sources > Smartlink et rafraîchis la découverte automatique.",likes:5,best:false},
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
    {text:"> Sources: Schneider · Legrand · Hager · Siemens · INES",cls:"tl-dim"},
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
          <button className="nav-logo" onClick={()=>nav("accueil")} aria-label="Les Éclaireurs — Accueil">
            <div className="logo-mark" aria-hidden="true">
              <svg className="logo-bolt" viewBox="0 0 32 32"><path d="M20 2L8 18h10l-6 12L28 14H18L20 2z"/></svg>
            </div>
            <div className="logo-name">Les <span>Éclaireurs</span></div>
          </button>
          <nav className="nav-links" aria-label="Menu principal">
            {[["accueil","Accueil"],["formations","Formations"],["parcours","Parcours"],["forum","Communauté 💬"],["financement","Financement"],["profil","Mon Profil"]].map(([id,label])=>(
              <button key={id} className={`nav-btn ${page===id?"active":""}`} onClick={()=>nav(id)} aria-current={page===id?"page":undefined}>{label}</button>
            ))}
          </nav>
          <div>
            {parcours.length>0&&<span className="nav-count" aria-live="polite">{parcours.length} formation{parcours.length>1?"s":""}</span>}
            <button className="nav-cta" onClick={()=>nav("formations")} style={{marginLeft:"8px"}}>Commencer</button>
          </div>
        </nav>
      </header>

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
                  Schneider, Legrand, Hager, Siemens, INES, YouTube — réunis, organisés par compétences,
                  finançables via CPF et OPCO.
                </p>
                <div className="hero-stats" role="list" aria-label="Chiffres clés">
                  {[["760K","Postes/an · 2019-2030"],["109+","Formations disponibles"],["8","Sources partenaires"]].map(([n,l])=>(
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
                {[{id:"schneider"},{id:"legrand"},{id:"hager"},{id:"siemens"},{id:"rexel"},{id:"sonepar"},{id:"ines"},{id:"youtube"}].map(({id})=>(
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
                      {["Visio directement depuis le chantier","Experts Schneider, Legrand, Hager disponibles","Compte comme session de formation courte","Rapport d'intervention généré automatiquement"].map(f=>(
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
                    <span style={{fontWeight:700,fontSize:".88rem",color:"var(--text2)"}}>{label}</span>
                  </div>
                ))}
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
                          <div className="source-mini"><Logo id={c.source} h={14}/><span>{c.sourceLabel}</span></div>
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
                          <div className="source-mini"><Logo id={c.source} h={14}/><span>{c.sourceLabel}</span></div>
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
          <PageBanner tag="Communauté" title="Forum des Éclaireurs" sub="Posez vos questions, partagez vos bonnes pratiques, aidez vos confrères électriciens." showA11y/>
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
                    {[["⚡","12","Formations suivies"],["🏅","4","Badges obtenus"],["⏱","34h","Temps de formation"]].map(([ico,val,lbl])=>(
                      <div key={lbl} className="kpi-box">
                        <div style={{fontSize:"2rem",marginBottom:".5rem"}} aria-hidden="true">{ico}</div>
                        <div className="kpi-val" aria-label={val}>{val}</div>
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
                <span style={{fontWeight:800,fontSize:"1.05rem",color:"var(--text)"}}>Les <span style={{color:"var(--blue)"}}>Éclaireurs</span></span>
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
              ["Sources",["Schneider Electric","Legrand","Hager","Siemens","INES Solar","YouTube"]],
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
            <span className="footer-copy">© 2026 Les Éclaireurs · SAS initiée par Schneider Electric · WCAG 2.1 AA · RGAA en cours</span>
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

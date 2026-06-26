cat > /mnt/user-data/outputs/runnerx-final.html << 'ENDOFFILE'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>RunnerX — EQ Runner</title>
<style>
:root{
  --gold:#F5A623;--gold-lt:#FDC84B;--danger:#EF4444;--success:#10B981;
  --info:#3B82F6;--bg-dark:#0a0814;--bg-mid:#160f2a;--bg-card:#1e1438;
  --txt:#F3F0FF;--txt-m:#9A8EC4;--primary:#7C3AED;--prim-lt:#A78BFA;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0814;
  font-family:'Segoe UI',system-ui,sans-serif;color:#F3F0FF;
  user-select:none;-webkit-user-select:none;touch-action:manipulation}

/* ── SCREENS ── */
.screen{position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;opacity:0;pointer-events:none;
  transition:opacity .35s;overflow:hidden}
.screen.active{opacity:1;pointer-events:all}

/* ─── LOADING ─── */
#s-loading{background:#0a0814;gap:12px}
.ld-icon{font-size:64px;animation:pulse 1.2s infinite}
.ld-name{font-size:22px;font-weight:900;letter-spacing:2px;color:#F5A623}
.ld-bar{width:260px;height:6px;background:#1e1438;border-radius:99px;overflow:hidden}
.ld-fill{height:100%;background:linear-gradient(90deg,#7C3AED,#F5A623);border-radius:99px;animation:ld 2.2s forwards}
@keyframes ld{from{width:0}to{width:100%}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}

/* ─── MENU (LOBBY) ─── */
#s-menu{justify-content:flex-start;align-items:stretch;background:none;overflow:hidden}

/* Background: SVG fills everything */
.bg-wrap{position:absolute;inset:0;z-index:0;overflow:hidden}
.bg-wrap svg{width:100%;height:100%;object-fit:cover}

/* Dark vignette overlay */
.bg-vignette{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    linear-gradient(to right,rgba(0,0,0,.55) 0%,transparent 30%,transparent 70%,rgba(0,0,0,.55) 100%),
    linear-gradient(to bottom,rgba(0,0,0,.3) 0%,transparent 12%,transparent 78%,rgba(0,0,0,.65) 100%)}

/* Petals container */
#petals{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
.petal{position:absolute;font-size:12px;top:-20px;
  animation:pfall var(--d,6s) var(--dl,0s) infinite linear;opacity:0}
@keyframes pfall{
  0%{transform:translate(0,-30px) rotate(0deg);opacity:0}
  8%{opacity:.9}88%{opacity:.5}
  100%{transform:translate(var(--dx,50px),110vh) rotate(600deg);opacity:0}}

/* TOP BAR */
.menu-top{position:relative;z-index:10;display:flex;align-items:center;
  justify-content:space-between;padding:6px 14px;
  background:rgba(4,2,12,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}
.pcrd{display:flex;align-items:center;gap:9px}
.pavt{width:42px;height:42px;border-radius:50%;border:2.5px solid #F5A623;
  background:#1e1438;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.pavt svg{width:100%;height:100%}
.pinfo{display:flex;flex-direction:column;gap:3px}
.pname{font-size:13px;font-weight:900;color:#fff;letter-spacing:.4px}
.plvrow{display:flex;align-items:center;gap:5px}
.lv-badge{font-size:10px;font-weight:800;color:#F5A623;background:rgba(245,166,35,.15);
  border-radius:4px;padding:1px 6px}
.xp-track{width:85px;height:4px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}
.xp-fill{height:100%;background:linear-gradient(90deg,#F5A623,#FDC84B);border-radius:99px}
.xp-label{font-size:9px;color:#6a6a8a;white-space:nowrap}
.topright{display:flex;align-items:center;gap:7px}
.cpill{display:flex;align-items:center;gap:5px;background:rgba(0,0,0,.55);
  border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:3px 10px;
  font-size:13px;font-weight:800;color:#fff}
.cpill .ci{font-size:15px}
.icbtn{width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.55);
  border:1px solid rgba(255,255,255,.12);color:#fff;font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .15s;
  position:relative}
.icbtn:hover{background:rgba(255,255,255,.12)}
.nbdot::after{content:'';position:absolute;top:5px;right:5px;
  width:7px;height:7px;background:#EF4444;border-radius:50%;border:1.5px solid rgba(4,2,12,.9)}

/* MAIN CONTENT */
.menu-main{position:relative;z-index:5;flex:1;display:flex;align-items:stretch;min-height:0}

/* LEFT PANEL */
.pnl-left{width:192px;flex-shrink:0;background:rgba(4,2,12,.78);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-right:1px solid rgba(255,255,255,.06);padding:13px 12px;
  display:flex;flex-direction:column;gap:9px;overflow-y:auto}
.phdr{display:flex;align-items:center;justify-content:space-between}
.ptitle{font-size:10px;font-weight:900;letter-spacing:2.5px;color:#9A8EC4;text-transform:uppercase}
.chtimer{font-size:10px;color:#9A8EC4;display:flex;align-items:center;gap:3px}
.chi{display:flex;flex-direction:column;gap:5px}
.chirow{display:flex;align-items:center;justify-content:space-between}
.chil{display:flex;align-items:center;gap:6px}
.chic{font-size:13px}
.chnm{font-size:11px;font-weight:700;color:#fff}
.chir{display:flex;align-items:center;gap:5px}
.chct{font-size:10px;color:#9A8EC4;white-space:nowrap}
.chxp{background:rgba(59,130,246,.22);border:1px solid rgba(59,130,246,.38);
  border-radius:5px;padding:1px 5px;font-size:9px;font-weight:800;color:#60A5FA;white-space:nowrap}
.chprog{height:4px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden}
.chbar{height:100%;background:linear-gradient(90deg,#F5A623,#FDC84B);border-radius:99px;transition:width .5s}
.valink{background:none;border:none;color:#9A8EC4;font-size:11px;font-weight:800;cursor:pointer;
  padding:3px 0;text-align:center;letter-spacing:1px;text-transform:uppercase;transition:color .2s}
.valink:hover{color:#fff}

/* CENTER — runner area */
.menu-ctr{flex:1;display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:clamp(10px,2vw,22px);position:relative}
.runner-wrap{position:relative;display:flex;align-items:flex-end;justify-content:center}
.runner-glow{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
  width:clamp(80px,12vw,130px);height:20px;
  background:radial-gradient(ellipse,rgba(245,166,35,.3),transparent 70%);border-radius:50%;
  animation:rglow 1.7s ease-in-out infinite alternate}
@keyframes rglow{from{opacity:.4;width:clamp(70px,10vw,110px)}to{opacity:.9;width:clamp(100px,14vw,150px)}}
.runner-svg{height:clamp(200px,40vh,420px);width:auto;
  animation:rbob .9s ease-in-out infinite alternate;
  filter:drop-shadow(0 12px 30px rgba(0,0,0,.7))}
@keyframes rbob{from{transform:translateY(0)}to{transform:translateY(-12px)}}

/* RIGHT PANEL */
.pnl-right{width:198px;flex-shrink:0;background:rgba(4,2,12,.78);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-left:1px solid rgba(255,255,255,.06);padding:11px;
  display:flex;flex-direction:column;gap:7px}
.scrd{display:flex;align-items:center;background:rgba(16,10,26,.88);
  border:1.5px solid rgba(255,255,255,.1);border-radius:10px;overflow:hidden;
  cursor:pointer;transition:border-color .2s,background .2s;flex-shrink:0}
.scrd:hover:not(.slocked){border-color:rgba(255,255,255,.28)}
.scrd.ssel{border-color:#F5A623;background:rgba(245,166,35,.07)}
.slocked{opacity:.6;cursor:default}
.sctxt{flex:1;padding:8px 9px}
.scnm{font-size:12px;font-weight:900;letter-spacing:.6px;color:#fff}
.schs{font-size:10px;color:#F5A623;font-weight:700;margin-top:3px}
.sthumb{width:54px;height:46px;flex-shrink:0;overflow:hidden}
.sthumb svg{width:100%;height:100%}
.scbdg{width:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding-right:5px}
.scbdg-ico{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900}
.bchk{background:#10B981;color:#fff}
.blck{background:rgba(255,255,255,.15);color:rgba(255,255,255,.7)}
.ract{margin-top:auto;display:flex;flex-direction:column;gap:7px}
.clsbtn{display:flex;align-items:center;justify-content:space-between;
  background:rgba(16,10,26,.9);border:1px solid rgba(255,255,255,.12);
  border-radius:10px;padding:9px 13px;color:#fff;font-size:12px;font-weight:900;
  letter-spacing:.5px;cursor:pointer;transition:all .2s}
.clsbtn:hover{background:rgba(40,28,64,.9)}
.carrow{font-size:16px;color:#F5A623;font-weight:900}
.startbtn{background:linear-gradient(135deg,#F5A623,#E8940D);border:none;border-radius:12px;
  padding:13px 10px;text-align:center;font-size:22px;font-weight:900;letter-spacing:3px;
  color:#1a0800;cursor:pointer;
  box-shadow:0 4px 24px rgba(245,166,35,.5),0 0 0 2px rgba(245,166,35,.2);
  transition:all .15s;text-transform:uppercase}
.startbtn:active{transform:scale(.97)}

/* BOTTOM NAV */
.menu-nav{position:relative;z-index:10;display:flex;align-items:stretch;
  background:rgba(4,2,12,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}
.ntab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:9px 0 7px;cursor:pointer;border:none;background:none;
  color:#52527a;transition:color .2s;gap:2px}
.ntab.nton{color:#F5A623}
.ntab:not(.nton):hover{color:#9a9aba}
.ntic{font-size:20px}
.ntlbl{font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}

/* ─── GAME ─── */
#s-game{background:transparent;flex-direction:row;align-items:stretch;justify-content:center}
.hud{position:absolute;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;
  justify-content:space-between;padding:8px 16px;
  background:linear-gradient(to bottom,rgba(10,8,20,.9),transparent)}
.hud-left,.hud-right{display:flex;align-items:center;gap:10px}
.hdcoin,.hdgem{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:800;
  background:rgba(30,20,56,.8);border-radius:99px;padding:4px 11px}
.hdscore{font-size:18px;font-weight:900;color:#FDC84B}
.hdpause{background:rgba(30,20,56,.8);border:none;border-radius:99px;
  width:36px;height:36px;font-size:16px;cursor:pointer;color:#F3F0FF;
  display:flex;align-items:center;justify-content:center}
.hdhp{display:flex;gap:3px}
.heart{font-size:18px;transition:opacity .3s}
.heart.empty{opacity:.2}
#game-canvas{display:block;width:100%;height:100%;image-rendering:pixelated}
.mc{position:absolute;bottom:20px;left:0;right:0;z-index:20;
  display:flex;justify-content:space-between;padding:0 20px;pointer-events:none}
.mcbtn{width:72px;height:72px;border-radius:50%;border:2px solid rgba(167,139,250,.35);
  background:rgba(30,20,56,.7);font-size:28px;cursor:pointer;pointer-events:all;
  display:flex;align-items:center;justify-content:center;transition:transform .1s;
  -webkit-tap-highlight-color:transparent}
.mcbtn:active{transform:scale(.88);background:rgba(124,58,237,.45)}

/* ─── DILEMMA ─── */
#s-dil{background:rgba(10,8,20,.96);padding:20px}
.dhdr{font-size:11px;letter-spacing:3px;color:#A78BFA;text-transform:uppercase;margin-bottom:8px;text-align:center}
.demoji{font-size:54px;margin:6px 0;text-align:center}
.dsit{background:#1e1438;border-radius:16px;padding:16px;font-size:15px;line-height:1.65;
  margin-bottom:14px;border-left:3px solid #7C3AED;max-width:460px;text-align:center}
.dq{font-size:16px;font-weight:800;margin-bottom:14px;text-align:center;max-width:460px}
.dopts{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:460px}
.obtn{background:#1e1438;border:1.5px solid rgba(167,139,250,.22);border-radius:12px;
  padding:12px;cursor:pointer;text-align:left;transition:all .2s;color:#F3F0FF}
.obtn:hover{border-color:#A78BFA;background:#160f2a}
.obtn.correct{border-color:#10B981;background:rgba(16,185,129,.15)}
.obtn.wrong{border-color:#EF4444;background:rgba(239,68,68,.15)}
.olet{display:inline-block;width:22px;height:22px;border-radius:6px;background:#7C3AED;
  color:#fff;font-size:12px;font-weight:900;text-align:center;line-height:22px;margin-right:8px}
.otxt{font-size:13px;line-height:1.4}
.dfb{margin-top:12px;padding:10px 16px;border-radius:10px;font-size:14px;font-weight:700;
  text-align:center;max-width:460px;display:none}
.dfb.show{display:block}
.dfb.good{background:rgba(16,185,129,.2);color:#6EE7B7}
.dfb.bad{background:rgba(239,68,68,.2);color:#FCA5A5}
.dtimer{width:100%;max-width:460px;height:4px;background:#1e1438;border-radius:99px;overflow:hidden;margin-bottom:12px}
.dtimerbar{height:100%;background:linear-gradient(90deg,#F5A623,#7C3AED);border-radius:99px;transition:width .1s linear}

/* ─── PAUSE ─── */
#s-pause{background:rgba(10,8,20,.93)}
.pttl{font-size:36px;font-weight:900;margin-bottom:6px}
.plbl{color:#9A8EC4;font-size:14px}
.pval{font-size:44px;font-weight:900;color:#FDC84B;margin-bottom:22px}

/* ─── GAMEOVER ─── */
#s-go{background:rgba(10,8,20,.97)}
.goem{font-size:72px;margin-bottom:8px}
.gottl{font-size:32px;font-weight:900}
.gosub{color:#9A8EC4;font-size:14px;margin-bottom:14px}
.gorec{color:#FDC84B;font-size:13px;font-weight:800;margin-bottom:8px;letter-spacing:1px}
.gostats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;width:280px}
.gostat{background:#1e1438;border-radius:12px;padding:12px;text-align:center}
.gosv{font-size:22px;font-weight:900}
.gosl{font-size:11px;color:#9A8EC4;margin-top:2px}

/* ─── SHOP ─── */
#s-shop{background:var(--bg-dark);overflow-y:auto;padding:20px;align-items:stretch;justify-content:flex-start}
.shophdr{text-align:center;margin-bottom:18px}
.shopttl{font-size:26px;font-weight:900}
.shopsub{color:#9A8EC4;font-size:14px}
.stabs{display:flex;gap:8px;margin-bottom:14px;justify-content:center;flex-wrap:wrap}
.tbtn{padding:8px 18px;border-radius:99px;border:none;background:#1e1438;color:#9A8EC4;font-size:14px;cursor:pointer;transition:all .2s}
.tbtn.on{background:#7C3AED;color:#fff}
.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:12px;margin-bottom:16px}
.sitem{background:#1e1438;border-radius:16px;padding:14px 10px;text-align:center;
  border:1.5px solid rgba(167,139,250,.14);transition:all .2s;cursor:pointer}
.sitem:hover{border-color:#A78BFA}
.sitem.owned{border-color:#10B981}
.sitem.selected{border-color:#F5A623;background:rgba(245,166,35,.1)}
.sem{font-size:40px;margin-bottom:6px}
.snm{font-size:13px;font-weight:700;margin-bottom:4px}
.spr{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:800;color:#FDC84B}
.sob{font-size:11px;color:#10B981;font-weight:700}

/* ─── CHARACTERS ─── */
#s-chars{background:var(--bg-dark);overflow-y:auto;padding:20px;align-items:stretch;justify-content:flex-start}
.charhdr{text-align:center;margin-bottom:18px}
.charttl{font-size:26px;font-weight:900}
.charsub{color:#9A8EC4;font-size:14px}
.chargrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:14px;margin-bottom:16px}
.charcard{background:#1e1438;border-radius:16px;padding:16px 12px;text-align:center;
  border:1.5px solid rgba(167,139,250,.14);transition:all .2s;cursor:pointer;position:relative}
.charcard:hover{border-color:#A78BFA;transform:translateY(-2px)}
.charcard.csel{border-color:#F5A623;background:rgba(245,166,35,.08)}
.charcard.clocked{opacity:.55;cursor:default}
.charsvg{width:100%;height:120px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px}
.charsvg svg{height:100%;width:auto}
.charcnm{font-size:13px;font-weight:800;margin-bottom:3px}
.charcdesc{font-size:11px;color:#9A8EC4;margin-bottom:8px}
.charlockbadge{position:absolute;top:8px;right:8px;font-size:14px}
.charownbadge{font-size:11px;color:#10B981;font-weight:700}
.charpr{display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:800;color:#FDC84B}

/* ─── UPGRADES ─── */
#s-upg{background:var(--bg-dark);overflow-y:auto;padding:20px;align-items:stretch;justify-content:flex-start}
.upghdr{text-align:center;margin-bottom:18px}
.upgttl{font-size:26px;font-weight:900}
.upgsub{color:#9A8EC4;font-size:14px}
.upglist{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.upgraderow{background:#1e1438;border-radius:14px;padding:14px;
  border:1.5px solid rgba(167,139,250,.14);display:flex;align-items:center;gap:12px}
.upgicon{font-size:32px;flex-shrink:0}
.upginfo{flex:1}
.upgnm{font-size:14px;font-weight:800}
.upgdesc{font-size:12px;color:#9A8EC4;margin-top:2px}
.upglvlbar{display:flex;gap:4px;margin-top:6px}
.upgdot{width:14px;height:6px;border-radius:3px;background:rgba(255,255,255,.12)}
.upgdot.filled{background:#F5A623}
.upgcost{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:800;
  color:#FDC84B;background:rgba(245,166,35,.1);border-radius:8px;padding:6px 10px;
  cursor:pointer;border:1px solid rgba(245,166,35,.3);transition:all .2s;flex-shrink:0}
.upgcost:hover{background:rgba(245,166,35,.2)}
.upgcost:disabled{opacity:.5;cursor:default}

/* ─── RANKING ─── */
#s-rank{background:var(--bg-dark);overflow-y:auto;padding:20px;align-items:stretch;justify-content:flex-start}
.rankhdr{text-align:center;margin-bottom:18px}
.podium{display:flex;align-items:flex-end;justify-content:center;gap:8px;margin-bottom:18px}
.podslot{display:flex;flex-direction:column;align-items:center;background:#1e1438;
  border-radius:12px;padding:10px 14px;min-width:90px}
.podslot.p1{order:2;border-top:3px solid #F5A623}
.podslot.p2{order:1;border-top:3px solid #9CA3AF}
.podslot.p3{order:3;border-top:3px solid #B45309}
.podpos{font-size:22px}
.podavt{font-size:32px}
.podnm{font-size:12px;font-weight:700;text-align:center;margin-top:4px}
.podsc{font-size:13px;color:#FDC84B;font-weight:800}
.rankrows{display:flex;flex-direction:column;gap:8px}
.rankrow{display:flex;align-items:center;gap:12px;background:#1e1438;border-radius:12px;padding:10px 14px}
.rankpos{width:24px;font-size:14px;font-weight:800;color:#9A8EC4;text-align:center}
.rankavt{font-size:26px}
.rankinfo{flex:1}
.ranknm{font-size:14px;font-weight:700}
.rankdt{font-size:12px;color:#9A8EC4}
.ranksc{font-size:15px;font-weight:900;color:#FDC84B}
.rankyou{border:1.5px solid #A78BFA}

/* ─── GENERIC ─── */
.btn{padding:14px 24px;border:none;border-radius:14px;font-size:16px;font-weight:800;
  cursor:pointer;transition:transform .15s;letter-spacing:.5px}
.btn:active{transform:scale(.96)}
.btn-primary{background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;box-shadow:0 4px 20px rgba(124,58,237,.5)}
.btn-secondary{background:#1e1438;color:#F3F0FF;border:1.5px solid rgba(167,139,250,.28)}
.btn-accent{background:linear-gradient(135deg,#F5A623,#D97706);color:#1A0A00;box-shadow:0 4px 20px rgba(245,166,35,.4)}
.btn-danger{background:linear-gradient(135deg,#EF4444,#B91C1C);color:#fff}
.notif{position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#1e1438;
  border:1.5px solid #A78BFA;border-radius:12px;padding:10px 20px;font-size:14px;
  font-weight:700;z-index:200;opacity:0;transition:opacity .3s;pointer-events:none;white-space:nowrap}
.notif.show{opacity:1}
#fx-canvas{position:absolute;inset:0;pointer-events:none;z-index:15}

/* ─── RESPONSIVE ─── */
@media(max-width:600px){
  .pnl-left{width:clamp(120px,38vw,170px);padding:9px 8px}
  .pnl-right{width:clamp(130px,40vw,175px);padding:9px}
  .runner-svg{height:clamp(140px,30vh,280px)}
  .startbtn{font-size:18px}
  .sthumb{width:40px;height:36px}
  .xp-track{width:55px}
  .pavt{width:34px;height:34px}
  .menu-top{padding:5px 10px}
}
@media(max-width:380px){
  .pnl-left{width:120px}
  .pnl-right{width:128px}
  .runner-svg{height:140px}
  .scnm{font-size:10px}
}
@media(min-height:700px) and (min-width:700px){
  .runner-svg{height:clamp(280px,42vh,450px)}
}
</style>
</head>
<body>

<!-- ══ LOADING ══ -->
<div id="s-loading" class="screen active">
  <div class="ld-icon">🏃</div>
  <div class="ld-name">RUNNERX</div>
  <p style="color:#9A8EC4;font-size:13px">Carregando inteligência emocional...</p>
  <div class="ld-bar"><div class="ld-fill"></div></div>
</div>

<!-- ══ LOBBY MENU ══ -->
<div id="s-menu" class="screen">

  <!-- ZEN GARDEN BACKGROUND SVG -->
  <div class="bg-wrap">
    <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6db8d8"/><stop offset="35%" stop-color="#90cce0"/>
          <stop offset="65%" stop-color="#a8d8d0"/><stop offset="100%" stop-color="#90b8a8"/>
        </linearGradient>
        <linearGradient id="ghill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a5a3a"/><stop offset="100%" stop-color="#1a3828"/>
        </linearGradient>
        <linearGradient id="gground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3a2a1a"/><stop offset="100%" stop-color="#20150c"/>
        </linearGradient>
        <linearGradient id="gpath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7a6a58"/><stop offset="100%" stop-color="#5a4a38"/>
        </linearGradient>
        <linearGradient id="gwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6898b0"/><stop offset="100%" stop-color="#4878a0"/>
        </linearGradient>
        <filter id="bblur"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="bblurS"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="treeshadow"><feGaussianBlur stdDeviation="8"/></filter>
        <radialGradient id="gsun" cx="50%" cy="30%" r="40%">
          <stop offset="0%" stop-color="rgba(255,230,180,0.25)"/><stop offset="100%" stop-color="rgba(255,230,180,0)"/>
        </radialGradient>
      </defs>

      <!-- SKY -->
      <rect width="1920" height="1080" fill="url(#gsky)"/>
      <!-- Sun glow -->
      <rect width="1920" height="1080" fill="url(#gsun)"/>

      <!-- FAR HILLS -->
      <path d="M0 540 Q200 465 450 490 Q660 450 900 475 Q1100 440 1300 468 Q1520 438 1700 460 Q1820 448 1920 462 L1920 1080 L0 1080Z" fill="url(#ghill)" opacity=".85"/>
      <!-- Mid hills -->
      <path d="M0 600 Q250 545 500 565 Q750 530 960 552 Q1180 528 1420 550 Q1660 530 1920 548 L1920 1080 L0 1080Z" fill="#1e4828" opacity=".9"/>

      <!-- PAGODA (right background) -->
      <g transform="translate(1440,310)" opacity=".72">
        <rect x="55" y="190" width="18" height="90" fill="#1a3020"/><rect x="127" y="190" width="18" height="90" fill="#1a3020"/>
        <rect x="40" y="185" width="120" height="16" rx="2" fill="#1e3828"/>
        <path d="M30 185 Q100 165 170 185" stroke="#1a3020" stroke-width="10" fill="none"/>
        <rect x="60" y="155" width="80" height="32" fill="#1a3020"/>
        <path d="M45 155 Q100 132 155 155" stroke="#1a3020" stroke-width="9" fill="none"/>
        <rect x="68" y="125" width="64" height="32" fill="#1e3828"/>
        <path d="M55 125 Q100 104 145 125" stroke="#1a3020" stroke-width="8" fill="none"/>
        <rect x="75" y="98" width="50" height="29" fill="#1a3020"/>
        <path d="M62 98 Q100 78 138 98" stroke="#1a3020" stroke-width="7" fill="none"/>
        <rect x="82" y="73" width="36" height="27" fill="#1e3828"/>
        <path d="M70 73 Q100 55 130 73" stroke="#1a3020" stroke-width="6" fill="none"/>
        <polygon points="100,8 115,8 107.5,-25" fill="#162818"/>
        <line x1="107" y1="-25" x2="107" y2="8" stroke="#1e3828" stroke-width="4"/>
      </g>

      <!-- BACKGROUND CENTER TREES (green) -->
      <g opacity=".8">
        <ellipse cx="680" cy="490" rx="70" ry="95" fill="#1e5030"/>
        <rect x="672" y="558" width="16" height="80" fill="#2a1a08"/>
        <ellipse cx="760" cy="510" rx="55" ry="78" fill="#245838"/>
        <rect x="754" y="572" width="12" height="65" fill="#2a1a08"/>
        <ellipse cx="1160" cy="505" rx="65" ry="90" fill="#1e5030"/>
        <rect x="1153" y="570" width="14" height="78" fill="#2a1a08"/>
        <ellipse cx="1240" cy="518" rx="52" ry="75" fill="#245838"/>
        <rect x="1234" y="578" width="12" height="62" fill="#2a1a08"/>
        <!-- Far smaller trees -->
        <ellipse cx="830" cy="498" rx="38" ry="55" fill="#1a4828"/>
        <ellipse cx="1090" cy="502" rx="35" ry="52" fill="#1a4828"/>
      </g>

      <!-- LEFT CHERRY BLOSSOM TREE — trunk & branches -->
      <g id="tl-trunk">
        <path d="M-20 1080 Q60 920 130 800 Q170 740 200 670 Q220 620 240 558" stroke="#3a2010" stroke-width="48" fill="none" stroke-linecap="round"/>
        <path d="M220 670 Q290 620 365 575" stroke="#3a2010" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M240 640 Q225 568 258 508" stroke="#3a2010" stroke-width="24" fill="none" stroke-linecap="round"/>
        <path d="M280 700 Q340 648 355 578" stroke="#3a2010" stroke-width="22" fill="none" stroke-linecap="round"/>
        <path d="M180 720 Q110 680 80 618" stroke="#3a2010" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M150 760 Q80 740 30 700" stroke="#3a2010" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M268 565 Q280 505 310 468" stroke="#3a2010" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M368 580 Q400 528 420 490" stroke="#3a2010" stroke-width="15" fill="none" stroke-linecap="round"/>
      </g>
      <!-- Left cherry blossoms (layered blur ellipses) -->
      <g filter="url(#bblur)" opacity=".96">
        <ellipse cx="240" cy="510" rx="175" ry="148" fill="#e088a8"/>
        <ellipse cx="340" cy="460" rx="155" ry="132" fill="#d07090"/>
        <ellipse cx="160" cy="490" rx="162" ry="140" fill="#e898b8"/>
        <ellipse cx="300" cy="418" rx="148" ry="125" fill="#d87898"/>
        <ellipse cx="190" cy="432" rx="135" ry="118" fill="#e488ae"/>
        <ellipse cx="388" cy="525" rx="138" ry="118" fill="#e090a8"/>
        <ellipse cx="115" cy="545" rx="125" ry="108" fill="#d478a0"/>
        <ellipse cx="320" cy="558" rx="145" ry="120" fill="#e898b8"/>
        <ellipse cx="220" cy="590" rx="128" ry="105" fill="#d07898"/>
        <ellipse cx="420" cy="462" rx="118" ry="105" fill="#dc7ea0"/>
        <ellipse cx="265" cy="625" rx="118" ry="95" fill="#e090a8"/>
        <ellipse cx="80" cy="610" rx="108" ry="92" fill="#d07098"/>
        <ellipse cx="450" cy="550" rx="105" ry="92" fill="#e488b0"/>
      </g>

      <!-- RIGHT CHERRY BLOSSOM TREE — trunk & branches -->
      <g id="tr-trunk">
        <path d="M1940 1080 Q1860 920 1790 800 Q1750 740 1720 670 Q1700 620 1680 558" stroke="#3a2010" stroke-width="48" fill="none" stroke-linecap="round"/>
        <path d="M1700 670 Q1630 620 1555 575" stroke="#3a2010" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M1680 640 Q1695 568 1662 508" stroke="#3a2010" stroke-width="24" fill="none" stroke-linecap="round"/>
        <path d="M1640 700 Q1580 648 1565 578" stroke="#3a2010" stroke-width="22" fill="none" stroke-linecap="round"/>
        <path d="M1740 720 Q1810 680 1840 618" stroke="#3a2010" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M1770 760 Q1840 740 1890 700" stroke="#3a2010" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M1652 565 Q1640 505 1610 468" stroke="#3a2010" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M1552 580 Q1520 528 1500 490" stroke="#3a2010" stroke-width="15" fill="none" stroke-linecap="round"/>
      </g>
      <!-- Right cherry blossoms -->
      <g filter="url(#bblur)" opacity=".96">
        <ellipse cx="1680" cy="510" rx="175" ry="148" fill="#e088a8"/>
        <ellipse cx="1580" cy="460" rx="155" ry="132" fill="#d07090"/>
        <ellipse cx="1760" cy="490" rx="162" ry="140" fill="#e898b8"/>
        <ellipse cx="1620" cy="418" rx="148" ry="125" fill="#d87898"/>
        <ellipse cx="1730" cy="432" rx="135" ry="118" fill="#e488ae"/>
        <ellipse cx="1532" cy="525" rx="138" ry="118" fill="#e090a8"/>
        <ellipse cx="1805" cy="545" rx="125" ry="108" fill="#d478a0"/>
        <ellipse cx="1600" cy="558" rx="145" ry="120" fill="#e898b8"/>
        <ellipse cx="1700" cy="590" rx="128" ry="105" fill="#d07898"/>
        <ellipse cx="1500" cy="462" rx="118" ry="105" fill="#dc7ea0"/>
        <ellipse cx="1655" cy="625" rx="118" ry="95" fill="#e090a8"/>
        <ellipse cx="1840" cy="610" rx="108" ry="92" fill="#d07098"/>
        <ellipse cx="1470" cy="550" rx="105" ry="92" fill="#e488b0"/>
      </g>

      <!-- WATER/POND -->
      <ellipse cx="960" cy="808" rx="355" ry="72" fill="url(#gwater)" opacity=".82"/>
      <ellipse cx="960" cy="808" rx="340" ry="66" fill="#78b0c8" opacity=".28"/>
      <ellipse cx="960" cy="808" rx="220" ry="28" stroke="#88c0d0" stroke-width="1.5" fill="none" opacity=".5"/>
      <ellipse cx="960" cy="808" rx="300" ry="50" stroke="#88c0d0" stroke-width="1" fill="none" opacity=".3"/>
      <!-- Water reflection of blossoms -->
      <ellipse cx="640" cy="815" rx="180" ry="40" fill="#e898b8" opacity=".1" filter="url(#bblurS)"/>
      <ellipse cx="1280" cy="815" rx="180" ry="40" fill="#e898b8" opacity=".1" filter="url(#bblurS)"/>

      <!-- RED BRIDGE -->
      <g transform="translate(800,705)">
        <!-- Arch -->
        <path d="M0 95 Q160 30 320 95" stroke="#8a1a0a" stroke-width="14" fill="none"/>
        <!-- Deck surface -->
        <rect x="-8" y="88" width="336" height="18" rx="4" fill="#9a2010"/>
        <!-- Railings top bar -->
        <line x1="0" y1="88" x2="320" y2="88" stroke="#7a1508" stroke-width="5"/>
        <!-- Railing posts -->
        <line x1="22" y1="60" x2="22" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="64" y1="44" x2="64" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="108" y1="34" x2="108" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="160" y1="30" x2="160" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="212" y1="34" x2="212" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="256" y1="44" x2="256" y2="106" stroke="#7a1508" stroke-width="5"/>
        <line x1="298" y1="60" x2="298" y2="106" stroke="#7a1508" stroke-width="5"/>
        <!-- Support pillars -->
        <rect x="-4" y="90" width="14" height="95" fill="#8a1a0a"/>
        <rect x="310" y="90" width="14" height="95" fill="#8a1a0a"/>
        <!-- Foot blocks -->
        <rect x="-12" y="180" width="28" height="14" rx="2" fill="#6a1208"/>
        <rect x="304" y="180" width="28" height="14" rx="2" fill="#6a1208"/>
      </g>

      <!-- STONE PATH (perspective) -->
      <path d="M745 1080 L878 840 Q960 808 1042 840 L1175 1080Z" fill="url(#gpath)"/>
      <!-- Stone slab rows on path -->
      <path d="M756 1050 Q960 1025 1164 1050" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M770 1010 Q960 988 1150 1010" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".55"/>
      <path d="M786 970 Q960 950 1134 970" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M800 930 Q960 912 1120 930" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".45"/>
      <path d="M815 892 Q960 876 1105 892" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".4"/>
      <path d="M830 858 Q960 843 1090 858" stroke="#5a4a38" stroke-width="2" fill="none" opacity=".35"/>
      <!-- Vertical joints -->
      <line x1="900" y1="858" x2="858" y2="1080" stroke="#5a4a38" stroke-width="1.5" opacity=".4"/>
      <line x1="960" y1="840" x2="960" y2="1080" stroke="#5a4a38" stroke-width="1.5" opacity=".4"/>
      <line x1="1020" y1="858" x2="1062" y2="1080" stroke="#5a4a38" stroke-width="1.5" opacity=".4"/>
      <!-- Path edges (mossy) -->
      <path d="M745 1080 L878 840 Q920 820 960 808" stroke="#3a6038" stroke-width="6" fill="none" opacity=".5"/>
      <path d="M1175 1080 L1042 840 Q1000 820 960 808" stroke="#3a6038" stroke-width="6" fill="none" opacity=".5"/>

      <!-- GROUND COBBLESTONE -->
      <rect x="0" y="920" width="745" height="160" fill="#2a1e10"/>
      <rect x="1175" y="920" width="745" height="160" fill="#2a1e10"/>
      <rect x="0" y="1040" width="1920" height="40" fill="#1a1208"/>
      <!-- Cobblestone texture hints -->
      <g stroke="#1a1208" stroke-width="1" opacity=".5">
        <line x1="0" y1="945" x2="745" y2="945"/><line x1="0" y1="970" x2="745" y2="970"/>
        <line x1="0" y1="995" x2="745" y2="995"/><line x1="0" y1="1020" x2="745" y2="1020"/>
        <line x1="50" y1="920" x2="50" y2="1040"/><line x1="110" y1="920" x2="110" y2="1040"/>
        <line x1="175" y1="920" x2="175" y2="1040"/><line x1="240" y1="920" x2="240" y2="1040"/>
        <line x1="305" y1="920" x2="305" y2="1040"/><line x1="368" y1="920" x2="368" y2="1040"/>
        <line x1="430" y1="920" x2="430" y2="1040"/><line x1="492" y1="920" x2="492" y2="1040"/>
        <line x1="554" y1="920" x2="554" y2="1040"/><line x1="615" y1="920" x2="615" y2="1040"/>
        <line x1="677" y1="920" x2="677" y2="1040"/>
        <!-- Right side -->
        <line x1="1175" y1="945" x2="1920" y2="945"/><line x1="1175" y1="970" x2="1920" y2="970"/>
        <line x1="1175" y1="995" x2="1920" y2="995"/><line x1="1175" y1="1020" x2="1920" y2="1020"/>
        <line x1="1245" y1="920" x2="1245" y2="1040"/><line x1="1308" y1="920" x2="1308" y2="1040"/>
        <line x1="1370" y1="920" x2="1370" y2="1040"/><line x1="1432" y1="920" x2="1432" y2="1040"/>
        <line x1="1494" y1="920" x2="1494" y2="1040"/><line x1="1556" y1="920" x2="1556" y2="1040"/>
        <line x1="1618" y1="920" x2="1618" y2="1040"/><line x1="1680" y1="920" x2="1680" y2="1040"/>
        <line x1="1742" y1="920" x2="1742" y2="1040"/><line x1="1804" y1="920" x2="1804" y2="1040"/>
        <line x1="1866" y1="920" x2="1866" y2="1040"/>
      </g>

      <!-- FOREGROUND BRANCHES overlaying edge (blossoms in front) -->
      <g filter="url(#bblurS)" opacity=".85">
        <ellipse cx="80" cy="780" rx="120" ry="90" fill="#e090a8"/>
        <ellipse cx="200" cy="820" rx="100" ry="75" fill="#d87898"/>
        <ellipse cx="1720" cy="780" rx="120" ry="90" fill="#e090a8"/>
        <ellipse cx="1840" cy="820" rx="100" ry="75" fill="#d87898"/>
      </g>

      <!-- ATMOSPHERIC HAZE -->
      <rect width="1920" height="1080" fill="rgba(150,180,160,0.04)"/>
    </svg>
  </div>
  <div class="bg-vignette"></div>
  <div id="petals"></div>

  <!-- TOP BAR -->
  <div class="menu-top">
    <div class="pcrd">
      <!-- Avatar — mini runner portrait SVG -->
      <div class="pavt">
        <svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="#1e1438"/>
          <ellipse cx="21" cy="17" rx="10" ry="11" fill="#c8906a"/>
          <path d="M11 17 Q13 8 21 7 Q29 8 31 17 Q29 12 21 12 Q13 12 11 17Z" fill="#3d2010"/>
          <circle cx="17" cy="16" r="2.5" fill="#1a0e08"/>
          <circle cx="25" cy="16" r="2.5" fill="#1a0e08"/>
          <path d="M16 22 Q21 25 26 22" stroke="#9a5040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M8 34 Q10 28 21 26 Q32 28 34 34" fill="#454555"/>
        </svg>
      </div>
      <div class="pinfo">
        <div class="pname" id="m-pname">RunnerX</div>
        <div class="plvrow">
          <span class="lv-badge">Lv. <span id="m-level">25</span></span>
          <div class="xp-track"><div class="xp-fill" id="m-xpbar" style="width:47%"></div></div>
          <span class="xp-label" id="m-xplbl">2,350/5,000</span>
        </div>
      </div>
    </div>
    <div class="topright">
      <div class="cpill"><span class="ci">🪙</span><span id="m-coins">12,450</span></div>
      <div class="cpill"><span class="ci">💎</span><span id="m-gems">320</span></div>
      <button class="icbtn" onclick="UI.notify('💰 Loja de moedas em breve!')">➕</button>
      <button class="icbtn nbdot" onclick="UI.show('rank')">✉️</button>
      <button class="icbtn" onclick="UI.notify('⚙️ Configurações em breve!')">⚙️</button>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="menu-main">

    <!-- LEFT: Daily Challenges -->
    <div class="pnl-left">
      <div class="phdr">
        <span class="ptitle">Daily Challenges</span>
        <span class="chtimer">⏱ <span id="chtval">12h 34m</span></span>
      </div>
      <div id="ch-list"></div>
      <button class="valink" onclick="UI.notify('🎯 Mais desafios em breve!')">VIEW ALL</button>
    </div>

    <!-- CENTER: RunnerX SVG Character -->
    <div class="menu-ctr">
      <div class="runner-wrap">
        <div class="runner-glow"></div>
        <!-- RUNNERX CHARACTER — SVG (8K-quality vector) -->
        <svg id="runner-char" class="runner-svg" viewBox="0 0 240 430" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4906a"/><stop offset="100%" stop-color="#c07850"/>
            </linearGradient>
            <linearGradient id="jkt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#52525e"/><stop offset="100%" stop-color="#3c3c48"/>
            </linearGradient>
            <linearGradient id="pnt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2a2a38"/><stop offset="100%" stop-color="#1e1e2a"/>
            </linearGradient>
          </defs>

          <!-- Ground shadow -->
          <ellipse cx="120" cy="424" rx="68" ry="9" fill="rgba(0,0,0,.28)"/>

          <!-- BACK LEG (left, trailing behind) -->
          <path d="M107 272 Q88 325 76 368 Q68 395 64 415" stroke="url(#pnt)" stroke-width="30" fill="none" stroke-linecap="round"/>
          <path d="M105 275 Q86 328 74 371 Q66 398 62 418" stroke="#F5A623" stroke-width="5.5" fill="none" stroke-linecap="round"/>
          <!-- Back shoe -->
          <path d="M58 412 Q46 421 34 419 Q24 415 22 407 L59 398Z" fill="#181820"/>
          <path d="M20 410 Q33 422 60 416" stroke="#F5A623" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- Sole -->
          <rect x="20" y="416" width="40" height="5" rx="2" fill="#282828"/>

          <!-- BACKPACK -->
          <rect x="83" y="148" width="40" height="62" rx="9" fill="#181822"/>
          <rect x="85" y="150" width="36" height="58" rx="7" fill="#222230"/>
          <line x1="89" y1="165" x2="116" y2="165" stroke="#F5A623" stroke-width="3" stroke-linecap="round"/>
          <rect x="89" y="178" width="28" height="20" rx="4" stroke="#2a2a3a" stroke-width="1.5" fill="none"/>
          <rect x="91" y="180" width="24" height="16" rx="3" fill="#1a1a28"/>
          <!-- Pack straps -->
          <path d="M85 152 Q78 170 80 188" stroke="#282838" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M121 152 Q128 170 126 188" stroke="#282838" stroke-width="5" fill="none" stroke-linecap="round"/>

          <!-- BACK ARM (left, swinging back) -->
          <path d="M84 155 Q62 196 50 238" stroke="url(#jkt)" stroke-width="25" fill="none" stroke-linecap="round"/>
          <path d="M50 238 Q38 260 30 283" stroke="url(#jkt)" stroke-width="23" fill="none" stroke-linecap="round"/>
          <path d="M86 159 Q64 200 52 242" stroke="#F5A623" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Back hand -->
          <ellipse cx="28" cy="285" rx="14" ry="12" fill="url(#sk)"/>
          <!-- Knuckle lines -->
          <path d="M22 282 Q28 280 34 282" stroke="#a86848" stroke-width="1.5" fill="none" opacity=".5"/>

          <!-- TORSO (jacket/hoodie) -->
          <path d="M78 136 Q66 192 64 243 Q62 265 68 280 L172 280 Q178 265 176 243 Q174 192 162 136Z" fill="url(#jkt)"/>
          <!-- Front panel (hood/chest) -->
          <path d="M106 138 Q97 195 96 245 Q95 268 99 280 L141 280 Q145 268 144 245 Q143 195 135 138Z" fill="#3a3a48"/>
          <!-- Center zip line -->
          <line x1="120" y1="142" x2="120" y2="280" stroke="#F5A623" stroke-width="3" opacity=".75" stroke-dasharray="7,4"/>
          <!-- Chest logo circle -->
          <circle cx="153" cy="172" r="8" fill="rgba(245,166,35,.25)" stroke="#F5A623" stroke-width="1.5"/>
          <text x="153" y="176" font-size="7" fill="#F5A623" text-anchor="middle" font-weight="900">X</text>
          <!-- Collar -->
          <path d="M106 140 Q120 130 135 140" stroke="#3a3a48" stroke-width="9" fill="none" stroke-linecap="round"/>
          <!-- Sleeve cuffs (orange) -->
          <rect x="150" y="248" width="28" height="7" rx="3" fill="#F5A623" opacity=".6"/>
          <rect x="62" y="272" width="26" height="7" rx="3" fill="#F5A623" opacity=".6"/>

          <!-- FRONT LEG (right, striding forward) -->
          <path d="M133 272 Q158 320 175 362 Q183 390 180 415" stroke="url(#pnt)" stroke-width="32" fill="none" stroke-linecap="round"/>
          <path d="M136 275 Q161 323 178 365 Q186 393 183 418" stroke="#F5A623" stroke-width="5.5" fill="none" stroke-linecap="round"/>
          <!-- Lower leg bend -->
          <path d="M180 415 Q187 422 193 428" stroke="url(#pnt)" stroke-width="28" fill="none" stroke-linecap="round"/>
          <!-- Front shoe (dynamic angle) -->
          <path d="M187 424 Q202 430 222 427 Q237 423 239 414 L202 404Z" fill="#181820"/>
          <path d="M185 418 Q198 430 224 428" stroke="#F5A623" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <rect x="185" y="427" width="55" height="5" rx="2" fill="#282828"/>

          <!-- FRONT ARM (right, pumping forward/up) -->
          <path d="M156 148 Q186 184 203 218" stroke="url(#jkt)" stroke-width="25" fill="none" stroke-linecap="round"/>
          <path d="M203 218 Q215 192 218 164" stroke="url(#jkt)" stroke-width="23" fill="none" stroke-linecap="round"/>
          <path d="M158 152 Q188 188 205 222" stroke="#F5A623" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Front hand/fist -->
          <ellipse cx="216" cy="161" rx="14" ry="12" fill="url(#sk)" transform="rotate(-18,216,161)"/>
          <!-- Watch on right wrist -->
          <rect x="206" y="155" width="17" height="10" rx="3" fill="#181820"/>
          <rect x="208" y="156" width="13" height="8" rx="2" fill="#06B6D4"/>
          <line x1="202" y1="159" x2="207" y2="159" stroke="#555" stroke-width="2"/>
          <line x1="223" y1="159" x2="228" y2="159" stroke="#555" stroke-width="2"/>

          <!-- NECK -->
          <rect x="113" y="116" width="24" height="26" rx="7" fill="url(#sk)"/>

          <!-- HEAD -->
          <ellipse cx="122" cy="84" rx="44" ry="49" fill="url(#sk)"/>
          <!-- Jaw/chin -->
          <path d="M80 96 Q77 118 90 138 Q105 152 122 153 Q139 152 154 138 Q167 118 164 96" fill="url(#sk)"/>

          <!-- EARS -->
          <ellipse cx="79" cy="91" rx="10" ry="13" fill="#c07850"/>
          <ellipse cx="80" cy="91" rx="7" ry="10" fill="#d4906a"/>
          <ellipse cx="165" cy="91" rx="10" ry="13" fill="#c07850"/>
          <ellipse cx="164" cy="91" rx="7" ry="10" fill="#d4906a"/>

          <!-- HAIR -->
          <path d="M80 78 Q82 38 122 32 Q162 38 164 78 Q157 54 122 52 Q87 54 80 78Z" fill="#3d2010"/>
          <path d="M80 78 Q76 58 82 44 Q90 34 104 31 Q90 42 87 57 Q83 67 80 78Z" fill="#2e1a0a"/>
          <!-- Hair strands/texture -->
          <path d="M106 33 Q122 28 138 33" stroke="#4a2818" stroke-width="2.5" fill="none" opacity=".7"/>
          <path d="M128 32 Q145 36 158 46" stroke="#4a2818" stroke-width="2" fill="none" opacity=".6"/>
          <path d="M116 32 Q100 36 88 46" stroke="#4a2818" stroke-width="2" fill="none" opacity=".55"/>
          <!-- Front hair wisps -->
          <path d="M96 60 Q104 54 112 60" stroke="#3d2010" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M126 58 Q136 51 146 58" stroke="#3d2010" stroke-width="3" fill="none" stroke-linecap="round"/>

          <!-- EYEBROWS (focused/determined) -->
          <path d="M92 75 Q103 69 113 74" stroke="#2e1a0a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M131 74 Q141 69 152 75" stroke="#2e1a0a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Brow furrow -->
          <path d="M117 76 Q122 72 127 76" stroke="#b87858" stroke-width="1.5" fill="none" opacity=".45"/>

          <!-- LEFT EYE -->
          <ellipse cx="103" cy="88" rx="12" ry="9" fill="#f8f8f8"/>
          <circle cx="103" cy="88" r="7" fill="#3d2a1a"/>
          <circle cx="103" cy="88" r="4.5" fill="#1a0e08"/>
          <circle cx="105.5" cy="85.5" r="2" fill="#fff"/>
          <circle cx="101" cy="90" r=".8" fill="rgba(255,255,255,.5)"/>
          <!-- Eyelid lines -->
          <path d="M91 84 Q103 81 115 84" stroke="#2e1a0a" stroke-width="2.5" fill="none"/>
          <path d="M92 93 Q103 96 114 93" stroke="#b87858" stroke-width="1.5" fill="none" opacity=".45"/>

          <!-- RIGHT EYE -->
          <ellipse cx="141" cy="88" rx="12" ry="9" fill="#f8f8f8"/>
          <circle cx="141" cy="88" r="7" fill="#3d2a1a"/>
          <circle cx="141" cy="88" r="4.5" fill="#1a0e08"/>
          <circle cx="143.5" cy="85.5" r="2" fill="#fff"/>
          <circle cx="139" cy="90" r=".8" fill="rgba(255,255,255,.5)"/>
          <path d="M129 84 Q141 81 153 84" stroke="#2e1a0a" stroke-width="2.5" fill="none"/>
          <path d="M130 93 Q141 96 152 93" stroke="#b87858" stroke-width="1.5" fill="none" opacity=".45"/>

          <!-- NOSE -->
          <path d="M122 101 Q115 114 113 120 Q117 124 122 123 Q127 124 131 120 Q129 114 122 101Z" fill="rgba(0,0,0,.06)"/>
          <ellipse cx="115" cy="120" rx="5" ry="3.5" fill="rgba(140,70,40,.32)"/>
          <ellipse cx="129" cy="120" rx="5" ry="3.5" fill="rgba(140,70,40,.32)"/>
          <!-- Nose bridge -->
          <path d="M122 99 Q118 108 116 114" stroke="rgba(160,80,50,.2)" stroke-width="2" fill="none"/>

          <!-- MOUTH (confident, slight smile) -->
          <path d="M109 135 Q122 141 135 135" stroke="#9a5040" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M111 138 Q122 143 133 138" stroke="rgba(140,60,40,.2)" stroke-width="2" fill="none" stroke-linecap="round"/>

          <!-- Cheek flush from running -->
          <ellipse cx="88" cy="108" rx="14" ry="9" fill="rgba(200,80,60,.1)"/>
          <ellipse cx="156" cy="108" rx="14" ry="9" fill="rgba(200,80,60,.1)"/>

          <!-- Sweat drop (dynamic element) -->
          <ellipse cx="70" cy="78" rx="3.5" ry="5" fill="rgba(100,180,220,.6)"/>
        </svg>
      </div>
    </div>

    <!-- RIGHT: Stage selection + actions -->
    <div class="pnl-right">
      <div id="stage-list"></div>
      <div class="ract">
        <button class="clsbtn" onclick="Game.start()">
          <span>🏃 CLASSIC RUN</span>
          <span class="carrow">›</span>
        </button>
        <button class="startbtn" onclick="Game.start()">START</button>
      </div>
    </div>
  </div>

  <!-- BOTTOM NAV -->
  <div class="menu-nav">
    <button class="ntab nton" id="nav-store" onclick="navClick('store')">
      <span class="ntic">🛒</span><span class="ntlbl">Store</span>
    </button>
    <button class="ntab" id="nav-chars" onclick="navClick('chars')">
      <span class="ntic">👤</span><span class="ntlbl">Characters</span>
    </button>
    <button class="ntab" id="nav-upg" onclick="navClick('upg')">
      <span class="ntic">⬆️</span><span class="ntlbl">Upgrades</span>
    </button>
    <button class="ntab" id="nav-events" onclick="navClick('events')">
      <span class="ntic">📅</span><span class="ntlbl">Events</span>
    </button>
  </div>
</div>

<!-- ══ GAME SCREEN ══ -->
<div id="s-game" class="screen">
  <div class="hud">
    <div class="hud-left">
      <div class="hdcoin">🪙 <span id="hd-coins">0</span></div>
      <div class="hdgem">💎 <span id="hd-gems">0</span></div>
    </div>
    <div class="hdscore" id="hd-score">0m</div>
    <div class="hud-right">
      <div class="hdhp" id="hd-hp"></div>
      <button class="hdpause" onclick="Game.pause()">⏸</button>
    </div>
  </div>
  <canvas id="game-canvas"></canvas>
  <canvas id="fx-canvas"></canvas>
  <div class="mc">
    <button class="mcbtn" id="btn-l" style="margin-right:auto">◀</button>
    <button class="mcbtn" id="btn-r" style="margin-left:auto">▶</button>
  </div>
</div>

<!-- ══ DILEMMA ══ -->
<div id="s-dil" class="screen">
  <div class="dhdr">⚡ Momento de Decisão</div>
  <div class="dtimer"><div class="dtimerbar" id="dtb"></div></div>
  <div class="demoji" id="d-em">😰</div>
  <div class="dsit" id="d-sit"></div>
  <div class="dq" id="d-q"></div>
  <div class="dopts" id="d-opts"></div>
  <div class="dfb" id="d-fb"></div>
</div>

<!-- ══ PAUSE ══ -->
<div id="s-pause" class="screen">
  <div class="pttl">⏸ Pausado</div>
  <div class="plbl">Pontuação atual</div>
  <div class="pval" id="p-score">0</div>
  <div style="display:flex;flex-direction:column;gap:12px;width:240px">
    <button class="btn btn-primary" onclick="Game.resume()">▶ Continuar</button>
    <button class="btn btn-secondary" onclick="Game.restart()">🔄 Reiniciar</button>
    <button class="btn btn-danger" onclick="Game.exitMenu()">🏠 Menu</button>
  </div>
</div>

<!-- ══ GAME OVER ══ -->
<div id="s-go" class="screen">
  <div class="goem" id="go-em">😓</div>
  <div class="gottl">Fim de Corrida!</div>
  <div class="gosub" id="go-sub">Você chegou longe!</div>
  <div class="gorec" id="go-rec" style="display:none">🌟 NOVO RECORDE!</div>
  <div class="gostats">
    <div class="gostat"><div class="gosv" id="go-d">0m</div><div class="gosl">Distância</div></div>
    <div class="gostat"><div class="gosv" id="go-c">0</div><div class="gosl">Moedas</div></div>
    <div class="gostat"><div class="gosv" id="go-eq">0</div><div class="gosl">Acertos EQ</div></div>
    <div class="gostat"><div class="gosv" id="go-g">0</div><div class="gosl">Gemas</div></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px;width:240px">
    <button class="btn btn-primary" onclick="Game.restart()">🔄 Jogar Novamente</button>
    <button class="btn btn-secondary" onclick="UI.show('rank')">🏆 Ver Ranking</button>
    <button class="btn btn-secondary" onclick="Game.exitMenu()">🏠 Menu</button>
  </div>
</div>

<!-- ══ SHOP ══ -->
<div id="s-shop" class="screen">
  <div class="shophdr">
    <div class="shopttl">🛒 Loja EQ</div>
    <div class="shopsub">🪙 <span id="sh-c">0</span> &nbsp;|&nbsp; 💎 <span id="sh-g">0</span></div>
  </div>
  <div class="stabs">
    <button class="tbtn on" onclick="Shop.tab('boards')">🛹 Skates</button>
    <button class="tbtn" onclick="Shop.tab('bikes')">🚲 Bikes</button>
    <button class="tbtn" onclick="Shop.tab('outfits')">👕 Roupas</button>
  </div>
  <div class="sgrid" id="sh-grid"></div>
  <button class="btn btn-secondary" onclick="UI.show('menu')" style="width:100%;max-width:360px">← Voltar</button>
</div>

<!-- ══ CHARACTERS ══ -->
<div id="s-chars" class="screen">
  <div class="charhdr">
    <div class="charttl">👤 Personagens</div>
    <div class="charsub">Escolha seu corredor emocional</div>
  </div>
  <div class="chargrid" id="char-grid"></div>
  <button class="btn btn-secondary" onclick="UI.show('menu')" style="width:100%;max-width:360px">← Voltar</button>
</div>

<!-- ══ UPGRADES ══ -->
<div id="s-upg" class="screen">
  <div class="upghdr">
    <div class="upgttl">⬆️ Upgrades</div>
    <div class="upgsub">Melhore suas habilidades emocionais · 🪙 <span id="upg-c">0</span></div>
  </div>
  <div class="upglist" id="upg-list"></div>
  <button class="btn btn-secondary" onclick="UI.show('menu')" style="width:100%;max-width:360px">← Voltar</button>
</div>

<!-- ══ RANKING/EVENTS ══ -->
<div id="s-rank" class="screen">
  <div class="rankhdr">
    <div style="font-size:26px;font-weight:900">🏆 Top Run</div>
    <div style="color:#9A8EC4;font-size:13px">Melhores corredores emocionais</div>
  </div>
  <div class="podium" id="podium"></div>
  <div class="rankrows" id="rank-rows"></div>
  <button class="btn btn-secondary" onclick="UI.show('menu')" style="width:100%;max-width:360px;margin-top:14px">← Voltar</button>
</div>

<!-- NOTIFICATION -->
<div class="notif" id="notif"></div>

<script>
/* ===========================================================
   RunnerX EQ Runner  v3.0 — Full lobby + bug-fixed engine
=========================================================== */

/* ── STORAGE ── */
const Storage=(()=>{
  const K='rux_v3';
  const dflt=()=>({
    coins:12450,gems:320,highScore:0,totalRuns:0,
    name:'RunnerX',level:25,xp:2350,xpMax:5000,
    selStage:'zen_garden',
    selOutfit:'outfit_default',selBoard:'board_default',
    stages:{
      urban_park: {name:'URBAN PARK',  hs:12450,unlocked:true,  thumb:'t-urban'},
      zen_garden: {name:'ZEN GARDEN',  hs:8750, unlocked:true,  thumb:'t-zen'},
      coastal_road:{name:'COASTAL ROAD',hs:15600,unlocked:false,thumb:'t-coast'}
    },
    challenges:[
      {ic:'🏃',nm:'Run 5km',         cur:3,  max:5,   xp:500},
      {ic:'🪙',nm:'Collect 10 coins',cur:7,  max:10,  xp:250},
      {ic:'⏱', nm:'Score 1000 pts',  cur:450,max:1000,xp:300}
    ],
    owned:{boards:['board_default'],bikes:[],outfits:['outfit_default']},
    sel:{board:'board_default',bike:null,outfit:'outfit_default'},
    upgrades:{speed:1,shield:0,magnet:0,time:0},
    ranking:mockRanking()
  });
  function mockRanking(){
    const ns=['Ana Paula','Bruno K.','Carla M.','Diego S.','Erika F.','Felipe A.','Gabi R.','Hugo L.','Iris C.','João V.'];
    const em=['😎','🤩','🧠','💪','🌟','🔥','⚡','🎯','🚀','✨'];
    return ns.map((n,i)=>({n,em:em[i],sc:Math.floor(3000-i*180+Math.random()*80),bot:true})).sort((a,b)=>b.sc-a.sc);
  }
  let d=null;
  function load(){try{const r=localStorage.getItem(K);d=r?{...dflt(),...JSON.parse(r)}:dflt();
    ['stages','challenges','upgrades'].forEach(k=>{if(!d[k])d[k]=dflt()[k]});}catch(e){d=dflt();}return d;}
  function save(){try{localStorage.setItem(K,JSON.stringify(d));}catch(e){}}
  function get(){return d||load();}
  return{load,save,get};
})();

/* ── UI ── */
const UI=(()=>{
  const sc={};let cur=null;
  function init(){document.querySelectorAll('.screen').forEach(el=>{sc[el.id.replace('s-','')]=el;});}
  function show(nm){
    if(cur)sc[cur]&&sc[cur].classList.remove('active');
    cur=nm;
    if(sc[nm]){sc[nm].classList.add('active');
      if(nm==='menu')   renderMenu();
      if(nm==='shop')   Shop.refresh();
      if(nm==='chars')  Chars.render();
      if(nm==='upg')    Upg.render();
      if(nm==='rank')   Rank.render();
    }
  }
  function getCur(){return cur;}
  function renderMenu(){
    const d=Storage.get();
    document.getElementById('m-coins').textContent=d.coins.toLocaleString();
    document.getElementById('m-gems').textContent=d.gems.toLocaleString();
    document.getElementById('m-pname').textContent=d.name||'RunnerX';
    document.getElementById('m-level').textContent=d.level||25;
    const pct=Math.round(((d.xp||2350)/(d.xpMax||5000))*100);
    document.getElementById('m-xpbar').style.width=pct+'%';
    document.getElementById('m-xplbl').textContent=(d.xp||2350).toLocaleString()+'/'+(d.xpMax||5000).toLocaleString();
    // Runner emoji via outfit
    const oid=d.sel&&d.sel.outfit||d.selOutfit||'outfit_default';
    const out=CHARS_DATA.find(c=>c.id===oid);
    // Update avatar color if needed
    renderChallenges(d); renderStages(d);
  }
  function renderChallenges(d){
    const c=document.getElementById('ch-list');if(!c)return;c.innerHTML='';
    (d.challenges||[]).forEach(ch=>{
      const pct=Math.min(100,Math.round((ch.cur/ch.max)*100));
      const el=document.createElement('div');el.className='chi';
      el.innerHTML=`<div class="chirow"><div class="chil"><span class="chic">${ch.ic}</span><span class="chnm">${ch.nm}</span></div>
        <div class="chir"><span class="chct">${ch.cur}/${ch.max}</span><span class="chxp">XP ${ch.xp}</span></div></div>
        <div class="chprog"><div class="chbar" style="width:${pct}%"></div></div>`;
      c.appendChild(el);
    });
  }
  function renderStages(d){
    const c=document.getElementById('stage-list');if(!c)return;c.innerHTML='';
    Object.entries(d.stages||{}).forEach(([k,s])=>{
      const sel=d.selStage===k,lk=!s.unlocked;
      const el=document.createElement('div');
      el.className='scrd'+(sel?' ssel':'')+(lk?' slocked':'');
      if(!lk)el.onclick=()=>{d.selStage=k;Storage.save();renderStages(d);UI.notify('🗺️ '+s.name+' selecionado!');};
      el.innerHTML=`<div class="sctxt"><div class="scnm">${s.name}</div><div class="schs">High Score: ${s.hs.toLocaleString()}</div></div>
        <div class="sthumb">${thumbSVG(s.thumb)}</div>
        <div class="scbdg"><div class="scbdg-ico ${lk?'blck':'bchk'}">${lk?'🔒':'✓'}</div></div>`;
      c.appendChild(el);
    });
  }
  function thumbSVG(t){
    if(t==='t-urban') return `<svg viewBox="0 0 54 46" xmlns="http://www.w3.org/2000/svg">
      <rect width="54" height="46" fill="#2a3848"/><rect x="0" y="30" width="54" height="16" fill="#3a4838"/>
      <rect x="5" y="15" width="10" height="18" fill="#485a70"/><rect x="8" y="10" width="4" height="6" fill="#5a6e88"/>
      <rect x="18" y="18" width="8" height="14" fill="#3d5268"/><rect x="20" y="13" width="4" height="6" fill="#485a70"/>
      <rect x="38" y="12" width="12" height="20" fill="#485a70"/><rect x="41" y="7" width="6" height="6" fill="#5a6e88"/>
      <rect x="5" y="32" width="8" height="3" fill="#3a5028"/><ellipse cx="9" cy="30" rx="6" ry="8" fill="#2a6030"/>
      <rect x="22" y="34" width="8" height="3" fill="#3a5028"/><ellipse cx="26" cy="32" rx="5" ry="6" fill="#2a6030"/>
      <rect x="0" y="38" width="54" height="8" fill="#2a3420"/></svg>`;
    if(t==='t-zen') return `<svg viewBox="0 0 54 46" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="zsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#78b8d0"/><stop offset="100%" stop-color="#90c8b0"/></linearGradient></defs>
      <rect width="54" height="46" fill="url(#zsky)"/>
      <ellipse cx="12" cy="18" rx="14" ry="18" fill="#d87898" opacity=".85"/>
      <ellipse cx="42" cy="16" rx="14" ry="16" fill="#d87898" opacity=".85"/>
      <path d="M5 46 Q8 40 12 38 Q16 36 20 38 L20 46Z" fill="#3a2010"/>
      <ellipse cx="27" cy="35" rx="18" ry="5" fill="#5898a8" opacity=".8"/>
      <path d="M20 38 Q27 33 34 38" stroke="#8a1808" stroke-width="4" fill="none"/>
      <rect x="0" y="36" width="54" height="10" fill="#2a1e10"/></svg>`;
    return `<svg viewBox="0 0 54 46" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4888c0"/><stop offset="60%" stop-color="#60a8d8"/><stop offset="100%" stop-color="#2858a0"/></linearGradient></defs>
      <rect width="54" height="46" fill="url(#csky)"/>
      <path d="M0 28 Q12 22 18 26 Q26 20 34 24 Q42 18 54 22 L54 46 L0 46Z" fill="#1a3878"/>
      <rect x="0" y="36" width="54" height="10" fill="#5a4a30"/>
      <line x1="0" y1="36" x2="54" y2="36" stroke="#3a3420" stroke-width="2"/>
      <ellipse cx="10" cy="22" rx="4" ry="8" fill="#1e5038"/><ellipse cx="44" cy="20" rx="4" ry="7" fill="#1e5038"/>
      <ellipse cx="27" cy="30" rx="20" ry="6" fill="#3878b0" opacity=".5"/>
      <path d="M0 32 Q14 30 27 32 Q40 30 54 32" stroke="#88c0e0" stroke-width="1.5" fill="none" opacity=".6"/></svg>`;
  }
  function notify(msg,dur=2200){
    const el=document.getElementById('notif');el.textContent=msg;el.classList.add('show');
    clearTimeout(UI._t);UI._t=setTimeout(()=>el.classList.remove('show'),dur);
  }
  return{init,show,getCur,notify,_t:null};
})();

function navClick(tab){
  document.querySelectorAll('.ntab').forEach(b=>b.classList.remove('nton'));
  document.getElementById('nav-'+tab)&&document.getElementById('nav-'+tab).classList.add('nton');
  const map={store:'shop',chars:'chars',upg:'upg',events:'rank'};
  UI.show(map[tab]||'menu');
}

/* ── SHOP DATA ── */
const SHOP_DATA={
  boards:[
    {id:'board_default',nm:'Skate Clássico',em:'🛹',price:0,  cur:'coins',desc:'O início de tudo'},
    {id:'board_neon',   nm:'Neon Board',    em:'✨',price:200, cur:'coins',desc:'+5% velocidade'},
    {id:'board_rainbow',nm:'Rainbow Board', em:'🌈',price:500, cur:'coins',desc:'Rastro colorido'},
    {id:'board_fire',   nm:'Fire Board',    em:'🔥',price:800, cur:'coins',desc:'Velocidade máxima'},
    {id:'board_gem',    nm:'Gem Board',     em:'💠',price:10,  cur:'gems', desc:'Atrai gemas'},
    {id:'board_gold',   nm:'Gold Board',    em:'🏅',price:20,  cur:'gems', desc:'Dobra moedas'},
  ],
  bikes:[
    {id:'bike_basic',   nm:'Bicicleta',     em:'🚲',price:300, cur:'coins',desc:'Mais estabilidade'},
    {id:'bike_electric',nm:'E-Bike',        em:'⚡',price:700, cur:'coins',desc:'+10% velocidade'},
    {id:'bike_bmx',     nm:'BMX',           em:'🎪',price:1200,cur:'coins',desc:'Pula obstáculos'},
    {id:'bike_crystal', nm:'Crystal Bike',  em:'🔮',price:15,  cur:'gems', desc:'3s invencível/dilema'},
  ],
  outfits:[
    {id:'outfit_default',nm:'Corredor',       em:'🏃',price:0,  cur:'coins',desc:'Você mesmo'},
    {id:'outfit_ninja',  nm:'Ninja EQ',       em:'🥷',price:400,cur:'coins',desc:'Furtividade emocional'},
    {id:'outfit_hero',   nm:'Herói EQ',       em:'🦸',price:600,cur:'coins',desc:'Escudo emocional'},
    {id:'outfit_wizard', nm:'Sábio',          em:'🧙',price:900,cur:'coins',desc:'+2s nos dilemas'},
    {id:'outfit_robot',  nm:'Empata-Bot',     em:'🤖',price:12, cur:'gems', desc:'Dicas nas respostas'},
    {id:'outfit_angel',  nm:'Anjo da Empatia',em:'😇',price:25, cur:'gems', desc:'Vida extra por fase'},
  ]
};

/* ── CHARACTERS DATA ── */
const CHARS_DATA=[
  {id:'outfit_default',nm:'RunnerX',       em:'🏃',desc:'Equilíbrio perfeito',     price:0,   gc:'coins',unlocked:true},
  {id:'outfit_ninja',  nm:'Ninja EQ',       em:'🥷',desc:'Mestre do autocontrole', price:400, gc:'coins',unlocked:false},
  {id:'outfit_hero',   nm:'Herói EQ',       em:'🦸',desc:'Protetor emocional',     price:600, gc:'coins',unlocked:false},
  {id:'outfit_wizard', nm:'Sábio Emocional',em:'🧙',desc:'Sabedoria ancestral',    price:900, gc:'coins',unlocked:false},
  {id:'outfit_robot',  nm:'Empata-Bot',     em:'🤖',desc:'IA com empatia',         price:12,  gc:'gems', unlocked:false},
  {id:'outfit_angel',  nm:'Anjo Empático',  em:'😇',desc:'Amor incondicional',     price:25,  gc:'gems', unlocked:false},
];

/* ── SHOP MODULE ── */
const Shop=(()=>{
  let tab='boards';
  function tab_(t){
    tab=t;
    document.querySelectorAll('.tbtn').forEach((b,i)=>b.classList.toggle('on',['boards','bikes','outfits'][i]===t));
    render();
  }
  function refresh(){const d=Storage.get();document.getElementById('sh-c').textContent=d.coins;document.getElementById('sh-g').textContent=d.gems;render();}
  function render(){
    const d=Storage.get(),items=SHOP_DATA[tab]||[],g=document.getElementById('sh-grid');g.innerHTML='';
    items.forEach(item=>{
      const own=d.owned[tab].includes(item.id),sk=tab==='boards'?'board':tab==='bikes'?'bike':'outfit',isSel=d.sel[sk]===item.id;
      const el=document.createElement('div');el.className='sitem'+(own?' owned':'')+(isSel?' selected':'');
      el.innerHTML=`<div class="sem">${item.em}</div><div class="snm">${item.nm}</div>
        ${own?`<div class="sob">${isSel?'✅ Equipado':'✔ Possuído'}</div>`:`<div class="spr">${item.cur==='coins'?'🪙':'💎'} ${item.price}</div>`}
        <div style="font-size:11px;color:#9A8EC4;margin-top:4px">${item.desc}</div>`;
      el.onclick=()=>buy(item,tab);g.appendChild(el);
    });
  }
  function buy(item,t){
    const d=Storage.get(),own=d.owned[t].includes(item.id);
    if(!own){const h=item.cur==='coins'?d.coins:d.gems;if(h<item.price){UI.notify('💸 Recursos insuficientes!');return;}
      if(item.cur==='coins')d.coins-=item.price;else d.gems-=item.price;d.owned[t].push(item.id);UI.notify('✅ '+item.em+' '+item.nm+' comprado!');}
    const k=t==='boards'?'board':t==='bikes'?'bike':'outfit';d.sel[k]=item.id;
    Storage.save();refresh();UI.notify('✨ '+item.nm+' equipado!');
  }
  return{tab:tab_,refresh};
})();

/* ── CHARACTERS MODULE ── */
const Chars=(()=>{
  function render(){
    const d=Storage.get(),g=document.getElementById('char-grid');if(!g)return;g.innerHTML='';
    CHARS_DATA.forEach(c=>{
      const own=d.owned.outfits.includes(c.id),sel=d.sel.outfit===c.id;
      const el=document.createElement('div');el.className='charcard'+(sel?' csel':'')+(own?'':' clocked');
      el.innerHTML=`
        <div class="charsvg"><svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
          <text x="40" y="80" font-size="52" text-anchor="middle">${c.em}</text>
          ${sel?'<circle cx="40" cy="110" r="8" fill="#F5A623" opacity=".5"/>':''}
        </svg></div>
        ${!own?`<div class="charlockbadge">🔒</div>`:''}
        <div class="charcnm">${c.nm}</div>
        <div class="charcdesc">${c.desc}</div>
        ${own?`<div class="charownbadge">${sel?'✅ Selecionado':'✔ Desbloqueado'}</div>`
             :`<div class="charpr">${c.gc==='coins'?'🪙':'💎'} ${c.price}</div>`}`;
      el.onclick=()=>{
        if(!own){const dd=Storage.get();const h=c.gc==='coins'?dd.coins:dd.gems;
          if(h<c.price){UI.notify('💸 Recursos insuficientes!');return;}
          if(c.gc==='coins')dd.coins-=c.price;else dd.gems-=c.price;dd.owned.outfits.push(c.id);
          Storage.save();UI.notify('✅ '+c.em+' '+c.nm+' desbloqueado!');}
        const dd=Storage.get();dd.sel.outfit=c.id;Storage.save();render();UI.notify('✨ '+c.nm+' equipado!');
      };
      g.appendChild(el);
    });
  }
  return{render};
})();

/* ── UPGRADES MODULE ── */
const UPG_DATA=[
  {key:'speed',  nm:'Velocidade',  ic:'⚡',desc:'Aumenta vel. máxima',maxLv:5,base:200},
  {key:'shield', nm:'Escudo EQ',   ic:'🛡️',desc:'Invencibilidade +2s', maxLv:3,base:350},
  {key:'magnet', nm:'Magneto',     ic:'🧲',desc:'Atrai moedas/gemas',  maxLv:4,base:250},
  {key:'time',   nm:'Tempo Dilema',ic:'⏱',desc:'Mais tempo p/ pensar', maxLv:3,base:400},
];
const Upg=(()=>{
  function render(){
    const d=Storage.get();document.getElementById('upg-c').textContent=d.coins;
    const g=document.getElementById('upg-list');if(!g)return;g.innerHTML='';
    UPG_DATA.forEach(u=>{
      const lv=d.upgrades&&d.upgrades[u.key]||0,cost=u.base*(lv+1),maxed=lv>=u.maxLv;
      const row=document.createElement('div');row.className='upgraderow';
      const dots=Array.from({length:u.maxLv},(_,i)=>`<div class="upgdot${i<lv?' filled':''}"></div>`).join('');
      row.innerHTML=`<div class="upgicon">${u.ic}</div>
        <div class="upginfo">
          <div class="upgnm">${u.nm} ${lv>0?`<span style="color:#F5A623;font-size:12px">Lv.${lv}</span>`:''}</div>
          <div class="upgdesc">${u.desc}</div>
          <div class="upglvlbar">${dots}</div>
        </div>
        <button class="upgcost" ${maxed?'disabled':''} onclick="Upg.buy('${u.key}')">
          ${maxed?'MAX':'🪙 '+cost.toLocaleString()}
        </button>`;
      g.appendChild(row);
    });
  }
  function buy(k){
    const d=Storage.get(),u=UPG_DATA.find(x=>x.key===k);if(!u)return;
    const lv=d.upgrades[k]||0;if(lv>=u.maxLv){UI.notify('✅ Nível máximo!');return;}
    const cost=u.base*(lv+1);if(d.coins<cost){UI.notify('💸 Moedas insuficientes!');return;}
    d.coins-=cost;d.upgrades[k]=(d.upgrades[k]||0)+1;Storage.save();render();
    UI.notify('⬆️ '+u.nm+' melhorado para Lv.'+(lv+1)+'!');
  }
  return{render,buy};
})();
window.Upg=Upg;

/* ── RANKING ── */
const Rank=(()=>{
  function render(){
    const d=Storage.get();let list=[...d.ranking];
    list=list.filter(r=>!r.isPlayer);list.push({n:'Você',em:'😊',sc:d.highScore,isPlayer:true});
    list.sort((a,b)=>b.sc-a.sc);list=list.slice(0,10);
    const pod=document.getElementById('podium');pod.innerHTML='';
    const top3=list.slice(0,3),order=[top3[1],top3[0],top3[2]].filter(Boolean);
    const cls=['p2','p1','p3'],lbl=['🥈','🥇','🥉'];
    order.forEach((r,i)=>{const s=document.createElement('div');s.className='podslot '+cls[i];
      s.innerHTML=`<div class="podpos">${lbl[i]}</div><div class="podavt">${r.em}</div><div class="podnm">${r.n}</div><div class="podsc">${r.sc}m</div>`;
      pod.appendChild(s);});
    const rl=document.getElementById('rank-rows');rl.innerHTML='';
    list.forEach((r,i)=>{const row=document.createElement('div');row.className='rankrow'+(r.isPlayer?' rankyou':'');
      row.innerHTML=`<div class="rankpos">${i+1}</div><div class="rankavt">${r.em}</div>
        <div class="rankinfo"><div class="ranknm">${r.n}${r.isPlayer?' (você)':''}</div><div class="rankdt">${r.bot?'Bot EQ':'Jogador'}</div></div>
        <div class="ranksc">${r.sc}m</div>`;
      rl.appendChild(row);});
  }
  function submit(sc){const d=Storage.get();if(sc>d.highScore)d.highScore=sc;Storage.save();}
  return{render,submit};
})();

/* ── DILEMMAS ── */
const DILEMMAS=[
  {em:'😤',sit:'Seu colega critica seu projeto em frente a toda a equipe.',q:'O que você faz?',
   opts:[{t:'Responde na mesma hora com críticas dele',ok:false},{t:'Respira fundo e conversa depois',ok:true},{t:'Sai da sala sem falar nada',ok:false},{t:'Concorda com tudo para evitar conflito',ok:false}],
   fb:{ok:'Autorregulação é fundamental na IE!',no:'Reagir impulsivamente raramente resolve conflitos.'}},
  {em:'😔',sit:'Um amigo está quieto e triste, mas diz "estou bem".',q:'Qual a reação mais empática?',
   opts:[{t:'Aceito o "estou bem" e mudo de assunto',ok:false},{t:'"Parece que algo te incomoda, estou aqui"',ok:true},{t:'Conto meus problemas para distrair',ok:false},{t:'Ignoro, não é da minha conta',ok:false}],
   fb:{ok:'Reconhecer emoções não verbais = inteligência emocional!',no:'Validar o que vemos sem forçar cria conexão verdadeira.'}},
  {em:'😰',sit:'Você errou numa apresentação importante e quer desistir.',q:'Como lidar com a frustração?',
   opts:[{t:'Se culpar intensamente por dias',ok:false},{t:'Ignorar o erro completamente',ok:false},{t:'Analisar, aprender e criar um plano de melhora',ok:true},{t:'Transferir a culpa para os outros',ok:false}],
   fb:{ok:'Auto-compaixão + ação = resiliência emocional!',no:'Autocrítica excessiva bloqueia o crescimento.'}},
  {em:'😠',sit:'No trânsito, alguém te fecha e você fica irritadíssimo.',q:'Qual a melhor resposta emocional?',
   opts:[{t:'Buzinar, gesticular e dar o troco',ok:false},{t:'Gritar e xingar dentro do carro',ok:false},{t:'"Talvez ele esteja em emergência" + respirar fundo',ok:true},{t:'Ficar ruminando o episódio por horas',ok:false}],
   fb:{ok:'Reframing cognitivo reduz o impacto emocional.',no:'Ruminação mantém o corpo em estresse.'}},
  {em:'🤗',sit:'Seu chefe te elogia muito, mas você não se sente merecedor.',q:'O que a IE sugere?',
   opts:[{t:'"Não mereço mesmo, foi sorte"',ok:false},{t:'Aceitar com gratidão e reconhecer seu esforço',ok:true},{t:'Diminuir o elogio na frente de todos',ok:false},{t:'Fingir que não ouviu',ok:false}],
   fb:{ok:'Autoconhecimento saudável inclui reconhecer conquistas!',no:'Síndrome do impostor limita seu crescimento.'}},
  {em:'😟',sit:'Você percebe que magoou alguém sem querer.',q:'Qual atitude emocionalmente inteligente?',
   opts:[{t:'Esperar o tempo curar tudo',ok:false},{t:'Justificar: não foi sua intenção',ok:false},{t:'Pedir desculpas genuínas e perguntar como ajudar',ok:true},{t:'Ignorar: exagero da parte dela',ok:false}],
   fb:{ok:'Responsabilidade emocional fortalece relacionamentos!',no:'Justificativas invalidam o sentimento do outro.'}},
  {em:'😅',sit:'Um familiar te dá feedback duro sobre uma decisão sua.',q:'Como você reage?',
   opts:[{t:'Entra em modo defensivo e ataca',ok:false},{t:'Agradece, reflete e filtra o que é válido',ok:true},{t:'Aceita tudo e muda sua vida por causa dele',ok:false},{t:'Ignora completamente',ok:false}],
   fb:{ok:'Filtragem emocional saudável — nem tudo é crítica!',no:'Reações extremas não são equilibradas.'}},
  {em:'😓',sit:'Você está sobrecarregado mas todos pedem mais.',q:'O que uma pessoa com boa IE faz?',
   opts:[{t:'Aceita tudo para não decepcionar',ok:false},{t:'Explode de raiva',ok:false},{t:'Comunica seus limites com respeito e clareza',ok:true},{t:'Desaparece sem avisar ninguém',ok:false}],
   fb:{ok:'Autogestão inclui saber dizer não com respeito!',no:'Limites saudáveis protegem você e seus relacionamentos.'}}
];

/* ── DILEMMA MODULE ── */
const Dil=(()=>{
  let tmr=null,answered=false,cb=null;
  const TIME=15;
  function show(d,callback){
    answered=false;cb=callback;UI.show('dil');
    document.getElementById('d-em').textContent=d.em;
    document.getElementById('d-sit').textContent=d.sit;
    document.getElementById('d-q').textContent=d.q;
    const fb=document.getElementById('d-fb');fb.className='dfb';fb.textContent='';
    const opts=document.getElementById('d-opts');opts.innerHTML='';
    const ltrs=['A','B','C','D'],sh=[...d.opts].sort(()=>Math.random()-.5);
    sh.forEach((o,i)=>{const btn=document.createElement('button');btn.className='obtn';
      btn.innerHTML=`<span class="olet">${ltrs[i]}</span><span class="otxt">${o.t}</span>`;
      btn.onclick=()=>answer(o,sh,d,btn);opts.appendChild(btn);});
    const bar=document.getElementById('dtb');bar.style.width='100%';
    let rem=TIME;clearInterval(tmr);
    tmr=setInterval(()=>{rem-=.1;bar.style.width=Math.max(0,(rem/TIME)*100)+'%';
      if(rem<=0){clearInterval(tmr);timeout(d);}},100);
  }
  function answer(opt,all,d,btn){
    if(answered)return;answered=true;clearInterval(tmr);
    document.querySelectorAll('.obtn').forEach((b,i)=>{
      if(all[i].ok)b.classList.add('correct');else if(b===btn&&!opt.ok)b.classList.add('wrong');
      b.style.pointerEvents='none';});
    const fb=document.getElementById('d-fb');
    if(opt.ok){fb.textContent='✅ '+d.fb.ok;fb.className='dfb show good';FX.burst(200,300,'success');}
    else      {fb.textContent='❌ '+d.fb.no;fb.className='dfb show bad';}
    setTimeout(()=>{UI.show('game');if(cb)cb(opt.ok);},2500);
  }
  function timeout(d){
    if(answered)return;answered=true;
    const fb=document.getElementById('d-fb');fb.textContent='⏱️ Tempo esgotado! '+d.fb.no;fb.className='dfb show bad';
    setTimeout(()=>{UI.show('game');if(cb)cb(false);},2000);
  }
  return{show};
})();

/* ── FX ── */
const FX=(()=>{
  let cv,cx;const ps=[];
  function init(){cv=document.getElementById('fx-canvas');cx=cv.getContext('2d');resize();window.addEventListener('resize',resize);loop();}
  function resize(){cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;}
  function burst(x,y,t='coin'){
    const cs={coin:['#F59E0B','#FDC84B','#fff'],gem:['#06B6D4','#67E8F9','#fff'],success:['#10B981','#6EE7B7','#fff'],danger:['#EF4444','#FCA5A5','#fff'],neg:['#7C3AED','#A78BFA','#C4B5FD']};
    const c=cs[t]||cs.coin;for(let i=0;i<20;i++){const a=(Math.PI*2/20)*i,s=2+Math.random()*3;
      ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,r:3+Math.random()*4,color:c[~~(Math.random()*c.length)],life:1,dec:.03+Math.random()*.02});}
  }
  function ftxt(x,y,t,c='#FDC84B'){ps.push({x,y,t,c,vx:(Math.random()-.5),vy:-2.5,life:1,dec:.025,isTxt:true,fs:16});}
  function loop(){cx.clearRect(0,0,cv.width,cv.height);
    for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.life-=p.dec;
      cx.globalAlpha=Math.max(0,p.life);
      if(p.isTxt){cx.font=`bold ${p.fs}px Segoe UI`;cx.fillStyle=p.c;cx.textAlign='center';cx.fillText(p.t,p.x,p.y);}
      else{cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=p.color;cx.fill();}
      if(p.life<=0)ps.splice(i,1);}
    cx.globalAlpha=1;requestAnimationFrame(loop);}
  return{init,burst,ftxt};
})();

/* ── GAME ENGINE ── */
const Game=(()=>{
  let cv,cx,run=false,psd=false,over=false,aid=null;
  let dist=0,sc=0,sg=0,seq=0,lives=3,spd=4,fr=0,dilN=0;
  let inv=false,invT=0,W,H,lW,lX;const LANES=3;
  let pLane=1,pX=0,tX=0,obs=[],coins=[],gems=[],bgL=[];
  const PS=44;let pEm='🏃';
  const OBS=[
    {em:'😈',lb:'Raiva',     cl:'#EF4444'},{em:'😰',lb:'Ansiedade',cl:'#F59E0B'},
    {em:'😔',lb:'Tristeza',  cl:'#6366F1'},{em:'🤯',lb:'Overwhelm', cl:'#EC4899'},
    {em:'😤',lb:'Frustração',cl:'#F97316'},{em:'😨',lb:'Medo',      cl:'#8B5CF6'},
    {em:'😒',lb:'Negatividade',cl:'#64748B'},{em:'🙄',lb:'Julgamento',cl:'#06B6D4'}
  ];
  function init(){
    cv=document.getElementById('game-canvas');cx=cv.getContext('2d');
    resize();window.addEventListener('resize',resize);ctrl();
  }
  function resize(){
    W=Math.min(window.innerWidth,480);H=window.innerHeight;
    cv.width=W;cv.height=H;lW=Math.floor(W/LANES);
    lX=[lW*.5,lW*1.5,lW*2.5];tX=lX[pLane];pX=tX;
    const fx=document.getElementById('fx-canvas');
    if(fx){fx.width=fx.offsetWidth;fx.height=fx.offsetHeight;}
  }
  function ctrl(){
    document.addEventListener('keydown',e=>{
      if(!run||psd)return;
      if(e.key==='ArrowLeft'||e.key==='a')mvL();
      if(e.key==='ArrowRight'||e.key==='d')mvR();
      if(e.key==='Escape'||e.key==='p')pause();
    });
    ['btn-l','btn-r'].forEach((id,i)=>{
      const el=document.getElementById(id);if(!el)return;
      el.addEventListener('touchstart',e=>{e.preventDefault();if(run&&!psd)(i===0?mvL:mvR)();},{passive:false});
      el.addEventListener('click',()=>{if(run&&!psd)(i===0?mvL:mvR)();});
    });
    let tx0=0;
    cv.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;},{passive:true});
    cv.addEventListener('touchend',e=>{if(!run||psd)return;const dx=e.changedTouches[0].clientX-tx0;if(Math.abs(dx)>28){dx<0?mvL():mvR();}},{passive:true});
    cv.addEventListener('click',e=>{if(!run||psd)return;const r=cv.getBoundingClientRect();tapObs(e.clientX-r.left,e.clientY-r.top);});
  }
  function mvL(){if(pLane>0){pLane--;tX=lX[pLane];}}
  function mvR(){if(pLane<LANES-1){pLane++;tX=lX[pLane];}}
  function tapObs(tx,ty){
    for(let i=obs.length-1;i>=0;i--){const o=obs[i];
      if(Math.abs(tx-o.x)<35&&Math.abs(ty-o.y)<35){FX.burst(o.x,o.y,'neg');FX.ftxt(o.x,o.y-20,'💨 Eliminado!','#A78BFA');obs.splice(i,1);sc+=2;hud();return;}
    }
  }
  function start(){
    dist=0;sc=0;sg=0;seq=0;lives=3;spd=4;fr=0;dilN=0;inv=false;invT=0;pLane=1;
    obs=[];coins=[];gems=[];bgL=[];over=false;psd=false;
    const d=Storage.get(),out=SHOP_DATA.outfits.find(o=>o.id===d.sel.outfit);
    pEm=out?out.em:'🏃';
    resize();pX=lX[1];tX=pX;
    for(let i=0;i<22;i++)bgL.push({x:Math.random()*W,y:Math.random()*H,len:10+Math.random()*42,s:3+Math.random()*4,a:.04+Math.random()*.09});
    UI.show('game');run=true;hud();hearts();
    cancelAnimationFrame(aid);loop();
  }
  function restart(){start();}
  function pause(){if(!run||over)return;psd=true;run=false;document.getElementById('p-score').textContent=Math.floor(dist)+'m';UI.show('pause');}
  function resume(){psd=false;run=true;UI.show('game');loop();}
  function exitMenu(){run=false;psd=false;over=false;cancelAnimationFrame(aid);UI.show('menu');}
  function loop(){if(!run)return;aid=requestAnimationFrame(loop);update();draw();}

  function update(){
    fr++;spd=Math.min(4+dist*.003,14);dist+=spd*.05;pX+=(tX-pX)*.18;
    if(fr%Math.max(45,110-~~(dist/30))===0)sObs();
    if(fr%40===0)sCoin();if(fr%300===0)sGem();
    bgL.forEach(l=>{l.y+=l.s*(spd/5);if(l.y>H){l.y=-l.len;l.x=Math.random()*W;}});
    for(let i=obs.length-1;i>=0;i--){const o=obs[i];o.y+=spd;if(o.y>H+60){obs.splice(i,1);continue;}if(!inv&&col(o.x,o.y,pX,py(),32)){obs.splice(i,1);hit(o);}}
    for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.y+=spd;if(c.y>H+40){coins.splice(i,1);continue;}if(col(c.x,c.y,pX,py(),27)){coins.splice(i,1);sc++;FX.burst(c.x,c.y,'coin');FX.ftxt(c.x,c.y-20,'+1🪙','#FDC84B');hud();}}
    for(let i=gems.length-1;i>=0;i--){const g=gems[i];g.y+=spd*.8;if(g.y>H+40){gems.splice(i,1);continue;}if(col(g.x,g.y,pX,py(),27)){gems.splice(i,1);sg++;FX.burst(g.x,g.y,'gem');FX.ftxt(g.x,g.y-20,'+1💎','#67E8F9');hud();}}
    if(inv){invT--;if(invT<=0)inv=false;}
    if(fr>300&&fr%900===0)trigDil();
    document.getElementById('hd-score').textContent=Math.floor(dist)+'m';
  }

  function draw(){
    cx.clearRect(0,0,W,H);
    const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0814');g.addColorStop(1,'#160f2a');
    cx.fillStyle=g;cx.fillRect(0,0,W,H);
    bgL.forEach(l=>{cx.globalAlpha=l.a;cx.strokeStyle='#A78BFA';cx.lineWidth=1;cx.beginPath();cx.moveTo(l.x,l.y);cx.lineTo(l.x,l.y+l.len);cx.stroke();});
    cx.globalAlpha=1;
    cx.strokeStyle='rgba(167,139,250,.14)';cx.lineWidth=1;cx.setLineDash([12,8]);
    [lW,lW*2].forEach(x=>{cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();});
    cx.setLineDash([]);
    for(let i=0;i<8;i++){const yy=(H*.7)+i*25+(fr*spd*.5)%25;if(yy>H)continue;cx.strokeStyle=`rgba(167,139,250,${.04+i*.02})`;cx.lineWidth=.5;cx.beginPath();cx.moveTo(0,yy);cx.lineTo(W,yy);cx.stroke();}
    coins.forEach(c=>drawE('🪙',c.x,c.y,22));
    gems.forEach(g=>drawE('💎',g.x,g.y,22));
    obs.forEach(o=>{cx.globalAlpha=.24;cx.beginPath();cx.arc(o.x,o.y,28,0,Math.PI*2);cx.fillStyle=o.cl;cx.fill();cx.globalAlpha=1;drawE(o.em,o.x,o.y,36);cx.fillStyle='#fff';cx.globalAlpha=.68;cx.font='bold 10px Segoe UI';cx.textAlign='center';cx.fillText(o.lb,o.x,o.y+28);cx.globalAlpha=1;});
    drawPlayer();
  }

  function drawPlayer(){
    const pyy=py(),blink=inv&&(fr%6<3);
    cx.globalAlpha=blink?.11:.28;cx.beginPath();cx.ellipse(pX,pyy+PS/2+5,PS*.4,8,0,0,Math.PI*2);cx.fillStyle='#000';cx.fill();
    cx.globalAlpha=blink?.38:1;
    drawE(pEm,pX,pyy,PS);cx.globalAlpha=1;
  }
  function drawE(e,x,y,s){cx.font=`${s}px serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(e,x,y);cx.textBaseline='alphabetic';}
  function py(){return H-110;}
  function col(ax,ay,bx,by,r){const dx=ax-bx,dy=ay-by;return Math.sqrt(dx*dx+dy*dy)<r;}
  function sObs(){obs.push({x:lX[~~(Math.random()*LANES)],y:-40,...OBS[~~(Math.random()*OBS.length)]});}
  function sCoin(){const l=~~(Math.random()*LANES),n=3+~~(Math.random()*3);for(let i=0;i<n;i++)coins.push({x:lX[l],y:-40-i*40});}
  function sGem(){gems.push({x:lX[~~(Math.random()*LANES)],y:-40});}
  function hit(o){
    lives--;inv=true;invT=85;FX.burst(pX,py(),'danger');FX.ftxt(pX,py()-40,'💢 '+o.lb,'#FCA5A5');
    hearts();UI.notify('💢 Pensamento negativo: '+o.lb+'!');if(lives<=0)gameOver();
  }

  /* ★ BUG CORRIGIDO: reinicia o loop após o dilema ★ */
  function trigDil(){
    if(!run)return;run=false;
    const idx=dilN%DILEMMAS.length;dilN++;
    Dil.show(DILEMMAS[idx],ok=>{
      if(ok){seq++;sc+=15;FX.ftxt(W/2,H/2,'🧠 +15🪙 EQ!','#6EE7B7');hud();}
      else{lives=Math.max(0,lives-1);hearts();if(lives<=0){gameOver();return;}}
      run=true;cancelAnimationFrame(aid);loop();  /* ← CORREÇÃO */
    });
  }

  function gameOver(){
    run=false;over=true;cancelAnimationFrame(aid);
    const d=Storage.get();d.coins+=sc;d.gems+=sg;d.totalRuns++;
    const isRec=Math.floor(dist)>d.highScore;Storage.save();Rank.submit(Math.floor(dist));
    document.getElementById('go-d').textContent=Math.floor(dist)+'m';
    document.getElementById('go-c').textContent=sc;
    document.getElementById('go-g').textContent=sg;
    document.getElementById('go-eq').textContent=seq;
    const em=document.getElementById('go-em'),sb=document.getElementById('go-sub');
    if(seq>=4){em.textContent='🧠';sb.textContent='Mestre da Inteligência Emocional!';}
    else if(seq>=2){em.textContent='😊';sb.textContent='Bom equilíbrio emocional!';}
    else if(seq>=1){em.textContent='🙂';sb.textContent='Continue praticando!';}
    else{em.textContent='😓';sb.textContent='As emoções te venceram desta vez...';}
    document.getElementById('go-rec').style.display=isRec?'block':'none';
    UI.show('go');
  }
  function hud(){document.getElementById('hd-coins').textContent=sc;document.getElementById('hd-gems').textContent=sg;}
  function hearts(){const h=document.getElementById('hd-hp');h.innerHTML='';for(let i=0;i<3;i++){const x=document.createElement('span');x.className='heart'+(i>=lives?' empty':'');x.textContent='❤️';h.appendChild(x);}}
  return{init,start,restart,pause,resume,exitMenu};
})();

/* ── CHERRY BLOSSOM PETALS ── */
function spawnPetals(){
  const c=document.getElementById('petals');if(!c)return;
  const ps=['🌸','🌸','🌺','🌸','🌸'];
  for(let i=0;i<22;i++){
    const el=document.createElement('span');el.className='petal';
    el.textContent=ps[~~(Math.random()*ps.length)];
    el.style.cssText=`left:${Math.random()*100}%;font-size:${8+Math.random()*10}px;--d:${5+Math.random()*8}s;--dl:${-Math.random()*10}s;--dx:${(Math.random()-.5)*140}px`;
    c.appendChild(el);
  }
}

/* ── BOOT ── */
(function boot(){
  Storage.load();UI.init();FX.init();Game.init();spawnPetals();
  setTimeout(()=>UI.show('menu'),2400);
})();
</script>
</body>
</html>
ENDOFFILE
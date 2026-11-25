(()=>{
if(!document.body.classList.contains('dbpage'))return;
const grid=document.querySelector('.recordgrid');if(!grid)return;
const store='custia.extras.v082',key=r=>r.uid||r.owner+'|'+r.id;
const read=()=>{try{return JSON.parse(localStorage.getItem(store)||'{}')}catch{return{}}};
const el=(t,c,s)=>{const n=document.createElement(t);if(c)n.className=c;if(s!==undefined)n.textContent=s;return n};
const T=(en,th)=>document.documentElement.lang==='th'?th:en;
const sec=el('section','hist');grid.after(sec);
const ROT=[-1.5,4,-5];let idx=0,editing=false,last='',busy=false;
const logo='<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#logo" style="color:#d0002a;--logo-hole:#eee"/></svg>';
// V0.9.3.2: History/Item/Gallery tabs live in interactive093.js (permanent sticky bar)

function draw(){
  sec.replaceChildren();sec.hidden=!current||!!window.custiaExtraMode;if(!current)return;
  const r=current,k=key(r),own=r.onlineOwner?!!r.onlineOwn:!!account&&r.owner===account,a=window.custiaExtras.read(r);
  if(k!==last){last=k;idx=0;editing=false}
  const hist=a.history??r.onlineBio??'',crime=a.crime||'';
  const title=el('div','hist-title','HISTORY');title.setAttribute('aria-hidden','true');
  const main=el('div','hist-main'),side=el('div','hist-side');sec.append(title,main,side);
  const status=el('p','hist-status');status.setAttribute('role','status');

  if(editing){ /* ---------- page 2: edit ---------- */
    sec.classList.add('editing');
    const back=el('button','hist-back','←');back.type='button';back.setAttribute('aria-label',T('Back','ย้อนกลับ'));
    const page=el('div','hist-page'),mk=(l,v)=>{const lab=el('label',undefined,l),ta=el('textarea');ta.value=v;ta.maxLength=5000;lab.append(ta);page.append(lab);return ta};
    const h=mk('Character History',hist),c=mk('Criminal Records',crime),inc=mk('Reason for incarceration',a.incarceration||'');page.append(status);
    const saveButton=el('button','hist-save','Save History');saveButton.type='button';saveButton.onclick=()=>save();page.append(saveButton);main.append(back,page);
    const save=async()=>{if(!own)return;saveButton.disabled=true;try{await window.custiaExtras.save(r,{...window.custiaExtras.read(r),history:h.value,crime:c.value,incarceration:inc.value});editing=false;draw()}catch(e){status.textContent=e.message}finally{saveButton.disabled=false}};
    back.onclick=()=>{
      if(h.value===hist&&c.value===crime&&inc.value===(a.incarceration||'')){editing=false;draw();return}
      const dlg=el('dialog','hist-dlg');dlg.append(el('p',undefined,T('Discard writing?','ยกเลิกการเขียนหรือไม่?')));
      const s=el('button',undefined,T('Save','บันทึก')),x=el('button',undefined,T('Cancel','ยกเลิก'));s.type=x.type='button';
      s.onclick=()=>{dlg.close();save()};x.onclick=()=>{dlg.close();editing=false;draw()};
      dlg.append(s,x);sec.append(dlg);dlg.showModal()};
    return;
  }
  sec.classList.remove('editing');
  /* ---------- page 1: paper stack ---------- */
  const papers=[['"'+(r.name||'Unknown')+'"','Personal background',hist],['Criminal records','',crime]];
  if(a.incarceration)papers.push(['Reason for incarceration','',a.incarceration]);
  const n=papers.length,stack=el('div','hist-stack'),sheets=papers.map(([h,sub,txt])=>{
    const s=el('article','sheet');if(h===papers[0][0] && sub==='Personal background'){s.insertAdjacentHTML('afterbegin',logo);s.classList.add('first-sheet');}
    if(s.classList.contains('first-sheet'))s.append(el('h3',undefined,h),el('p','sub',sub));else s.append(el('p','continuation',h));s.append(el('div','txt',txt||'No records available.'));s.onclick=e=>{if(!e.target.closest('button')&&!getSelection()?.toString())swap()};
    if(n>1){const b=el('button','swapbtn','( Click to swap paper to continue reading )');b.type='button';b.onclick=swap;s.append(b)}
    stack.append(s);return s});
  function layout(){sheets.forEach((s,i)=>{const p=(i-idx+n)%n;s.style.zIndex=n-p;s.style.transform=`translate(${p*10}px,${p*-6}px) rotate(${ROT[p]}deg)`;s.inert=p!==0})}
  async function swap(){if(busy||n<2)return;busy=true;const f=sheets[idx];try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){idx=(idx+1)%n;layout();return}const start=f.style.transform,away='translateX(85%) rotate(14deg)';const a=f.animate([{transform:start},{transform:away}],{duration:330,fill:'forwards',easing:'ease-in-out'});await a.finished;idx=(idx+1)%n;layout();a.cancel();await f.animate([{transform:away},{transform:f.style.transform}],{duration:330,easing:'ease-out'}).finished}finally{busy=false}}
  layout();main.append(stack);
  if(own){const pen=el('button','hist-pen');pen.type='button';pen.setAttribute('aria-label','Edit History');
    pen.append(el('span','pentip','Edit History'));
    pen.onclick=e=>{e.stopPropagation();if(!own)return;editing=true;draw()};
    side.append(pen)}
  
}
document.addEventListener('click',e=>{if(!e.target.closest('.hist-pen'))sec.querySelector('.hist-pen')?.classList.remove('glow')});
window.custiaHistoryRefresh=()=>{if(!editing)draw()};const prev=renderRecord;renderRecord=function(){prev();draw()};renderRecord();
})();

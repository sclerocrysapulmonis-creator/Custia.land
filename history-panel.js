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
// the old History button is replaced; Item / Gallery ribbons reuse the existing panels
const old=n=>[...document.querySelectorAll('.extrasnav button')][n];

function draw(){
  sec.replaceChildren();sec.hidden=!current;if(!current)return;
  const r=current,k=key(r),own=r.onlineOwner?!!r.onlineOwn:!!account&&r.owner===account,a=read()[k]||{};
  if(k!==last){last=k;idx=0;editing=false}
  const hist=a.history||r.onlineBio||'',crime=a.crime||'';
  const title=el('div','hist-title','HISTORY');title.setAttribute('aria-hidden','true');
  const main=el('div','hist-main'),side=el('div','hist-side');sec.append(title,main,side);
  const status=el('p','hist-status');status.setAttribute('role','status');

  if(editing){ /* ---------- page 2: edit ---------- */
    sec.classList.add('editing');
    const back=el('button','hist-back','←');back.type='button';back.setAttribute('aria-label',T('Back','ย้อนกลับ'));
    const page=el('div','hist-page'),mk=(l,v)=>{const lab=el('label',undefined,l),ta=el('textarea');ta.value=v;ta.maxLength=5000;lab.append(ta);page.append(lab);return ta};
    const h=mk('Character History',hist),c=mk('Criminal Records',crime);page.append(status);
    main.append(back,page);
    const save=()=>{try{const all=read();all[k]={...a,history:h.value,crime:c.value};localStorage.setItem(store,JSON.stringify(all));editing=false;draw()}catch{status.textContent=T('Storage full.','พื้นที่เต็ม')}};
    back.onclick=()=>{
      if(h.value===hist&&c.value===crime){editing=false;draw();return}
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
    const s=el('article','sheet');s.insertAdjacentHTML('afterbegin',logo);
    s.append(el('h3',undefined,h),el('p','sub',sub),el('div','txt',txt||'No records available.'));
    if(n>1){const b=el('button','swapbtn','( Click to swap paper to continue reading )');b.type='button';b.onclick=swap;s.append(b)}
    stack.append(s);return s});
  function layout(){sheets.forEach((s,i)=>{const p=(i-idx+n)%n;s.style.zIndex=n-p;s.style.transform=`translate(${p*10}px,${p*-6}px) rotate(${ROT[p]}deg)`;s.inert=p!==0})}
  function swap(){if(busy)return;busy=true;const f=sheets[idx];f.classList.add('out');
    setTimeout(()=>{f.classList.remove('out');idx=(idx+1)%n;busy=false;layout()},520)}
  layout();main.append(stack);
  if(own){const pen=el('button','hist-pen');pen.type='button';pen.setAttribute('aria-label','Edit History');
    pen.append(el('span','pentip','Edit History'));
    pen.onclick=e=>{e.stopPropagation();if(pen.classList.contains('glow')){editing=true;draw()}else pen.classList.add('glow')};
    side.append(pen)}
  for(const [label,i] of [['Item',1],['Gallery',2]]){const b=el('button','ribbon',label);b.type='button';b.onclick=()=>old(i)?.click();side.append(b)}
}
document.addEventListener('click',e=>{if(!e.target.closest('.hist-pen'))sec.querySelector('.hist-pen')?.classList.remove('glow')});
const prev=renderRecord;renderRecord=function(){prev();draw()};renderRecord();
})();

(()=>{
// V0.9.3.5 — scale full-body artwork to the stated height on the 0–220 cm ruler,
// and make sure the History / Item / Gallery bar can never stay hidden while a profile is open.
const subject=document.querySelector('#records .subject');const bar=document.querySelector('.i93tabs');
const MAX=220; // ruler top (cm). Taller characters are clamped to the ruler.
function scaleBody(){
  if(!subject)return;
  const h=parseFloat(current?.Height);const ok=Number.isFinite(h)&&h>0&&current?.kind!=='personnel';
  const img=subject.querySelector(':scope > .recordimage');
  const on=!!(ok&&img);
  subject.classList.toggle('scaled-body',on);
  if(on)subject.style.setProperty('--hpct',String(Math.min(1,h/MAX)));else subject.style.removeProperty('--hpct');
}
function keepBar(){if(bar&&current&&bar.hidden)bar.hidden=false}
const prev=renderRecord;
renderRecord=function(){prev();scaleBody();keepBar()};
renderRecord();
})();

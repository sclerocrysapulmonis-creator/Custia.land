(()=>{
const portrait=document.querySelector('#records .portrait'),subject=document.querySelector('#records .subject');
const number=document.createElement('div');number.className='capsule-number';portrait.append(number);
const scale=document.createElement('div');scale.className='height-scale';scale.setAttribute('aria-hidden','true');for(let n=220;n>=0;n-=20){const line=document.createElement('span');line.textContent=n+' cm';scale.append(line)}subject.prepend(scale);
const heading=document.createElement('span');heading.className='height-heading';subject.append(heading);
const prev=renderRecord;renderRecord=function(){prev();const staff=current?current.kind==='personnel':directoryKind==='personnel';subject.classList.toggle('no-height',staff);number.textContent='NO. '+(current?.id||'000');heading.textContent=staff?'':(document.documentElement.lang==='th'?'ส่วนสูง: ':'HEIGHT: ')+(current?.Height||'—');};
for(const id of ['prisonersTab','personnelTab'])document.getElementById(id).addEventListener('click',()=>{current=null;renderRecord()});renderRecord();
})();

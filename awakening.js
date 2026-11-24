(()=>{
const thai=()=>document.documentElement.lang==='th', t=(a,b)=>thai()?b:a;
const allowed=r=>!!r&&(r.kind==='personnel'||['Clairvoyant','Judge','Manager','Guard','Teacher','The 7'].includes(r.Role)|| (JSON.parse(localStorage.getItem('custia.bank.v071')||'{}')[r.uid||r.owner+'|'+r.id]||[]).some(h=>h.outcome==='new'||h.outcome==='original'));
const form=$('editform');['SKILLS','Skill2','Skill3','Skill4'].forEach((k,i)=>{form.elements[k].parentElement.firstChild.textContent='Skill '+(i+1)});
const oldEditor=openEditor;openEditor=function(r){oldEditor(r);const can=allowed(r)||(!r&&roleFor()!=='Prisoner');form.elements.ABILITIES.parentElement.hidden=!can;form.elements.ABILITIES.readOnly=!can};
const oldRender=renderRecord;renderRecord=function(){const can=allowed(current);if(!can&&tab==='ABILITIES')tab='SKILLS';oldRender();document.querySelector('[data-tab="ABILITIES"]').hidden=!can;if(tab==='SKILLS'){const host=$('tabcontent');host.replaceChildren();['SKILLS','Skill2','Skill3','Skill4'].forEach((k,i)=>{const e=document.createElement('div');e.className='skill-slot';const h=document.createElement('strong');h.textContent=t('SKILL ','สกิล ')+(i+1);const p=document.createElement('p');p.textContent=current?.[k]||'—';e.append(h,p);host.append(e)})}};
})();

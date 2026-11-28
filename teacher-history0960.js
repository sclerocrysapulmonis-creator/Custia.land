(()=>{
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const T=(en,th)=>document.documentElement.lang==='th'?th:en;
const asset='';let last='',opened=false,editing=false,audio=null;
function sound(){try{audio?.pause();audio=new Audio(asset+'lenspulse-foley-paper-handling-amp-page-turning-sfx-584919.mp3');audio.volume=.55;audio.play().catch(()=>{});const a=audio;setTimeout(()=>a.pause(),700)}catch{}}
window.custiaTeacherHistoryStop=()=>{audio?.pause()};
window.custiaTeacherHistory=(sec,r,a,own)=>{
 const k=r.uid||r.owner+'|'+r.id;if(k!==last){last=k;opened=false;editing=false}sec.classList.add('teacher-history0960');
 const stage=el('div','teacher-stage'),title=el('h2','teacher-title',T('PERSONNEL / HISTORY','บุคลากร / ประวัติ'));sec.append(title,stage);
 const scene=el('div','teacher-scene');stage.append(scene);const img=(file,cls)=>{const n=el('img',cls);n.src=new URL(file,document.baseURI).href;n.alt='';n.draggable=false;return n};
 const alias=r.alias||r.name||'Unknown';const hist=a.history??r.onlineBio??'';
 const closed=el('button','teacher-closed');closed.type='button';closed.setAttribute('aria-label',T('Open teacher folder','เปิดแฟ้มอาจารย์'));closed.append(img('teacher-back.png','teacher-back'),el('span','teacher-paper-back'),img('teacher-front.png','teacher-front'),el('span','teacher-name',alias));
 const open=el('div','teacher-open');open.append(img('teacher-open.png','teacher-open-art'));const paper=el('article','teacher-paper');paper.append(el('small','', 'CUSTIA / TEACHER'),el('h3','',alias),el('p','teacher-doc-label',T('Personal background','ประวัติส่วนตัว')));const body=el('div','teacher-doc-text',hist||T('No records available.','ยังไม่มีประวัติ'));paper.append(body);open.append(paper);scene.append(closed,open);
 const controls=el('div','teacher-controls');stage.append(controls);const toggle=el('button','', '');toggle.type='button';controls.append(toggle);const edit=el('button','',T('Edit History','แก้ไขประวัติ'));edit.type='button';if(own)controls.append(edit);
 function update(){scene.classList.toggle('is-open',opened);closed.inert=opened;open.inert=!opened;toggle.textContent=opened?T('Close folder','ปิดแฟ้ม'):T('Open folder','เปิดแฟ้ม');edit.hidden=!opened;toggle.setAttribute('aria-expanded',String(opened))}
 function flip(){if(editing)return;opened=!opened;sound();update()}closed.onclick=flip;toggle.onclick=flip;update();
 edit.onclick=()=>{if(!own||editing)return;editing=true;opened=true;update();const ta=el('textarea','teacher-doc-edit');ta.value=hist;ta.maxLength=5000;body.replaceWith(ta);edit.hidden=true;toggle.disabled=true;const save=el('button','',T('Save','บันทึก')),cancel=el('button','',T('Cancel','ยกเลิก')),status=el('p','teacher-status');status.setAttribute('role','status');controls.append(save,cancel,status);const finish=()=>{editing=false;window.custiaHistoryRefresh()};cancel.onclick=()=>{if(ta.value!==hist&&!confirm(T('Discard changes?','ยกเลิกการแก้ไขหรือไม่?')))return;finish()};save.onclick=async()=>{save.disabled=cancel.disabled=true;try{await window.custiaExtras.save(r,{...window.custiaExtras.read(r),history:ta.value});editing=false;if(current===r)window.custiaHistoryRefresh()}catch(e){status.textContent=e.message;save.disabled=cancel.disabled=false}};ta.focus()};
};
})();

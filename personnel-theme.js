import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const db=createClient('https://mtupbtlqbjtladkogjrq.supabase.co','sb_publishable_BuroUNv_POvAOMO4Gf2JsQ_3o6sPyCu');
export function applyRole(role){const theme={'Guard':'guard','Manager':'manager','Special Manager':'manager','Clairvoyant':'clairvoyant'}[role];if(theme)document.documentElement.dataset.personnel=theme;else delete document.documentElement.dataset.personnel;}
async function refresh(){const {data}=await db.auth.getSession();const u=data?.session?.user;if(!u||sessionStorage.getItem('custia-staff-'+u.id)!=='on'){applyRole(null);return}const r=await db.rpc('custia_staff_role');applyRole(r.error?null:r.data)}
window.addEventListener('custia-personnel',e=>applyRole(e.detail));window.addEventListener('pageshow',refresh);refresh();

db.auth.onAuthStateChange(()=>{setTimeout(refresh,0)});

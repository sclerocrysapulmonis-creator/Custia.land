import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const db=createClient('https://mtupbtlqbjtladkogjrq.supabase.co','sb_publishable_BuroUNv_POvAOMO4Gf2JsQ_3o6sPyCu');
const host=document.querySelector('header .accountlinks');
function draw(session){if(!host)return;host.replaceChildren();const a=document.createElement('a');a.href='portal.html';a.textContent=session?'ACCOUNT · ONLINE':'Log In';host.append(a);if(!session){const b=document.createElement('a');b.href='portal.html?signup=1';b.textContent='Sign Up';host.append(b)}}
const {data,error}=await db.auth.getSession();if(!error)draw(data.session);db.auth.onAuthStateChange((_event,session)=>draw(session));

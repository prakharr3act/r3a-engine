function openTab(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  toggleMenu(false);
}
function toggleTheme(){app.classList.toggle('light');}
function toggleMenu(force){
  if(force===false) sidebar.classList.remove('show');
  else sidebar.classList.toggle('show');
}
function hash(str){
  let h=0;for(let i=0;i<str.length;i++) h=(h<<5)-h+str.charCodeAt(i);
  return Math.abs(h).toString(36);
}
function mix(t,k){
  let s='';for(let i=0;i<t.length;i++) s+=String.fromCharCode(t.charCodeAt(i)+(k.charCodeAt(i%k.length)%17));
  return btoa(s);
}
function unmix(t,k){
  let r=atob(t),s='';for(let i=0;i<r.length;i++) s+=String.fromCharCode(r.charCodeAt(i)-(k.charCodeAt(i%k.length)%17));
  return s;
}
function encrypt(){
  if(!plain.value||!key.value) return alert('Missing input');
  let payload = mix(plain.value,key.value);
  let sum = hash(payload+key.value);
  encrypted.value = `R3A|v1|${sum}|${payload}`;
}
function decrypt(){
  try{
    if(!cipher.value.startsWith('R3A|')) throw 0;
    let [,v,sum,p] = cipher.value.split('|');
    if(v!=='v1'||hash(p+dkey.value)!==sum) throw 0;
    decrypted.value = unmix(p,dkey.value);
  }catch{
    alert('Invalid R3A data or key');
  }
}
function safeCopy(id){
  let el=document.getElementById(id);el.select();
  try{document.execCommand('copy');}catch{alert('Copy blocked');}
}
function downloadText(){
  let b=new Blob([encrypted.value],{type:'application/octet-stream'});
  let a=document.createElement('a');a.href=URL.createObjectURL(b);
  a.download='encrypted.r3a';a.click();
}
function checkStrength(v){
  strength.className='meter';
  if(v.length<6||/(.)\1{2,}/.test(v)) strength.classList.add('weak');
  else if(v.length<10) strength.classList.add('medium');
  else strength.classList.add('strong');
}

function updateTimer(){
  let t=new Date();
  let h=t.getHours().toString().padStart(2,'0');
  let m=t.getMinutes().toString().padStart(2,'0');
  let s=t.getSeconds().toString().padStart(2,'0');
  document.getElementById('footer-timer').textContent=`${h}:${m}:${s}`;
}
setInterval(updateTimer,1000); updateTimer();

window.addEventListener('load',()=>{
  document.getElementById('loader').style.opacity='0';
  setTimeout(()=>document.getElementById('loader').style.display='none',300);
});
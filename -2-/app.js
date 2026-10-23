/* Soligref — общая логика. База данных = localStorage браузера. */
const SALT='sg1:';
/* Админ — аккаунт soligrief@gmail.com (в коде только хэши почты и пароля) */
const ADMIN_E='51807623c66805dcb12a47581ebb74b51bf8a313695d02038d7aa76791ede5d7';
const ADMIN_MAIL='soligrief@gmail.com',ADMIN_H='c577592e3d627d57f7fecc8f80b0b798b12c884a4a5cb3fb05b40b8219050cb9';
const DB_KEY='soligref_users',SES_KEY='soligref_session',THK='soligref_theme';
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(SALT+s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const okImg=u=>/^(https?:\/\/|data:image\/)/i.test(u||'');
const db={
  all(){try{return JSON.parse(localStorage.getItem(DB_KEY))||[]}catch{return[]}},
  save(u){localStorage.setItem(DB_KEY,JSON.stringify(u))}
};
const session={
  get(){try{return JSON.parse(localStorage.getItem(SES_KEY))}catch{return null}},
  set(s){localStorage.setItem(SES_KEY,JSON.stringify(s))},
  clear(){localStorage.removeItem(SES_KEY)}
};
async function register(name,email,pass){
  email=email.trim().toLowerCase();
  if(name.trim().length<2)return'Введите имя';
  if(!/^\S+@\S+\.\S+$/.test(email))return'Проверьте адрес почты';
  if(pass.length<6)return'Пароль — минимум 6 символов';
  const u=db.all();
  if(u.some(x=>x.email===email))return'Эта почта уже зарегистрирована';
  const admin=(await sha(email))===ADMIN_E;
  u.push({name:name.trim(),email,hash:await sha(pass),date:new Date().toISOString()});
  db.save(u);session.set({name:name.trim(),email,admin});return null;
}
async function login(email,pass){
  email=email.trim().toLowerCase();
  const [he,hp]=[await sha(email),await sha(pass)];
  const u=db.all().find(x=>x.email===email&&x.hash===hp);
  if(!u)return{error:'Неверная почта или пароль'};
  const admin=he===ADMIN_E;
  session.set({name:u.name,email,admin});return{admin};
}
/* Готовый админ-аккаунт: создаётся при первом открытии сайта, регистрироваться не нужно */
(function(){try{const u=db.all(),k=u.findIndex(x=>x.email===ADMIN_MAIL);
  if(k<0)u.push({name:'Admin',email:ADMIN_MAIL,hash:ADMIN_H,date:new Date().toISOString()});
  else if(u[k].hash!==ADMIN_H)u[k].hash=ADMIN_H;else return;
  db.save(u)}catch{}})();
/* Старые админ-сессии (другая почта) больше не действуют */
(async()=>{const s=session.get();if(s&&s.admin&&await sha(s.email||'')!==ADMIN_E){session.clear();if(/admin\.html$/.test(location.pathname))location.replace('index.html')}})().catch(()=>{});

/* Тема: светлая / тёмная */
function theme(){return document.documentElement.dataset.theme==='dark'?'dark':'light'}
function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem(THK,t)}catch{}}

/* Окно «нужно зарегистрироваться» */
function gate(e){
  if(session.get())return true;
  if(e)e.preventDefault();
  let o=document.getElementById('gate');
  if(!o){
    o=document.createElement('div');o.id='gate';o.className='overlay';
    o.innerHTML='<div class="glass modal" role="dialog" aria-modal="true"><div class="dot" style="margin:0 auto 16px"></div><h3>Нужна регистрация</h3><p>Зарегистрируйтесь, чтобы пользоваться сайтом.</p><a class="btn" href="form.html">Зарегистрироваться</a> <button class="btn light" id="gx">Позже</button></div>';
    document.body.appendChild(o);
    o.onclick=ev=>{if(ev.target===o||ev.target.id==='gx')o.classList.remove('open')};
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape')o.classList.remove('open')});
  }
  o.classList.add('open');return false;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-gate]');if(t)gate(e)});

/* Меню: ссылки, переключатель темы, вход/выход */
document.addEventListener('DOMContentLoaded',()=>{
  const l=document.querySelector('nav .links');if(!l)return;
  const s=session.get();
  const a=l.querySelector('a[href="sostav.html"]');
  if(a&&!l.querySelector('a[href="shop.html"]'))a.insertAdjacentHTML('afterend','<a href="shop.html">Магазин</a><a href="report.html">Жалоба</a><a href="support.html">Обращения</a>');
  if(s&&s.admin)l.insertAdjacentHTML('beforeend','<a href="admin.html">Админ</a>');
  l.insertAdjacentHTML('beforeend','<button type="button" class="themebtn" id="tg"></button>');
  const tg=document.getElementById('tg');
  const paint=()=>{const d=theme()==='dark';tg.textContent=d?'☀️':'🌙';const t=d?'Светлая тема':'Тёмная тема';tg.title=t;tg.setAttribute('aria-label',t)};
  tg.onclick=()=>{const next=theme()==='dark'?'light':'dark',go=()=>{setTheme(next);paint()},R=document.documentElement;
    if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
      const r=tg.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      document.startViewTransition(go).ready.then(()=>R.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:650,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
    }else{R.classList.add('tt');go();setTimeout(()=>R.classList.remove('tt'),600)}};paint();
  if(s){
    l.insertAdjacentHTML('beforeend','<a href="#" class="btn sm" id="out">Выйти</a>');
    document.getElementById('out').onclick=e=>{e.preventDefault();session.clear();location.href='index.html'};
  }else l.insertAdjacentHTML('beforeend','<a href="form.html" class="btn sm">Регистрация</a>');
});

/* Жалобы на игроков */
const CK='soligref_complaints';
const complaints={
  all(){try{return JSON.parse(localStorage.getItem(CK))||[]}catch{return[]}},
  save(c){localStorage.setItem(CK,JSON.stringify(c))}
};

/* Обращения: жалоба на админа, баги, заявка на модератора */
const RK='soligref_requests',TSK='soligref_support';
const requests={
  all(){try{return JSON.parse(localStorage.getItem(RK))||[]}catch{return[]}},
  save(c){localStorage.setItem(RK,JSON.stringify(c))}
};
const SUP_DEF={testTypes:['Тест на знание правил','Ситуационный тест','Устное собеседование']};
const support={
  get(){try{return{...SUP_DEF,...JSON.parse(localStorage.getItem(TSK))}}catch{return{...SUP_DEF}}},
  save(s){localStorage.setItem(TSK,JSON.stringify(s))}
};

/* Настройки сайта (управляются из админки) */
const SK='soligref_site';
const SITE_DEF={name:'Soligref',logo:'logo.jpg',accent:'#c08a6a',ip:'mc.soligrief.pw',
heroTitle:'SoliGrief — Minecraft-сервер',
heroText:'SoliGrief — сервер для тех, кто любит играть спокойно и честно. Заходите по IP, играйте с друзьями, поддерживайте проект в магазине и сообщайте о нарушителях: администрация рассматривает каждую жалобу.',
homeCards:[{t:'Играйте с друзьями',p:'Заходите на сервер вместе, стройте, исследуйте и общайтесь в чате.'},{t:'Магазин донатов',p:'Привилегии и внутриигровая валюта. Товар приходит на сервер после оплаты.'},{t:'Честная игра',p:'Читеры и нарушители наказываются. Увидели нарушение — подайте жалобу со скриншотом.'},{t:'Поддержка',p:'Баги, вопросы и заявки в модераторы можно отправить прямо на сайте.'}],
sostavTitle:'Состав',sostavSub:'Из чего состоит Soligref',
sostavCards:[{t:'Ядро',p:'Главная страница с анимированной 3D-моделью.'},{t:'Регистрация',p:'Аккаунты с защищённым хранением паролей.'},{t:'Админ-панель',p:'Управление пользователями. Доступна только администратору.'},{t:'База данных',p:'Хранение аккаунтов и хэшей паролей.'}]};
const site={
  get(){try{return{...SITE_DEF,...JSON.parse(localStorage.getItem(SK))}}catch{return{...SITE_DEF}}},
  save(s){localStorage.setItem(SK,JSON.stringify(s))}
};
function renderCards(id,list,label){
  const c=document.getElementById(id);if(!c)return;c.textContent='';
  list.forEach(x=>{const d=document.createElement('div');d.className='glass card';
    d.innerHTML='<div class="dot"></div><h3></h3><p></p><button class="btn sm" data-gate></button>';
    d.children[1].textContent=x.t;d.children[2].textContent=x.p;if(label)d.children[3].textContent=label;else{d.children[3].remove();d.children[2].style.marginBottom='0'}c.appendChild(d)});
}
function applySite(){
  const s=site.get();
  document.documentElement.style.setProperty('--cu',s.accent);
  document.querySelectorAll('nav .brand img,.model img,.logo-s').forEach(i=>i.src=s.logo);
  document.querySelectorAll('nav .brand span').forEach(e=>e.textContent=s.name);
  const ic=document.querySelector('link[rel=icon]');if(ic)ic.href=s.logo;
  document.title=document.title.replace('Soligref',s.name);
  document.querySelectorAll('[data-site]').forEach(e=>{const v=s[e.dataset.site];if(v!==undefined)e.textContent=v});
  renderCards('home-cards',s.homeCards,'');
  renderCards('sostav-cards',s.sostavCards,'Подробнее');
}
document.addEventListener('DOMContentLoaded',applySite);
function shrinkImg(f,max,q){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=no;r.onload=()=>{const i=new Image();i.onerror=no;i.onload=()=>{const k=Math.min(1,max/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',q))};i.src=r.result};r.readAsDataURL(f)})}

/* Магазин донатов */
const SHK='soligref_shop',ORK='soligref_orders';
const SHOP_DEF={pluginUrl:'',currency:'₽',apiUrl:'',apiKey:'',coupons:[],products:[
{id:1,name:'VIP',desc:'Префикс в чате, набор ресурсов и приватный регион.',price:199,discount:0,img:''},
{id:2,name:'Premium',desc:'Всё из VIP, дополнительные команды и ежедневный набор.',price:499,discount:0,img:''},
{id:3,name:'1000 монет',desc:'Игровая валюта сервера для покупок во внутриигровом магазине.',price:99,discount:0,img:''}]};
const shop={
  get(){try{return{...SHOP_DEF,...JSON.parse(localStorage.getItem(SHK))}}catch{return{...SHOP_DEF}}},
  save(s){localStorage.setItem(SHK,JSON.stringify(s))}
};
const orders={
  all(){try{return JSON.parse(localStorage.getItem(ORK))||[]}catch{return[]}},
  save(o){localStorage.setItem(ORK,JSON.stringify(o))}
};
/* Цена со скидкой на товар и купоном */
function priceOf(p){const d=Math.min(100,Math.max(0,Number(p.discount)||0));return Math.max(0,Math.round((Number(p.price)||0)*(1-d/100)))}
function findCoupon(code){code=(code||'').trim().toUpperCase();if(!code)return null;
  return(shop.get().coupons||[]).find(c=>c.active&&String(c.code).toUpperCase()===code&&(!c.max||(c.used||0)<c.max))||null}
function applyCoupon(price,c){return c?Math.max(0,Math.round(price*(1-c.percent/100))):price}

/* Работа без интернета: кэш страниц и шрифтов */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('sw.js').catch(()=>{});

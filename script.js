const categories = {all:'All gear',consoles:'Consoles',controllers:'Controllers',games:'Games',accessories:'Accessories',laptop:'Laptops',monitor:'Monitors',gpu:'Graphics cards'};
let category='all';
let favorites=[];
try { favorites=JSON.parse(localStorage.getItem('alpha-favorites')||'[]'); if(!Array.isArray(favorites))favorites=[]; } catch {}
const params=new URLSearchParams(location.search);
let favoritesOnly=params.has('favorites');
const search=document.querySelector('.search-box input');
search.value=params.get('q')||'';
const grid=document.querySelector('.listings');
const categoryBar=document.querySelector('.categories');
Object.entries(categories).forEach(([value,label])=>{const button=document.createElement('button');button.textContent=label;button.dataset.category=value;button.onclick=()=>{category=value;render();};categoryBar.append(button);});
function render(){
 const query=search.value.trim().toLowerCase();
 let shown=products.filter(p=>(category==='all'||p.category===category)&&(!favoritesOnly||favorites.includes(p.href))&&(p.name+' '+p.description+' '+categories[p.category]).toLowerCase().includes(query));
 const sort=document.querySelector('#sort').value;
 const price=p=>Number(p.price.replace(/[^0-9]/g,''));
 if(sort!=='featured')shown.sort((a,b)=>sort==='low'?price(a)-price(b):price(b)-price(a));
 grid.replaceChildren();
 shown.forEach(p=>{
 const card=document.createElement('article');card.className='product-card';
 card.innerHTML=`<div class="product-visual"><a href="${p.href}"><img src="${p.image}" alt="${p.name.replaceAll('"','&quot;')}"></a><span class="product-category">${categories[p.category]}</span><button class="favorite" aria-label="Save ${p.name.replaceAll('"','&quot;')}" aria-pressed="${favorites.includes(p.href)}">${favorites.includes(p.href)?'♥':'♡'}</button></div><div class="product-info"><h3><a href="${p.href}">${p.name}</a></h3><p>${p.description}</p><div class="product-bottom"><strong>${p.price}</strong><a href="${p.href}" aria-label="View ${p.name.replaceAll('"','&quot;')}">↗</a></div></div>`;
 card.querySelector('.favorite').onclick=()=>{favorites=favorites.includes(p.href)?favorites.filter(x=>x!==p.href):[...favorites,p.href];try{localStorage.setItem('alpha-favorites',JSON.stringify(favorites));}catch{}render();};grid.append(card);
 });
 categoryBar.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.category===category);b.setAttribute('aria-pressed',String(b.dataset.category===category));});
 document.querySelector('#result-count').textContent=`${shown.length} products${favoritesOnly?' in your favourites':''}`;
 document.querySelector('.empty-state').hidden=shown.length>0;
 document.querySelector('#clear-favorites').hidden=!favoritesOnly;
}
search.addEventListener('input',render);
document.querySelector('.search-box').addEventListener('submit',event=>{event.preventDefault();render();document.querySelector('#shop').scrollIntoView();});
document.querySelector('#sort').onchange=render;
document.querySelector('#clear-favorites').onclick=()=>{favoritesOnly=false;render();};
render();

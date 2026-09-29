const sb = (window.SUPABASE_URL && !window.SUPABASE_URL.includes("YOUR_"))
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

const fallbackProducts = [
  {id:"p1",name:"SADEE SOLUTIONS — App & Website Package",category:"Development",price:1000,price_note:"Inbox for final price",image:"assets/sadee-solutions.jpg",description:"A custom app and website development package for digital businesses. Contact SADEE for your exact requirements and package price.",features:["Custom mobile applications","Custom websites","Cloud solutions","API integration","Digital innovation"],featured:true,active:true},
  {id:"p2",name:"SADEE SENSITIVE PRO",category:"Gaming",price:1000,price_note:"Lifetime",image:"assets/sadee-sensitive-pro.png",description:"A Free Fire sensitivity tool designed to help you create and sell your own sensitivity profiles. Choose your device and tune your setup to your preferred play style.",features:["Free Fire sensitivity profiles","Device-based setup","Custom presets","Lifetime access"],featured:true,active:true},
  {id:"p3",name:"SADEE X DIMA OPTIMIZER",category:"Gaming",price:500,price_note:"7 day key • 1 month Rs.1000 • Lifetime Rs.2200",image:"assets/sadee-x-dima-optimizer.png",description:"SADEE X DIMA OPTIMIZER for Android / iOS optimization workflows, device information, game-center tools, RAM/storage utilities and activation-key access.",features:["7 day key — Rs.500","1 month — Rs.1000","Lifetime — Rs.2200","Device information","RAM / storage tools","Game optimization tools"],featured:true,active:true}
];

let products = fallbackProducts.slice();

function money(p){
  if (p.price_note && p.price_note.toLowerCase().includes("inbox")) return "Rs. " + Number(p.price||0).toLocaleString() + "+";
  return "Rs. " + Number(p.price||0).toLocaleString();
}
function waOrder(p){
  const msg = `Hello SADEE SOLUTIONS 👋%0A%0AI want to order:%0A*${encodeURIComponent(p.name)}*%0APrice: ${encodeURIComponent(money(p))}%0A%0APlease send me the payment/order details.`;
  window.open(`https://wa.me/${window.WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}
function render(){
  const q=document.querySelector("#search").value.toLowerCase().trim();
  const cat=document.querySelector("#category").value;
  const list=products.filter(p=>p.active!==false && (!q || (p.name+" "+p.description+" "+p.category).toLowerCase().includes(q)) && (!cat||p.category===cat));
  const el=document.querySelector("#products");
  document.querySelector("#status").textContent = `${list.length} product${list.length===1?"":"s"} available`;
  if(!list.length){el.innerHTML='<div class="empty">No products found.</div>';return}
  el.innerHTML=list.map(p=>`
    <article class="card">
      <div class="card-img"><img src="${p.image}" alt="${esc(p.name)}">${p.featured?'<span class="badge">FEATURED</span>':''}</div>
      <div class="card-body">
        <span class="eyebrow">${esc(p.category||"Digital Product")}</span>
        <h3>${esc(p.name)}</h3>
        <div class="desc">${esc(p.description||"Premium digital product from SADEE SOLUTIONS.")}</div>
        <div class="price">${money(p)} <small>${esc(p.price_note||"")}</small></div>
        <button class="btn primary" onclick="openDetail('${p.id}')">View & Buy</button>
      </div>
    </article>`).join("");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
window.openDetail=(id)=>{
  const p=products.find(x=>x.id===id); if(!p)return;
  const features=(p.features||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  document.querySelector("#detail").innerHTML=`<div class="detail-grid">
    <div><img src="${p.image}" alt="${esc(p.name)}"></div>
    <div><span class="status-pill">${p.active!==false?"AVAILABLE":"UNAVAILABLE"}</span><h2>${esc(p.name)}</h2>
    <div class="price">${money(p)} <small>${esc(p.price_note||"")}</small></div>
    <p>${esc(p.description||"")}</p><ul class="feature-list">${features}</ul>
    <button class="btn primary" style="width:100%" onclick='waOrder(${JSON.stringify(p)})'>BUY NOW — WHATSAPP</button>
    </div></div>`;
  document.querySelector("#drawer").classList.add("show");
};
document.querySelector("#closeDrawer").onclick=()=>document.querySelector("#drawer").classList.remove("show");
document.querySelector("#drawer").addEventListener("click",e=>{if(e.target.id==="drawer")e.currentTarget.classList.remove("show")});
document.querySelector("#search").oninput=render;
document.querySelector("#category").onchange=render;

async function loadProducts(){
  if(!sb){render();return}
  const {data,error}=await sb.from("products").select("*").order("created_at",{ascending:false});
  if(!error && data && data.length){
    products=data;
    const cats=[...new Set(data.map(x=>x.category).filter(Boolean))];
    document.querySelector("#category").innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join("");
  }
  render();
}
loadProducts();

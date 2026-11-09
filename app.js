"use strict";
const products = [
 {id:"urban",category:"Городской",filter:"city",name:"VELOX URBAN 01",material:"Алюминий",gears:7,wheels:28,weight:"12,4",price:189000,image:"urban"},
 {id:"trail",category:"Горный",filter:"mountain",name:"VELOX TRAIL 02",material:"Алюминий",gears:21,wheels:29,weight:"14,2",price:279000,image:"trail"},
 {id:"speed",category:"Шоссейный",filter:"road",name:"VELOX SPEED 03",material:"Карбон",gears:22,wheels:28,weight:"8,6",price:459000,image:"speed"}
];
const $ = s => document.querySelector(s);
const gearsText = n => n === 21 ? "21 скорость" : n === 22 ? "22 скорости" : n + " скоростей";
const money = n => new Intl.NumberFormat("ru-RU").format(n) + " ₸";
const grid = $("#product-grid");
grid.innerHTML = products.map(p => `<article class="product-card" data-category="${p.filter}"><button class="product-image" data-product="${p.id}" aria-label="Открыть характеристики ${p.name}"><img src="${p.image}.png" alt="${p.category} велосипед ${p.name}" width="1152" height="928" loading="lazy"></button><div class="product-info"><p class="category">${p.category}</p><button class="product-name" data-product="${p.id}">${p.name}</button><p class="product-specs">${p.material} · ${gearsText(p.gears)}<br>Рама M · Колёса ${p.wheels}″ · ${p.weight} кг</p><p class="availability">● В наличии</p><strong class="price">${money(p.price)}</strong><button class="button" data-product="${p.id}">Характеристики →</button></div></article>`).join("");
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
 document.querySelectorAll("[data-filter]").forEach(b => {const active=b===button;b.classList.toggle("active",active);b.setAttribute("aria-pressed",active);});
 let count=0;document.querySelectorAll(".product-card").forEach(card=>{card.hidden=button.dataset.filter!=="all"&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
 $("#filter-status").textContent = "Показано моделей: "+count;
}));
const dialog=$("#product-dialog");let currentProduct=null,pendingSize="M",committedSize="",topic="selection",returnFocus=null;
function openProduct(id,trigger){
 currentProduct=products.find(p=>p.id===id);pendingSize=$("#chosen-model").value===id&&committedSize?committedSize:"M";returnFocus=trigger;
 const p=currentProduct;$("#dialog-title").innerHTML=p.name.replace("VELOX ","VELOX<br>");$("#dialog-category").textContent=p.category+" велосипед";
 $("#dialog-image").src=""+p.image+".png";$("#dialog-image").alt=p.name;
 $("#dialog-specs").innerHTML=p.material+" · "+gearsText(p.gears)+"<br>Колёса "+p.wheels+"″ · Вес "+p.weight+" кг";
 $("#dialog-price").textContent=money(p.price);
 $(".sizes").innerHTML=["S","M","L","XL"].map(size=>`<button type="button" data-size="${size}" aria-pressed="${size===pendingSize}">${size}</button>`).join("");
 dialog.showModal();document.body.classList.add("modal-open");$(".dialog-close").focus();
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-product]");if(b)openProduct(b.dataset.product,b);const size=e.target.closest("[data-size]");if(size){pendingSize=size.dataset.size;$(".sizes").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b===size));}});
$(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener("close",()=>{document.body.classList.remove("modal-open");returnFocus?.focus({preventScroll:true});});
dialog.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const nodes=[...dialog.querySelectorAll("button,select,input,a[href]")].filter(n=>!n.disabled);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
const form=$("#lead-form");
function clearFeedback(){document.querySelectorAll(".field-error").forEach(n=>n.textContent="");form.querySelectorAll("[aria-invalid]").forEach(n=>n.removeAttribute("aria-invalid"));$("#form-status").textContent="";$("#form-status").className="";}
function updateContext(){
 const model=$("#chosen-model").value;
 $("#chosen-size").textContent=committedSize||"Уточним при подборе";
 $("#chosen-topic").textContent=topic==="delivery"?"Условия доставки":model?"Обсуждение модели":"Консультация по подбору";
 const heading=topic==="delivery"?"УТОЧНИМ УСЛОВИЯ<br>ДОСТАВКИ":model?"ОБСУДИМ<br>ВЫБРАННУЮ МОДЕЛЬ":"ПОДБЕРЁМ МОДЕЛЬ<br>ДЛЯ ТВОИХ ПОЕЗДОК";
 $("#contact-title").innerHTML=heading;
 $("#contact-copy").textContent=topic==="delivery"?"Укажи город и телефон. Обсудим способ получения, стоимость и срок перед оформлением заказа.":model?"Оставь контакты. Уточним размер рамы и комплектацию, ответим на вопросы о модели.":"Заполни форму. Мы позвоним, уточним рост и бюджет и предложим варианты под твои дороги.";
}
function scrollContact(){clearFeedback();updateContext();$("#contact").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
$("#discuss-model").addEventListener("click",()=>{$("#chosen-model").value=currentProduct.id;committedSize=pendingSize;topic="model";dialog.close();scrollContact();$("#chosen-model").focus({preventScroll:true});});
document.querySelectorAll("[data-consult]").forEach(b=>b.addEventListener("click",()=>{$("#chosen-model").value="";committedSize="";topic="selection";scrollContact();$("#name").focus({preventScroll:true});}));
$("#delivery-cta").addEventListener("click",()=>{topic="delivery";scrollContact();$("#city").focus({preventScroll:true});});
$("#chosen-model").addEventListener("change",()=>{committedSize="";if(topic!=="delivery")topic=$("#chosen-model").value?"model":"selection";clearFeedback();updateContext();});
$("#city").addEventListener("change",()=>{$("#other-city-label").hidden=$("#city").value!=="other";});
document.querySelectorAll(".faq-list details").forEach(item=>item.addEventListener("toggle",()=>{if(item.open)document.querySelectorAll(".faq-list details").forEach(other=>{if(other!==item)other.open=false;});}));
form.addEventListener("input",e=>{const error=$("#"+e.target.id+"-error");if(error){error.textContent="";e.target.removeAttribute("aria-invalid");}if($("#form-status").classList.contains("success")){$("#form-status").textContent="";$("#form-status").className="";}});
$("#phone").addEventListener("blur",e=>{const digits=normalizePhone(e.target.value);if(/^7\d{10}$/.test(digits))e.target.value="+7 ("+digits.slice(1,4)+") "+digits.slice(4,7)+"-"+digits.slice(7,9)+"-"+digits.slice(9);});
function normalizePhone(value){let d=value.replace(/\D/g,"");if(d.length===11&&d[0]==="8")d="7"+d.slice(1);return d;}
form.addEventListener("submit",async e=>{
 e.preventDefault();clearFeedback();const errors=[];
 const invalid=(id,message)=>{$("#"+id+"-error").textContent=message;$("#"+id).setAttribute("aria-invalid","true");errors.push(id);};
 if(!$("#name").value.trim())invalid("name","Укажи имя");
 if(!/^7\d{10}$/.test(normalizePhone($("#phone").value)))invalid("phone","Нужны +7 и 10 цифр номера");
 if(!$("#consent").checked)invalid("consent","Подтверди согласие на обработку данных");
 if(errors.length){$("#form-status").textContent="Проверь отмеченные поля";$("#form-status").className="error";$("#"+errors[0]).focus();return;}
 const submit=$(".submit");submit.disabled=true;submit.textContent="Проверяем данные…";
 await new Promise(resolve=>setTimeout(resolve,600));
 submit.disabled=false;submit.textContent="Проверить заявку ещё раз ↗";
 $("#form-status").className="success";$("#form-status").textContent="Демонстрация пройдена — форма заполнена правильно. Заявка не отправлена: это учебный сайт.";$("#form-status").focus();
});
if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>{el.classList.add("ready");observer.observe(el);});}




import {parseAmount,convert} from './conversion.js';
const $=id=>document.getElementById(id);
const names={USD:'Доллар США',EUR:'Евро',RUB:'Рубль',GBP:'Фунт',CNY:'Юань',JPY:'Иена',CHF:'Франк',TRY:'Лира',KZT:'Тенге',AED:'Дирхам'};
for(const id of ['from','to'])for(const [code,name] of Object.entries(names))$(id).add(new Option(`${code} · ${name}`,code));
$('from').value='USD';$('to').value='RUB';
let rates=null,manual=null,updated='';
const fmt=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(n);
function render(){
 try{
  const amount=parseAmount($('amount').value),from=$('from').value,to=$('to').value;
  if(!rates&&manual===null&&from!==to){$('result').textContent='—';$('rate').textContent='Курс пока недоступен';return;}
  const rate=from===to?1:manual??convert(1,from,to,rates);
  $('result').textContent=`${fmt(amount*rate)} ${to}`;
  $('rate').textContent=`1 ${from} = ${new Intl.NumberFormat('ru-RU',{maximumFractionDigits:6}).format(rate)} ${to}`;
  $('status').textContent=manual!==null?'Используется введённый вами курс.':rates?`Данные от ${updated}. Банк может использовать другой курс.`:'Одинаковые валюты: курс 1 к 1.';
 }catch(e){$('result').textContent='—';$('rate').textContent='Проверьте сумму';$('status').textContent=e.message;}
}
async function load(){
 $('refresh').disabled=true;$('status').textContent='Загружаем свежие курсы…';
 try{
  const response=await fetch('https://open.er-api.com/v6/latest/USD',{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error();
  const data=await response.json();
  if(data.result!=='success'||data.base_code!=='USD'||!data.rates||Object.keys(names).some(c=>!Number.isFinite(data.rates[c])||data.rates[c]<=0)||!Number.isFinite(data.time_last_update_unix))throw new Error();
  rates=data.rates;manual=null;updated=new Date(data.time_last_update_unix*1000).toLocaleDateString('ru-RU');render();
 }catch{
  render();$('status').textContent=rates?`Не удалось обновить курсы. Показаны данные от ${updated}.`:'Источник курсов недоступен. Попробуйте ещё раз или введите курс вручную.';
 }finally{$('refresh').disabled=false;}
}
$('amount').addEventListener('input',render);
for(const id of ['from','to'])$(id).addEventListener('change',()=>{manual=null;$('manual').value='';render();});
$('swap').addEventListener('click',()=>{const previous=$('from').value;$('from').value=$('to').value;$('to').value=previous;if(manual!==null)manual=1/manual;$('manual').value='';render();});
$('apply').addEventListener('click',()=>{try{const value=parseAmount($('manual').value);if(value<=0)throw new Error('Курс должен быть больше нуля.');manual=value;render();}catch(e){$('status').textContent=e.message;}});
$('refresh').addEventListener('click',load);load();

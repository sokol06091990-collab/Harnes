export function parseAmount(value){
  const normalized=String(value).trim().replace(',','.');
  if(!/^\d+(\.\d+)?$/.test(normalized))throw new Error('Введите сумму числом, например 100 или 100,50.');
  const number=Number(normalized);
  if(!Number.isFinite(number)||number>1e12)throw new Error('Введите сумму не больше 1 триллиона.');
  return number;
}
export function convert(amount,from,to,rates){
  if(from===to)return amount;
  if(!(rates[from]>0)||!(rates[to]>0))throw new Error('Курс этой валюты недоступен.');
  return amount/rates[from]*rates[to];
}

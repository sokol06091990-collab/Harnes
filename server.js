import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':['index.html','text/html; charset=utf-8'], '/app.js':['app.js','text/javascript; charset=utf-8'], '/style.css':['style.css','text/css; charset=utf-8'], '/conversion.js':['conversion.js','text/javascript; charset=utf-8']};
http.createServer(async(req,res)=>{
  const file=files[new URL(req.url,'http://localhost').pathname];
  if(!file){res.writeHead(404);res.end('Not found');return;}
  try{const body=await readFile(new URL('./public/'+file[0],import.meta.url));res.writeHead(200,{'Content-Type':file[1],'X-Content-Type-Options':'nosniff'});res.end(body);}
  catch{res.writeHead(500);res.end('Server error');}
}).listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('Currency converter started on port '+(process.env.PORT || 3000)));

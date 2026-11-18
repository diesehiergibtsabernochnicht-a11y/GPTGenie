export type StrokePoint={x:number;y:number;pressure:number;time:number;tiltX:number;tiltY:number};
export type InkStroke={id:string;tool:'pen'|'marker'|'pencil'|'fountain'|'brush';color:string;width:number;opacity:number;points:StrokePoint[]};
export type Glyph={id:string;char:string;dataUrl:string;strokes:InkStroke[];baselineY?:number;createdAt:number};
export type Doc={id:string;title:string;text:string;updatedAt:number;settings?:Record<string,unknown>;edits?:InkStroke[][]};
export type Preset={id:string;name:string;settings:Record<string,unknown>};
export type FastScanState={queue:string[];index:number;script:string};
export type Workspace={schema:'gptgenie-workspace';version:3;exportedAt:string;settings:Record<string,unknown>;glyphs:Glyph[];documents:Doc[];presets:Preset[];fastScan:FastScanState|null;integrity:{algorithm:'SHA-256';digest:string}};
const DB='gptgenie-local',STORE='records';let dbPromise:Promise<IDBDatabase>|null=null;
function db():Promise<IDBDatabase>{
 if(!dbPromise){
  dbPromise=new Promise((resolve,reject)=>{
   const request=indexedDB.open(DB,3);
   request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE)};
   request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();dbPromise=null};resolve(request.result)};
   request.onerror=()=>reject(request.error);
   request.onblocked=()=>reject(new Error('GPTGenie storage upgrade is blocked by another open tab.'));
  });
  dbPromise.catch(()=>{dbPromise=null});
 }
 return dbPromise;
}
function done(tx:IDBTransaction):Promise<void>{
 return new Promise((resolve,reject)=>{
  tx.oncomplete=()=>resolve();
  tx.onerror=()=>reject(tx.error??new Error('IndexedDB transaction failed.'));
  tx.onabort=()=>reject(tx.error??new Error('IndexedDB transaction was aborted.'));
 });
}
export async function get<T>(key:string):Promise<T|undefined>{
 const d=await db();
 return new Promise((resolve,reject)=>{
  const tx=d.transaction(STORE,'readonly'),request=tx.objectStore(STORE).get(key);let value:T|undefined;
  request.onsuccess=()=>{value=request.result as T|undefined};
  request.onerror=()=>reject(request.error);
  tx.oncomplete=()=>resolve(value);
  tx.onerror=()=>reject(tx.error??new Error('IndexedDB read failed.'));
  tx.onabort=()=>reject(tx.error??new Error('IndexedDB read was aborted.'));
 });
}
export async function put(key:string,value:unknown):Promise<void>{
 const d=await db(),tx=d.transaction(STORE,'readwrite');
 tx.objectStore(STORE).put(value,key);
 await done(tx);
}
export async function remove(key:string):Promise<void>{
 const d=await db(),tx=d.transaction(STORE,'readwrite');
 tx.objectStore(STORE).delete(key);
 await done(tx);
}
export async function all<T>(key:string):Promise<T[]>{return(await get<T[]>(key))??[]}
function isRecord(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null&&!Array.isArray(value)}
function isFiniteNumber(value:unknown):value is number{return typeof value==='number'&&Number.isFinite(value)}
function validateStroke(stroke:unknown):stroke is InkStroke{
 return isRecord(stroke)&&typeof stroke.id==='string'&&['pen','marker','pencil','fountain','brush'].includes(String(stroke.tool))&&typeof stroke.color==='string'&&isFiniteNumber(stroke.width)&&stroke.width>0&&isFiniteNumber(stroke.opacity)&&Array.isArray(stroke.points)&&stroke.points.every(point=>isRecord(point)&&['x','y','pressure','time','tiltX','tiltY'].every(k=>isFiniteNumber(point[k])));
}
function validateGlyph(value:unknown):value is Glyph{
 if(!isRecord(value)||typeof value.id!=='string'||typeof value.char!=='string'||!value.char||typeof value.dataUrl!=='string'||!isFiniteNumber(value.createdAt)||!Array.isArray(value.strokes))return false;
 if(value.baselineY!==undefined&&!isFiniteNumber(value.baselineY))return false;
 return value.strokes.every(validateStroke);
}
function validatePreset(value:unknown):value is Preset{return isRecord(value)&&typeof value.id==='string'&&typeof value.name==='string'&&isRecord(value.settings)}
async function sha256(value:string):Promise<string>{
 const bytes=new TextEncoder().encode(value),digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function exportWorkspace():Promise<Workspace>{
 const d=await db(),tx=d.transaction(STORE,'readonly'),store=tx.objectStore(STORE);
 const read=<T>(key:string)=>new Promise<T|undefined>((resolve,reject)=>{const request=store.get(key);request.onsuccess=()=>resolve(request.result as T|undefined);request.onerror=()=>reject(request.error)});
 const completed=done(tx);
 const [settings,glyphs,documents,presets,fastScan]=await Promise.all([
  read<Record<string,unknown>>('settings'),read<Glyph[]>('glyphs'),read<Doc[]>('documents'),read<Preset[]>('presets'),read<FastScanState|null>('fastScan')
 ]);
 await completed;
 const body={schema:'gptgenie-workspace' as const,version:3 as const,exportedAt:new Date().toISOString(),settings:settings??{},glyphs:glyphs??[],documents:documents??[],presets:presets??[],fastScan:fastScan??null};
 return {...body,integrity:{algorithm:'SHA-256',digest:await sha256(JSON.stringify(body))}};
}
export async function importWorkspace(input:unknown):Promise<void>{
 if(!isRecord(input)||input.schema!=='gptgenie-workspace'||![1,2,3].includes(Number(input.version)))throw new Error('This is not a supported GPTGenie backup.');
 const presets=input.presets??[],scan=input.fastScan??null;
 if(scan!==null&&(!isRecord(scan)||!Array.isArray(scan.queue)||scan.queue.length===0||!scan.queue.every(x=>typeof x==='string')||!Number.isInteger(scan.index)||!isFiniteNumber(scan.index)||scan.index<0||scan.index>=scan.queue.length||typeof scan.script!=='string'))throw new Error('The backup contains an invalid Fast Scan checkpoint.');
 if(!Array.isArray(input.glyphs)||!input.glyphs.every(validateGlyph)||!Array.isArray(input.documents)||!input.documents.every(validateDoc)||!Array.isArray(presets)||!presets.every(validatePreset)||!isRecord(input.settings??{}))throw new Error('The backup contains invalid or incomplete workspace data.');
 if(input.version===3){
  if(!isRecord(input.integrity)||input.integrity.algorithm!=='SHA-256'||typeof input.integrity.digest!=='string')throw new Error('The backup is missing its integrity checksum.');
  const {integrity,...body}=input;
  const actual=await sha256(JSON.stringify(body));
  if(actual!==input.integrity.digest)throw new Error('Backup integrity check failed. No data was restored.');
 }
 const d=await db(),tx=d.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);
 store.put(input.settings??{},'settings');
 store.put(input.glyphs,'glyphs');
 store.put(input.documents,'documents');
 store.put(presets,'presets');
 store.put(scan,'fastScan');
 await done(tx);
}

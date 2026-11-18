export type StrokePoint={x:number;y:number;pressure:number;time:number;tiltX:number;tiltY:number};
export type InkStroke={id:string;tool:'pen'|'marker'|'pencil'|'fountain'|'brush';color:string;width:number;opacity:number;points:StrokePoint[]};
export type Glyph={id:string;char:string;dataUrl:string;strokes:InkStroke[];createdAt:number};
export type Doc={id:string;title:string;text:string;updatedAt:number;settings?:Record<string,unknown>};
export type Workspace={schema:'gptgenie-workspace';version:2;exportedAt:string;settings:Record<string,unknown>;glyphs:Glyph[];documents:Doc[];presets:Preset[]};
export type Preset={id:string;name:string;settings:Record<string,unknown>};
const DB='gptgenie-local',STORE='records';let dbPromise:Promise<IDBDatabase>|null=null;
function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,2);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
export async function get<T>(key:string):Promise<T|undefined>{const d=await db();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export async function put(key:string,value:unknown){const d=await db();return new Promise<void>((res,rej)=>{const r=d.transaction(STORE,'readwrite').objectStore(STORE).put(value,key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function remove(key:string){const d=await db();return new Promise<void>((res,rej)=>{const r=d.transaction(STORE,'readwrite').objectStore(STORE).delete(key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function all<T>(key:string):Promise<T[]>{return(await get<T[]>(key))??[]}
export async function exportWorkspace():Promise<Workspace>{return{schema:'gptgenie-workspace',version:2,exportedAt:new Date().toISOString(),settings:(await get<Record<string,unknown>>('settings'))??{},glyphs:await all<Glyph>('glyphs'),documents:await all<Doc>('documents'),presets:await all<Preset>('presets')}}
export async function importWorkspace(w:Workspace){if(w.schema!=='gptgenie-workspace'||![1,2].includes(w.version)||!Array.isArray(w.glyphs)||!Array.isArray(w.documents))throw new Error('This is not a supported GPTGenie backup.');await Promise.all([put('settings',w.settings??{}),put('glyphs',w.glyphs),put('documents',w.documents),put('presets',w.presets??[])])}

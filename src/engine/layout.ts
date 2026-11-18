import type{Glyph,InkStroke,StrokePoint}from'../storage';
import{parseMath,type FormulaNode}from'./math';
export type LayoutSettings={paper:'A4'|'A5'|'Letter';fontSize:number;lineSpacing:number;margin:number;letterSpacing:number;wordSpacing:number;variation:number;ink:string;style?:'plain'|'lined'|'grid'|'dotted'|'ruled-wide'|'ruled-narrow'|'squared-wide'|'squared-narrow'|'dotted-wide'|'dotted-narrow';ruleSpacing?:number;marginLeft?:number;marginRight?:number;marginTop?:number;marginBottom?:number;lineSlope?:number;lineWave?:number;marginIrregularity?:number;snapToRules?:boolean;backgroundImage?:string;backgroundImageScale?:number;backgroundImageRotation?:number;backgroundImageX?:number;backgroundImageY?:number};
export type PlacedStroke={points:StrokePoint[];color:string;width:number;opacity:number;tool:InkStroke['tool']};
export type PlacedFallback={text:string;x:number;y:number;size:number;color:string};
export type LayoutPage={width:number;height:number;strokes:PlacedStroke[];fallback:PlacedFallback[]};
const PAGE={A4:[595.28,841.89],A5:[419.53,595.28],Letter:[612,792]} as const;
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rand(seed:number){let x=seed||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function bounds(strokes:InkStroke[]){const pts=strokes.flatMap(s=>s.points);if(!pts.length)return{x:0,y:0,w:1,h:1};const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(1,Math.max(...xs)-Math.min(...xs)),h:Math.max(1,Math.max(...ys)-Math.min(...ys))}}
function glyphWidth(char:string,size:number,byChar:Map<string,Glyph[]>):number{
 const variant=byChar.get(char)?.[0];if(!variant?.strokes?.length)return size*.55;
 const b=bounds(variant.strokes);return b.w*(size/b.h);
}
function measureFormula(nodes:FormulaNode[],size:number,byChar:Map<string,Glyph[]>,wordSpacing:number):number{
 return nodes.reduce((total,node)=>{
  if(node.type==='glyph')return total+(node.value===' '?size*.32+wordSpacing:node.value==='\n'?0:glyphWidth(node.value,size,byChar)+size*.015);
  if(node.type==='fraction')return total+Math.max(measureFormula(node.numerator,size*.68,byChar,wordSpacing*.68),measureFormula(node.denominator,size*.68,byChar,wordSpacing*.68))+size*.28;
  if(node.type==='root')return total+glyphWidth('√',size,byChar)*.72+measureFormula(node.body,size,byChar,wordSpacing)+size*.12;
  const base=measureFormula([node.base],size,byChar,wordSpacing),sup=measureFormula(node.superscript??[],size*.58,byChar,wordSpacing*.58),sub=measureFormula(node.subscript??[],size*.58,byChar,wordSpacing*.58);
  return total+base+Math.max(sup,sub)*.88;
 },0);
}
export function composeText(rawText:string,title:string,settings:LayoutSettings,glyphs:Glyph[],scriptDirection:'ltr'|'rtl'='ltr'):LayoutPage[]{
 const formula=parseMath(rawText),[width,height]=PAGE[settings.paper],margin=settings.margin,left=settings.marginLeft??margin,right=settings.marginRight??margin,top=settings.marginTop??margin,bottom=settings.marginBottom??margin,style=settings.style??'lined';
 const defaultGap=style==='ruled-wide'?30:style==='ruled-narrow'?16:style==='squared-wide'?24:style==='squared-narrow'?12:style==='dotted-wide'?24:style==='dotted-narrow'?12:settings.fontSize*settings.lineSpacing;
 const lineHeight=Math.max(10,settings.snapToRules===false?settings.fontSize*settings.lineSpacing:(settings.ruleSpacing??defaultGap)),textSize=Math.min(settings.fontSize,lineHeight*.78);
 const pages:LayoutPage[]=[];let page:LayoutPage={width,height,strokes:[],fallback:[]};pages.push(page);
 const random=rand(hash(title+rawText)),byChar=new Map<string,Glyph[]>();for(const g of glyphs)byChar.set(g.char,[...(byChar.get(g.char)??[]),g]);
 const initialY=top+textSize,state={x:left,y:initialY};
 const nextLine=()=>{state.x=left+(random()-.5)*(settings.marginIrregularity??0);state.y+=lineHeight;if(state.y>height-bottom){page={width,height,strokes:[],fallback:[]};pages.push(page);state.x=left;state.y=initialY}};
 const baselineAt=(x:number,base:number)=>base+Math.tan((settings.lineSlope??0)*Math.PI/180)*(x-left)+Math.sin((x-left)/80)*(settings.lineWave??0);
 const addRule=(x1:number,y1:number,x2:number,y2:number,strokeWidth:number)=>page.strokes.push({points:[{x:x1,y:y1,pressure:1,time:0,tiltX:0,tiltY:0},{x:x2,y:y2,pressure:1,time:1,tiltX:0,tiltY:0}],color:settings.ink,width:strokeWidth,opacity:1,tool:'pen'});
 const placeGlyph=(char:string,x:number,base:number,size:number)=>{
  const variants=byChar.get(char)??[],variant=variants.length?variants[Math.floor(random()*variants.length)]:undefined;
  const jitter=(random()-.5)*settings.variation/100*size*.16,tilt=(random()-.5)*settings.variation/100*.08,baseline=baselineAt(x,base)+jitter+(x-left)*tilt;
  if(variant?.strokes?.length){const b=bounds(variant.strokes),scale=size/b.h,glyphBase=variant.baselineY??(b.y+b.h),gy=baseline-(glyphBase-b.y)*scale;
   for(const stroke of variant.strokes){const points=stroke.points.map(p=>({x:x+(p.x-b.x)*scale,y:gy+(p.y-b.y)*scale,pressure:p.pressure,time:p.time,tiltX:p.tiltX,tiltY:p.tiltY}));page.strokes.push({points,color:stroke.color||settings.ink,width:stroke.width*scale,opacity:stroke.opacity,tool:stroke.tool})}
  }else page.fallback.push({text:char,x,y:baseline,size,color:settings.ink});
 };
 const renderSequence=(nodes:FormulaNode[],cursor:{x:number;y:number},size:number,nested=false):void=>{
  for(const node of nodes){
   const nodeWidth=measureFormula([node],size,byChar,settings.wordSpacing);
   if(!nested&&node.type==='glyph'&&node.value==='\n'){nextLine();continue}
   if(!nested&&cursor.x+nodeWidth>width-right&&cursor.x>left)nextLine();
   if(node.type==='glyph'){
    const char=node.value;if(char===' '||char==='\t'){cursor.x+=size*.32+settings.wordSpacing;continue}
    if(char==='\n'){cursor.y+=lineHeight;cursor.x=left;continue}
    placeGlyph(char,cursor.x,cursor.y,size);cursor.x+=glyphWidth(char,size,byChar)+size*.015;continue;
   }
   if(node.type==='fraction'){
    const small=size*.68,nw=measureFormula(node.numerator,small,byChar,settings.wordSpacing),dw=measureFormula(node.denominator,small,byChar,settings.wordSpacing),w=Math.max(nw,dw)+size*.28;
    const numerator={x:cursor.x+(w-nw)/2,y:cursor.y-size*.43},denominator={x:cursor.x+(w-dw)/2,y:cursor.y+size*.43};
    renderSequence(node.numerator,numerator,small,true);renderSequence(node.denominator,denominator,small,true);
    addRule(cursor.x+size*.06,baselineAt(cursor.x,cursor.y)+size*.04,cursor.x+w-size*.06,baselineAt(cursor.x+w,cursor.y)+size*.04,Math.max(.55,size*.045));
    cursor.x+=w;continue;
   }
   if(node.type==='root'){
    const rootW=glyphWidth('√',size,byChar),bodyW=measureFormula(node.body,size,byChar,settings.wordSpacing),bodyX=cursor.x+rootW*.68;
    placeGlyph('√',cursor.x,cursor.y,size);const body={x:bodyX,y:cursor.y};renderSequence(node.body,body,size,true);
    addRule(bodyX-1,baselineAt(bodyX,cursor.y)-size*.72,bodyX+Math.max(bodyW,1),baselineAt(bodyX+bodyW,cursor.y)-size*.72,Math.max(.55,size*.045));
    cursor.x+=rootW*.68+bodyW+size*.12;continue;
   }
   const baseW=measureFormula([node.base],size,byChar,settings.wordSpacing),scriptSize=size*.58,supW=measureFormula(node.superscript??[],scriptSize,byChar,settings.wordSpacing*.58),subW=measureFormula(node.subscript??[],scriptSize,byChar,settings.wordSpacing*.58);
   renderSequence([node.base],cursor,size,true);
   if(node.superscript?.length)renderSequence(node.superscript,{x:cursor.x-baseW+baseW*.82,y:cursor.y-size*.58},scriptSize,true);
   if(node.subscript?.length)renderSequence(node.subscript,{x:cursor.x-baseW+baseW*.82,y:cursor.y+size*.25},scriptSize,true);
   cursor.x+=Math.max(supW,subW)*.88;
  }
 };
 renderSequence(formula,state,settings.fontSize);
 if(scriptDirection==='rtl')for(const p of pages){p.strokes.reverse();p.fallback.reverse()}
 return pages;
}

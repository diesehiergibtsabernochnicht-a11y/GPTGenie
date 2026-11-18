const SUP:Record<string,string>={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ"};
const SUB:Record<string,string>={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","=":"₌","(":"₍",")":"₎","a":"ₐ","e":"ₑ","i":"ᵢ","o":"ₒ","r":"ᵣ","u":"ᵤ","x":"ₓ","n":"ₙ"};
const COMMANDS:Record<string,string>={cdot:"·",times:"×",div:"÷",pm:"±",mp:"∓",le:"≤",leq:"≤",ge:"≥",geq:"≥",neq:"≠",approx:"≈",equiv:"≡",pi:"π",alpha:"α",beta:"β",gamma:"γ",Delta:"Δ",theta:"θ",lambda:"λ",mu:"μ",sigma:"σ",omega:"ω",infty:"∞",sum:"∑",int:"∫",rightarrow:"→",leftarrow:"←",Rightarrow:"⇒",sqrt:"√",percent:"%",circ:"°",therefore:"∴",angle:"∠"};
function cleanGroup(v:string){return v.startsWith("{")?v.slice(1,-1):v}
function scriptify(s:string,map:Record<string,string>){return [...s].map(c=>map[c]??c).join("")}
export function normalizeMath(input:string):string{
 let s=input.replace(/\\\\/g,"\n");
 for(let pass=0;pass<4;pass++){
  s=s.replace(/\\frac\s*(\{[^{}]*\}|[a-zA-Z0-9])\s*(\{[^{}]*\}|[a-zA-Z0-9])/g,(_,a,b)=>"("+cleanGroup(a)+")⁄("+cleanGroup(b)+")");
  s=s.replace(/\\sqrt\s*(\{[^{}]*\}|[a-zA-Z0-9])/g,(_,v)=>"√("+cleanGroup(v)+")");
  s=s.replace(/([A-Za-z0-9)])\^\{([^{}]+)\}/g,(_,a,b)=>a+scriptify(b,SUP));
  s=s.replace(/([A-Za-z0-9)])_\{([^{}]+)\}/g,(_,a,b)=>a+scriptify(b,SUB));
 }
 s=s.replace(/\\([A-Za-z]+)/g,(_,name:string)=>COMMANDS[name]??name);
 s=s.replace(/([A-Za-z0-9)])\^([0-9n])/g,(_,a,b)=>a+(SUP[b]??b));
 s=s.replace(/([A-Za-z0-9)])_([0-9])/g,(_,a,b)=>a+(SUB[b]??b));
 s=s.replace(/\\left|\\right/g,"").replace(/[{}]/g,"");
 return s;
}
export const MATH_INSERTS=[["x²","x^2"],["x₁","x_1"],["√","\\sqrt{}"],["a⁄b","\\frac{}{}"],["·","\\cdot"],["π","\\pi"],["≤","\\le"],["≥","\\ge"],["≠","\\neq"],["∑","\\sum"],["∞","\\infty"],["→","\\rightarrow"]] as const;

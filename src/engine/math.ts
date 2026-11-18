const SUP:Record<string,string>={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ"};
const SUB:Record<string,string>={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","=":"₌","(":"₍",")":"₎","a":"ₐ","e":"ₑ","i":"ᵢ","o":"ₒ","r":"ᵣ","u":"ᵤ","x":"ₓ","n":"ₙ"};
const COMMANDS:Record<string,string>={cdot:"·",times:"×",div:"÷",pm:"±",mp:"∓",le:"≤",leq:"≤",ge:"≥",geq:"≥",neq:"≠",approx:"≈",equiv:"≡",pi:"π",alpha:"α",beta:"β",gamma:"γ",Delta:"Δ",theta:"θ",lambda:"λ",mu:"μ",sigma:"σ",omega:"ω",infty:"∞",sum:"∑",int:"∫",rightarrow:"→",leftarrow:"←",Rightarrow:"⇒",sqrt:"√",percent:"%",circ:"°",therefore:"∴",angle:"∠"};
function cleanGroup(v:string){return v.startsWith("{")?v.slice(1,-1):v}
function scriptify(s:string,map:Record<string,string>){return [...s].map(c=>map[c]??c).join("")}
export function normalizeMath(input:string):string{
 let s=input.replace(/\\\\/g,"\n");
 s=s.replace(/\bsqrt\(([^()]*)\)/g,"√($1)");
 s=s.replace(/\b(\d)\s*\/\s*(\d)\b/g,"$1⁄$2");
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

export type FormulaNode =
  | { type: 'glyph'; value: string }
  | { type: 'fraction'; numerator: FormulaNode[]; denominator: FormulaNode[] }
  | { type: 'root'; body: FormulaNode[] }
  | { type: 'script'; base: FormulaNode; superscript?: FormulaNode[]; subscript?: FormulaNode[] };

const FORMULA_COMMANDS: Record<string, string> = {
  cdot:'·', times:'×', div:'÷', pm:'±', mp:'∓', le:'≤', leq:'≤', ge:'≥', geq:'≥',
  neq:'≠', approx:'≈', equiv:'≡', pi:'π', alpha:'α', beta:'β', gamma:'γ', Delta:'Δ',
  theta:'θ', lambda:'λ', mu:'μ', sigma:'σ', omega:'ω', infty:'∞', sum:'∑', int:'∫',
  rightarrow:'→', leftarrow:'←', Rightarrow:'⇒', percent:'%', circ:'°', therefore:'∴', angle:'∠',
};

export function parseMath(input: string): FormulaNode[] {
  const source = input.replace(/\\\\/g, '\n');
  let index = 0;
  const readGroup = (): FormulaNode[] => {
    if (source[index] !== '{') return readAtom();
    index++;
    const nodes = readSequence(true);
    if (source[index] === '}') index++;
    return nodes;
  };
  const readAtom = (): FormulaNode[] => {
    if (source[index] === '{') return readGroup();
    if (source[index] === '\\') {
      index++;
      const start = index;
      while (/[A-Za-z]/.test(source[index] ?? '')) index++;
      const command = source.slice(start, index);
      if (command === 'frac') return [{ type: 'fraction', numerator: readGroup(), denominator: readGroup() }];
      if (command === 'sqrt') return [{ type: 'root', body: readGroup() }];
      if (command === 'left' || command === 'right') return readAtom();
      const mapped = FORMULA_COMMANDS[command];
      return [...(mapped ?? command).split('')].map(value => ({ type: 'glyph', value }));
    }
    if (source.startsWith('sqrt(', index)) {
      index += 5;
      const start = index;
      let depth = 1;
      while (index < source.length && depth > 0) {
        if (source[index] === '(') depth++;
        else if (source[index] === ')') depth--;
        if (depth > 0) index++;
      }
      const body = source.slice(start, index);
      if (source[index] === ')') index++;
      return [{ type: 'root', body: parseMath(body) }];
    }
    const value = [...source.slice(index)][0] ?? '';
    if (value) index += value.length;
    return value ? [{ type: 'glyph', value }] : [];
  };
  const readSequence = (group = false): FormulaNode[] => {
    const nodes: FormulaNode[] = [];
    while (index < source.length && (!group || source[index] !== '}')) {
      const ch = source[index];
      if (ch === '^' || ch === '_') {
        index++;
        const argument = source[index] === '{' ? readGroup() : readAtom();
        const base = nodes.pop();
        if (!base) { nodes.push({ type: 'glyph', value: ch }, ...argument); continue; }
        const existing = base.type === 'script' ? base : { type: 'script' as const, base };
        if (ch === '^') existing.superscript = argument;
        else existing.subscript = argument;
        nodes.push(existing);
        continue;
      }
      if (ch === '/' && nodes.length && nodes[nodes.length - 1].type === 'glyph' && index + 1 < source.length && source[index + 1] !== ' ') {
        const numerator = [nodes.pop()!];
        index++;
        const denominator = readAtom();
        nodes.push({ type: 'fraction', numerator, denominator });
        continue;
      }
      nodes.push(...readAtom());
    }
    return nodes;
  };
  return readSequence();
}

export function flattenFormula(nodes: FormulaNode[]): string {
 return nodes.map(node => node.type === 'glyph' ? node.value : node.type === 'fraction' ? flattenFormula(node.numerator) + flattenFormula(node.denominator) : node.type === 'root' ? '√' + flattenFormula(node.body) : flattenFormula([node.base]) + flattenFormula(node.superscript ?? []) + flattenFormula(node.subscript ?? [])).join('');
}

export const MATH_INSERTS=[["x²","x^2"],["x₁","x_1"],["√","\\sqrt{x}"],["a⁄b","\\frac{a}{b}"],["·","\\cdot"],["π","\\pi"],["≤","\\le"],["≥","\\ge"],["≠","\\neq"],["∑","\\sum"],["∞","\\infty"],["→","\\rightarrow"],["Pythagoras","a^2+b^2=c^2"],["Kreisfläche","A=\\pi r^2"],["Geschwindigkeit","v=\\frac{s}{t}"],["Kraft","F=m\\cdot a"],["Prozent","W=G\\cdot\\frac{p}{100}"]] as const;

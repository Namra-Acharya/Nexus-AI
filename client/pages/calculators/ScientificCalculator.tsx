import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState<string>("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);

  const inputNum = (s: string) => {
    setDisplay(d => waiting ? (setWaiting(false), s) as any : (d === "0" && s !== "." ? s : d + s));
  };

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaiting(false); };
  const back = () => setDisplay(d => d.length>1 ? d.slice(0,-1) : "0");

  const applyUnary = (fn: (x:number)=>number) => {
    const x = parseFloat(display);
    const y = fn(x);
    setDisplay(format(y));
  };

  const setBinary = (next: string) => {
    const x = parseFloat(display);
    if (prev === null) setPrev(x);
    else if (op) setPrev(calc(prev, x, op));
    setOp(next);
    setWaiting(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const x = parseFloat(display);
    const y = calc(prev, x, op);
    setDisplay(format(y));
    setPrev(null); setOp(null); setWaiting(true);
  };

  const calc = (a:number, b:number, o:string) => {
    switch(o){
      case '+': return a+b;
      case '-': return a-b;
      case '×': return a*b;
      case '÷': return b===0? NaN : a/b;
      case '^': return Math.pow(a,b);
      default: return b;
    }
  };

  const format = (n:number) => {
    if (!isFinite(n)) return "Error";
    const s = n.toString();
    return s.length>14 ? n.toExponential(8) : s;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Scientific Calculator</CardTitle>
        <CardDescription>Advanced functions with a clean layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <Input readOnly value={display} className="text-right text-2xl font-mono" />
        </div>
        <div className="grid grid-cols-5 gap-2">
          <Button variant="outline" onClick={clear}>AC</Button>
          <Button variant="outline" onClick={back}>⌫</Button>
          <Button variant="outline" onClick={()=>applyUnary(x=>-x)}>±</Button>
          <Button variant="outline" onClick={()=>applyUnary(x=>x/100)}>%</Button>
          <Button variant="outline" onClick={()=>setBinary('÷')}>÷</Button>

          <Button variant="outline" onClick={()=>applyUnary(Math.sin)}>sin</Button>
          <Button variant="outline" onClick={()=>applyUnary(Math.cos)}>cos</Button>
          <Button variant="outline" onClick={()=>applyUnary(Math.tan)}>tan</Button>
          <Button variant="outline" onClick={()=>applyUnary(Math.sqrt)}>√x</Button>
          <Button variant="outline" onClick={()=>setBinary('×')}>×</Button>

          <Button variant="outline" onClick={()=>applyUnary(x=>Math.log10(x))}>log</Button>
          <Button variant="outline" onClick={()=>applyUnary(Math.log)}>ln</Button>
          <Button variant="outline" onClick={()=>applyUnary(x=>x*x)}>x²</Button>
          <Button variant="outline" onClick={()=>setBinary('^')}>xʸ</Button>
          <Button variant="outline" onClick={()=>setBinary('-')}>-</Button>

          <Button variant="outline" onClick={()=>inputNum('7')}>7</Button>
          <Button variant="outline" onClick={()=>inputNum('8')}>8</Button>
          <Button variant="outline" onClick={()=>inputNum('9')}>9</Button>
          <Button variant="outline" onClick={()=>applyUnary(x=>1/x)}>1/x</Button>
          <Button variant="outline" onClick={()=>setBinary('+')}>+</Button>

          <Button variant="outline" onClick={()=>inputNum('4')}>4</Button>
          <Button variant="outline" onClick={()=>inputNum('5')}>5</Button>
          <Button variant="outline" onClick={()=>inputNum('6')}>6</Button>
          <Button variant="outline" onClick={()=>inputNum('0')}>0</Button>
          <Button className="bg-brand-600 hover:bg-brand-700" onClick={equals}>=</Button>

          <Button variant="outline" onClick={()=>inputNum('1')}>1</Button>
          <Button variant="outline" onClick={()=>inputNum('2')}>2</Button>
          <Button variant="outline" onClick={()=>inputNum('3')}>3</Button>
          <Button variant="outline" onClick={()=>inputNum('.')}>.</Button>
          <div />
        </div>
      </CardContent>
    </Card>
  );
}

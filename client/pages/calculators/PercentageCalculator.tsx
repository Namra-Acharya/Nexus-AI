import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PercentageCalculator(){
  const [base, setBase] = useState<number>(0);
  const [pct, setPct] = useState<number>(10);
  const [part, setPart] = useState<number>(0);
  const ofResult = useMemo(()=> (base * pct)/100, [base, pct]);
  const incResult = useMemo(()=> base * (1 + pct/100), [base, pct]);
  const decResult = useMemo(()=> base * (1 - pct/100), [base, pct]);
  const whatPct = useMemo(()=> base!==0 ? (part/base)*100 : 0, [base, part]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Percentage Calculator</CardTitle>
        <CardDescription>Common percentage operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">X% of Y</div>
            <div className="flex gap-2">
              <Input type="number" value={pct} onChange={e=>setPct(Number(e.target.value))} placeholder="%" />
              <Input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} placeholder="Base" />
            </div>
            <div className="mt-2 text-sm">Result: <b>{ofResult}</b></div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Increase Y by X%</div>
            <div className="flex gap-2">
              <Input type="number" value={pct} onChange={e=>setPct(Number(e.target.value))} placeholder="%" />
              <Input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} placeholder="Base" />
            </div>
            <div className="mt-2 text-sm">New Value: <b>{incResult}</b></div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Decrease Y by X%</div>
            <div className="flex gap-2">
              <Input type="number" value={pct} onChange={e=>setPct(Number(e.target.value))} placeholder="%" />
              <Input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} placeholder="Base" />
            </div>
            <div className="mt-2 text-sm">New Value: <b>{decResult}</b></div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600 mb-1">X is what % of Y?</div>
            <div className="flex gap-2">
              <Input type="number" value={part} onChange={e=>setPart(Number(e.target.value))} placeholder="Part" />
              <Input type="number" value={base} onChange={e=>setBase(Number(e.target.value))} placeholder="Whole" />
            </div>
            <div className="mt-2 text-sm">Percentage: <b>{whatPct.toFixed(2)}%</b></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

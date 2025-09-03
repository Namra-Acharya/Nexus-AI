import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftRight, Copy } from "lucide-react";

const UNITS = ["C", "F", "K"] as const;

type Unit = typeof UNITS[number];

function convert(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  // Convert to Celsius
  let c = value;
  if (from === "F") c = (value - 32) * (5 / 9);
  if (from === "K") c = value - 273.15;
  // From Celsius to target
  if (to === "C") return c;
  if (to === "F") return c * (9 / 5) + 32;
  return c + 273.15; // K
}

export default function TemperatureConverter() {
  const [fromUnit, setFromUnit] = useState<Unit>("C");
  const [toUnit, setToUnit] = useState<Unit>("F");
  const [value, setValue] = useState<string>("0");

  const result = useMemo(() => {
    const n = Number(value);
    if (!isFinite(n)) return "";
    const out = convert(n, fromUnit, toUnit);
    return out.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, fromUnit, toUnit]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(result); } catch {}
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>Temperature Converter</CardTitle>
        <CardDescription>Convert between Celsius, Fahrenheit, and Kelvin accurately.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as Unit)}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center md:justify-start">
            <Button type="button" variant="outline" className="mt-6" onClick={swap}>
              <ArrowLeftRight className="w-4 h-4 mr-2" /> Swap
            </Button>
          </div>
          <div>
            <Label>To</Label>
            <Select value={toUnit} onValueChange={(v) => setToUnit(v as Unit)}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label>Value</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" />
          </div>
          <div>
            <Label>Result</Label>
            <div className="flex gap-2">
              <Input readOnly value={result} />
              <Button type="button" variant="outline" onClick={copy}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

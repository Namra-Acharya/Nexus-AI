import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftRight, Copy } from "lucide-react";

// Define unit maps with conversion factors to a base unit for each category
const UNITS: Record<string, { base: string; units: Record<string, number> }> = {
  Length: {
    base: "m",
    units: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
  },
  Weight: {
    base: "kg",
    units: {
      t: 1000,
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523125,
    },
  },
  Time: {
    base: "s",
    units: {
      day: 86400,
      h: 3600,
      min: 60,
      s: 1,
      ms: 0.001,
    },
  },
  Area: {
    base: "m²",
    units: {
      "km²": 1_000_000,
      "m²": 1,
      "cm²": 0.0001,
      "mm²": 0.000001,
      "ft²": 0.09290304,
      "in²": 0.00064516,
      acre: 4046.8564224,
      hectare: 10000,
    },
  },
  Volume: {
    base: "L",
    units: {
      "m³": 1000,
      L: 1,
      mL: 0.001,
      "ft³": 28.316846592,
      gal: 3.785411784,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.2365882365,
    },
  },
};

export default function UnitConverter() {
  const categories = Object.keys(UNITS);
  const [category, setCategory] = useState<string>(categories[0]);
  const unitList = useMemo(() => Object.keys(UNITS[category].units), [category]);
  const [fromUnit, setFromUnit] = useState<string>(unitList[0]);
  const [toUnit, setToUnit] = useState<string>(unitList[1] ?? unitList[0]);
  const [value, setValue] = useState<string>("1");

  const result = useMemo(() => {
    const n = Number(value);
    if (!isFinite(n)) return "";
    const { units } = UNITS[category];
    const toBase = n * units[fromUnit];
    const converted = toBase / units[toUnit];
    // Format smartly
    const out = Math.abs(converted) < 0.0001 || Math.abs(converted) > 1e6 ? converted.toExponential(6) : converted.toLocaleString(undefined, { maximumFractionDigits: 8 });
    return out;
  }, [value, category, fromUnit, toUnit]);

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
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Convert between common units across multiple categories.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); const list = Object.keys(UNITS[v].units); setFromUnit(list[0]); setToUnit(list[1] ?? list[0]); }}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From unit" />
              </SelectTrigger>
              <SelectContent>
                {unitList.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
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
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To unit" />
              </SelectTrigger>
              <SelectContent>
                {unitList.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
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

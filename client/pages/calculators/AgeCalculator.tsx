import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function diffYMD(from: Date, to: Date){
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

export default function AgeCalculator(){
  const [birth, setBirth] = useState<string>("");
  const [asOf, setAsOf] = useState<string>("");

  const res = useMemo(()=>{
    if (!birth) return null;
    const b = new Date(birth);
    const t = asOf ? new Date(asOf) : new Date();
    if (isNaN(b.getTime()) || isNaN(t.getTime())) return null;
    const {years, months, days} = diffYMD(b, t);
    const totalDays = Math.floor((t.getTime()-b.getTime())/(1000*60*60*24));
    return { years, months, days, totalDays };
  },[birth, asOf]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Age Calculator</CardTitle>
        <CardDescription>Calculate precise age between dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Date of Birth</div>
            <Input type="date" value={birth} onChange={e=>setBirth(e.target.value)} />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">As of (optional)</div>
            <Input type="date" value={asOf} onChange={e=>setAsOf(e.target.value)} />
          </div>
        </div>
        {res && (
          <div className="mt-4 border rounded-lg p-3">
            <div className="text-sm text-gray-700">Age</div>
            <div className="text-xl font-semibold">{res.years} years, {res.months} months, {res.days} days</div>
            <div className="text-sm text-gray-600 mt-1">Total Days: {res.totalDays}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

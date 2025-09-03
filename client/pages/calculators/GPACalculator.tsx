import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Row { id:string; course:string; credits:number; grade:string }

const GRADE_POINTS: Record<string, number> = {
  'A+':4.0,'A':4.0,'A-':3.7,
  'B+':3.3,'B':3.0,'B-':2.7,
  'C+':2.3,'C':2.0,'C-':1.7,
  'D+':1.3,'D':1.0,'F':0.0
};

export default function GPACalculator(){
  const [rows, setRows] = useState<Row[]>([{id:crypto.randomUUID(), course:'', credits:3, grade:'A'}]);

  const addRow = () => setRows(r=>[...r,{id:crypto.randomUUID(), course:'', credits:3, grade:'A'}]);
  const removeRow = (id:string) => setRows(r=>r.filter(x=>x.id!==id));
  const update = (id:string, patch:Partial<Row>) => setRows(r=>r.map(x=>x.id===id?{...x,...patch}:x));

  const { gpa, totalCredits } = useMemo(()=>{
    let pts=0, cr=0;
    for(const r of rows){
      const c = Math.max(0, Number(r.credits)||0);
      const p = GRADE_POINTS[r.grade] ?? 0;
      pts += p*c; cr+=c;
    }
    return { gpa: cr? (pts/cr) : 0, totalCredits: cr };
  },[rows]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>GPA Calculator</CardTitle>
        <CardDescription>Compute GPA on a 4.0 scale</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((r)=> (
            <div key={r.id} className="grid grid-cols-12 gap-2 items-center">
              <Input className="col-span-5" placeholder="Course (optional)" value={r.course} onChange={e=>update(r.id,{course:e.target.value})} />
              <Input className="col-span-2" type="number" min={0} step={0.5} value={r.credits} onChange={e=>update(r.id,{credits:Number(e.target.value)})} />
              <select className="col-span-3 border rounded-md h-10 px-2" value={r.grade} onChange={e=>update(r.id,{grade:e.target.value})}>
                {Object.keys(GRADE_POINTS).map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
              <Button variant="outline" className="col-span-2" onClick={()=>removeRow(r.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3">
          <Button variant="outline" onClick={addRow}>Add Course</Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Credits: {totalCredits}</Badge>
            <Badge>GPA: {gpa.toFixed(2)}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

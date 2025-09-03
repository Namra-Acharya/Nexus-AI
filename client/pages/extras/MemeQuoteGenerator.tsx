import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const QUOTES = [
  "Believe you can and you're halfway there.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated.",
  "Dream big. Start small. Act now.",
  "Stay hungry. Stay foolish.",
];

export default function MemeQuoteGenerator(){
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [quote, setQuote] = useState(QUOTES[0]);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ draw(); }, [top, bottom, quote, img]);

  const onUpload = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = ()=>{ setImg(im); URL.revokeObjectURL(url); };
    im.src = url;
  };

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = 800, H = 800; canvas.width = W; canvas.height = H;
    ctx.fillStyle = '#111827'; ctx.fillRect(0,0,W,H);
    if (img) {
      const ratio = Math.min(W/img.width, H/img.height);
      const w = img.width*ratio, h = img.height*ratio;
      const x = (W-w)/2, y=(H-h)/2;
      ctx.drawImage(img, x, y, w, h);
    }

    const stroke = (text:string, y:number) => {
      ctx.font = "bold 42px Impact, Arial, sans-serif";
      ctx.textAlign = 'center';
      ctx.lineWidth = 6; ctx.strokeStyle = 'black'; ctx.fillStyle = 'white';
      ctx.strokeText(text, W/2, y); ctx.fillText(text, W/2, y);
    };

    if (top.trim()) stroke(top.toUpperCase(), 60);
    if (bottom.trim()) stroke(bottom.toUpperCase(), H-30);

    if (quote.trim()){
      ctx.font = "italic 24px Georgia, serif";
      ctx.textAlign = 'center'; ctx.fillStyle = 'white';
      const lines = wrapText(ctx, '“'+quote+'”', W-80);
      lines.forEach((l,i)=> ctx.fillText(l, W/2, H/2 + i*28));
    }
  };

  const wrapText = (ctx:CanvasRenderingContext2D, text:string, maxWidth:number)=>{
    const words = text.split(' '); const lines:string[] = []; let line='';
    for(const w of words){
      const test = line ? line+' '+w : w;
      if (ctx.measureText(test).width > maxWidth){ lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line); return lines;
  };

  const download = () => {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const a = document.createElement('a'); a.href=url; a.download='meme.png'; a.click();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Meme & Quote Generator</CardTitle>
        <CardDescription>Create memes or inspirational posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-600 mb-1">Upload Image (optional)</div>
              <Input type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0]||undefined)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Top text" value={top} onChange={e=>setTop(e.target.value)} />
              <Input placeholder="Bottom text" value={bottom} onChange={e=>setBottom(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Quote</div>
              <Textarea rows={3} value={quote} onChange={e=>setQuote(e.target.value)} />
              <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={()=>setQuote(QUOTES[Math.floor(Math.random()*QUOTES.length)])}>Random Quote</Button>
                <Button onClick={download} className="bg-brand-600 hover:bg-brand-700">Download</Button>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-2 bg-gray-900">
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

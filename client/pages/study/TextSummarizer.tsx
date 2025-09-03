import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, Loader2, Sparkles } from "lucide-react";

const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","then","than","that","this","those","these","to","for","of","in","on","at","by","with","from","as","is","are","was","were","be","been","being","it","its","into","about","over","after","before","such","not","no","do","does","did","doing","can","could","should","would","will","shall","may","might","must","have","has","had","having","you","your","yours","we","our","ours","they","them","their","theirs","he","him","his","she","her","hers","i","me","my","mine"
]);

function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  let sentences = cleaned.match(/[^.!?\n]+[.!?]?/g)?.map(s => s.trim()).filter(Boolean) || [];
  // If it's one giant sentence, further split on semicolons/commas
  if (sentences.length <= 1 && cleaned.length > 240) {
    sentences = cleaned.split(/[;：；]|\s-\s|,\s/g).map(s => s.trim()).filter(s => s.length > 0);
  }
  return sentences;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-zA-Z0-9']+/g)?.filter(w => !STOPWORDS.has(w)) || [];
}

function summarize(text: string, title: string, ratio: number): { sentences: string[]; keywords: string[] } {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return { sentences: [], keywords: [] };

  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);

  const titleTokens = new Set(tokenize(title || ""));
  const maxFreq = Math.max(1, ...tf.values());

  const scored = sentences.map((s, idx) => {
    const words = tokenize(s);
    if (words.length === 0) return { i: idx, s: 0, len: s.length };
    const freqScore = words.reduce((sum, w) => sum + (tf.get(w) || 0) / maxFreq, 0) / words.length;
    const titleBoost = words.reduce((sum, w) => sum + (titleTokens.has(w) ? 0.2 : 0), 0);
    const positionBoost = Math.max(0, (sentences.length - idx) / sentences.length) * 0.05;
    return { i: idx, s: freqScore + titleBoost + positionBoost, len: s.length };
  });

  // Aim for a character budget rather than raw sentence count
  const charBudget = Math.max(200, Math.floor(text.length * ratio));
  const picked: number[] = [];
  let used = 0;
  for (const { i } of scored.sort((a,b)=>b.s-a.s)) {
    const L = sentences[i].length;
    if (used + L > charBudget && picked.length > 0) continue;
    picked.push(i);
    used += L;
    if (used >= charBudget) break;
  }
  picked.sort((a,b)=>a-b);

  const topTokens = Array.from(tf.entries())
    .sort((a,b)=>b[1]-a[1])
    .slice(0, 10)
    .map(([w]) => w);

  return { sentences: picked.map(i => sentences[i]), keywords: topTokens };
}

export default function TextSummarizer() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [ratio, setRatio] = useState(0.3); // 30% of sentences
  const [bullets, setBullets] = useState(true);
  const [loading, setLoading] = useState(false);

  const result = useMemo(() => summarize(text, title, ratio), [text, title, ratio]);

  const copy = async () => {
    const out = bullets ? result.sentences.map(s => `• ${s}`).join("\n") : result.sentences.join(" ");
    try { await navigator.clipboard.writeText(out); } catch {}
  };

  const download = () => {
    const out = bullets ? result.sentences.map(s => `• ${s}`).join("\n") : result.sentences.join(" ");
    const blob = new Blob([out], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const run = async () => {
    setLoading(true);
    setTimeout(()=>setLoading(false), 300); // quick UX feedback
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>Text Summarizer</CardTitle>
        <CardDescription>Extract key points without sending data to a server.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <Label>Title (optional)</Label>
            <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Document title" />
          </div>
          <div>
            <Label>Length: {Math.round(ratio*100)}%</Label>
            <Slider value={[ratio]} min={0.1} max={0.9} step={0.05} onValueChange={(v)=>setRatio(v[0])} />
          </div>
        </div>

        <div>
          <Label>Text</Label>
          <Textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste or write text here..." className="min-h-[220px]" />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button onClick={run} disabled={!text.trim() || loading} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Summarize
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={()=>setBullets(!bullets)}>{bullets?"Bullets":"Paragraph"}</Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={copy}><Copy className="w-4 h-4 mr-2" /> Copy</Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={download}><Download className="w-4 h-4 mr-2" /> Download</Button>
          </div>
        </div>

        <div>
          <Label>Summary</Label>
          <ScrollArea className="border rounded-lg p-3 bg-gray-50 min-h-[140px] max-h-[50vh]">
            {result.sentences.length===0 ? (
              <div className="text-sm text-gray-500">Summary will appear here.</div>
            ) : bullets ? (
              <ul className="list-disc pl-6 space-y-1 pr-2">
                {result.sentences.map((s, i)=> <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <p className="text-gray-800 pr-2">{result.sentences.join(" ")}</p>
            )}
          </ScrollArea>
        </div>

        {result.keywords.length>0 && (
          <div>
            <Label>Keywords</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {result.keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Languages } from "lucide-react";

const LANGS = [
  { code:'en', name:'English' },
  { code:'es', name:'Spanish' },
  { code:'fr', name:'French' },
  { code:'de', name:'German' },
  { code:'hi', name:'Hindi' },
  { code:'ur', name:'Urdu' },
  { code:'zh', name:'Chinese' },
  { code:'ja', name:'Japanese' },
];

export default function Translator(){
  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('es');
  const [text, setText] = useState('Hello, how are you?');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const swap = () => { setFrom(to); setTo(from); setOut(''); };

  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try{
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      const translated = data?.responseData?.translatedText || '';
      setOut(translated);
    }catch(e:any){ setError('Translation failed. Please try again.'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ setOut(''); }, [from,to]);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Languages className="w-5 h-5" /> AI Translator</CardTitle>
        <CardDescription>Free multi-language translation (powered by MyMemory)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <select className="border rounded-md h-10 px-2" value={from} onChange={e=>setFrom(e.target.value)}>
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          <Button variant="outline" onClick={swap}>Swap</Button>
          <select className="border rounded-md h-10 px-2" value={to} onChange={e=>setTo(e.target.value)}>
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">Source</div>
            <Textarea rows={6} value={text} onChange={e=>setText(e.target.value)} placeholder="Enter text to translate" />
            <Button className="mt-2 bg-brand-600 hover:bg-brand-700" onClick={translate} disabled={loading || !text.trim()}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Translate
            </Button>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Result</div>
            <Textarea rows={6} value={out} readOnly placeholder="Translation will appear here" />
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Globe, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

interface Item { id: string; type: 'tool'|'note'; title: string; description?: string; url?: string; tags: string[] }

const NOTES_KEY = "nexus_notes";

const TOOL_ITEMS: Item[] = [];

export default function GlobalSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [engine, setEngine] = useState<'web'|'youtube'>('web');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(NOTES_KEY); if (raw) setNotes(JSON.parse(raw)); } catch {}
  }, []);

  const index: Item[] = useMemo(() => {
    const noteItems: Item[] = notes.map((n) => ({ id: n.id, type:'note', title: n.title || 'Untitled', description: (n.content||'').slice(0,120), tags: n.tags || [] }));
    return [...TOOL_ITEMS, ...noteItems];
  }, [notes]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.slice(0, 10);
    return index.filter(item => {
      const hay = [item.title, item.description, ...(item.tags||[])].join(' ').toLowerCase();
      return hay.includes(term);
    }).slice(0, 30);
  }, [q, index]);

  const openExternal = () => {
    const url = engine === 'web'
      ? `https://www.google.com/search?q=${encodeURIComponent(q)}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    if (!q.trim()) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          autoFocus
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==='Enter'){ openExternal(); } }}
          placeholder="Search the web or YouTube..."
          className="pl-9"
        />
      </div>
      <div className="mt-2 flex gap-2">
        <Button variant={engine==='web'?'brand':'outline'} className="flex-1" onClick={()=>setEngine('web')}>
          <Globe className="w-4 h-4 mr-2" /> Web
        </Button>
        <Button variant={engine==='youtube'?'brand':'outline'} className="flex-1" onClick={()=>setEngine('youtube')}>
          <Youtube className="w-4 h-4 mr-2" /> YouTube
        </Button>
        <Button className="flex-none bg-brand-600 hover:bg-brand-700" onClick={openExternal} disabled={!q.trim()}>
          Go <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="mt-3 text-xs text-gray-500">Press Enter to search {engine==='web'?'Google':'YouTube'} in a new tab.</div>
      <ScrollArea className="mt-3 max-h-[50vh] pr-2">
        <div className="space-y-2">
          {results.map(item => (
            <div key={item.id} className="border rounded-lg p-3 bg-white/60">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {item.title}
                  {item.type==='tool' && item.url && (
                    <Button asChild variant="link" className="p-0 h-auto ml-2 text-brand-600">
                      <Link to={item.url}>Open <ExternalLink className="w-3.5 h-3.5 ml-1" /></Link>
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  {item.tags.slice(0,4).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                </div>
              </div>
              {item.description && <div className="text-sm text-gray-600 mt-1">{item.description}</div>}
            </div>
          ))}
          {results.length===0 && <div className="text-sm text-gray-500">No results.</div>}
        </div>
      </ScrollArea>
    </div>
  );
}

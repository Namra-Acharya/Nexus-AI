import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Volume2, Loader2, ExternalLink } from "lucide-react";

interface DictPhonetic { text?: string; audio?: string }
interface DictMeaning { partOfSpeech?: string; definitions?: { definition: string; example?: string; synonyms?: string[] }[] }
interface DictEntry { word: string; phonetics?: DictPhonetic[]; meanings?: DictMeaning[] }

interface CacheEntry { ts: number; data: DictEntry[] | null; syns: string[] }

const CACHE_KEY = "nexus_dict_cache_v1";

function loadCache(): Record<string, CacheEntry> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}
function saveCache(cache: Record<string, CacheEntry>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

export default function DictionaryThesaurus() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<DictEntry[] | null>(null);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const phoneticAudio = useMemo(() => entries?.[0]?.phonetics?.find(p => p.audio)?.audio, [entries]);
  const phoneticText = useMemo(() => entries?.[0]?.phonetics?.find(p => p.text)?.text, [entries]);

  const search = async (term?: string) => {
    const word = (term ?? query).trim();
    if (!word) return;
    setLoading(true); setError("");
    try {
      // cache
      const cache = loadCache();
      const key = word.toLowerCase();
      const cached = cache[key];
      if (cached && Date.now() - cached.ts < 1000 * 60 * 60 * 24) { // 24h
        setEntries(cached.data);
        setSynonyms(cached.syns);
        return;
      }

      // dictionaryapi.dev
      const dictResp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
      let dictData: DictEntry[] | null = null;
      if (dictResp.ok) {
        dictData = await dictResp.json();
      }
      // datamuse for synonyms
      const synResp = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(key)}&max=24`);
      const synData = synResp.ok ? await synResp.json() : [];
      const syns: string[] = Array.isArray(synData) ? synData.map((x: any) => x.word).filter(Boolean) : [];

      if (!dictData || !Array.isArray(dictData) || dictData.length === 0) {
        setEntries(null);
        setSynonyms(syns);
        setError("No definitions found.");
      } else {
        setEntries(dictData);
        setSynonyms(syns);
      }

      cache[key] = { ts: Date.now(), data: dictData, syns };
      saveCache(cache);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // no prefill; show placeholder instead

  const first = entries?.[0];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle>Dictionary & Thesaurus</CardTitle>
        <CardDescription>Free definitions, examples, pronunciation, and synonyms.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="e.g., example" className="pl-9" onKeyDown={(e)=>{ if(e.key==='Enter') search(); }} />
          </div>
          <Button onClick={()=>search()} disabled={loading || !query.trim()} className="bg-brand-600 hover:bg-brand-700">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {first && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">{first.word}</h2>
              {phoneticText && <Badge variant="outline">{phoneticText}</Badge>}
              {phoneticAudio && (
                <Button size="sm" variant="outline" onClick={()=>{ if(!audioRef.current){ audioRef.current = new Audio(phoneticAudio); } audioRef.current.currentTime = 0; audioRef.current.play(); }}>
                  <Volume2 className="w-4 h-4 mr-1" /> Play
                </Button>
              )}
              <a href={`https://en.wiktionary.org/wiki/${encodeURIComponent(first.word)}`} target="_blank" rel="noreferrer" className="text-brand-600 text-sm inline-flex items-center gap-1">
                Wiktionary <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <ScrollArea className="h-[360px] mt-3">
              <div className="space-y-4 pr-2">
                {entries?.flatMap((e, ei) => (e.meanings || []).map((m, mi) => (
                  <div key={`${ei}-${mi}`} className="border rounded-lg p-3 bg-gray-50">
                    {m.partOfSpeech && <div className="text-sm text-gray-600 mb-2">{m.partOfSpeech}</div>}
                    <ol className="list-decimal pl-5 space-y-2">
                      {(m.definitions || []).map((d, di) => (
                        <li key={di}>
                          <div className="text-gray-900">{d.definition}</div>
                          {d.example && <div className="text-sm text-gray-600 mt-1">“{d.example}”</div>}
                          {d.synonyms && d.synonyms.length>0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {d.synonyms.slice(0,6).map(s => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={()=>{ setQuery(s); search(s); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e)=>{ if(e.key==='Enter'){ setQuery(s); search(s); } }}
                              >
                                {s}
                              </Badge>
                            ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )))}

                {synonyms.length>0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Synonyms</div>
                    <div className="flex flex-wrap gap-1">
                      {synonyms.map(s => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={()=>{ setQuery(s); search(s); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e)=>{ if(e.key==='Enter'){ setQuery(s); search(s); } }}
                      >
                        {s}
                      </Badge>
                    ))}
                    </div>
                  </div>
                )}

                {!entries && !loading && !error && (
                  <div className="text-sm text-gray-500">Type a word and search to see results.</div>
                )}
                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>
            </ScrollArea>
          </div>
        )}

        {!first && (loading || error || entries===null) && (
          <div className="mt-4">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

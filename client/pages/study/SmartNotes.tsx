import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Tag, Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "nexus_notes";

export default function SmartNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  const selected = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach(n => n.tags.forEach(t => set.add(t)));
    return Array.from(set).sort((a,b) => a.localeCompare(b));
  }, [notes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter(n => {
      const matchesText = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const tag = tagQuery.trim().toLowerCase();
      const matchesTag = !tag || n.tags.some(t => t.toLowerCase().includes(tag));
      return matchesText && matchesTag;
    }).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, search, tagQuery]);

  const createNote = () => {
    const now = new Date().toISOString();
    const newNote: Note = { id: crypto.randomUUID(), title: "Untitled", content: "", tags: [], createdAt: now, updatedAt: now };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const updateNote = (patch: Partial<Note>) => {
    if (!selected) return;
    setNotes(prev => prev.map(n => n.id === selected.id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t || !selected) return;
    if (selected.tags.includes(t)) return;
    updateNote({ tags: [...selected.tags, t] });
    setTagQuery("");
    if (tagInputRef.current) tagInputRef.current.value = "";
  };

  const removeTag = (tag: string) => {
    if (!selected) return;
    updateNote({ tags: selected.tags.filter(t => t !== tag) });
  };

  return (
    <div className="grid grid-cols-1 md:[grid-template-columns:minmax(220px,20%)_1fr] gap-4 min-h-[60vh]">
      {/* Sidebar list */}
      <Card className="md:col-span-1 border rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-3 border-b flex flex-col gap-2">
            <Button size="sm" onClick={createNote} className="bg-brand-600 hover:bg-brand-700 w-full">
              <Plus className="w-4 h-4 mr-1" /> New Note
            </Button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search notes..." className="pl-7" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <ScrollArea className="h-[60vh] sm:h-[420px]">
            <div className="divide-y">
              {filtered.map(n => (
                <button type="button" key={n.id} onClick={() => setSelectedId(n.id)} className={`w-full text-left p-3 hover:bg-gray-50 transition ${selectedId===n.id?"bg-gray-50":""}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{n.title || "Untitled"}</div>
                    <div className="text-xs text-gray-500 ml-2">{new Date(n.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {n.tags.slice(0,4).map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                    {n.tags.length>4 && <Badge variant="outline" className="text-xs">+{n.tags.length-4}</Badge>}
                  </div>
                </button>
              ))}
              {filtered.length===0 && (
                <div className="p-3 text-sm text-gray-500">No notes found.</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="border rounded-xl">
        <CardContent className="p-4 space-y-3 min-h-[60vh]">
          {selected ? (
            <>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1">
                  <Label className="sr-only">Title</Label>
                  <Input
                    value={selected.title}
                    onChange={(e)=>updateNote({ title: e.target.value })}
                    placeholder="Title"
                    className="text-lg"
                  />
                </div>
                <Button className="w-full sm:w-auto" variant="outline" onClick={()=>deleteNote(selected.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>

              <div>
                <Label className="mb-1 inline-flex items-center gap-1"><Tag className="w-4 h-4" /> Tags</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {selected.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button type="button" className="ml-1 text-xs" onClick={()=>removeTag(tag)}>×</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input ref={tagInputRef} placeholder="Add tag and press Enter" onKeyDown={(e)=>{
                    if (e.key==='Enter' || e.key===',') { e.preventDefault(); addTag((e.target as HTMLInputElement).value); }
                  }} />
                  <Input value={tagQuery} onChange={(e)=>setTagQuery(e.target.value)} placeholder="Filter by tag" className="flex-1 sm:max-w-[200px]" />
                </div>
              </div>

              <div>
                <Label className="sr-only">Content</Label>
                <Textarea
                  placeholder="Write your note..."
                  value={selected.content}
                  onChange={(e)=>updateNote({ content: e.target.value })}
                  className="min-h-[260px]"
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-16">
              Select or create a note to start.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Calendar as Cal, Tag, Filter, Search } from "lucide-react";

interface Task {
  id: string;
  title: string;
  notes: string;
  tags: string[];
  due?: string; // ISO date
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "nexus_tasks";

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<{ q: string; tag: string; show: 'all' | 'open' | 'done' }>({ q: '', tag: '', show: 'all' });
  const [draft, setDraft] = useState<{ title: string; notes: string; tags: string; due: string }>({ title: '', notes: '', tags: '', due: '' });

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setTasks(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {} }, [tasks]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => s.add(tag)));
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();
    const tag = filter.tag.trim().toLowerCase();
    return tasks.filter(t => {
      const matchText = !q || t.title.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q);
      const matchTag = !tag || t.tags.some(x => x.toLowerCase().includes(tag));
      const matchState = filter.show === 'all' || (filter.show === 'open' && !t.done) || (filter.show === 'done' && t.done);
      return matchText && matchTag && matchState;
    }).sort((a,b)=>{
      // open first, then due soonest, then updated desc
      if (a.done !== b.done) return a.done ? 1 : -1;
      const ad = a.due ? new Date(a.due).getTime() : Infinity;
      const bd = b.due ? new Date(b.due).getTime() : Infinity;
      if (ad !== bd) return ad - bd;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [tasks, filter]);

  const addTask = () => {
    const title = draft.title.trim();
    if (!title) return;
    const now = new Date().toISOString();
    const tags = draft.tags.split(',').map(s=>s.trim()).filter(Boolean);
    const t: Task = { id: crypto.randomUUID(), title, notes: draft.notes, tags, due: draft.due || undefined, done: false, createdAt: now, updatedAt: now };
    setTasks(prev => [t, ...prev]);
    setDraft({ title: '', notes: '', tags: '', due: '' });
  };

  const toggleDone = (id: string, done: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done, updatedAt: new Date().toISOString() } : t));
  };

  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1 border rounded-xl overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium">New Task</div>
          <div>
            <Label className="sr-only">Title</Label>
            <Input value={draft.title} onChange={(e)=>setDraft(d=>({ ...d, title: e.target.value }))} placeholder="Task title" />
          </div>
          <div>
            <Label className="sr-only">Notes</Label>
            <Textarea value={draft.notes} onChange={(e)=>setDraft(d=>({ ...d, notes: e.target.value }))} placeholder="Notes (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tags</Label>
              <Input value={draft.tags} onChange={(e)=>setDraft(d=>({ ...d, tags: e.target.value }))} placeholder="comma,separated" />
            </div>
            <div>
              <Label className="inline-flex items-center gap-1"><Cal className="w-3.5 h-3.5" /> Due</Label>
              <Input type="date" value={draft.due} onChange={(e)=>setDraft(d=>({ ...d, due: e.target.value }))} />
            </div>
          </div>
          <Button onClick={addTask} className="bg-brand-600 hover:bg-brand-700"><Plus className="w-4 h-4 mr-1" /> Add Task</Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search tasks..." className="pl-7" value={filter.q} onChange={(e)=>setFilter(f=>({ ...f, q: e.target.value }))} />
            </div>
            <Input placeholder="Filter by tag" value={filter.tag} onChange={(e)=>setFilter(f=>({ ...f, tag: e.target.value }))} className="w-[160px]" />
            <div className="flex gap-1">
              <Button variant={filter.show==='all'?'default':'outline'} onClick={()=>setFilter(f=>({ ...f, show:'all' }))}>All</Button>
              <Button variant={filter.show==='open'?'default':'outline'} onClick={()=>setFilter(f=>({ ...f, show:'open' }))}>Open</Button>
              <Button variant={filter.show==='done'?'default':'outline'} onClick={()=>setFilter(f=>({ ...f, show:'done' }))}>Done</Button>
            </div>
          </div>

          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="divide-y">
              {filtered.map(t => (
                <div key={t.id} className="py-3 flex items-start gap-3">
                  <Checkbox checked={t.done} onCheckedChange={(v)=>toggleDone(t.id, Boolean(v))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`font-medium ${t.done?'line-through text-gray-400':''}`}>{t.title}</div>
                      <div className="flex items-center gap-2">
                        {t.due && <Badge variant="outline">Due {new Date(t.due).toLocaleDateString()}</Badge>}
                        <Button size="sm" variant="outline" onClick={()=>removeTask(t.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                    {t.notes && <div className={`text-sm ${t.done?'line-through text-gray-400':'text-gray-600'}`}>{t.notes}</div>}
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {t.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length===0 && <div className="py-6 text-sm text-gray-500">No tasks.</div>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

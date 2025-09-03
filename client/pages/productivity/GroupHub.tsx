import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Share2, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface Resource { id:string; type:string; title:string; content?:string; url?:string; authorName?:string; authorId?: string | null; createdAt:string }
interface GroupMeta { id: string; code: string; name: string }

const STORAGE = {
  groupId: "nexus_group_id",
  groupCode: "nexus_group_code",
  groupName: "nexus_group_name",
  groups: "nexus_groups",
};

export default function GroupHub(){
  const initialGroups: GroupMeta[] = (()=>{
    try{ return JSON.parse(localStorage.getItem(STORAGE.groups) || "[]"); }catch{ return []; }
  })();
  const [groups, setGroups] = useState<GroupMeta[]>(initialGroups);

  const [groupId, setGroupId] = useState<string | null>(localStorage.getItem(STORAGE.groupId));
  const [groupCode, setGroupCode] = useState<string>(localStorage.getItem(STORAGE.groupCode) || "");
  const [groupName, setGroupName] = useState<string>(localStorage.getItem(STORAGE.groupName) || "");
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>(localStorage.getItem('nexus_author') || '');
  const [authorId, setAuthorId] = useState<string>(localStorage.getItem('nexus_author_id') || (()=>{ const id = crypto.randomUUID(); localStorage.setItem('nexus_author_id', id); return id; })() as unknown as string);
  const [resList, setResList] = useState<Resource[]>([]);

  const { token } = useAuth();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const load = async (gid: string) => {
    const r = await fetch(`/api/groups/${gid}/resources`, { headers: { ...authHeader } });
    if (r.ok){ const data = await r.json(); setResList(data); }
  };

  useEffect(()=>{ if (groupId) load(groupId); },[groupId]);

  const setActiveGroup = (g: GroupMeta) => {
    setGroupId(g.id);
    setGroupCode(g.code);
    setGroupName(g.name);
    localStorage.setItem(STORAGE.groupId, g.id);
    localStorage.setItem(STORAGE.groupCode, g.code);
    localStorage.setItem(STORAGE.groupName, g.name);
  };

  const upsertGroup = (g: GroupMeta) => {
    setGroups(prev => {
      const exists = prev.some(x => x.id === g.id);
      const next = exists ? prev.map(x=> x.id===g.id? g : x) : [...prev, g];
      localStorage.setItem(STORAGE.groups, JSON.stringify(next));
      return next;
    });
    setActiveGroup(g);
  };

  const removeGroup = (id: string) => {
    setGroups(prev => {
      const next = prev.filter(g=>g.id!==id);
      localStorage.setItem(STORAGE.groups, JSON.stringify(next));
      if (groupId === id){
        if (next.length){ setActiveGroup(next[0]); }
        else {
          setGroupId(null); setGroupCode(""); setGroupName("");
          localStorage.removeItem(STORAGE.groupId);
          localStorage.removeItem(STORAGE.groupCode);
          localStorage.removeItem(STORAGE.groupName);
        }
      }
      return next;
    });
  };

  const create = async () => {
    if (!groupName.trim()) return;
    const r = await fetch('/api/groups',{ method:'POST', headers:{'Content-Type':'application/json', ...authHeader}, body: JSON.stringify({ name: groupName.trim() }) });
    const data = await r.json();
    if (r.ok){
      const g = { id: String(data.id), code: data.code, name: data.name } as GroupMeta;
      upsertGroup(g);
      setGroupName("");
    }
  };

  const createAnother = async () => {
    if (!newGroupName.trim()) return;
    const r = await fetch('/api/groups',{ method:'POST', headers:{'Content-Type':'application/json', ...authHeader}, body: JSON.stringify({ name: newGroupName.trim() }) });
    const data = await r.json();
    if (r.ok){
      const g = { id: String(data.id), code: data.code, name: data.name } as GroupMeta;
      upsertGroup(g);
      setNewGroupName("");
    }
  };

  const [joinCode, setJoinCode] = useState<string>("");
  const join = async () => {
    const code = (joinCode || groupCode).trim();
    if (!code) return;
    const r = await fetch('/api/groups/join',{ method:'POST', headers:{'Content-Type':'application/json', ...authHeader}, body: JSON.stringify({ code }) });
    const data = await r.json();
    if (r.ok){
      const g = { id: String(data.id), code: data.code, name: data.name } as GroupMeta;
      upsertGroup(g);
      setJoinCode("");
    }
  };

  const [type, setType] = useState('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!groupId || !title.trim()) return;
    setBusy(true);
    try{
      let finalUrl = url.trim();
      if (file) {
        const form = new FormData();
        form.append('file', file);
        const up = await fetch('/api/upload', { method:'POST', headers: { ...authHeader }, body: form });
        const data = await up.json();
        if (up.ok) finalUrl = data.url; else throw new Error(data.error || 'Upload failed');
      }
      if (authorName.trim()) localStorage.setItem('nexus_author', authorName.trim());
      const body:any = { type: file ? 'file' : type, title: title.trim(), authorName: authorName.trim() || 'Anonymous', authorId };
      if (content.trim()) body.content = content.trim();
      if (finalUrl) body.url = finalUrl;
      const r = await fetch(`/api/groups/${groupId}/resources`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeader}, body: JSON.stringify(body) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Failed'); }
      setTitle(''); setContent(''); setUrl(''); setFile(null);
      load(groupId);
    } finally { setBusy(false); }
  };

  const shareLink = useMemo(()=> groupCode ? `${location.origin}/?group=${groupCode}` : '', [groupCode]);
  const shareLinkFor = (code:string)=> `${location.origin}/?group=${code}`;

  if (!groupId){
    return (
      <div>
        {!token ? (
          <div className="p-4 border rounded-lg bg-white/70">
            <div className="text-sm font-medium mb-1">Sign in required</div>
            <p className="text-sm text-gray-600">Please sign in to create or join groups.</p>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="brand"><Link to="/login">Sign in</Link></Button>
              <Button asChild variant="outline"><Link to="/signup">Create account</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-2">Create or join multiple groups. You can switch between them anytime.</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium mb-1">Create Group</div>
                <Input placeholder="Group name" value={groupName} onChange={e=>setGroupName(e.target.value)} />
                <Button className="mt-2 w-full" variant="brand" onClick={create}>Create</Button>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium mb-1">Join Group</div>
                <Input placeholder="Invite code" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} />
                <Button className="mt-2 w-full" variant="brand" onClick={join}>Join</Button>
              </div>
            </div>
          </>
        )}
        {groups.length>0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Your Groups</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groups.map(g=> (
                <div key={g.id} className="flex items-center justify-between border rounded-md px-3 py-2 bg-white/70">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{g.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{g.code}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Button size="sm" variant="outline" onClick={()=>setActiveGroup(g)}>Open</Button>
                    <Button size="icon" variant="ghost" onClick={()=>removeGroup(g.id)} aria-label={`Remove ${g.name}`}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-2">
          <div className="text-sm font-medium">Your Groups</div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input placeholder="Create new group" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} className="flex-1 sm:w-64" />
            <Button onClick={createAnother} variant="brand" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-1" /> Create
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {groups.map(g=> (
            <div key={g.id} className="border rounded-lg p-3 bg-white/70">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{g.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{g.code}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={()=>setActiveGroup(g)}>Open</Button>
                  <Button size="icon" variant="ghost" onClick={()=>{ navigator.clipboard.writeText(shareLinkFor(g.code)); }} aria-label={`Copy invite link for ${g.name}`}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={()=>removeGroup(g.id)} aria-label={`Remove ${g.name}`}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="w-full sm:w-auto">
          <div className="text-sm text-gray-600 mb-1">Active Group</div>
          <div className="flex gap-2 items-center">
            <Select value={groupId || undefined} onValueChange={(val)=>{ const g = groups.find(x=>x.id===val); if (g) setActiveGroup(g); }}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(g=> (
                  <SelectItem key={g.id} value={g.id}>{g.name} ({g.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="hidden sm:inline-flex">{groupCode}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Your name" value={authorName} onChange={e=>setAuthorName(e.target.value)} className="flex-1 sm:w-40" />
          <Button className="w-full sm:w-auto" variant="outline" onClick={()=>{ navigator.clipboard.writeText(groupCode); }}>Copy Code</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 p-3 border rounded-lg">
          <div className="text-sm font-medium mb-2">Add Resource</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select className="border rounded-md h-10 px-2" value={type} onChange={e=>setType(e.target.value)}>
              <option value="note">Note</option>
              <option value="link">Link</option>
              <option value="file">File</option>
            </select>
            <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <Input placeholder="URL (optional)" value={url} onChange={e=>setUrl(e.target.value)} />
            <input type="file" accept="application/pdf,image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="md:col-span-2" />
            <textarea className="border rounded-md p-2 md:col-span-2" rows={4} placeholder="Content (optional)" value={content} onChange={e=>setContent(e.target.value)} />
          </div>
          <Button className="mt-2 w-full sm:w-auto" variant="brand" onClick={add} disabled={busy}>{busy? 'Sharing...' : 'Share'}</Button>
        </div>

        <div className="p-3 border rounded-lg space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Invite Friends</div>
            <div className="text-xs text-gray-600 mb-2">Share this code:</div>
            <div className="font-mono text-sm p-2 bg-gray-100 rounded-md">{groupCode}</div>
            <Button className="mt-2 w-full" variant="outline" onClick={()=>navigator.clipboard.writeText(shareLink)}>Copy Invite Link</Button>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Create Another Group</div>
            <Input placeholder="Group name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} disabled={!token} />
            <Button className="mt-2 w-full" variant="brand" onClick={createAnother} disabled={!token}>Create</Button>
            {!token && <p className="text-xs text-gray-500 mt-1">Sign in to create groups.</p>}
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Join Another Group</div>
            <Input placeholder="Invite code" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} disabled={!token} />
            <Button className="mt-2 w-full" variant="secondary" onClick={join} disabled={!token}>Join</Button>
            {!token && <p className="text-xs text-gray-500 mt-1">Sign in to join groups.</p>}
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Your Groups</div>
            <ScrollArea className="h-36 pr-2">
              <div className="space-y-2">
                {groups.map(g=> (
                  <div key={g.id} className="flex items-center justify-between border rounded-md px-3 py-2 bg-white/70">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{g.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{g.code}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Button size="sm" variant="outline" onClick={()=>setActiveGroup(g)}>Set Active</Button>
                      <Button size="icon" variant="ghost" onClick={()=>removeGroup(g.id)} aria-label={`Remove ${g.name}`}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium mb-1">Shared Resources</div>
        <ScrollArea className="max-h-[50vh] sm:max-h-[320px] pr-2">
          <div className="space-y-2">
            {resList.map(r=> (
              <div key={r.id} className="border rounded-lg p-3 bg-white/70">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate pr-2">{r.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{r.type}</Badge>
                    {r.authorId === authorId && (
                      <Button size="sm" variant="outline" onClick={async ()=>{
                        if (!groupId) return; if (!confirm('Delete this item?')) return;
                        const resp = await fetch(`/api/groups/${groupId}/resources/${r.id}`, { method:'DELETE', headers:{'Content-Type':'application/json', ...authHeader}, body: JSON.stringify({ authorId }) });
                        if (resp.ok) setResList(list=>list.filter(x=>x.id!==r.id));
                      }}>Delete</Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">Shared by {r.authorName || 'Anonymous'} • {new Date(r.createdAt).toLocaleString()}</div>
                {r.url && <a className="text-sm text-brand-600 break-all" href={r.url} target="_blank" rel="noreferrer">{r.url}</a>}
                {r.content && <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.content}</div>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

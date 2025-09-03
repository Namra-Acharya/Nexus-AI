import { Request, Response } from "express";
import { getDb } from "../lib/mongo";
import { ObjectId } from "mongodb";

function code(len=6){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s=""; for(let i=0;i<len;i++) s+=chars[Math.floor(Math.random()*chars.length)];
  return s;
}

export async function createGroup(req: Request, res: Response){
  try{
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ error: "name required" });
    const db = await getDb();
    const groups = db.collection("groups");
    const groupCode = code();
    const doc = { name, code: groupCode, createdAt: new Date() };
    const { insertedId } = await groups.insertOne(doc);
    res.json({ id: insertedId, ...doc });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function joinGroup(req: Request, res: Response){
  try{
    const { code: groupCode } = req.body || {};
    if (!groupCode) return res.status(400).json({ error: "code required" });
    const db = await getDb();
    const group = await db.collection("groups").findOne({ code: groupCode });
    if (!group) return res.status(404).json({ error: "group not found" });
    res.json({ id: group._id, name: group.name, code: group.code });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function addResource(req: Request, res: Response){
  try{
    const { groupId } = req.params;
    const { type, title, content, url, authorName } = req.body || {};
    const authUser = req.user as { id?: string; name?: string } | undefined;
    if (!type || !title) return res.status(400).json({ error: "type/title required" });
    const db = await getDb();
    const resources = db.collection("resources");
    const doc = { groupId: new ObjectId(groupId), type, title, content, url, authorName: authorName || authUser?.name || 'Anonymous', authorId: authUser?.id || null, createdAt: new Date() };
    const { insertedId } = await resources.insertOne(doc);
    res.json({ id: insertedId, ...doc });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function listResources(req: Request, res: Response){
  try{
    const { groupId } = req.params;
    const db = await getDb();
    const resources = await db.collection("resources").find({ groupId: new ObjectId(groupId) }).sort({ createdAt: -1 }).toArray();
    res.json(resources.map(r=>({ id: r._id, type: r.type, title: r.title, content: r.content, url: r.url, authorName: r.authorName, authorId: r.authorId, createdAt: r.createdAt })));
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

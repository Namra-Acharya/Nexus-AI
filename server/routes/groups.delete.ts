import { Request, Response } from "express";
import { getDb } from "../lib/mongo";
import { GridFSBucket, ObjectId } from "mongodb";

export async function deleteResource(req: Request, res: Response){
  try{
    const { groupId, resId } = req.params as any;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'unauthorized' });
    const db = await getDb();
    const resources = db.collection('resources');
    const _id = new ObjectId(resId);
    const doc = await resources.findOne({ _id, groupId: new ObjectId(groupId) });
    if (!doc) return res.status(404).json({ error: 'not found' });
    if (doc.authorId && doc.authorId !== userId) return res.status(403).json({ error: 'forbidden' });
    if (doc.url && typeof doc.url === 'string'){
      const m = doc.url.match(/\/api\/files\/(.+)$/);
      if (m) {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        try { await bucket.delete(new ObjectId(m[1])); } catch {}
      }
    }
    await resources.deleteOne({ _id });
    res.json({ ok: true });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

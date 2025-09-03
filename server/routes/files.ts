import type { Request, Response } from "express";
import multer from "multer";
import { getDb } from "../lib/mongo";
import { GridFSBucket, ObjectId } from "mongodb";

export const upload = multer({ storage: multer.memoryStorage(), limits:{ fileSize: 15 * 1024 * 1024 } });

export async function handleUpload(req: Request, res: Response){
  try{
    const file = (req as any).file as any as { originalname: string; mimetype: string; buffer: Buffer } | undefined;
    if (!file) return res.status(400).json({ error: "file required" });
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const meta = { originalName: file.originalname, mime: file.mimetype, uploadedAt: new Date() };
    const uploadStream = bucket.openUploadStream(file.originalname, { contentType: file.mimetype, metadata: meta });
    uploadStream.on('error', (err)=> {
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
    uploadStream.on('finish', ()=>{
      const id = (uploadStream.id as any)?.toString?.() || String(uploadStream.id);
      if (!id) {
        if (!res.headersSent) return res.status(500).json({ error: 'Upload failed' });
        return;
      }
      if (!res.headersSent) res.json({ id, url: `/api/files/${id}`, filename: file.originalname, contentType: file.mimetype });
    });
    uploadStream.end(file.buffer);
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function handleDownload(req: Request, res: Response){
  try{
    const { id } = req.params;
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const _id = new ObjectId(id);
    const cursor = await db.collection('uploads.files').find({ _id }).toArray();
    if (!cursor[0]) return res.status(404).end();
    const file = cursor[0];
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    bucket.openDownloadStream(_id).pipe(res);
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

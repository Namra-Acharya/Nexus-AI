import { getDb } from "../lib/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

function sign(user: any){
  let secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('JWT_SECRET not set — using temporary dev secret. Set JWT_SECRET in production for security.');
    secret = 'dev-secret';
  }
  return jwt.sign({ id: String(user._id), email: user.email, name: user.name }, secret, { expiresIn: "30d" });
}

export async function register(req: Request, res: Response){
  try{
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "name/email/password required" });
    const db = await getDb();
    const users = db.collection("users");
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "email already in use" });
    const hash = await bcrypt.hash(password, 10);
    const doc = { name, email: email.toLowerCase(), passwordHash: hash, createdAt: new Date() };
    const { insertedId } = await users.insertOne(doc);
    const token = sign({ _id: insertedId, email: doc.email, name: doc.name });
    res.json({ token, user: { id: insertedId, name: doc.name, email: doc.email } });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function login(req: Request, res: Response){
  try{
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email/password required" });
    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = sign(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

export async function me(req: Request, res: Response){
  try{
    const user = req.user;
    if (!user) return res.status(401).json({ error: "unauthorized" });
    res.json({ user });
  }catch(e:any){ res.status(500).json({ error: e.message }); }
}

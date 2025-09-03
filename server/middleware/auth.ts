import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface AuthUser { id: string; email: string; name?: string }

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction){
  try{
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "unauthorized" });
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");
    const payload = jwt.verify(token, secret) as AuthUser & { iat:number; exp:number };
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    next();
  }catch(e:any){ return res.status(401).json({ error: "unauthorized" }); }
}

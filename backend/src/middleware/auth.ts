import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-cybersecurity-token-key-change-me";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Format: Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access Denied: Missing Bearer Token" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Access Denied: Invalid or Expired Token" });
      }

      req.user = decoded as { id: string; email: string; role: string };
      next();
    });
  } else {
    res.status(401).json({ error: "Access Denied: Authorization Header Required" });
  }
}

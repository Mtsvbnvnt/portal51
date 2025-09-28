import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyFirebaseAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No se encontró token de autenticación." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

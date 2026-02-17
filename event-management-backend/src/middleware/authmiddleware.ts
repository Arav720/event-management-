import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";




interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: "user" | "organizer";
}
interface AuthRequest extends Request {
  user?: CustomJwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) =>{
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({message: "Unauthorized"});
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as CustomJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}



export const isOrganizer = (
    req: AuthRequest,
    res: Response,
    next: NextFunction

)=>{
     try {
        
        if(req.user?.role !== "organizer"){
            return res.status(403).json({
                success:false,
                message: "this route is protected for organizers only",
            })
        }

        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Organizer role can not be verified",
        })

    }
}

export const isUser = (
    req: AuthRequest,
    res: Response,
    next: NextFunction

)=>{
     try {

        if(req.user?.role !== "user"){
            return res.status(403).json({
                success:false,
                message: "this route is protected for users only",
            })
        }

        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified",
        })

    }
}
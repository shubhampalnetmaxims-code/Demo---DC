import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vaya-secret-key-2026";

export const authenticateAdmin = async (req: any, res: any, next: any) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vaya-secret-key-2026";

export const authenticateAdmin = async (req: any, res: any, next: any) => {
  // Bypassing authentication as requested
  req.admin = { id: "mock-admin", email: "admin@vaya.com", role: "admin", name: "Staff Member" };
  next();
};

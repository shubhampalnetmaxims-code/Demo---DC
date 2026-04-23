import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb, SIM_STATE } from "../models/state";

const JWT_SECRET = process.env.JWT_SECRET || "vaya-secret-key-2026";

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    let user: any = null;

    if (db) {
      user = await db.collection("admin_users").findOne({ email: email.toLowerCase() });
    } else {
      user = SIM_STATE.admin_users.find(u => u.email.toLowerCase() === (email || "").toLowerCase());
    }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const me = async (req: any, res: any) => {
  const token = req.cookies.admin_token;
  if (!token) return res.json({ authenticated: false });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (error) {
    res.json({ authenticated: false });
  }
};

export const logout = (req: any, res: any) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};

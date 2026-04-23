import { Router } from "express";
import * as contentController from "../controllers/contentController";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/public/destinations", contentController.getPublicDestinations);
router.get("/public/destinations/:id", contentController.getPublicDestinationDetails);
router.get("/public/packages", contentController.getPublicPackages);
router.get("/public/stays", contentController.getPublicStays);
router.get("/public/experiences", contentController.getPublicExperiences);

// Admin routes
router.get("/content/:collection", authenticateAdmin, contentController.getContent);
router.post("/content/:collection", authenticateAdmin, contentController.createContent);
router.put("/content/:collection/:id", authenticateAdmin, contentController.updateContent);
router.delete("/content/:collection/:id", authenticateAdmin, contentController.deleteContent);

export default router;

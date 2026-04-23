import { Router } from "express";
import * as leadController from "../controllers/leadController";
import * as paymentController from "../controllers/paymentController";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// Public lead/payment routes
router.post("/leads", leadController.createLead);
router.post("/enquiries", leadController.createLead); // Reusing createLead for now or map to specific logic
router.post("/log-view", leadController.logPageView);
router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/payments", paymentController.logPayment);

// Admin lead routes
router.get("/admin/leads", authenticateAdmin, leadController.getLeads);
router.get("/admin/leads/:id", authenticateAdmin, leadController.getLeadDetails);
router.post("/admin/leads", authenticateAdmin, leadController.createLead);
router.patch("/admin/leads/:id/status", authenticateAdmin, leadController.updateLeadStatus);

// Admin dashboard
router.get("/admin/stats", authenticateAdmin, leadController.getDashboardStats);

// Admin payment routes
router.patch("/admin/payments/:paymentId", authenticateAdmin, paymentController.updatePaymentStatus);

export default router;

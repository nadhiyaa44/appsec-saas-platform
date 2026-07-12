import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.get("/stats", authenticateJWT, getDashboardStats);

export default router;

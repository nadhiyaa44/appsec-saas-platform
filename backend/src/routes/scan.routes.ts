import { Router } from "express";
import { runScan, getScanHistory, deleteScan } from "../controllers/scan.controller";
import { authenticateJWT } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { RunScanSchema } from "../utils/schemas";

const router = Router();

router.post("/run", authenticateJWT, validate(RunScanSchema), runScan);
router.get("/history", authenticateJWT, getScanHistory);
router.delete("/:id", authenticateJWT, deleteScan);

export default router;

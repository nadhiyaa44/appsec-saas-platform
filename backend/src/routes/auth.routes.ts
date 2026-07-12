import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { RegisterSchema, LoginSchema } from "../utils/schemas";

const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);
router.get("/me", authenticateJWT, getMe);

export default router;

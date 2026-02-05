import { Router } from "express";

import {
    forgotPassword,
    verifyResetToken,
    resetPassword
} from "../controllers/auth.controller";


const router = Router();

// Endpoint to initiate password reset
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodAuthSchema } from "./auth.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/login",
  validateRequest(ZodAuthSchema.login),
  authController.login
);

router.post("/logout", authController.logout);

router.post("/refresh-token", authController.setAccessToken);

router.post(
  "/change-password",
  validateRequest(ZodAuthSchema.changePassword),
  checkAuth(...Object.values(UserRole)),
  authController.changePassword
);

router.post("/register/user", authController.registerUser);

router.post("/register/agent", authController.registerAgent);

router.post(
  "/register/admin",
  checkAuth(UserRole.SUPER_ADMIN),
  authController.registerAdmin
);

export const authRoutes = router;

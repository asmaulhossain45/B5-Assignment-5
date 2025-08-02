import { Router } from "express";
import { UserRole } from "../../constants/enums";
import { ZodUserSchema } from "./user.validation";
import { userController } from "./user.controller";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { ZodTransactionSchema } from "../transaction/transaction.validation";

const router = Router();

router.get("/me", checkAuth(UserRole.USER), userController.getUserProfile);

router.get("/wallet", checkAuth(UserRole.USER), userController.getUserWallet);

router.get(
  "/transactions",
  checkAuth(UserRole.USER),
  userController.getTransactions
);

router.patch(
  "/me",
  validateRequest(ZodUserSchema.update),
  checkAuth(UserRole.USER),
  userController.updateProfile
);

router.post(
  "/top-up",
  validateRequest(ZodTransactionSchema.topUp),
  checkAuth(UserRole.USER),
  userController.topUp
);

router.post(
  "/withdraw",
  validateRequest(ZodTransactionSchema.withdraw),
  checkAuth(UserRole.USER),
  userController.withdraw
);

router.post(
  "/send-money",
  validateRequest(ZodTransactionSchema.sendMoney),
  checkAuth(UserRole.USER),
  userController.sendMoney
);

export const userRoutes = router;

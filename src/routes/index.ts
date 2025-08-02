import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { agentRoutes } from "../modules/agent/agent.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { divisionRoutes } from "../modules/division/division.route";
import { districtRoutes } from "../modules/district/district.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admins", adminRoutes);
router.use("/users", userRoutes);
router.use("/agents", agentRoutes);
router.use("/divisions", divisionRoutes);
router.use("/districts", districtRoutes);

export default router;

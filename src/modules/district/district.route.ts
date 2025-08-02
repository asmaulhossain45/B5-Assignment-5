import { Router } from "express";
import { districtController } from "./district.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodDistrictSchema } from "./district.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/",
  validateRequest(ZodDistrictSchema.create),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  districtController.createDistrict
);

router.get("/", districtController.getAllDistrict);

router.get("/:slug", districtController.getDistrict);

router.get("/division/:slug", districtController.getDistrictsByDivision);

router.patch(
  "/:slug",
  validateRequest(ZodDistrictSchema.update),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  districtController.updateDistrict
);

router.delete(
  "/:slug",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  districtController.deleteDistrict
);

export const districtRoutes = router;

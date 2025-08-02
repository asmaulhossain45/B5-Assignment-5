import { Router } from "express";
import { divisionController } from "./division.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ZodDivisionSchema } from "./division.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../constants/enums";

const router = Router();

router.post(
  "/",
  validateRequest(ZodDivisionSchema.create),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.createDivision
);

router.get("/", divisionController.getAllDivision);

router.get("/:slug", divisionController.getDivision);

router.patch(
  "/:slug",
  validateRequest(ZodDivisionSchema.update),
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.updateDivision
);

router.delete(
  "/:slug",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  divisionController.deleteDivision
);

export const divisionRoutes = router;

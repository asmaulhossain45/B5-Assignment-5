import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HTTP_STATUS from "../../constants/httpStatus";
import { divisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionService.createDivision(req.body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.CREATED,
    message: "Division created successfully",
    data: result,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await divisionService.getAllDivision(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Divisions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await divisionService.getDivision(slug);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Division retrieved successfully",
    data: result,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await divisionService.updateDivision(slug, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Division updated successfully",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  await divisionService.deleteDivision(slug);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Division deleted successfully",
    data: null,
  });
});

export const divisionController = {
  createDivision,
  getAllDivision,
  getDivision,
  updateDivision,
  deleteDivision,
};

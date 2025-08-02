import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import HTTP_STATUS from "../../constants/httpStatus";
import { districtService } from "./district.service";

const createDistrict = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  const result = await districtService.createDistrict(body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.CREATED,
    message: "District created successfully",
    data: result,
  });
});

const getAllDistrict = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await districtService.getAllDistrict(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Districts retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getDistrict = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await districtService.getDistrict(slug);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "District retrieved successfully",
    data: result,
  });
});

const getDistrictsByDivision = catchAsync(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const result = await districtService.getDistrictsByDivision(slug);

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Districts retrieved successfully",
      data: result,
    });
  }
);

const updateDistrict = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await districtService.updateDistrict(slug, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "District updated successfully",
    data: result,
  });
});

const deleteDistrict = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  await districtService.deleteDistrict(slug);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "District deleted successfully",
    data: null,
  });
});

export const districtController = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  getDistrictsByDivision,
  updateDistrict,
  deleteDistrict,
};

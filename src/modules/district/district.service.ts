/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../utils/appError";
import { District } from "./district.model";
import { IDistrict } from "./district.interface";
import HTTP_STATUS from "../../constants/httpStatus";
import { Division } from "../division/division.model";
import { QueryBuilder } from "../../utils/queryBuilder";

const createDistrict = async (payload: IDistrict) => {
  const division = await Division.findOne({ slug: payload.division });

  if (!division) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
  }

  const isExists = await District.findOne({
    name: payload.name,
    division: division._id,
  });

  if (isExists) {
    throw new AppError(HTTP_STATUS.CONFLICT, "District already exists.");
  }

  const district = await District.create({
    ...payload,
    division: division._id,
  });

  if (!district) {
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create district."
    );
  }

  const { _id, ...rest } = district.toObject();

  return rest;
};

const getAllDistrict = async (query: Record<string, string>) => {
  const searchableFields = ["name", "slug"];
  const queryBuilder = new QueryBuilder(District.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const result = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: result, meta };
};

const getDistrict = async (slug: string) => {
  const district = await District.findOne({ slug }).select("-_id");

  if (!district) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "District not found.");
  }

  return district;
};

const getDistrictsByDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  if (!division) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
  }

  const districts = await District.find({ division: division._id }).select(
    "-_id"
  );

  if (!districts) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Districts not found.");
  }

  return districts;
};

const updateDistrict = async (slug: string, payload: Partial<IDistrict>) => {
  const oldDistrict = await District.findOne({ slug });

  if (!oldDistrict) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "District not found.");
  }

  let divisionId = oldDistrict.division;
  let districtName = oldDistrict.name;

  if (payload.name) {
    districtName = payload.name as string;
  }

  if (payload.division) {
    const division = await Division.findOne({ slug: payload.division });

    if (!division) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
    }

    divisionId = division._id;
  }

  const isExists = await District.findOne({
    name: districtName,
    division: divisionId,
  });

  if (isExists) {
    throw new AppError(HTTP_STATUS.CONFLICT, "District already exists.");
  }

  oldDistrict.name = districtName;
  oldDistrict.division = divisionId;

  const updatedDistrict = await oldDistrict.save();

  const { _id, ...rest } = updatedDistrict.toObject();

  return rest;
};

const deleteDistrict = async (slug: string) => {
  const district = await District.findOneAndDelete({ slug });

  if (!district) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "District not found.");
  }

  return true;
};

export const districtService = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  getDistrictsByDivision,
  updateDistrict,
  deleteDistrict,
};

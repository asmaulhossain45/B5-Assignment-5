/* eslint-disable @typescript-eslint/no-unused-vars */
import { Division } from "./division.model";
import AppError from "../../utils/appError";
import { IDivision } from "./division.interface";
import HTTP_STATUS from "../../constants/httpStatus";
import { District } from "../district/district.model";
import { QueryBuilder } from "../../utils/queryBuilder";

const createDivision = async (payload: IDivision) => {
  const division = await Division.findOne({ name: payload.name });

  if (division) {
    throw new AppError(HTTP_STATUS.CONFLICT, "Division already exists.");
  }

  const createdDivision = await Division.create(payload);

  if (!createdDivision) {
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to create division."
    );
  }

  return createdDivision;
};

const getAllDivision = async (query: Record<string, string>) => {
  const searchableFields = ["name", "slug"];
  const queryBuilder = new QueryBuilder(Division.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const result = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data: result, meta };
};

const getDivision = async (payload: string) => {
  const division = await Division.findOne({ slug: payload }).select("-_id");

  if (!division) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
  }

  return division;
};

const updateDivision = async (slug: string, payload: Partial<IDivision>) => {
  const division = await Division.findOne({ slug });

  if (!division) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
  }

  division.name = payload.name as string;
  const updatedDivision = await division.save();

  if(!updatedDivision) {
    throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update division.");
  }

  return updatedDivision;
};

const deleteDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  if (!division) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Division not found.");
  }

  const session = await Division.startSession();
  session.startTransaction();

  try {
    await District.deleteMany({ division: division._id }, { session });
    await Division.deleteOne({ _id: division._id }, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Failed to delete division and its districts."
    );
  } finally {
    await session.endSession();
  }

  return true;
};

export const divisionService = {
  createDivision,
  getAllDivision,
  getDivision,
  updateDivision,
  deleteDivision,
};

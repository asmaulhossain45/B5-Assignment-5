import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "../../interfaces";
import HTTP_STATUS from "../../constants/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { agentService } from "./agent.service";
import { IAgent } from "./agent.interface";

const getAgentProfile = catchAsync(async (req: Request, res: Response) => {
  const agent = await agentService.getAgentProfile(req.user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent profile retrieved successfully",
    data: agent,
  });
});

const getAgentWallet = catchAsync(async (req: Request, res: Response) => {
  const agent = req.user as JwtPayload;
  const result = await agentService.getAgentWallet(agent);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent wallet retrieved successfully",
    data: result,
  });
});

const getAgentTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = req.user as JwtPayload;
  const result = await agentService.getAgentTransactions(
    user,
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent Transactions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCommisionHistory = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.user as JwtPayload;
  const query = req.query as Record<string, string>;

  const result = await agentService.getCommisionHistory(id, query);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Commision history retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateAgentProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const body = req.body as Partial<IAgent>;

  const result = await agentService.updateAgentProfile(user, body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent profile updated successfully",
    data: result,
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const { amount, receiver } = req.body;
  const user = req.user as JwtPayload;
  const result = await agentService.cashIn(amount, user, receiver);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Cash in successfully",
    data: result,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const { amount, sender } = req.body;
  const user = req.user as JwtPayload;
  const result = await agentService.cashOut(amount, user, sender);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Agent withdraw successfully",
    data: result,
  });
});

export const agentController = {
  getAgentProfile,
  getAgentWallet,
  getAgentTransactions,
  getCommisionHistory,
  updateAgentProfile,
  cashIn,
  cashOut,
};

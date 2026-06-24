import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import { StatsService } from "./stats.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await StatsService.getDashboardStatsData(user as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Stats fetched successfully",
    data: result,
  });
});

export const StatsController = {
  getStats,
};

import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utils/token";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createUser(req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfull",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );

  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  console.log(token, "token from controller");

  const result = await AuthService.logoutUser(token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User log out successfull",
    data: result,
  });
});
const getMe: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await AuthService.getMe(req.user?.id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "get current user successfull",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const AuthController = {
  createUser,
  loginUser,
  logoutUser,
  getNewToken,
  getMe,
};

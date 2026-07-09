import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.createUser(req.body);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User logged in successfull",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};



const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    await AuthService.logoutUser();

    res.clearCookie("token");

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
export const AuthController = {
  createUser,
  loginUser,

  logoutUser,
};

import { Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User creation failed",
      data: error.message,
    });
  }
};
 
const loginUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",

      //  ------ for production
      //  secure: true,
      //   httpsOnly: false,
      //   sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfull",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "User login failed",
      data: error.message,
    });
  }
};

export const AuthController = {
  createUser,
  loginUser,
};
 
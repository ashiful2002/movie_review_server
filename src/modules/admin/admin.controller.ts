import { NextFunction, Request, RequestHandler, Response } from "express";
 import sendResponse from "../../utils/sendResponse";
import { AuthService } from "../Auth/auth.service";

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.createUser(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.logoutUser();

    res.clearCookie("token");

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logout successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.getMe(req.user?.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Current user fetched",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.updateProfile(req.user?.id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  createUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
};
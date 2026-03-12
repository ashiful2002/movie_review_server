import { NextFunction, RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get all users successfully",
      data: users,
    });
  } catch (error: any) {
    next(error);
  }
};
const getSingleUser: RequestHandler = async (req, res, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getSingleUser(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get a specifuc user successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllOrders: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await AdminService.getAllOrders();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get all orders for admin",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const makeProvider: RequestHandler = async (req, res, next: NextFunction) => {
  const { id } = req.params;
  const { role } = req.body;
  console.log({ id, role });

  try {
    const result = await AdminService.makeProvider(id as string, role);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User promoted to provider successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const AdminController = {
  getAllUsers,
  getSingleUser,
  getAllOrders,
  makeProvider,
};

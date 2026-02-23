import { Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { providerService } from "./provider.service";
const createProviderProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await providerService.createProviderProfile(
      req.body,
      userId
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Provider profile created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getMyProviderProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const result = await providerService.getMyProviderProfile(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Provider profile fetched successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getSingleProviderProfile: RequestHandler = async (req, res) => {
  try {
    const result = await providerService.getSingleProviderProfile(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Provider profile fetched successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const ProviderController = {
  createProviderProfile,
  getMyProviderProfile,
  getSingleProviderProfile,
};

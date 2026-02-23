import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./categories.service";

const createCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Category creation failed",
      data: error.message,
    });
  }
};

const getCategories: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryService.getCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Fetching categories failed",
      data: error.message,
    });
  }
};

const getSingleCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryService.getSingleCategory(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Category not found",
      data: error.message,
    });
  }
};

const updateCategory: RequestHandler = async (req, res) => {
  try {
    const result = await CategoryService.updateCategory(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Category update failed",
      data: error.message,
    });
  }
};

const deleteCategory: RequestHandler = async (req, res) => {
  try {
    await CategoryService.deleteCategory(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Category deletion failed",
      data: error.message,
    });
  }
};

export const CategoryController = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};

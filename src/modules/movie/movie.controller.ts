import { Request, Response, NextFunction, RequestHandler } from "express";
import { MovieService } from "./movie.service";
import sendResponse from "../../utils/sendResponse";

const getMovies: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.getMovies(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movies fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.getSingleMovie(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movie fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.getReviews(req.params.movieId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.createMovie(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Movie created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.updateMovie(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movie updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.deleteMovie(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movie deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const purchaseMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.purchaseMovie(
      req.params.id as string,
      req.user?.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movie purchased",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const rentMovie: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.rentMovie(
      req.params.id as string,
      req.user?.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Movie rented",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const MovieController = {
  getMovies,
  getSingleMovie,
  getReviews,
  createMovie,
  updateMovie,
  deleteMovie,
  purchaseMovie,
  rentMovie,
};

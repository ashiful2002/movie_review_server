import { RequestHandler } from "express";
import { MovieService } from "./movie.service";
import { sendResponse } from "../../shared/sendResponse";
import { prisma } from "../../lib/prisma";

const getMovies: RequestHandler = async (req, res, next) => {
  try {
    const result = await MovieService.getMovies(req.query);

    sendResponse(res, {
      httpStatusCode: 200,
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
      httpStatusCode: 200,
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
      httpStatusCode: 200,
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
    const { title, description, releaseYear, director, genres } = req.body;
    const result = await MovieService.createMovie(req.body);
    // Validation
    if (!title || !description || !releaseYear || !director) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: "At least one genre is required" });
    }

    // Verify all genres exist
    const existingGenres = await prisma.genre.findMany({
      where: { id: { in: genres } },
    });

    if (existingGenres.length !== genres.length) {
      return res.status(400).json({ error: "One or more genres do not exist" });
    }
    sendResponse(res, {
      httpStatusCode: 201,
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
      httpStatusCode: 200,
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
      httpStatusCode: 200,
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
      httpStatusCode: 200,
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
      httpStatusCode: 200,
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

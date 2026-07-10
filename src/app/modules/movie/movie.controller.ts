import { Request, RequestHandler, Response } from "express";
import { MovieService } from "./movie.service";
import { sendResponse } from "../../shared/sendResponse";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { buildCacheKey, withCache } from "../../lib/withCache";

const getMovies = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const cacheKey = buildCacheKey("movie:list", JSON.stringify(query));

  const { data: result, fromCache } = await withCache(cacheKey, 1200, () =>
    MovieService.getMovies(query as IQueryParams)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: fromCache
      ? "Movies fetched successfully (cached)"
      : "Movies fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleMovie = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const cacheKey = buildCacheKey("singleMovie:list", JSON.stringify(slug));
  const { data: result, fromCache } = await withCache(cacheKey, 600, () =>
    MovieService.getSingleMovie(slug as string)
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: fromCache
      ? "Movie fetched successfully (cached)"
      : "Movie fetched successfully",
    data: result,
  });
});

const createMovie = catchAsync(async (req: Request, res: Response) => {
  const { title, description, releaseYear, director, genreIds } = req.body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !releaseYear ||
    !director?.trim()
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!Array.isArray(genreIds) || genreIds.length === 0) {
    return res.status(400).json({ error: "At least one genre is required" });
  }

  const result = await MovieService.createMovie(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Movie created successfully",
    data: result,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.updateMovie(
    req.params.slug as string,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Movie updated successfully",
    data: result,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.deleteMovie(req.params.slug as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Movie deleted successfully",
    data: result,
  });
});

export const MovieController = {
  getMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};

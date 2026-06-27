// genre.controller.ts
import { RequestHandler } from "express";
import { GenreService } from "./genre.service";
import { sendResponse } from "../../shared/sendResponse";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";

const getGenres = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await GenreService.getAllGenres(query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Genres fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGenre: RequestHandler = async (req, res, next) => {
  try {
    const result = await GenreService.getGenreById(req.params.id as string);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Genre fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createGenre: RequestHandler = async (req, res, next) => {
  try {
    const result = await GenreService.createGenre(req.body);
    console.log("genre from controller", result);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Genre created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateGenre: RequestHandler = async (req, res, next) => {
  try {
    const result = await GenreService.updateGenre(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Genre updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteGenre: RequestHandler = async (req, res, next) => {
  try {
    await GenreService.deleteGenre(req.params.id as string);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Genre deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const GenreController = {
  getGenres,
  getSingleGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};

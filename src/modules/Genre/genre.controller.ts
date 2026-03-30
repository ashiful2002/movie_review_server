// genre.controller.ts
import { RequestHandler } from "express";
import { GenreService } from "./genre.service";
import sendResponse from "../../utils/sendResponse";

const getGenres: RequestHandler = async (req, res, next) => {
  try {
    const result = await GenreService.getAllGenres();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Genres fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleGenre: RequestHandler = async (req, res, next) => {
  try {
    const result = await GenreService.getGenreById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
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

    sendResponse(res, {
      statusCode: 201,
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
      statusCode: 200,
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
      statusCode: 200,
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

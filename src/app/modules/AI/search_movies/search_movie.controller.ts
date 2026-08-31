import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { movieSearchService } from "./search_movie.service";


const AiMovieSearch = catchAsync(async (req: Request, res: Response) => {
    let query = "";
    const reqAny = req as any;

    if (typeof reqAny.body === "string") {
        query = reqAny.body;
    } else if (reqAny.body && typeof reqAny.body === "object") {
        query =
            reqAny.body.query ||
            reqAny.body.userQuery ||
            reqAny.body.search ||
            reqAny.body.prompt ||
            reqAny.body.searchTerm ||
            reqAny.body.q ||
            (Object.values(reqAny.body).find((val) => typeof val === "string" && (val as string).trim().length > 0) as string) ||
            "";
    }

    if (!query && reqAny.query) {
        query = (reqAny.query.query || reqAny.query.q || reqAny.query.search || "") as string;
    }

    const result = await movieSearchService.AiMovieSearch(query);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Movies fetched successfully",
        data: result
    });
});

export const aimovieSearchController = { AiMovieSearch };
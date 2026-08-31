import status from "http-status";
import { envVars } from "../../../config/env";
import AppError from "../../../errorHelpers/AppError";
import { prisma } from "../../../lib/prisma";

const STOP_WORDS = new Set([
    "find", "show", "me", "movies", "movie", "film", "films", "recommend", 
    "looking", "for", "the", "a", "an", "with", "about", "in", "of", "to", "and", "or", "get", "give"
]);

const AiMovieSearch = async (userQuery: string) => {
    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
        throw new AppError(
            status.BAD_REQUEST,
            "A valid search query string is required. Send a JSON body like: { \"query\": \"search text\" }"
        );
    }

    const groqApiKey = envVars.GROQ_API_KEY;
    if (!groqApiKey) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "GROQ API KEY is not defined");
    }

    // Step 1: Prompt AI to extract core search intent and keywords without filler words
    const systemPrompt = `You are a movie database search query parser.
Analyze the user's natural language search query and extract core search terms (genres, topics, director, actor names).
Strip away filler phrase words like "find", "show me", "movies", "recommend", "looking for".

Return ONLY a JSON object:
{
  "keywords": ["Action"], 
  "genre": "Action",
  "director": "",
  "summary": "Action movies"
}`;

    // Fetch active models dynamically from Groq API
    let activeModels: string[] = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "gemma2-9b-it", "llama3-8b-8192"];
    try {
        const modelsRes = await fetch("https://api.groq.com/openai/v1/models", {
            method: "GET",
            headers: { Authorization: `Bearer ${groqApiKey}` }
        });
        if (modelsRes.ok) {
            const modelsData = await modelsRes.json();
            if (Array.isArray(modelsData?.data) && modelsData.data.length > 0) {
                activeModels = modelsData.data.map((m: any) => m.id);
            }
        }
    } catch {
        // Fallback to default model list
    }

    let response: Response | null = null;
    let lastErrorMessage = "";

    for (const model of activeModels) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userQuery }
                ]
            })
        });

        if (res.ok) {
            response = res;
            break;
        } else {
            const errorData = await res.json().catch(() => ({}));
            lastErrorMessage = errorData?.error?.message || res.statusText;
        }
    }

    if (!response || !response.ok) {
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            `Groq API Error: ${lastErrorMessage || "Failed to communicate with Groq API"}`
        );
    }

    const data = await response.json();
    let aiContent = data.choices[0]?.message?.content || "";
    aiContent = aiContent.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsedParams: { keywords?: string[]; genre?: string; director?: string; summary?: string } = {};
    try {
        parsedParams = JSON.parse(aiContent || "{}");
    } catch {
        parsedParams = {};
    }

    // Step 2: Extract clean terms without stop words
    const searchTerms = new Set<string>();

    if (parsedParams.genre && parsedParams.genre.trim()) {
        searchTerms.add(parsedParams.genre.trim());
    }

    if (parsedParams.keywords && Array.isArray(parsedParams.keywords)) {
        parsedParams.keywords.forEach((kw) => {
            kw.toLowerCase()
                .split(/\s+/)
                .filter((w) => !STOP_WORDS.has(w) && w.length > 1)
                .forEach((w) => searchTerms.add(w));
        });
    }

    // Fallback: parse words directly from userQuery if no clean terms extracted
    if (searchTerms.size === 0) {
        userQuery
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => !STOP_WORDS.has(w) && w.length > 1)
            .forEach((w) => searchTerms.add(w));
    }

    // Step 3: Build database search conditions across Title, Description, Director, and Genres
    const searchConditions: any[] = [];

    searchTerms.forEach((term) => {
        searchConditions.push(
            { title: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { director: { contains: term, mode: "insensitive" } },
            {
                genres: {
                    some: {
                        genre: {
                            name: { contains: term, mode: "insensitive" }
                        }
                    }
                }
            }
        );
    });

    if (parsedParams.director && parsedParams.director.trim()) {
        searchConditions.push({ director: { contains: parsedParams.director, mode: "insensitive" } });
    }

    let movies = await prisma.movie.findMany({
        where: {
            isDeleted: false,
            ...(searchConditions.length > 0 ? { OR: searchConditions } : {})
        },
        include: {
            genres: {
                include: {
                    genre: true
                }
            }
        },
        take: 10
    });

    // Fallback 1: search without isDeleted filter if 0 results
    if (movies.length === 0 && searchConditions.length > 0) {
        movies = await prisma.movie.findMany({
            where: {
                OR: searchConditions
            },
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            },
            take: 10
        });
    }

    // Fallback 2: if still 0 results, fetch top recent movies from DB
    if (movies.length === 0) {
        movies = await prisma.movie.findMany({
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            },
            take: 10
        });
    }

    const message = movies.length === 0 
        ? "No movies found in your database. Please create or seed movies in your database."
        : (parsedParams.summary || `Search results for "${userQuery}"`);

    return {
        aiSummary: message,
        extractedKeywords: Array.from(searchTerms),
        totalFound: movies.length,
        movies
    };
};

export const movieSearchService = { AiMovieSearch };
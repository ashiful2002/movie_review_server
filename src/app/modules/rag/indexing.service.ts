import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";
import { Prisma } from "../../../generated/prisma";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async indexDocument(
    chunkKey: string,
    sourceType: string,
    sourceId: string,
    content: string,
    metaData: Record<string, unknown>
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);

      await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "document_embeddings"
    (
      "id",
      "chunkKey",
      "sourceType",
      "sourceId",
      "sourceLabel",
      "content",
      "metadata",
      "embedding",
      "updatedAt"
    )
      VALUES
      (
          gen_random_uuid(),
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${null},
          ${content},
          ${JSON.stringify(metaData || {})}::jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
      )
      ON CONFLICT ("chunkKey")
      DO UPDATE SET
      "sourceType" = EXCLUDED."sourceType",
      "sourceId" = EXCLUDED."sourceId",
      "sourceLabel" = EXCLUDED."sourceLabel",
      "content" = EXCLUDED."content",
      "metadata" = EXCLUDED."metadata",
      "embedding" = EXCLUDED."embedding",
      "isDeleted" = false,
      "deletedAt" = null,
      "updatedAt" = NOW()
      `);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async indexMovieData() {
    try {
      console.log("fetching movie data for indexing...");
      const movies = await prisma.movie.findMany({
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          reviews: true,
        },
      });

      let indexedCount = 0;
      for (const movie of movies) {
        // format genres
        const genresList = movie.genres.map((ge) => ge.genre.name).join(", ");

        // format reviews
        const reviewsText = movie.reviews
          .map(
            (r) =>
              `- Rating: ${r.rating}/10. Content: ${r.content || "No content"}`
          )
          .join("\n");

        const content = `
      Movie Name: ${movie.title}
      Description: ${movie.description}
      Release Year: ${movie.releaseYear}
      Director: ${movie.director}
      Cast: ${movie.cast?.join(", ") || "Not specified"}
      Genres: ${genresList || "Not specified"}
      Duration: ${movie.duration ? `${movie.duration} mins` : "Unknown"}
      Language: ${movie.language || "Unknown"}
      Country: ${movie.country || "Unknown"}
      Age Rating: ${movie.ageRating || "Not rated"}
      Rating: ${movie.rating ?? "N/A"}
      Reviews:
      ${reviewsText || "No Reviews"}
    `;

        const metaData = {
          movieId: movie.id,
          name: movie.title,
          genres: movie.genres.map((ge) => ge.genre.name),
          releaseYear: movie.releaseYear,
          rating: movie.rating,
        };

        const chunkKey = `movie-${movie.id}`;
        await this.indexDocument(
          chunkKey,
          "MOVIE",
          movie.id,
          content,
          metaData
        );

        indexedCount++;
        console.log(`Successfully indexed ${indexedCount} movies`
        );
      } 
      return {
        success: true,
        message: `Successfully indexed ${indexedCount} movies`,
        indexedCount,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

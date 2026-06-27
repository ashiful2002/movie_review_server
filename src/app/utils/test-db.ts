import { prisma } from "../lib/prisma";

async function main() {
  const result = await prisma.movie.findMany({
    include: {
      reviews: {
        orderBy: {
          createdAt: "asc",
        },
      },
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
  console.log("RESULT_REVIEWS:", JSON.stringify(result.map(m => m.reviews.map(r => r.createdAt)), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

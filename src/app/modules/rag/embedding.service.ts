import { envVars } from "../../config/env";

export class EmbeddingService {
  private apikey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private embeddingModel: string;

  constructor() {
    this.apikey = envVars.RAG.OPEN_ROUTER_API_KEY || "";
    this.embeddingModel =
      envVars.RAG.OPENROUTER_EMBEDDING_MODEL ||
      "nvidia/llama-nemotron-embed-vl-1b-v2:free";

    if (!this.apikey) {
      throw new Error("OPEN router api key is not set in .env");
    }
  }

  async generateEmbedding(text: string) {
    const response = await fetch(`${this.apiUrl}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apikey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: text, model: this.embeddingModel }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Open router api error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    if (!data?.data?.length) {
      throw new Error("No embedding data returned");
    }

    return data.data[0].embedding;
  }
}

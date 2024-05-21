import { Chroma, ChromaLibArgs } from "@langchain/community/vectorstores/chroma";
import {OllamaEmbeddings} from "@langchain/community/embeddings/ollama";
import {OLLAMA_MODEL} from "../constants.ts";

const embeddings = new OllamaEmbeddings({ model: OLLAMA_MODEL });

const chromaConfig: ChromaLibArgs = {
  collectionName: "embeddings",
  url: "http://127.0.0.1:8000",
  collectionMetadata: {
    "hnsw:space": "cosine",
  }
}


export default async function getChromaVectorStore() {
  return new Chroma(embeddings, chromaConfig);
}
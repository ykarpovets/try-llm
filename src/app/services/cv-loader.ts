import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import getVectorStore from "./llm/vector-store.ts";
import { addCandidate } from "./db.ts";
import {randomUUID} from "node:crypto";

export async function loadCV(cvFile: File) {
    
    console.log("Load CV file and split into chunks");
    const loader = new PDFLoader(cvFile);

    const docs = await loader.load();

    /* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitChunks = await textSplitter.splitDocuments(docs);
    splitChunks.forEach((chunk) => {
        chunk.metadata.name = cvFile.name;
        chunk.metadata.type = cvFile.type;
    });
    
    console.log("Add documents to vector store");
    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments(splitChunks);

    console.log("Add candidate to database");
    await addCandidate("User " + randomUUID(), cvFile.name);
}

export default {
    loadCV
}
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import getVectorStore from "./llm/vector-store";
import { addCandidate } from "./db";
import randomName from "node-random-name";
import logger from "@/logger";
async function loadCV(cvFile: File) {
    await addCandidate(randomName(), cvFile.name);
}
async function loadCV2(cvFile: File) {
    
    logger.info("Load CV file and split into chunks");
    const loader = new PDFLoader(cvFile);

    const docs = await loader.load();

    /* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitChunks = await textSplitter.splitDocuments(docs);
    splitChunks.forEach((chunk) => {
        chunk.metadata.namespace = cvFile.name;
        chunk.metadata.type = cvFile.type;
    });
    
    const vectorStore = await getVectorStore();
    logger.info("Add documents to vector store");
    await vectorStore.addDocuments(splitChunks);
    logger.info("Add candidate to database");
    await addCandidate(randomName(), cvFile.name);
}

export default {
    loadCV
}
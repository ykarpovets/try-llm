import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import getVectorStore from "./llm/vector-store";
import { addCandidate } from "./db";
import randomName from "node-random-name";
import logger from "@/logger";
async function loadCV(cvFile: File) {
  logger.info(`Load CV ${cvFile.name} file and split into chunks`);
  const candidateName = randomName();

  const loader = new PDFLoader(cvFile, { splitPages: false});
  // we should get one document in the array as we are not splitting the pages
  const docs = await loader.load();
  // add metadata to the document
  docs[0].metadata.candidate = candidateName;
  docs[0].metadata.filename = cvFile.name;
  docs[0].metadata.type = cvFile.type;

  /* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  logger.info(`Split document ${cvFile.name} into chunks`)
  const splitChunks = await textSplitter.splitDocuments(docs);
  const vectorStore = await getVectorStore();
  logger.info("Add documents to vector store");
  await vectorStore.addDocuments(splitChunks);
  logger.info("Add candidate to database");
  await addCandidate(candidateName, cvFile.name);
}

export { loadCV };

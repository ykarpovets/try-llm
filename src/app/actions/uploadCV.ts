'use server'

import cvLoader from "../services/cv-loader.ts";
import logger from "@/logger.ts";

export async function uploadCV(formData: FormData) {
  const cvfile = formData.get('cvfile') as File;

  // Thats it, you have your files
  logger.info(`Received CV file: ${cvfile.name}`);

  await cvLoader.loadCV(cvfile);
  
}
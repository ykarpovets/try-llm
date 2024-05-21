import { NextRequest, NextResponse } from 'next/server';
import logger from "@/logger.ts";
import cvLoader from "@/services/cv-loader.ts";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const cvfile = formData.get('cvfile') as File;

  // Thats it, you have your files
  logger.info(`Received CV file: ${cvfile.name}`);

  await cvLoader.loadCV(cvfile);
  return NextResponse.json({message: 'CV uploaded successfully'});
}
import { NextResponse } from 'next/server';
import { getCandidates} from "../../services/db.ts";
import { extractDetailsFromCV } from "../../services/llm/retriver.ts";

async function getProfession(cv: string) {
    return await extractDetailsFromCV(cv);
    
} 
export async function GET() {
    const candidates = await getCandidates();
    const candidatesWithProfession = await Promise.all(
        candidates.map(async (candidate) => {
            const profession = await getProfession(candidate.cv);
            return {
                ...candidate,
                profession,
            };
        })
    );
    return NextResponse.json(candidatesWithProfession);
}
import { NextRequest, NextResponse } from 'next/server';
import {getCandidate, getCandidates} from "../../services/db.ts";
import { extractDetailsFromCV } from "../../services/llm/retriver.ts";

async function getProfession(cv: string) {
    return await extractDetailsFromCV("what is the candidate profession?", cv);

}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') as unknown;
    if (id) {
        const candidate = await getCandidate(id as number);
        const profession = await getProfession(candidate.cv);
        return NextResponse.json({profession});
    }
    const candidates = await getCandidates();
    return NextResponse.json(candidates);
}
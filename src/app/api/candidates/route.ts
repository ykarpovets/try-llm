import { NextRequest, NextResponse } from 'next/server';
import {getCandidate, getCandidates, Candidate} from "../../services/db.ts";
import { extractDetailsFromCV } from "../../services/llm/retriver.ts";

async function getProfession(c: Candidate) {
    return await extractDetailsFromCV("what is the current profession?", c);
}

async function getYearsOfExperience(c: Candidate) {
    return await extractDetailsFromCV("what is total years of commercial experience?", c);
}


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') as unknown;
    if (id) {
        const candidate = await getCandidate(id as number);
        const profession = await getProfession(candidate);
        const experienceYears = await getYearsOfExperience(candidate);
        return NextResponse.json({profession, experienceYears});
    }
    const candidates = await getCandidates();
    return NextResponse.json(candidates);
}
'use client';

import Link from "next/link";

import React from 'react';

export type CandidateProps = {
    id: number;
    name: string;
    cv: string;
};

export default function Candidate({id, name, cv}: CandidateProps) {
    return (
        <div className="border-b border-slate-600 h-10 justify-between flex">
            <span className="font-bold flex flex-col justify-center"><Link href={`?detail=true&id=${id}`}>{name}</Link></span>
          <span className="flex flex-col justify-center">CV: {cv}</span>
        </div>
    )
}
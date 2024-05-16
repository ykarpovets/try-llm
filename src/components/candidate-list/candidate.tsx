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
        <div>
            <h1><Link href={`?detail=true&id=${id}`}>{name}</Link></h1>
          <p>CV: {cv}</p>
        </div>
    )
}
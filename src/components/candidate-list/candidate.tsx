
import React from 'react';

export type CandidateProps = {
    name: string;
    cv: string;
    profession?: string;
};

export default function Candidate({name, cv, profession}: CandidateProps) {
    return (
        <div>
          <h1>{name}</h1>
          <p>{profession}</p>
          <p>{cv}</p>
        </div>
    )
}
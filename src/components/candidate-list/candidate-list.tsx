'use server';

import Candidate from "./candidate";
import {getCandidates} from "@/services/db";
import DetailsModal from "@/components/candidate-list/details-modal";

export default async  function CandidateList() {
    const candidates = await getCandidates();
    return (
        <>
        <div>
            {candidates.map(candidate => (<Candidate {...candidate} key={candidate.name} />))}
        </div>
        <DetailsModal />
        </>
    )
}
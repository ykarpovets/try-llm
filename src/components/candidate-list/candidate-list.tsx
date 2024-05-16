
import Candidate, {CandidateProps} from "./candidate.tsx";
import {useEffect, useState} from "react";

export default function CandidateList() {
    const [candidates, setCandidates] = useState<CandidateProps[]>([]);
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true);
        fetch('/api/candidates' )
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data)
            })
            .finally(() => setLoading(false));
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!candidates || candidates.length == 0) return <p>Please upload at least one CV to start our conversation...</p>
    return (
        <>
        <div>
            {candidates.map(candidate => (<Candidate {...candidate} key={candidate.name} />))}
        </div>
        </>
    )
}
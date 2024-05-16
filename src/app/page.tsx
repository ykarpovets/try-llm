'use client'

import React, {useCallback} from 'react'

import CvUpload from '../components/upload/cv-upload.tsx';
import CandidateList from "../components/candidate-list/candidate-list.tsx";
import { useRouter } from 'next/navigation';
import Modal from "../components/candidate-list/modal.tsx";

export default function Page() {
    const router = useRouter();
    const callback = useCallback(() => {
        router.refresh(); 
    }, [router]);
    return (
        <>
            <CvUpload onSuccessSubmit={callback} />
            <CandidateList />
            <Modal />
        </>
    )
}
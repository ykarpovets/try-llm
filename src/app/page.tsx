'use client'

import React, {useCallback} from 'react'

import CvUpload from '@/components/upload/cv-upload.tsx';
import CandidateList from "@/components/candidate-list/candidate-list.tsx";
import Modal from "@/components/candidate-list/modal.tsx";

export default function Page() {
    const callback = useCallback(() => {
        window.location.reload(); 
    }, []);
    return (
        <>
            <CvUpload onSuccessSubmit={callback} />
            <CandidateList />
            <Modal />
        </>
    )
}
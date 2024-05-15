'use client'

import React from 'react'

import CvUpload from '../components/upload/cv-upload.tsx';
import CandidateList from "../components/candidate-list/candidate-list.tsx";


export default function Page() {
    return (
        <>
            <CvUpload />
            <CandidateList />
        </>
    )
}
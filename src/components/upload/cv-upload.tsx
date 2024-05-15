'use client';
import React, {useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {uploadCV} from "../../app/actions/uploadCV.ts";
import Loader from '../loader/loader';
import { useRouter } from 'next/navigation';
import './styles.css';

type FormFields = {
    cvfile: FileList;
};

export default function CvUpload() {
    const { 
        register, 
        reset, 
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('cvfile', data.cvfile[0]);
            await uploadCV(formData);
        } finally {
            setLoading(false);
            reset();
            router.refresh();
        }
        
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input id="cvfile" type="file" multiple={false} {...register("cvfile", {
                        required: "CV file is required",
                    })} />
                    {errors.cvfile && <span className="error">{errors.cvfile.message}</span>}
                </div>
                <div>
                    <input type="submit" value="Upload CV" />
                </div>
            </form>
            {loading && <Loader/>}
        </>
    );
}
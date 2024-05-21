'use client';
import React, {useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import Loader from '../loader/loader';
import './styles.css';

type FormFields = {
    cvfile: FileList;
};

export type CvUploadProps = {
    onSuccessSubmit: () => void;
}

export default function CvUpload({onSuccessSubmit}: CvUploadProps) {
    const { 
        register, 
        reset, 
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('cvfile', data.cvfile[0]);
            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            onSuccessSubmit();
        } finally {
            setLoading(false);
            reset();
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
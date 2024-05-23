"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";

type FormFields = {
  cvfile: FileList;
};

export type CvUploadProps = {
  onSuccessSubmit: () => void;
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
  const [hasError, setHasError] = useState(false);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setHasError(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("cvfile", data.cvfile[0]);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setHasError(true);
      }
    } finally {
      setLoading(false);
      router.refresh();
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-6">
          <div>
            <input
              id="cvfile"
              type="file"
              multiple={false}
              {...register("cvfile", {
                required: "CV file is required",
              })}
            />
            {errors.cvfile && (
              <span className="text-red-500">{errors.cvfile.message}</span>
            )}
          </div>
          <div className="pt-2">
            <input type="submit" value="Upload CV" className="btn" />
          </div>
        </div>
      </form>
      {loading && <Loader />}
      {hasError && <div className="text-red-500">Error uploading CV</div>}
    </>
  );
}

"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type DetailProps = {
  profession?: string;
  experienceYears?: string;
  summary?: string;
};

function Placeholder() {
  return (
    <div
      role="status"
      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center w-full h-full"
    >
      <div className="w-full">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48  mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-600 max-w-[480px] mb-2.5"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48  mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-600 max-w-[480px] mb-2.5"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48  mb-2.5"></div>
        <div className="h-2.5 flex items-center w-full  mb-2.5">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
        <div className="h-2.5 flex items-center w-full max-w-[480px]  mb-2.5">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
        </div>
        <div className="h-2.5 flex items-center w-full max-w-[400px]  mb-2.5">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
          <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
          <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function DetailsModal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("detail");
  const id = searchParams.get("id");
  const pathname = usePathname();
  const [detail, setDetails] = useState<DetailProps | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/candidates?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDetails(data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <>
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-1/2 overflow-auto m-auto p-10 border border-slate-600">
            <div className="flex flex-col items-center">
              {isLoading ? (
                <Placeholder />
              ) : (
                <div className="flex flex-col">
                  <label htmlFor="profession" className="font-bold">
                    Profession:
                  </label>
                  <span id="profession" className="pb-5">
                    {detail?.profession}
                  </span>
                  <label htmlFor="years" className="font-bold">
                    Years of experience:
                  </label>
                  <span id="years" className="pb-5">
                    {detail?.experienceYears}
                  </span>
                  <label htmlFor="summary" className="font-bold">
                    Summary:
                  </label>
                  <span id="summary" className="pb-5">
                    {detail?.summary}
                  </span>
                </div>
              )}
              <br />
              <Link href={pathname}>
                <button type="button" className="btn">
                  Close
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailsModal;

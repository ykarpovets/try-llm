"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";
import {useEffect, useState} from "react";

import './modal.css';

type DetailProps = {
  profession?: string;
  experienceYears?: string;
}

function DetailsModal() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("detail");
  const id = searchParams.get("id");
  const pathname = usePathname();
  const [detail, setDetails] = useState<DetailProps>(null);
  const [isLoading, setLoading] = useState(true)

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
        {modal &&
            <div className="modal">
              <div className="modal-content">
                <div className="flex flex-col items-center">
                  {isLoading ? <p>Loading...</p> : (
                      <div className="flex flex-col">
                        <span className="pb-5">{detail?.profession}</span>
                        <span>{detail?.experienceYears}</span>
                      </div>
                  )}
                  <br/>
                  <Link href={pathname}>
                    <button type="button" className="btn">Close</button>
                  </Link>
                </div>
              </div>
            </div>
        }
      </>
  );
}

export default DetailsModal;
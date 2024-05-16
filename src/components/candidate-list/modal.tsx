"use client";
import {useSearchParams, usePathname} from "next/navigation";
import Link from "next/link";
import {useEffect, useState} from "react";

import './modal.css';

type DetailProps = {
  profession?: string;
}

function Modal() {
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
                      <div>
                        <h1>{detail?.profession}</h1>
                      </div>
                  )}
                  <br/>
                  <Link href={pathname}>
                    <button type="button" className="bg-red-500 text-white p-2">Close Modal</button>
                  </Link>
                </div>
              </div>
            </div>
        }
      </>
  );
}

export default Modal;
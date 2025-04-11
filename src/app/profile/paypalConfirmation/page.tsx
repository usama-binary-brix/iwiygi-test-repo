"use client";
import { FC, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import isAuth from "@/components/auth/isAuth";
import Loader from "@/components/Loader";
const PaypalConfirmation: FC = () => {
  const [error, setError] = useState("");
  const [successmsg, setsuccessmsg] = useState("");
  const queryString =
    typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  useEffect(() => {
    let gettoken = urlParams.get("token");
    if (gettoken) {
      handleVerification();
    }
  }, []);

  const handleVerification = async () => {
    let gettoken = urlParams.get("token");
    const VerifyUserApi = `${process.env.NEXT_PUBLIC_API}/api/payments/verifyUserPaypal/${gettoken}`;
    try {
      const response = await fetch(VerifyUserApi, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        const Successresponse = await response.json();
        setsuccessmsg(Successresponse?.message);
      }
    } catch (error) {
      setError("Failed to Reset Password. Please try again.");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 md:gap-8">
     
      <div className="bg-black border-2 border-bright-green p-4 md:p-8">
        <div className="text-center text-[30px] font-bold  tracking-wider mb-4">
          {successmsg}
        </div>
        <div className="flex flex-col items-center md:flex-row justify-center md:justify-between gap-4 md:gap-8">
          <div>
            <Link className="text-dark-green" href="/profile">
              Home Page
            </Link>
          </div>
        </div>
        {!successmsg && <Loader />}
        
      </div>
    </div>
  );
};

export default isAuth(PaypalConfirmation);

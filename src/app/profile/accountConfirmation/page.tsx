"use client";
import { FC, useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Button from "@/components/button/Button";
import Image from "next/image";

const AccountConfirmation: FC = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [shortMsg, setShortMsg] = useState("");
  const [longMsg, setLongMsg] = useState("");
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
    const ResetPasswordPostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/verifyUser/${gettoken}`;
    try {
      const response = await fetch(ResetPasswordPostApi, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            setShortMsg(data.short_message);
            setLongMsg(data.long_message);
          }
        });
    } catch (error) {
      setError("Failed to Reset Password. Please try again.");
    }
  };

  const handlePushToLogin = () => {
    router.push("/sign-in");
  };

  return (
    <div className="p-4 flex flex-col gap-4 md:gap-8">
      <div className="bg-black border-2 border-bright-green p-4 md:p-8">
        <div className="text-center text-[30px] font-bold  tracking-wider">
          {!shortMsg && <Loader />}
          <div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={300}
                height={300}
                className="object-contain w-[300px]"
              />
            </div>

            <div>{shortMsg}</div>
            <p className="text-[20px] font-normal">{longMsg}</p>

            {shortMsg && (
              // <button
              //   onClick={handlePushToLogin}
              //   className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-base  w-[fit-content]"
              // >
              //   Click Here to Sign In
              // </button>
              <div className="flex items-center justify-center mt-3">
                <Button
                  text="Click Here to Sign In"
                  onClick={handlePushToLogin}
                  type={"success"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountConfirmation;

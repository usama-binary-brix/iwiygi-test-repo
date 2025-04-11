"use client";
import isAuth from "@/components/auth/isAuth";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";

const Onboard: FC = () => {
  const [error, setError] = useState("");
  const [successmsg, setsuccessmsg] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const queryString =
    typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  useEffect(() => {
    let gettoken = urlParams.get("token");
    if (gettoken) {
      handleVerification();
    }
  }, []);

  const handleOnboardClick = async () => {
    setError("");

    try {
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/initiateOnboarding/${paypalEmail}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        const responseData = await response.json();
        setError(responseData.message);
        // throw new Error(responseData.statusText);
      } else {
        console.log(response);
        toast.success("Onboarding Email Sent. Please check Email");
        // Handle success response
        // For now, let's just set success message
        // setSuccessMsg("Onboarding initiated successfully!");
      }
    } catch (error) {
      setError("Failed to initiate onboarding. Please try again.");
    }
  };

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
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      } else setsuccessmsg("User Verified");
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

        <div className="gap-4 md:gap-8 mb-6">
          <div className="flex flex-col items-center">
            <h1 className="text-dark-black font-bold text-[24px] md:text-[30px] text-center">
              You are not onboared. please onboard your paypal with our platform
              to create listings
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center mt-4">
            <input
              type="email"
              placeholder="Enter Your Email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="mr-0 md:mr-4 bg-white text-black border-2 border-gray-300 rounded-md px-4 py-2"
            />
            <button
              onClick={handleOnboardClick}
              className="bg-dark-green text-black rounded-[50%] mt-2 px-[20px] md:px-[50px] py-[10px] font-bold text-[18px] md:text-[24px] "
            >
              Onboard Now
            </button>
          </div>
        </div>
        <div>
          <div className="flex justify-center md:justify-start">
            <p className="text-sm md:text-base">
              No Paypal? No Worries.{" "}
              <Link
                href="https://www.paypal.com/de/welcome/signup"
                className="text-dark-green font-bold  rounded-[50%] "
              >
                Create Paypal{" "}
              </Link>
            </p>
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default isAuth(Onboard);

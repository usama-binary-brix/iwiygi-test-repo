"use client";
import Button from "@/components/button/Button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const StripeAndPayout = ({ userDetail }: any) => {
  const [onBoardingLinkPre, setOnBoardingLinkPre] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<string>("individual");
  const router = useRouter();

  const handleOnBoarding = async () => {
    setOnBoardingLinkPre(true);
    let accessToken = localStorage.getItem("accessToken");
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/seller-stripe-onboarding?type=${accountType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      
      if (data?.data) {
        console.log("Stripe Onboarding URL:", data.data);
        window.open(data.data, "_blank");
      } else {
        toast.error("Failed to get Stripe onboarding link");
      }
    } catch (error) {
      toast.error("An error occurred while connecting to Stripe");
    }
    setOnBoardingLinkPre(false);
  };


  const handleUploadDocuments = async (accountId:string) => {
    if (!accountId) {
      toast.error("Stripe Account ID is missing!");
      return;
    }
  
    setOnBoardingLinkPre(true);
    let accessToken = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payments/upload-documents/${accountId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const data = await response.json();
  console.log(data, 'data')
      if (data?.data) {
        console.log("Stripe Upload Documents URL:", data.data.uploadLink);
        window.open(data.data.uploadLink, "_blank");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('first', error)
      toast.error("An error occurred while connecting to Stripe");
    }
  
    setOnBoardingLinkPre(false);
  };
  

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="md:max-w-[70%] lg:max-w-[65%] xl:max-w-[43%]">
        {userDetail?.stripeAccountId && userDetail?.stripeAccountStatus === "1" && (
          <p className="text-xl text-dark-green  mb-0 text-center">
            Your account is already connected
          </p>
        )}
        
        <div className="flex gap-4 items-center justify-center mt-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              className="text-bright-green ring-0"
              value="individual"
              checked={accountType === "individual"}
              onChange={() => setAccountType("individual")}
            />
            Individual
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="accountType"
              value="company"
              className="text-bright-green ring-0"

              checked={accountType === "company"}
              onChange={() => setAccountType("company")}
            />
           Business
          </label>
        </div>

        <div className="flex justify-center flex-col gap-6 items-center mt-6">
        {/* <Button
        disabled={userDetail?.stripeAccountId && userDetail?.stripeAccountStatus == null}
  type="success"
  text={
    userDetail?.stripeAccountId && userDetail?.stripeAccountStatus !== null && 
      ? `Re-Connect ${accountType === "individual" ? "Stripe" : "Business Stripe"}`
      : `Connect ${accountType === "individual" ? "Stripe" : "Business Stripe"}`
  }
  loading={onBoardingLinkPre}
  onClick={handleOnBoarding}
/> */}

{accountType === 'individual' && (
  <Button
    disabled={
      userDetail?.stripeAccountId && userDetail?.stripeAccountStatus == null
    }
    type="success"
    text={
      userDetail?.stripeAccountId && userDetail?.stripeAccountStatus !== null && userDetail.accountType === 'individual'
        ? 'Re-Connect Stripe'
        : 'Connect Stripe'
    }
    loading={onBoardingLinkPre}
    onClick={handleOnBoarding}
  />
)}

{accountType === 'company' && (
  <Button
    disabled={
      userDetail?.stripeAccountId && userDetail?.stripeAccountStatus == null
    }
    type="success"
    text={
      userDetail?.stripeAccountId && userDetail?.stripeAccountStatus !== null && userDetail.accountType === 'company'
        ? 'Re-Connect Business Stripe'
        : 'Connect Business Stripe'
    }
    loading={onBoardingLinkPre}
    onClick={handleOnBoarding}
  />
)}

{userDetail?.stripeAccountId && userDetail?.stripeAccountStatus == null && accountType === "company" && (
  <Button
    type="success"
    text={'Upload Documents'}
    loading={onBoardingLinkPre}
    onClick={() => handleUploadDocuments(userDetail.stripeAccountId)} 
  />
)}


        </div>

        <div>
          <h4 className="text-xl text-dark-green mb-0">Note:</h4>
          <p className="text-sm">
            When Buying & Selling you must register with STRIPE to Pay or
            Receive funds
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeAndPayout;

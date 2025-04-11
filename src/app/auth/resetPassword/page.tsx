"use client";
import Button from "@/components/button/Button";
import TextInput from "@/components/Form/TextInput";
import { useRouter } from "next/navigation";
import { FC } from "react";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IoEye, IoEyeOff } from "react-icons/io5";

const ResetPassword: FC = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const router = useRouter();
  const queryString =
    typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  useEffect(() => {
    let gettoken = urlParams.get("token");
    if (gettoken) {
      setToken(gettoken);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be 8 characters atleast");
      return;
    }
    setResetLoading(true);
    const ResetPasswordPostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/resetPassword`;
    try {
      setResetLoading(true);
      const response = await fetch(ResetPasswordPostApi, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
        setResetLoading(false);
      } else {
        toast.success("Password Reset successfully!");
        setResetLoading(false);
        router.push("/sign-in"); // Navigate to sign-in page
      }
    } catch (error) {
      setResetLoading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to Reset Password. Please try again."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <div className="p-4 flex flex-col gap-4 md:gap-8">
      <div className="bg-black border-2 border-bright-green p-4 md:p-8">
        <form
          // onSubmit={handleSubmit}
          className="flex justify-center flex-col items-center"
        >
          <div className="text-center text-[30px] font-bold  tracking-wider mb-4 uppercase">
            - Reset Password -
          </div>

          <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[45%]">
           <div className="relative">
           <TextInput
              required
              label="PASSWORD"
              placeholder="Enter Your New Password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
               <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <IoEyeOff className="text-xl text-black" />
                ) : (
                  <IoEye className="text-xl text-black" />
                )}
              </div>
           </div>
          </div>


       

          <div className="flex justify-center my-4">
            <Button
              text="Submit"
              onClick={handleSubmit}
              loading={resetLoading}
              type={"success"}
            />
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

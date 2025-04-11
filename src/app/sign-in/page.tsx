"use client";

import TextInput from "@/components/Form/TextInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { FC } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "@/components/button/Button";
import { useForgotPasswordMutation, useSignInMutation } from "../../store/api";
import { setUser } from "@/store/Slices/userSlice";
import { useDispatch } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface APIError {
  message?: string;
  error?: string;
  statusCode?: number;
}

const SignIn: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [ForgotError, setForgotError] = useState("");
  const [email, setEmail] = useState("");

  const [signIn, { isLoading: signInLoading }] = useSignInMutation();
  const [forgotPassword, { isLoading: forgotPasswordLoading }] =
    useForgotPasswordMutation();

  const handleClosePopup = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await signIn({ username, password }).unwrap();
      if (response?.data) {
        toast.success(response.message || "Sign-in successful!");
        const userData = response?.data;
        const accessToken = userData?.tokens?.access_token;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("User", JSON.stringify(userData?.user));
        dispatch(setUser({ user: userData?.user, accessToken }));
        router.push("/");
      }
    } catch (error) {
      if ((error as FetchBaseQueryError)?.data) {
        const apiError = error as FetchBaseQueryError;
        const errorData = apiError.data as APIError;
        toast.error(errorData.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleForgotPasswordClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    setPasswordLoading(true);
    try {
      const response = await forgotPassword({email}).unwrap();

      if (response) {
        toast.success(response?.message);
        handleCloseModal();
      }
    } catch (err) {
      if ((err as FetchBaseQueryError)?.data) {
        const apiError = err as FetchBaseQueryError;
        const errorData = apiError.data as APIError;
        toast.error(
          errorData.message || "An error occurred while sending the email."
        );
      } else {
        toast.error("An error occurred while sending the email.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <div className="p-4 flex flex-col gap-8 lg:gap-12">
      <div className="bg-black border-2 border-bright-green p-4 lg:p-6">
        <form
          // onSubmit={handleSubmit}
          className="flex justify-center flex-col items-center"
        >
          <div className="text-center text-xl lg:text-2xl font-bold tracking-wider mb-4">
            - LOG IN -
          </div>

          <div className="text-center text-sm lg:text-md font-bold tracking-wider mb-4">
            No Account?{" "}
            <Link className="text-bright-green" href={"/sign-up"}>
              Sign Up
            </Link>
          </div>

          <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[30%]">
            <TextInput
              // label="USERNAME"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <div className="relative">
              <TextInput
                placeholder="Enter Your Password"
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
              <p
                className="text-sm text-dark-green text-end mt-2 mb-3 cursor-pointer"
                onClick={handleForgotPasswordClick}
              >
                Forgot Your Password or Username?
              </p>
            </div>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          <Button
            type="success"
            text="Submit"
            loading={signInLoading}
            onClick={handleSubmit}
          />
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-black border-2 border-bright-green p-4 lg:p-6 w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl lg:text-2xl font-bold mb-0">
                Forgot Password
              </h2>
              <button
                className="text-white font-bold z-10"
                onClick={handleClosePopup}
              >
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            <form
            //  onSubmit={handleForgotPasswordSubmit}
            >
              <TextInput
                label="Enter your email"
                placeholder="Enter Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {ForgotError && <div className="text-red-500">{ForgotError}</div>}
              <div className="mt-4 gap-4 flex flex-row justify-end pt-5 ">
                <Button
                  type="success"
                  text="Cancel"
                  onClick={handleCloseModal}
                />
                <Button
                  type="success"
                  text="Submit"
                  loading={forgotPasswordLoading}
                  onClick={handleForgotPasswordSubmit}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <Link href="/sign-up">
        <div className="flex justify-center mb-16">
          <div className="border-2 border-bright-green bg-black rounded-[50%] px-16 py-4 lg:px-32 lg:py-6 text-center flex flex-col items-center">
            <div className="text-lg lg:text-2xl font-bold">Not a Member ?</div>
            <div className="text-lg lg:text-2xl font-bold">
              Click here to Sign Up . . .
            </div>
            <div className="text-lg lg:text-2xl font-bold">
              It's Quick, Free & Easy !
            </div>

            <Image
              src="/images/underline.png"
              alt="underline"
              width={160}
              height={40}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SignIn;

"use client";
import TextInput from "@/components/Form/TextInput";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import ButtonLoading from "@/components/generic/ButtonLoading";
import ButtonWithLoading from "@/components/button/ButtonWIthLoading";
import Button from "@/components/button/Button";
import {
  useResendVerificationEmailMutation,
  useSignupMutation,
} from "@/store/api";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";

const SignUp: FC = () => {
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [resendVerificationEmail, { isLoading: emailLoading }] =
    useResendVerificationEmailMutation();
  const [signup, { isLoading: loading }] = useSignupMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false);
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phonenumber: "1234567891",
    username: "",
    zipCode: "",
    email: "",
    password: "",
    retypepassword: "",
  });

  interface ErrorResponse {
    message: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (requestProcessing) {
  //     toast.error("Request is Already Processing, Please wait");
  //     return;
  //   }
  //   setError("");
  //   localStorage.removeItem("email");
  //   if (formData.password !== formData.retypepassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }
  //   const SignUpPostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/signup`;
  //   setRequestProcessing(true);
  //   try {
  //     await axios.post(SignUpPostApi, formData).then((response) => {
  //       setRequestProcessing(false);
  //       if (response) {
  //         localStorage.setItem("email", formData.email);
  //         setFormSubmitted(true);
  //         toast.success(
  //           "Sign up Completed. Verification email has been sent, Please check your Email and/or Spam Folder"
  //         );
  //       }
  //     });
  //   } catch (err) {
  //     setRequestProcessing(false);
  //     const error = err as AxiosError<ErrorResponse>;
  //     setError(
  //       error.response?.data?.message || "An error occurred. Please try again."
  //     );
  //   }
  // };

  // const handleVerficationcodeSend = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const getEmail = localStorage.getItem("email");
  //   if (!getEmail) return;
  //   else {
  //     const VerficationcodeSendApi = `${process.env.NEXT_PUBLIC_API}/api/auth/resendVerificationEmail/${getEmail}`;
  //     const { retypepassword, ...dataToSend } = formData;
  //     try {
  //       await axios.post(VerficationcodeSendApi).then((response) => {
  //         if (response) {
  //           toast.success(
  //             "Verification email has been sent, Please check your Email and/or Spam Folder"
  //           );
  //         }
  //       });
  //     } catch (err) {
  //       const error = err as AxiosError<ErrorResponse>;
  //       setError(
  //         error.response?.data?.message ||
  //           "An error occurred. Please try again."
  //       );
  //     }
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    if (requestProcessing) {
      toast.error("Request is Already Processing, Please wait");
      return;
    }

    setError("");
    localStorage.removeItem("email");

    const password = formData.password;
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (formData.password !== formData.retypepassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // const phoneNumber = formData.phonenumber;
    // const phoneRegex = /^[0-9]{10,15}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   toast.error("Please enter a valid phone number.");
    //   return;
    // }
    const { retypepassword, ...dataToSend } = formData;

    try {
      setRequestProcessing(true);
      const response = await signup(dataToSend).unwrap();
      setRequestProcessing(false);

      if (response) {
        localStorage.setItem("email", formData.email);
        setTimeout(() => {
          setFormSubmitted(true);
        }, 30000);

        setConfirmationPopup(true);

        toast.success(response.message);
      }
    } catch (err: any) {
      setRequestProcessing(false);
      toast.error(err?.data?.message);
    }
  };

  const handleVerficationcodeSend = async (e: React.FormEvent) => {
    // e.preventDefault();

    const getEmail = localStorage.getItem("email");
    if (!getEmail) return;

    try {
      const response = await resendVerificationEmail(getEmail).unwrap(); // Unwrap the resolved promise

      if (response) {
        toast.success(response.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };
  const handleClosePopup = () => setConfirmationPopup(false);

  return (
    <div className="p-4">
      <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
        <div className="text-center text-2xl lg:text-4xl text-[30px] font-bold  tracking-wider mb-4">
          - SIGN UP -
        </div>

        <div className="text-center text-sm lg:text-md font-bold  tracking-wider mb-4">
          Already Have an Account?{" "}
          <Link className="text-bright-green" href={"/sign-in"}>
            Log In
          </Link>
        </div>
        <form
          className="flex justify-center flex-col items-center"
          // onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4 w-full md:max-w-[70%] lg:max-w-[40%] xl:max-w-[30%]">
            <TextInput
              name="fullname"
              // label="FULL NAME*"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
            />
            <TextInput
              name="username"
              // label="USERNAME*"
              value={formData.username}
              onChange={handleChange}
              placeholder="Create Your Username"
            />
            <div>
              <TextInput
                name="zipCode"
                // label="USERNAME*"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Enter Your Address Zip Code"
              />
              <p className="text-center text-[13px]">
              Sellers will use this Zip Code in offers sent to you.
              </p>
            </div>
            <TextInput
              // label="EMAIL*"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter Your Email Address"
            />

            <div className="relative">
              <TextInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Your Password"
                type={isPasswordVisible ? "text" : "password"}
              />
              <div
                className="absolute top-1/2 right-1 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? (
                  <IoEyeOff size={20} className="text-black" />
                ) : (
                  <IoEye size={20} className="text-black" />
                )}
              </div>
            </div>

            <div className="relative">
              <TextInput
                name="retypepassword"
                value={formData.retypepassword}
                onChange={handleChange}
                placeholder="Confirm You Password"
                type={isRetypePasswordVisible ? "text" : "password"}
              />
              <div
                className="absolute top-1/2 right-1 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setIsRetypePasswordVisible((prev) => !prev)}
              >
                {isRetypePasswordVisible ? (
                  <IoEyeOff size={20} className="text-black" />
                ) : (
                  <IoEye size={20} className="text-black" />
                )}
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="flex">
            <div className="flex items-center pt-5 pb-2">
              <Button
                type="success"
                text="Submit"
                loading={loading}
                onClick={handleSubmit}
              />
            </div>
          </div>
          {formSubmitted && (
            <>
              <div className="flex flex-col gap-2 justify-center text-center mt-5 ">
                <p>Didn't get confirmation email? </p>
                <Button
                  type="success"
                  text="Resend Verification Email"
                  loading={emailLoading}
                  onClick={handleVerficationcodeSend}
                />
              </div>
            </>
          )}
        </form>

        {confirmationPopup && (
          <>
            <div className="relative">
              <div className="fixed  inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="p-5">
                  <div
                    className="bg-black py-14 px-10 rounded-lg relative max-w-[30rem] max-h-[90vh] overflow-auto mt-3"
                    style={{
                      boxShadow: "1px 1px 10px 2px green",
                    }}
                  >
                    <button
                      onClick={handleClosePopup}
                      className="absolute top-2 right-2 text-white-600 font-bold"
                    >
                      <IoClose className="text-[2rem]" />
                    </button>

                    <div className="flex justify-center">
                      <Image
                        src="/images/logo.png"
                        alt="Perfume"
                        width={220}
                        height={100}
                        className=" cursor-pointer mb-[12px] max-w-[50%] md:max-w-[100%] lg:max-w-[100%] xl:max-w-[100%]"
                      />
                    </div>

                    <h2 className="text-[0.8rem] md:text-xl font-semibold my-1 text-center">
                      <span className="text-white p-2 leading-8 uppercase">
                        Your Registration is Complete!
                      </span>
                    </h2>

                    <h5 className="text-[0.8rem] md:text-xl my-1 text-center">
                      Please check your email to Confirm your FREE Membership
                    </h5>
                    <p className="text-xs md:text-sm mt-5 text-center">
                   If message is not received, please check your SPAM folder.
                    </p>
                    {/* {formSubmitted && confirmationPopup && (
                      <>
                        <div className="flex flex-col gap-2 justify-center items-center text-center mt-5 ">
                          <p>Didn't get confirmation email? </p>
                          <Button
                            type="success"
                            text="Resend Verification Email"
                            className="w-[fit-content]"
                            loading={emailLoading}
                            onClick={handleVerficationcodeSend}
                          />
                        </div>
                      </>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;

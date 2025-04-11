"use client";
import TextInput from "@/components/Form/TextInput";
import { FC, useState, useEffect } from "react";
import Link from "next/link";
import isAuth from "@/components/auth/isAuth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/button/Button";

interface FormValues {
  password: string;
  re_password: string;
}

const initialValues: FormValues = {
  password: "",
  re_password: "",
};

const validationSchema = Yup.object({
  password: Yup.string().required("Password Required"),
  re_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Retype Password Required"),
});

const UpdatePassword = () => {
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [initialValues, setInitialValues] = useState<FormValues>({
    password: "",
    re_password: "",
  });
  interface ErrorResponse {
    message: string;
  }

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = localStorage.getItem("User");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setInitialValues((prevValues) => ({
          ...prevValues,
          username: parsedUser.username || "",
          email: parsedUser.email || "",
        }));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    try {
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      if (!oldPassword || !newPassword) {
        setError("Please enter both old and new password.");
        return;
      }
      setLoading(true);
      const ChangePasswordPostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/updatePassword`;
      const response = await fetch(ChangePasswordPostApi, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        toast.error(responseData.message);
        setLoading(false);
      } else {
        const responseData = await response.json();

        toast.success(responseData.message);
        setShowChangePasswordPopup(false);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Formik<FormValues>
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        // onSubmit={async (values) => {
        //   await handleUpdateProfile(values);
        // }}
      >
        {({ handleSubmit, handleChange, values }) => ( */}
      <form
        onSubmit={handleChangePasswordSubmit}
        className="flex justify-center flex-col items-center"
      >
        <div className="flex flex-col gap-6 w-full md:max-w-[70%] lg:max-w-[65%] xl:max-w-[43%]">
          <TextInput
            label="OLD PASSWORD:"
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            name="oldpassword"
            type="password"
            placeholder="Enter Old Password"
          />
          <TextInput
            className="mt-2"
            label="NEW PASSWORD:"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            name="newpassword"
            type="password"
            placeholder="Enter New Password"
          />
          <div className="flex justify-end">
            {/* <button
              type="submit"
              className="bg-dark-green text-black rounded-lg px-4 py-2 uppercase font-bold text-lg lg:text-2xl  w-[fit-content]"
            >
              Submit
            </button> */}

            <Button
              type="success"
              text="Submit"
              loading={loading}
              onClick={handleChangePasswordSubmit}
            />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      {/* )}
      </Formik>
      */}
    </>
  );
};

export default UpdatePassword;

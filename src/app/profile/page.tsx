"use client";
import TextInput from "@/components/Form/TextInput";
import { FC, useState,useEffect } from "react";
import Link from "next/link";
import isAuth from "@/components/auth/isAuth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  username: string;
  email: string;
  password: string;
  re_password: string;
}

const initialValues: FormValues = {
  username: '',
  email: '',
  password: '',
  re_password: ''
}

const validationSchema = Yup.object({
  username: Yup.string().required('UserName Required'),
  email: Yup.string().email('Invalid email format').required('Email Required'),
  password: Yup.string().required('Password Required'),
  re_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Retype Password Required')
})

const Profile: FC = () => {
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const handleToggleChangePasswordPopup = () => {
    setShowChangePasswordPopup(!showChangePasswordPopup);
  };

  const handleClosePopup = () => {
    handleToggleChangePasswordPopup()
  };
  
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
    e.preventDefault();

    try {
      let accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      if (!oldPassword || !newPassword) {
        setError("Please enter both old and new password.");
        return;
      }

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
        setError(responseData.message);
      } else {
        toast.success("Password Changed successfully!");
        setShowChangePasswordPopup(false);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

 
  const handleUpdateProfile = async (values: FormValues) => {
    try {
      
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Access token not found");
        return;
      }
      if (values.password !== values.re_password) {
        toast.error("Both Passwords Should be the Same");
        return;
      }
  
      const UpdateProfilePostApi = `${process.env.NEXT_PUBLIC_API}/api/auth/updateProfile`;
      const response = await fetch(UpdateProfilePostApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        setError(responseData.message);
      } else {
        toast.success("Profile Updated successfully!");
        setShowChangePasswordPopup(false);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="p-4">
      <div className="bg-black border-2 border-bright-green p-2">
        <div className="flex flex-col sm:flex-row gap-4 justify-center py-8 sm:py-12">
           <Link
            href="/my-profile"
            className="text-center border-2 border-bright-green rounded-[50%] px-4 py-3 sm:px-8 sm:py-6"
          >
            <div className=" text-xl sm:text-2xl font-bold leading-tight">
              Go to
            </div>
            <div className=" text-xl sm:text-2xl font-bold">
              My Account
            </div>
          </Link>
         
          <Link
            href="/user-listing"
            className="text-center border-2 border-bright-green rounded-[50%] px-4 py-3 sm:px-8 sm:py-6"
          >
            <div className=" text-xl sm:text-2xl font-bold leading-tight">
              Go to
            </div>
            <div className=" text-xl sm:text-2xl font-bold">
              My Listings
            </div>
          </Link>

          <Link
            href="/saved-listings"
            className="text-center border-2 border-bright-green rounded-[50%] px-4 py-3 sm:px-8 sm:py-6"
          >
            <div className=" text-xl sm:text-2xl font-bold leading-tight">
              Go to
            </div>
            <div className=" text-xl sm:text-2xl font-bold">
              Saved Listings
            </div>
          </Link>
          <Link
            href="/my-orders"
            className="text-center border-2 border-bright-green rounded-[50%] px-4 py-3 sm:px-8 sm:py-6"
          >
            <div className=" text-xl sm:text-2xl font-bold leading-tight">
              Go to
            </div>
            <div className=" text-xl sm:text-2xl font-bold">
              My Orders
            </div>
          </Link>
          <Link
            href="/messages"
            className="text-center border-2 border-bright-green rounded-[50%] px-4 py-3 sm:px-8 sm:py-6"
          >
            <div className=" text-xl sm:text-2xl font-bold leading-tight">
              Go to
            </div>
            <div className=" text-xl sm:text-2xl font-bold">
              Messages
            </div>
          </Link>
        </div>
{/* 
        <div className="text-center text-2xl sm:text-3xl font-bold  tracking-wider mb-4">
          - Your Profile Page -
        </div> */}

        {/* <Formik<FormValues>
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleUpdateProfile(values);
          }}
          >
            {({ handleSubmit, handleChange, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 pb-8 sm:pb-12 sm:items-center">

                  <div>
                    <Field
                      name="username"
                      as={TextInput}
                      label="USERNAME:"
                      value={values.username}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    
                    <div>
                      <Field
                        name="password"
                        type="password"
                         label="PASSWORD:"
                        as={TextInput}
                        value={values.password}
                        onChange={handleChange}
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500" />
                    </div>

                    <button
                      className="text-black font-bold bg-dark-green rounded px-3 py-1"
                      onClick={handleToggleChangePasswordPopup}
                      type="button"
                    >
                      Change Password
                    </button>
                  </div>

                  <div>
                    <Field
                      name="re_password"
                      type="password"
                      label="RETYPE PASSWORD:"
                      as={TextInput}
                      value={values.re_password}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="re_password" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <Field
                      name="email"
                      type="email"
                      label="EMAIL:"
                      as={TextInput}
                      value={values.email}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-dark-green text-black rounded-[50%] px-[50px] py-[10px] font-bold text-[24px] "
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            )}
        </Formik> */}


      </div>
      {/* {showChangePasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

          <button
              className="relative right-2 text-white font-bold z-10"
              style={{left: "29rem",top: "-8rem"}}
              onClick={handleClosePopup}
            >
              X
            </button>
          <div className="bg-black border-2 border-bright-green p-4 sm:p-8 mt-2">
            <form onSubmit={handleChangePasswordSubmit} className="mb-2 pt-2">
              <div className="flex flex-col gap-6 mb-4">
                <TextInput
                  label="OLD PASSWORD:"
                  onChange={(e) => setOldPassword(e.target.value)}
                  value={oldPassword}
                  name="oldpassword"
                  type="password"
                />
                <TextInput
                  className="mt-2"
                  label="NEW PASSWORD:"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  name="newpassword"
                  type="password"
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-dark-green text-black rounded-[50%] px-8 py-2 sm:px-16 sm:py-4 font-bold text-xl sm:text-2xl "
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default isAuth(Profile);

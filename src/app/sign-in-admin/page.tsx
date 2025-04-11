"use client";
import TextInput from "@/components/Form/TextInput";
import { AxiosError } from "axios";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
// ADMIN PAGE

const SignInAdmin: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  interface ErrorResponse {
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    const SignInPostApi = `${process.env.NEXT_PUBLIC_API}/api/admin/signin`;
    try {
      const response = await fetch(SignInPostApi, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const responseData = await response.json();
        setError(responseData.message);
      } else {
        const data = await response.json();
        if (data?.data?.user?.role === "admin") {
          toast.success("Signed in successfully!");
          const access_token = data?.data?.tokens?.access_token;
          localStorage.setItem("accessToken", access_token);
          router.push('/')
          
        } else setError("Signin Failed. Admin not Found.");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="p-4 flex flex-col gap-8 lg:gap-12">
      <div className="bg-black border-2 border-bright-green p-4 lg:p-6">
        <form onSubmit={handleSubmit}>
          <div className="text-center text-xl lg:text-2xl font-bold  tracking-wider mb-4">
            - ADMIN SIGN IN -
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <TextInput
              label="USERNAME:"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <TextInput
              label="PASSWORD:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full"
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-8 mb-6">
            <button
              type="submit"
              className="bg-dark-green text-black rounded-[50%] px-4 py-2 lg:px-8 lg:py-4 font-bold text-lg lg:text-2xl "
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInAdmin;

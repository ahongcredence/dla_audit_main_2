"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    if (isFormValid) {
      router.push("/aoi-selection");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-sm bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/auditinsight-no-shadow.svg"
            alt="Audit Insight Logo"
            width={200}
            height={60}
            className="h-12"
          />
        </div>

        {/* Auth Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className={`w-full rounded-sm px-4 py-2 font-medium transition-colors ${
              isFormValid
                ? "cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

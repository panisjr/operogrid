"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const toastID = toast.loading("Signing in...");

    try {
      const res = await fetch("/api/requests?type=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        toast.error("Invalid username or password.", { id: toastID });
        return;
      }

      toast.success("Welcome back 👋", { id: toastID });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.", { id: toastID });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FFE5E7] via-[#FFD3D6] to-[#F9DCC0] px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-[#F9E6E4]/80 backdrop-blur-xl border border-[#FFD3D6] p-10 rounded-3xl shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-[#FFB0B5] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">NARJ</span>
          </div>

          <h1 className="text-3xl font-bold text-[#5A3E40]">Welcome Back</h1>
          <p className="text-[#9C6B6F] text-sm mt-2 font-medium">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-[#6D4C4F]">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              className="w-full mt-1 px-4 py-3 bg-white border border-[#FFD3D6] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#FFB0B5]
                         focus:border-transparent transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-[#6D4C4F]">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full mt-1 px-4 py-3 bg-white border border-[#FFD3D6] rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#FFB0B5]
                         focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFB0B5] text-white py-3 rounded-xl
                       hover:bg-[#FFC6CA] transition-all duration-200
                       font-semibold shadow-md
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-[#9C6B6F] mt-8">
          © {new Date().getFullYear()} NARJ
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2, UserPlus } from "lucide-react";
import { SignUpProps } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUp({ setFormType }: SignUpProps) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warning("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Account created successfully");

      setLoading(false);

      router.push("/dashboard");
    } catch {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  /* ================= Animation Variants ================= */

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2F2] px-4 overflow-hidden relative">
      {/* ========== BACKGROUND BLOBS ========== */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#FFE5E7] rounded-full blur-[120px] opacity-60"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-[#F9DCC0] rounded-full blur-[120px] opacity-50"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] right-[10%] w-75 h-75 bg-[#FFD3D6] rounded-full blur-[100px]"
        />

        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* ========== SIGN UP CARD ========== */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md z-10 relative"
      >
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-linear-to-tr from-[#FFB0B5] to-[#f9dcc0] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#FFD3D6] rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <span className="text-[#FFB0B5] font-black text-xl tracking-tighter">
                  NARJ
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-[#4A3234] tracking-tight">
              Create Account
            </h1>
            <p className="text-[#8C6064]/70 text-sm mt-3 font-medium">
              Join us and start your journey.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Full Name
              </label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A8D]" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white rounded-2xl focus:ring-4 focus:ring-[#FFB0B5]/10 focus:border-[#FFB0B5] transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A8D]" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white rounded-2xl focus:ring-4 focus:ring-[#FFB0B5]/10 focus:border-[#FFB0B5] transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08A8D]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/60 border border-white rounded-2xl focus:ring-4 focus:ring-[#FFB0B5]/10 focus:border-[#FFB0B5] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B08A8D]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full mt-2 px-4 py-4 bg-white/60 border border-white rounded-2xl focus:ring-4 focus:ring-[#FFB0B5]/10 focus:border-[#FFB0B5] transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-[#4A3234] hover:bg-[#322123] text-white py-4 rounded-2xl font-bold shadow-xl transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <UserPlus size={18} />
                  </div>
                )}
              </button>
            </motion.div>
            {/* Sign Up Redirect */}
            <motion.div variants={itemVariants} className="mt-5 text-center">
              <p className="text-sm text-[#8C6064]/80">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setFormType?.(true)}
                  className="relative inline-block font-semibold text-[#FFB0B5] hover:text-[#4A3234] transition-colors duration-300 cursor-pointer"
                >
                  Sign in
                  {/* Animated underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#FFB0B5] transition-all duration-300 group-hover:w-full" />
                </button>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-[10px] font-bold text-[#B08A8D] uppercase tracking-[0.3em] opacity-60">
              © {new Date().getFullYear()} Narj Studio
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

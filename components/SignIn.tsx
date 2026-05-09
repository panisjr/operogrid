"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Loader2, LogIn, Mail } from "lucide-react";
import { SignInProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

// Animation Variants for the Form Elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function SignIn({ setFormType }: SignInProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const supabase = createClient();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");

    router.push("/dashboard");

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2F2] px-4 overflow-hidden relative">
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Blob 1 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#FFE5E7] rounded-full blur-[120px] opacity-60"
        />
        {/* Animated Blob 2 */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-150 h-150 bg-[#F9DCC0] rounded-full blur-[120px] opacity-50"
        />
        {/* Animated Blob 3 */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-75 h-75 bg-[#FFD3D6] rounded-full blur-[100px]"
        />

        {/* Grain/Noise Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md z-10 relative"
      >
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          {/* Logo & Header */}
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-linear-to-tr from-[#FFB0B5] to-[#f9dcc0] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#FFD3D6] rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <span className="text-[#FFB0B5] font-black text-xl tracking-tighter">
                  NARJ
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-[#4A3234] tracking-tight">
              Sign In
            </h1>
            <p className="text-[#8C6064]/70 text-sm mt-3 font-medium">
              Welcome back! Please enter your details.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Username Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#B08A8D] group-focus-within:text-[#FFB0B5] transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white focus:bg-white rounded-2xl
                             focus:outline-none focus:ring-4 focus:ring-[#FFB0B5]/10 
                             focus:border-[#FFB0B5] transition-all duration-300 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6064] ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#B08A8D] group-focus-within:text-[#FFB0B5] transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white/60 border border-white focus:bg-white rounded-2xl
                             focus:outline-none focus:ring-4 focus:ring-[#FFB0B5]/10 
                             focus:border-[#FFB0B5] transition-all duration-300 shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#B08A8D] hover:text-[#FFB0B5] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-[#4A3234] hover:bg-[#322123] text-white py-4 rounded-2xl
                           transition-all duration-300 font-bold shadow-xl overflow-hidden
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Shine effect on button hover */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />

                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <LogIn
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
            {/* Sign Up Redirect */}
            <motion.div variants={itemVariants} className=" text-center">
              <p className="text-sm text-[#8C6064]/80">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setFormType?.(false)}
                  className="relative inline-block font-semibold text-[#FFB0B5] hover:text-[#4A3234] transition-colors duration-300 cursor-pointer"
                >
                  Sign up
                  {/* Animated underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#FFB0B5] transition-all duration-300 group-hover:w-full" />
                </button>
              </p>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-[10px] font-bold text-[#B08A8D] uppercase tracking-[0.3em] opacity-60">
              © {new Date().getFullYear()} Narj Studio • Privacy Policy
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

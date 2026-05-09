"use client";

import { createClient } from "@/lib/supabase/client";
import { Search, Bell, MessageSquare, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const today: string = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const router = useRouter();

  const supabase = createClient();

  const handleSignOut = async () => {
    const toastId = toast.loading("Signing out...");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message, {
          id: toastId,
        });

        return;
      }

      toast.success("Logged out successfully", {
        id: toastId,
      });

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed", {
        id: toastId,
      });
    }
  };
  return (
    <header className="bg-white border-b border-[#FFD3D6] px-8 py-3.75 font-lexend">
      <div className="flex items-center justify-between">
        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C6B6F]" />
            <input
              type="text"
              placeholder="Search..."
              className="
                pl-10 pr-4 py-2.5
                border border-[#FFD3D6]
                rounded-xl
                text-sm
                text-[#5A3E40]
                placeholder:text-[#9C6B6F]
                focus:outline-none
                focus:ring-2
                focus:ring-[#FFB0B5]
                focus:border-transparent
                transition
                w-72
              "
            />
          </div>

          {/* Notifications */}
          <button
            className="
              relative p-2.5
              bg-[#F9E6E4]
              border border-[#FFD3D6]
              rounded-xl
              hover:bg-[#FFC6CA]
              transition-all
              shadow-sm
            "
          >
            <Bell className="w-5 h-5 text-[#6D4C4F]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FFB0B5] rounded-full ring-2 ring-[#FFE5E7]" />
          </button>

          {/* Messages */}
          <button
            className="
              relative p-2.5
              bg-[#F9E6E4]
              border border-[#FFD3D6]
              rounded-xl
              hover:bg-[#FFC6CA]
              transition-all
              shadow-sm
            "
          >
            <MessageSquare className="w-5 h-5 text-[#6D4C4F]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F9DCC0] rounded-full ring-2 ring-[#FFE5E7]" />
          </button>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex flex-row items-center gap-5">
          <div className="text-sm font-medium text-[#6D4C4F] bg-[#F9E6E4] px-4 py-2 rounded-xl border border-[#FFD3D6] shadow-sm">
            {today}
          </div>
          <button
            onClick={handleSignOut}
            className={`
         flex items-center justify-center gap-3 rounded-xl
        w-10 h-10 bg-[#FFB0B5]
        text-white hover:bg-[#FFC6CA] hover:text-[#5A3E40]
        transition-all duration-200 cursor-pointer
      `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
}

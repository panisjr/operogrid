import { TodoProvider } from "../context/TodoContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <TodoProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-lexend">
        <Sidebar userMeta={user} />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </TodoProvider>
  );
}

import { DataProvider } from "../context/DataContext";
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

  const currentUser = {
    id: user.id,
    email: user.email ?? "",
    full_name: user.user_metadata?.full_name,
  };
  return (
    <DataProvider initialUser={currentUser}>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-lexend">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </DataProvider>
  );
}

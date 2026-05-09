import { DataProvider } from "../context/DataContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await supabase.auth.getSession()).data.session;
  const userMeta = session?.user.user_metadata;

  const currentUser = {
    id: user.id,
    email: user.email ?? "",
    full_name: user.user_metadata?.full_name,
  };
  return (
    <DataProvider initialUser={currentUser}>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-lexend">
        <Sidebar userMeta={userMeta} />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </DataProvider>
  );
}

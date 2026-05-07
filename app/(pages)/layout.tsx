import { TodoProvider } from "../context/TodoContext";
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

  return (
    <TodoProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-lexend">
        <Sidebar userMeta={userMeta} />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </TodoProvider>
  );
}

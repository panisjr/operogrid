import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { User } from "@/lib/types";
import { TodoProvider } from "../context/TodoContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { toast } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headerList = await headers();

  const host = headerList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const baseUrl = `${protocol}://${host}`;

  const token = cookieStore.get("WTBkR2VWbFhNVFk9")?.value;
  let currentUser = null;
  if (!token) {
    redirect("/");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const res = await fetch(`${baseUrl}/api/users`, {
      method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    if (!Array.isArray(data)) {
      console.error("Users is not an array:", data);
      return;
    }
    const foundUser = data.find(
      (u: User) => String(u.id) === String(decoded.id),
    );
    if (foundUser) {
      currentUser = foundUser;
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }

  return (
    <TodoProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-lexend">
        <Sidebar currentUser={currentUser} />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </TodoProvider>
  );
}

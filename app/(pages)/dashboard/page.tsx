"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Server, TrendingUp } from "lucide-react";
import Calendar from "@/components/Calendar";
import { CalendarTodo } from "@/lib/types";
import CalendarModal from "@/components/CalendarModal";

/* =========================
   ✅ TYPES
========================= */

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}

interface Activity {
  id: string;
  message: string;
  date: string;
}

/* =========================
   ✅ MOCK DATA (Replace with API later)
========================= */

const mockStats: StatCard[] = [
  {
    title: "Total Users",
    value: 124,
    icon: Users,
    description: "Active system users",
  },
  {
    title: "Terminal Nodes",
    value: 32,
    icon: Server,
    description: "Connected nodes",
  },
  {
    title: "System Growth",
    value: 18,
    icon: TrendingUp,
    description: "Growth this month (%)",
  },
];

const mockActivity: Activity[] = [
  {
    id: "1",
    message: "New terminal node added",
    date: "2 hours ago",
  },
  {
    id: "2",
    message: "Admin updated system settings",
    date: "5 hours ago",
  },
  {
    id: "3",
    message: "User John logged in",
    date: "Yesterday",
  },
];

/* =========================
   ✅ COMPONENT
========================= */

export default function Dashboard() {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
const [todos, setTodos] = useState<CalendarTodo[]>([]);

// Load
useEffect(() => {
  const stored = localStorage.getItem("calendar-todos");
  if (stored) setTodos(JSON.parse(stored));
}, []);

// Save
useEffect(() => {
  localStorage.setItem("calendar-todos", JSON.stringify(todos));
}, [todos]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Analytics Section */}
      <div className="lg:col-span-2 bg-[#F9E6E4] border border-[#FFD3D6] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard size={18} className="text-[#5A3E40]" />
          <h2 className="text-lg font-semibold text-[#5A3E40]">
            System Analytics
          </h2>
        </div>

        <div className="h-48 flex items-center justify-center bg-[#FFD3D6]/40 rounded-xl text-[#9C6B6F] text-sm">
          Chart placeholder (Integrate Recharts / Chart.js later)
        </div>
      </div>

      {/* Replace Recent Activity with Calendar + Activity Stack */}
      <div className="space-y-6">
        <Calendar onOpen={() => setIsCalendarOpen(true)} />

        {isCalendarOpen && (
          <CalendarModal
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            todos={todos}
            setTodos={setTodos}
          />
        )}

        <div className="bg-[#F9E6E4] border border-[#FFD3D6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#5A3E40] mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-4">
            {mockActivity.map((activity) => (
              <li
                key={activity.id}
                className="p-3 rounded-xl bg-[#FFE5E7] border border-[#FFD3D6]"
              >
                <p className="text-sm text-[#5A3E40] font-medium">
                  {activity.message}
                </p>
                <p className="text-xs text-[#9C6B6F] mt-1">{activity.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

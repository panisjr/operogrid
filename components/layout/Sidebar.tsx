"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Server,
  Search,
  BarChart,
} from "lucide-react";
import { SidebarProps } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: ["admin", "superadmin"],
  },
  {
    name: "Terminal Nodes",
    icon: Server,
    href: "/terminal-nodes",
    roles: ["superadmin"],
    subMenu: [
      {
        name: "Node Overview",
        icon: BarChart,
        href: "/terminal-nodes",
      },
      {
        name: "Find by Client",
        icon: Search,
        href: "/terminal-nodes/search",
      },
    ],
  },
];

export default function Sidebar({ userMeta }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // const filteredMenu = menuItems.filter(
  //   (item) => !item.roles || item.roles.includes(userMeta?.role ?? ""),
  // );
  return (
    <aside
      className={`
    ${collapsed ? "w-20" : "w-72"}
    bg-white
    min-h-screen flex flex-col
    transition-all duration-300 ease-in-out
    relative font-lexend
    border-r border-[#FFD3D6]
    overflow-visible text-sm text-[#6D4C4F]
  `}
    >
      {/* ================= LOGO ================= */}
      <div
        className={`flex items-center gap-3 px-6 border-b border-[#FFD3D6] ${!collapsed ? "py-3.5" : "py-4"}`}
      >
        <div className="w-10 h-10 bg-[#FFB0B5] rounded-xl flex items-center justify-center shadow-md">
          <Coffee className="w-5 h-5 text-white" />
        </div>

        {!collapsed && (
          <div>
            <h1 className="font-semibold text-lg tracking-wide text-[#5A3E40]">
              NARj
            </h1>
            <p className="text-[#9C6B6F] text-xs tracking-wide">Pink yarn</p>
          </div>
        )}
      </div>

      {/* ================= COLLAPSE BUTTON ================= */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
      absolute -right-3 top-15 w-7 h-7
      bg-[#F9E6E4] border border-[#FFD3D6]
      rounded-full flex items-center justify-center
      text-[#9C6B6F] hover:bg-[#FFC6CA] hover:text-[#5A3E40]
      transition-all shadow-sm cursor-pointer
      z-10
    "
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-3 py-6">
        <Accordion
          type="single"
          collapsible
          defaultValue={
            menuItems.find((item) =>
              item.subMenu?.some((sub) => pathname.startsWith(sub.href)),
            )?.name
          }
          className="space-y-1"
        >
          {menuItems.map((item) => {
            const hasSubMenu = item.subMenu?.length;
            const isActive =
              pathname === item.href ||
              item.subMenu?.some((sub) => pathname.startsWith(sub.href));

            /* ================= NO SUBMENU ================= */
            if (!hasSubMenu) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                group flex items-center gap-3
                ${collapsed ? "justify-center px-0" : "px-2"}
                py-3 rounded-xl relative
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#F9E6E4] text-[#5A3E40] font-semibold border border-[#FFC6CA]"
                    : "text-[#6D4C4F] hover:bg-[#F9E6E4] hover:text-[#5A3E40]"
                }
              `}
                >
                  <div
                    className={`
                  flex items-center justify-center rounded-lg shrink-0
                  ${collapsed ? "w-10 h-10" : "w-9 h-9"}
                  ${
                    isActive
                      ? "bg-[#FFD3D6]"
                      : "bg-white group-hover:bg-[#FFD3D6]"
                  }
                `}
                  >
                    <item.icon
                      className={`${collapsed ? "w-5 h-5" : "w-4 h-4"}`}
                    />
                  </div>

                  {!collapsed && (
                    <span className="font-semibold text-sm">{item.name}</span>
                  )}

                  {collapsed && (
                    <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#5A3E40] text-white rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 text-xs">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            }

            /* ================= WITH SUBMENU ================= */
            return (
              <AccordionItem
                key={item.name}
                value={item.name}
                className="border-none"
              >
                <AccordionTrigger
                  className={`
                group flex items-center gap-3
                ${collapsed ? "justify-center px-0" : "px-2"}
                py-3 rounded-xl hover:no-underline
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#F9E6E4] text-[#5A3E40] font-semibold border border-[#FFC6CA]"
                    : "text-[#6D4C4F] hover:bg-[#F9E6E4]"
                }
              `}
                >
                  <div
                    className={`
                  flex items-center justify-center rounded-lg shrink-0
                  ${collapsed ? "w-10 h-10" : "w-9 h-9"}
                  ${
                    isActive
                      ? "bg-[#FFD3D6]"
                      : "bg-white group-hover:bg-[#FFD3D6]"
                  }
                `}
                  >
                    <item.icon
                      className={`${collapsed ? "w-5 h-5" : "w-4 h-4"}`}
                    />
                  </div>

                  {!collapsed && (
                    <span className="font-semibold text-sm">{item.name}</span>
                  )}
                </AccordionTrigger>

                {!collapsed && (
                  <AccordionContent className="pl-10 pt-1 space-y-1">
                    {item.subMenu?.map((sub) => {
                      const isSubActive = pathname === sub.href;

                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                        transition-all duration-200
                        ${
                          isSubActive
                            ? "bg-[#F9DCC0] text-[#5A3E40] border-l-2 border-[#FFB0B5]"
                            : "text-[#6D4C4F] hover:bg-[#F9E6E4] border-l-2 border-transparent"
                        }
                      `}
                        >
                          <sub.icon className="w-4 h-4 shrink-0 opacity-70" />
                          <span className="text-sm">{sub.name}</span>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </nav>

      {/* ================= LOGOUT ================= */}
      {/* <div className="px-4 py-4 border-t border-[#FFD3D6]">
        <button
          onClick={handleLogout}
          className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl
        text-[#6D4C4F] hover:bg-[#FFC6CA] hover:text-[#5A3E40]
        transition-all duration-200 w-full cursor-pointer
        ${collapsed ? "justify-center px-2" : ""}
      `}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div> */}

      {/* ================= USER ================= */}
      <div className="px-4 py-4 border-t border-[#FFD3D6]">
        <div className="flex items-center gap-3 bg-[#F9E6E4] p-3 rounded-xl">
          <div className="w-10 h-10 bg-[#FFB0B5] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow">
            {userMeta?.full_name?.charAt(0) ?? "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[#5A3E40] text-sm font-medium truncate">
                {userMeta?.full_name}
              </p>
              {/* <p className="text-[#9C6B6F] text-xs capitalize">
                {userMeta?.role}
              </p> */}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

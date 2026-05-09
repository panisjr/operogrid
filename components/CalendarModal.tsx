"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarTodo } from "@/lib/types";
import DateDetailsDialog from "./DateDetailsDialog";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  todos: CalendarTodo[];
  setTodos: React.Dispatch<React.SetStateAction<CalendarTodo[]>>;
}

export default function CalendarModal({
  open,
  onClose,
  todos,
  setTodos,
}: CalendarModalProps) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<string>(
    today.toLocaleDateString("en-CA"),
  );
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);


  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = (): (number | null)[] => {
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };



  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl! bg-[#FFE5E7]/70 border border-[#FFD3D6] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A3E40]">
              {today.toLocaleString("default", { month: "long" })} {year}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-8 mt-6">
            {/* ===== CALENDAR GRID ===== */}
            <div className="col-span-2 max-h-120 overflow-y-auto">
              <div className="grid grid-cols-7 gap-3 text-sm">
                {calendarDays().map((day, idx) => {
                  if (!day) return <div key={idx} className="h-24" />;

                  const dateStr = new Date(year, month, day).toLocaleDateString(
                    "en-CA",
                  );

                  const dayTodos = todos.filter((t) => t.date === dateStr);
                  const totalCount = dayTodos.length;
                  const completedCount = dayTodos.filter(
                    (t) => t.completed,
                  ).length;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setIsDateDialogOpen(true);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const taskId = e.dataTransfer.getData("taskId");
                        setTodos((prev) =>
                          prev.map((t) =>
                            t.id === taskId ? { ...t, date: dateStr } : t,
                          ),
                        );
                      }}
                      className={`
        relative h-24 p-2 rounded-xl cursor-pointer transition flex flex-col
        ${
          isSelected
            ? "bg-[#FFB0B5] text-white"
            : "bg-[#F9E6E4] hover:bg-[#FFC6CA]"
        }
      `}
                    >
                      {/* Day number */}
                      <div className="text-xs font-semibold">{day}</div>

                      {/* Progress: completed / total */}
                      {totalCount > 0 && (
                        <span
                          className={`
            absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full
            ${
              isSelected
                ? "bg-white/20 text-white border border-white/30"
                : "bg-[#FFB0B5] text-white"
            }
          `}
                        >
                          {completedCount} / {totalCount}
                        </span>
                      )}

                      {/* Preview of up to 2 tasks */}
                      <div className="flex flex-col gap-1 overflow-hidden mt-1">
                        {dayTodos.slice(0, 2).map((todo) => {
                          const priorityColor =
                            todo.priority === "high"
                              ? "bg-red-400"
                              : todo.priority === "medium"
                                ? "bg-yellow-400"
                                : "bg-green-400";

                          return (
                            <div
                              key={todo.id}
                              className={`
          flex items-center gap-1 text-[10px] truncate px-1 rounded
          ${
            todo.completed
              ? isSelected
                ? "line-through opacity-60 bg-white/20 text-white"
                : "line-through opacity-60 bg-[#FFE5E7]/70 text-[#9C6B6F]"
              : isSelected
                ? "bg-white/30 text-white"
                : "bg-[#FFE5E7] text-[#5A3E40]"
          }
        `}
                            >
                              {/* Priority Dot */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${priorityColor}`}
                              />

                              {/* Title */}
                              <span className="truncate flex-1">
                                {todo.title}
                              </span>

                              {/* Important Star */}
                              {todo.important && (
                                <span className="text-[9px]">★</span>
                              )}
                            </div>
                          );
                        })}

                        {dayTodos.length > 2 && (
                          <span
                            className={`text-[10px] opacity-70 ${
                              isSelected ? "text-white" : "text-[#9C6B6F]"
                            }`}
                          >
                            +{dayTodos.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DateDetailsDialog
        open={isDateDialogOpen}
        onClose={() => setIsDateDialogOpen(false)}
        date={selectedDate}
        todos={todos}
        setTodos={setTodos}
      />
    </>
  );
}

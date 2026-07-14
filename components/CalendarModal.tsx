"use client";
import { gsap } from "gsap";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarTodo } from "@/lib/types";
import DateDetailsDialog from "./DateDetailsDialog";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

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
  const [displayDate, setDisplayDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toLocaleDateString("en-CA"),
  );
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const calendarRef = useRef<HTMLDivElement>(null);
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
  const previousMonth = () => {
    if (!calendarRef.current) return;

    gsap.to(calendarRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        setDisplayDate(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
        );

        gsap.fromTo(
          calendarRef.current,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.2,
            ease: "power2.inOut",
          },
        );
      },
    });
  };
  const nextMonth = () => {
    if (!calendarRef.current) return;

    gsap.to(calendarRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setDisplayDate(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
        );

        gsap.fromTo(
          calendarRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2 },
        );
      },
    });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent aria-describedby={undefined} className="max-w-7xl! bg-white border border-[#FFD3D6] rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="p-5! gap-2 text-xl font-bold text-[#5A3E40] cursor-pointer"
                  >
                    <CalendarIcon className="h-5 w-5 shrink-0" />

                    {format(displayDate, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={displayDate}
                    month={displayDate}
                    onMonthChange={setDisplayDate}
                    onSelect={(date) => {
                      if (!date) return;
                      setDisplayDate(date);
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(2020, 0)}
                    endMonth={new Date(2035, 11)}
                  />
                </PopoverContent>
              </Popover>
            </DialogTitle>
          </DialogHeader>

          <div className="w-full flex items-center justify-between gap-8 mt-6">
            <button
              className="rounded-full border cursor-pointer p-3 transition-all duration-300 hover:bg-gray-100"
              onClick={previousMonth}
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
            </button>
            {/* ===== CALENDAR GRID ===== */}

            <div className="w-full max-h-120 overflow-y-auto">
              <div className="space-y-3">
                {/* ===== WEEKDAY HEADER ===== */}
                <div className="grid grid-cols-7 gap-3 text-xs font-bold text-white uppercase tracking-wide">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center py-2 rounded-lg bg-[#5A3E40]"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* ===== DAYS GRID ===== */}
                <div
                  ref={calendarRef}
                  className="grid grid-cols-7 gap-3 text-sm"
                >
                  {calendarDays().map((day, idx) => {
                    if (!day) return <div key={idx} className="h-24" />;

                    const dateStr = new Date(
                      year,
                      month,
                      day,
                    ).toLocaleDateString("en-CA");

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
                        className={`relative h-24 p-2 rounded-xl cursor-pointer transition flex flex-col
            ${
              isSelected
                ? "bg-[#FFB0B5] text-white"
                : "bg-[#F9E6E4] hover:bg-[#FFC6CA]"
            }`}
                      >
                        {/* Day Number */}
                        <div className="text-xs font-semibold">{day}</div>

                        {/* Progress */}
                        {totalCount > 0 && (
                          <span
                            className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full
                ${
                  isSelected
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-[#FFB0B5] text-white"
                }`}
                          >
                            {completedCount} / {totalCount}
                          </span>
                        )}

                        {/* Preview */}
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
                                className={`flex items-center gap-1 text-[10px] truncate px-1 rounded
                    ${
                      todo.completed
                        ? isSelected
                          ? "line-through opacity-60 bg-white/20 text-white"
                          : "line-through opacity-60 bg-[#FFE5E7]/70 text-[#9C6B6F]"
                        : isSelected
                          ? "bg-white/30 text-white"
                          : "bg-[#FFE5E7] text-[#5A3E40]"
                    }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${priorityColor}`}
                                />
                                <span className="truncate flex-1">
                                  {todo.title}
                                </span>
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

            <button
              className="rounded-full border cursor-pointer p-3 transition-all duration-300 hover:bg-gray-100"
              onClick={nextMonth}
            >
              <ChevronRight className="w-5 h-5 shrink-0" />
            </button>
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

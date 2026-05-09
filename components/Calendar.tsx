"use client";

interface CalendarProps {
  onOpen: () => void;
}
export default function Calendar({ onOpen }: CalendarProps) {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = today.toLocaleString("default", {
    month: "long",
  });
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
    <div
      onClick={onOpen}
      className="bg-white border border-[#FFD3D6] rounded-2xl p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#5A3E40]">
          {monthName} {year}
        </h2>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-xs font-medium text-[#9C6B6F] mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-sm">
       {calendarDays().map((day, index) => {
          const isToday = day === today.getDate();

          return (
            <div
              key={index}
              className={`
                h-10 flex items-center justify-center rounded-lg
                ${
                  day
                    ? isToday
                      ? "bg-[#FFB0B5] text-white font-semibold shadow-sm"
                      : "bg-[#FFE5E7] text-[#5A3E40] hover:bg-[#FFC6CA] cursor-pointer transition"
                    : ""
                }
              `}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

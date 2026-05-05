"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarTodo, Priority } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  date: string;
  todos: CalendarTodo[];
  setTodos: React.Dispatch<React.SetStateAction<CalendarTodo[]>>;
}

export default function DateDetailsDialog({
  open,
  onClose,
  date,
  todos,
  setTodos,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [editValue, setEditValue] = useState("");

  const todosForDate = useMemo(
    () => todos.filter((t) => t.date === date),
    [todos, date]
  );

  const priorityColors: Record<Priority, string> = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  };

  const toggleImportant = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, important: !t.important }
          : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  const saveEdit = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: editValue } : t
      )
    );
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#FFE5E7] border border-[#FFD3D6] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#5A3E40]">
            Tasks for {date}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
          {todosForDate.length === 0 ? (
            <p className="text-sm text-[#9C6B6F]">
              No tasks.
            </p>
          ) : (
            todosForDate.map((todo) => (
              <div
                key={todo.id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "taskId",
                    todo.id
                  )
                }
                className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300
                  ${
                    todo.completed
                      ? "bg-[#FFD3D6]/50 opacity-60"
                      : "bg-[#F9E6E4]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() =>
                      toggleComplete(todo.id)
                    }
                  />

                  {editingId === todo.id ? (
                    <input
                      value={editValue}
                      onChange={(e) =>
                        setEditValue(e.target.value)
                      }
                      onBlur={() => saveEdit(todo.id)}
                      className="px-2 py-1 rounded border"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditingId(todo.id);
                        setEditValue(todo.title);
                      }}
                      className={`text-sm font-medium ${
                        todo.completed
                          ? "line-through text-[#9C6B6F]"
                          : "text-[#5A3E40]"
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {todo.time && (
                    <span className="text-xs text-[#9C6B6F]">
                      {todo.time}
                    </span>
                  )}

                  <Badge
                    className={`${priorityColors[todo.priority]}`}
                  >
                    {todo.priority}
                  </Badge>

                  {todo.important && (
                    <Badge className="bg-[#F9DCC0]">
                      Important
                    </Badge>
                  )}

                  <button
                    onClick={() =>
                      toggleImportant(todo.id)
                    }
                    className="text-xs px-2 py-1 bg-[#FFB0B5] text-white rounded"
                  >
                    ★
                  </button>

                  <button
                    onClick={() =>
                      deleteTodo(todo.id)
                    }
                    className="text-xs px-2 py-1 bg-red-400 text-white rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
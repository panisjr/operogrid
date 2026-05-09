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
import { createClient } from "@/lib/supabase/client";
import { useData } from "@/app/context/DataContext";

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
  const supabase = createClient();
  const { currentUser } = useData();
  const [openAddTask, setOpenAddTask] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const [newTodo, setNewTodo] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("low");

  const todosForDate = useMemo(
    () => todos.filter((t) => t.date === date),
    [todos, date],
  );

  const priorityColors: Record<Priority, string> = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const toggleImportant = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const saveEdit = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editValue } : t)),
    );
    setEditingId(null);
  };
  const handleAddTodo = async (): Promise<void> => {
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: currentUser.id,
            title: newTodo,
            date: date,
            time: newTime,
            priority: selectedPriority,
            completed: false,
            important: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(error.message);
        return;
      }

      // Update local state
      setTodos((prev) => [...prev, data]);

      // Reset form
      setNewTodo("");
      setNewTime("");
      setSelectedPriority("low");

      setOpenAddTask(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white backdrop-blur-xl border border-white rounded-3xl p-8 shadow-xl">
          {/* ===== HEADER ===== */}
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl font-bold text-[#5A3E40]">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogTitle>
                <p className="text-xs text-[#9C6B6F] mt-1">
                  {todosForDate.length} Tasks
                </p>
              </div>

              <button
                onClick={() => setOpenAddTask(true)}
                className="group bg-[#FFB0B5] hover:bg-[#FFC6CA] text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm"
              >
                + Add Task
              </button>
            </div>
          </DialogHeader>

          {/* ===== TASK LIST ===== */}
          <div className="space-y-3 mt-6 max-h-105 overflow-y-auto pr-1">
            {todosForDate.length === 0 ? (
              <div className="text-center py-10 text-[#9C6B6F] text-sm">
                No tasks for this day.
              </div>
            ) : (
              todosForDate.map((todo) => (
                <div
                  key={todo.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("taskId", todo.id)}
                  className={`group flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 hover:shadow-md
              ${
                todo.completed ? "bg-[#FFD3D6]/40 opacity-70" : "bg-[#ffdcd8]/50 border border-[#fdb9b2]"
              }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleComplete(todo.id)}
                    />

                    {editingId === todo.id ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        className="px-2 py-1 rounded-lg border border-[#FFD3D6] bg-white"
                        autoFocus
                      />
                    ) : (
                      <span
                        onDoubleClick={() => {
                          setEditingId(todo.id);
                          setEditValue(todo.title);
                        }}
                        className={`text-sm font-medium transition ${
                          todo.completed
                            ? "line-through text-[#9C6B6F]"
                            : "text-[#5A3E40]"
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">
                    {/* Time */}
                    {todo.time && (
                      <span className="text-xs text-[#9C6B6F] bg-white px-2 py-1 rounded-md border border-[#FFD3D6]">
                        {todo.time}
                      </span>
                    )}

                    {/* Priority */}
                    <Badge
                      className={`${priorityColors[todo.priority]} px-2 py-1 text-xs`}
                    >
                      {todo.priority}
                    </Badge>

                    {/* Important */}
                    {todo.important && (
                      <Badge className="bg-[#F9DCC0] text-[#5A3E40] border border-[#FFC6CA] text-xs">
                        Important
                      </Badge>
                    )}

                    {/* Toggle Important */}
                    <button
                      onClick={() => toggleImportant(todo.id)}
                      className="opacity-70 group-hover:opacity-100 transition text-[#FFB0B5] hover:scale-110"
                    >
                      ★
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-70 group-hover:opacity-100 transition text-red-400 hover:scale-110"
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
      <Dialog open={openAddTask} onOpenChange={setOpenAddTask}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-8 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#5A3E40]">
              Add Task
            </DialogTitle>
            <p className="text-xs text-[#9C6B6F] mt-1">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Title */}
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Task title..."
              className="w-full px-4 py-3 rounded-xl border border-[#FFD3D6] focus:ring-2 focus:ring-[#FFB0B5] outline-none bg-white"
            />

            {/* Time */}
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#FFD3D6] focus:ring-2 focus:ring-[#FFB0B5] outline-none bg-white"
            />

            {/* Priority */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 rounded-xl border border-[#FFD3D6] focus:ring-2 focus:ring-[#FFB0B5] outline-none bg-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button
              onClick={() => {
                handleAddTodo();
                setOpenAddTask(false);
              }}
              className="w-full bg-[#FFB0B5] text-white py-3 rounded-xl font-semibold hover:bg-[#FFC6CA] transition shadow-md cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

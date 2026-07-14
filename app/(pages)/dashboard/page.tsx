"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Plus, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Calendar from "@/components/Calendar";
import { CalendarTodo, Priority } from "@/lib/types";
import CalendarModal from "@/components/CalendarModal";
import { createClient } from "@/lib/supabase/client";
import { useData } from "@/app/context/DataContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Activity {
  id: string;
  message: string;
  date: string;
}

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

export default function Dashboard() {
  const supabase = createClient();
  const today = new Date();
  const { currentUser } = useData();
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [todos, setTodos] = useState<CalendarTodo[]>([]);
  const [openAddTask, setOpenAddTask] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const [newTodo, setNewTodo] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("low");

  const todosForDate = useMemo(
    () =>
      todos.filter((t) => t.date === new Date().toLocaleDateString("en-CA")),
    [todos],
  );

  const priorityColors: Record<Priority, string> = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };
  const toggleComplete = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedCompleted = !todo.completed;

      const { error } = await supabase
        .from("todos")
        .update({ completed: updatedCompleted })
        .eq("id", id);

      if (error) {
        console.error(error.message);
        return;
      }

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: updatedCompleted } : t,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleImportant = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedImportant = !todo.important;

      const { error } = await supabase
        .from("todos")
        .update({ important: updatedImportant })
        .eq("id", id);

      if (error) {
        console.error(error.message);
        return;
      }

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, important: updatedImportant } : t,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        console.error(error.message);
        return;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ title: editValue })
        .eq("id", id);

      if (error) {
        console.error(error.message);
        return;
      }

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: editValue } : t)),
      );

      setEditingId(null);
      setEditValue("");
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddTodo = async (): Promise<void> => {
    const toastID: string | boolean = "";
    if (!newTodo.trim() || newTodo === "" || newTime === "") {
      toast.error("Failed to add!", {
        description: `${newTodo === "" ? "Missing task field." : "Time is not set."}`,
        id: toastID,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: currentUser.id,
            title: newTodo,
            date: today.toLocaleDateString("en-CA"),
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
      toast.success("Added Successfully!", { id: toastID });
    } catch (error) {
      console.error(error);
    }
  };
  // const hasMounted = useRef<boolean>(false);

  // const fetchTodos = useCallback(async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("todos")
  //       .select("*")
  //       .eq("user_id", currentUser.id)
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       console.error(error.message);
  //       return;
  //     }

  //     setTodos(data || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [currentUser.id, supabase]);

  // useEffect(() => {
  //   if (hasMounted.current) return;
  //   fetchTodos();
  //   hasMounted.current = true;
  // }, [fetchTodos]);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error(error.message);
          return;
        }

        setTodos(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, [currentUser.id, supabase]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Analytics Section */}
      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-[#FFD3D6]/40">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center justify-center gap-2">
            <LayoutDashboard size={18} className="text-[#5A3E40]" />
            <h2 className="text-lg font-semibold text-[#5A3E40]">
              Today&#39;s Note
            </h2>
          </div>
          <button
            onClick={() => setOpenAddTask(true)}
            className="group bg-[#FFB0B5] hover:bg-[#FFC6CA] text-white px-2.5 py-2 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5 shrink-0" />
          </button>
        </div>

        <div className="flex items-center justify-center bg-[#FFD3D6]/40 rounded-xl text-[#9C6B6F] text-sm">
          {todos.some(
            (todo) => todo.date === today.toLocaleDateString("en-CA"),
          ) ? (
            <div className="w-full h-full max-h-80 overflow-y-auto flex items-start justify-start p-5 bg-[#FFD3D6]/40 rounded-xl text-[#9C6B6F] text-sm">
              <div className="w-full flex flex-col items-start gap-3">
                {todosForDate.length === 0 ? (
                  <div className="text-center py-10 text-[#9C6B6F] text-sm">
                    No tasks for this day.
                  </div>
                ) : (
                  todosForDate.map((todo) => (
                    <div
                      key={todo.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("taskId", todo.id)
                      }
                      className={`w-full group flex flex-col items-start justify-center p-4 rounded-2xl border transition-all duration-300 hover:shadow-md
              ${
                todo.completed
                  ? "bg-[#FFD3D6]/40 opacity-70"
                  : "bg-white border border-[#FFC6CA] shadow-md shadow-[#FFC6CA]"
              }`}
                    >
                      {/* Important */}
                      {todo.important && (
                        <Badge className="bg-[#FFB0B5] text-white border border-[#FFB0B5] text-xs -mt-6.25 mb-1.25">
                          Important
                        </Badge>
                      )}
                      <div className="w-full flex flex-row items-center justify-between">
                        {/* LEFT */}
                        <div className="w-full flex items-center gap-3">
                          <Checkbox
                            className="border border-[#fdb9b2] cursor-pointer"
                            checked={todo.completed}
                            onCheckedChange={() => toggleComplete(todo.id)}
                          />

                          {editingId === todo.id ? (
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => saveEdit(todo.id)}
                              className="w-full h-15 min-h-10 max-h-20 px-2 py-1 rounded-lg border border-[#FFD3D6] bg-white"
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

                          {/* Toggle Important */}
                          <Star
                            onClick={() => toggleImportant(todo.id)}
                            className="shrink-0 w-5 h-5 opacity-70 group-hover:opacity-100 transition text-[#FFB0B5]  hover:scale-110 cursor-pointer"
                          />

                          {/* Delete */}
                          <X
                            onClick={() => deleteTodo(todo.id)}
                            className="shrink-0 w-5 h-5 opacity-70 group-hover:opacity-100 transition text-red-400 hover:scale-110 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p>No todos for today.</p>
          )}
        </div>
      </div>

      {/* Replace Recent Activity with Calendar + Activity Stack */}
      <div className="space-y-6">
        <Calendar onOpen={() => setIsCalendarOpen(true)} todos={todos} />

        {isCalendarOpen && (
          <CalendarModal
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            todos={todos}
            setTodos={setTodos}
          />
        )}

        <div className="bg-white border border-[#FFD3D6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#5A3E40] mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-4">
            {mockActivity.map((activity) => (
              <li
                key={activity.id}
                className="p-3 rounded-xl bg-[#FFB0B5]/30 border border-[#FFB0B5]"
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
      <Dialog open={openAddTask} onOpenChange={setOpenAddTask}>
        <DialogContent
          aria-description={undefined}
          className="max-w-md! bg-white rounded-3xl p-8 shadow-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#5A3E40]">
              Add Task
            </DialogTitle>
            <p className="text-xs text-[#9C6B6F] mt-1">
              {new Date(today).toLocaleDateString("en-US", {
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
              }}
              className="w-full bg-[#FFB0B5] text-white py-3 rounded-xl font-semibold hover:bg-[#FFC6CA] transition shadow-md cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

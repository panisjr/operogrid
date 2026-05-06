export type Priority = "low" | "medium" | "high";

export interface CalendarTodo {
  id: string;
  title: string;
  date: string;          // ISO date
  time?: string;         // "14:30"
  completed: boolean;
  important: boolean;
  priority: Priority;
}
export interface User {
  email: string;
  id: string;
  name: string;
  password: string;
  role: string;
  username: string;
}

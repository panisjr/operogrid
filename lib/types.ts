export type Priority = "low" | "medium" | "high";

export interface CalendarTodo {
  id: string;
  title: string;
  date: string; // ISO date
  time?: string; // "14:30"
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

export interface UserMeta {
  id: string;
  email: string;
  full_name: string;
}

// PROPS __________________________________________________________________________________________________________
export interface SignInProps {
  setFormType?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface SignUpProps {
  setFormType?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SidebarProps {
  userMeta?: UserMeta;
}

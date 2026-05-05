"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useTodos } from "@/app/context/TodoContext";

export default function TodoTable() {
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [sortAsc, setSortAsc] = useState(true);

  const sortedTodos = [...todos].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => setSortAsc(!sortAsc)}
              className="cursor-pointer"
            >
              Task Name
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <input
                  className="bg-transparent outline-none"
                  value={todo.title}
                  onChange={(e) =>
                    updateTodo({ ...todo, title: e.target.value })
                  }
                />
              </TableCell>

              <TableCell>
                <div dangerouslySetInnerHTML={{ __html: todo.description }} />
              </TableCell>

              <TableCell>
                <input
                  type="date"
                  value={todo.dueDate}
                  onChange={(e) =>
                    updateTodo({ ...todo, dueDate: e.target.value })
                  }
                />
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    todo.status === "completed" ? "default" : "secondary"
                  }
                  onClick={() =>
                    updateTodo({
                      ...todo,
                      status:
                        todo.status === "completed" ? "pending" : "completed",
                    })
                  }
                  className="cursor-pointer"
                >
                  {todo.status}
                </Badge>
              </TableCell>

              <TableCell>
                <Trash2
                  className="cursor-pointer text-red-500"
                  size={16}
                  onClick={() => deleteTodo(todo.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

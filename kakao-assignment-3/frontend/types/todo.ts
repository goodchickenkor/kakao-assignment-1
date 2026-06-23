export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
};

export type TodoFilter = "all" | "active" | "completed";

export type GetTodosParams = {
  filter?: TodoFilter | string;
  search?: string;
  date?: string;
};

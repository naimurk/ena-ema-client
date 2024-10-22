export type TTask = {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: string;
  tags: string[];
  completed: boolean;
  reminder: boolean;
};

export type TMainT = {
  _id: string;
  count: number;
  tasks: TTask[];
};

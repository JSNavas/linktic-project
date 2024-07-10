export interface Project {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
}

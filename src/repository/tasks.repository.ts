import Queue from "../utils/queue.ts";
import { readStorage, writeStorage } from "../utils/storage.ts";

export type TTaskState = "Done" | "InProgress" | "Backlog";

export type Task = {
  id: number;
  state: TTaskState;
  description: string;
};

class TasksRepository {
  private tasks: Task[] = [];
  private queue = new Queue();

  constructor() {
    this.initStorage();
  }

  private async initStorage() {
    const storage = await readStorage<Task[]>();

    if (storage) {
      this.tasks = storage;
    }
  }

  private findNextId() {
    const sortedTasks = this.tasks.slice().sort((a, b) => a.id - b.id);
    const lastTaskId = sortedTasks[sortedTasks.length - 1]?.id ?? 0;
    return lastTaskId + 1;
  }

  public createTask(data: Omit<Task, "id">) {
    const newTask = { ...data, id: this.findNextId() };
    this.tasks.push(newTask);
    this.queue.pushTask(() => writeStorage(this.tasks));
    console.log(newTask);
  }

  public editTask() {}
  public deleteTask() {}
  public getTaskById() {}
  public getAllTasks() {}
}

export default TasksRepository;

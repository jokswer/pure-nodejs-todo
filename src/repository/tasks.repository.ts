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
    const lastTaskId = sortedTasks.at(-1)?.id ?? 0;
    return lastTaskId + 1;
  }

  public async createTask(data: Omit<Task, "id">) {
    return new Promise<Task>((resolve, reject) => {
      this.queue.pushTask(async () => {
        const newTask = { ...data, id: this.findNextId() };
        const result = await writeStorage(this.tasks.concat(newTask));

        if (result.status === "success") {
          this.tasks.push(newTask);
          resolve(newTask);
        } else {
          reject("Something went wrong");
        }
      });
    });
  }

  public editTask() {}
  public deleteTask() {}
  public getTaskById() {}
  public getAllTasks() {}
}

export default TasksRepository;

import { NotFoundError } from "../utils/error.ts";
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
  private writeQueue = new Queue();

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
      this.writeQueue.pushTask(async () => {
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

  public async editTask(id: number, data: Omit<Task, "id">) {
    return new Promise<Task>((resolve, reject) => {
      this.writeQueue.pushTask(async () => {
        try {
          const tasks = await readStorage<Task[]>();

          if (!tasks) {
            throw new Error("Something went wrong");
          }

          const taskIndex = tasks.findIndex((task) => task.id === id);

          if (taskIndex === -1) {
            throw new NotFoundError("Task not found");
          }

          tasks[taskIndex] = { ...tasks[taskIndex], ...data };

          const result = await writeStorage(tasks);

          if (result.status === "success") {
            resolve(tasks[taskIndex]);
          } else {
            reject("Something went wrong");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            reject(error);
          } else {
            reject("Something went wrong");
          }
        }
      });
    });
  }

  public deleteTask(id: number) {
    return new Promise<Task>((resolve, reject) => {
      this.writeQueue.pushTask(async () => {
        try {
          const tasks = await readStorage<Task[]>();

          if (!tasks) {
            throw new Error("Something went wrong");
          }

          const task = tasks.find((task) => task.id === id);

          if (!task) {
            throw new NotFoundError("Task not found");
          }

          const updatedTasks = tasks.filter((task) => task.id !== id);
          const result = await writeStorage(updatedTasks);

          if (result.status === "success") {
            this.tasks = updatedTasks;
            resolve(task);
          } else {
            reject("Something went wrong");
          }
        } catch (error) {
          if (error instanceof NotFoundError) {
            reject(error);
          } else {
            reject("Something went wrong");
          }
        }
      });
    });
  }

  public async getTaskById(id: number) {
    const tasks = await readStorage<Task[]>();

    if (!tasks) {
      throw new Error("Something went wrong");
    }

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return task;
  }
  public async getAllTasks() {
    const tasks = await readStorage<Task[]>();

    if (!tasks) {
      throw new Error("Something went wrong");
    }

    return tasks;
  }
}

export default TasksRepository;

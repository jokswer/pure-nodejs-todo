import TasksRepository, { type Task } from "../repository/tasks.repository.ts";

class TasksController {
  private readonly repository: TasksRepository;

  constructor(repository: TasksRepository) {
    this.repository = repository;
  }

  public createTask(data: Omit<Task, "id">) {
    this.repository.createTask(data)
    return "success"
  }
  public editTask() {}
  public deleteTask() {}
  public getTaskById() {}
  public getAllTasks() {}
}

export default TasksController;

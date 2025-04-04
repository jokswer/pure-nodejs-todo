import TasksRepository, { type Task } from "../repository/tasks.repository.ts";
import { validateCreateTasksBody } from "../validation/request.validation.ts";
import { ValidationError } from "../utils/error.ts";

class TasksController {
  private readonly repository: TasksRepository;

  constructor(repository: TasksRepository) {
    this.repository = repository;
  }

  public async createTask(req, res): Promise<Task | string> {
    try {
      const { body } = req;

      const validationError = validateCreateTasksBody(body);

      if (validationError) {
        throw new ValidationError(validationError);
      }

      const result = await this.repository.createTask(body);
      res.writeHead(200, { "Content-Type": "application/json" });

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return error.message;
      }
      res.writeHead(500, { "Content-Type": "text/plain" });
      return error;
    }
  }
  public editTask() {}
  public deleteTask() {}
  public getTaskById() {}
  public getAllTasks() {}
}

export default TasksController;

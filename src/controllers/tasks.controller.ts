import TasksRepository, { type Task } from "../repository/tasks.repository.ts";
import { validateCreateTasksBody } from "../validation/request.validation.ts";
import { NotFoundError, ValidationError } from "../utils/error.ts";

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

  public async editTask(req, res) {
    try {
      const { params, body } = req;
      const parsedId = parseInt(params.id, 10);

      if (isNaN(parsedId)) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return "Invalid id";
      }

      const validationError = validateCreateTasksBody(body);

      if (validationError) {
        throw new ValidationError(validationError);
      }

      const result = await this.repository.editTask(parsedId, body);
      res.writeHead(200, { "Content-Type": "application/json" });

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return error.message;
      }

      if (error instanceof ValidationError) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return error.message;
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      return error;
    }
  }

  public async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return "Invalid id";
      }

      const result = await this.repository.deleteTask(parsedId);
      res.writeHead(200, { "Content-Type": "application/json" });

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return error.message;
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      return error;
    }
  }

  public async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return "Invalid id";
      }

      const result = await this.repository.getTaskById(parsedId);
      res.writeHead(200, { "Content-Type": "application/json" });

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return error.message;
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      return error;
    }
  }

  public async getAllTasks(res) {
    try {
      const result = await this.repository.getAllTasks();
      res.writeHead(200, { "Content-Type": "application/json" });
      return result;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return error.message;
    }
  }
}

export default TasksController;

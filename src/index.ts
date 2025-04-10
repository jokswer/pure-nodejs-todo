import { Server } from "../libs/server.ts";

import TasksController from "./controllers/tasks.controller.ts";
import TasksRepository from "./repository/tasks.repository.ts";

const repository = new TasksRepository();
const controller = new TasksController(repository);

const server = Server();

server.post("/api/tasks", async (req, res) => {
  const result = await controller.createTask(req, res);
  return result;
});

server.get("/api/tasks", async (_, res) => {
  const result = await controller.getAllTasks(res);
  return result;
});

server.get("/api/tasks/:id", async (req, res) => {
  const result = await controller.getTaskById(req, res);
  return result;
});

server.put("/api/tasks/:id", async (req, res) => {
  const result = await controller.editTask(req, res)
  return result;
});

server.delete("/api/tasks/:id", async (req, res) => {
  const result = await controller.deleteTask(req, res);
  return result;
});

server.listen(3000);

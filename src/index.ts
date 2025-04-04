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

server.get("/api/tasks", () => {
  return "";
});

server.get("/api/tasks/:id", () => {
  return "";
});

server.put("/api/tasks/:id", () => {
  return "";
});

server.delete("/api/tasks/:id", () => {
  return "";
});

server.listen(3000);

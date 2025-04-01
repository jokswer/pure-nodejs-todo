import { Server } from "../libs/server.ts";

const server = Server();

server.post("/api/tasks", () => {
  return "";
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

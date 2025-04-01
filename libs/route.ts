import { IncomingMessage, ServerResponse } from "node:http";

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

export function addNewRoute({ method, url, handler }) {
  if (routes[method][url]) {
    console.error(`Route ${method} ${url} already exist`);
    return;
  }
  routes[method][url] = handler;
}

export function parseRequest(request: IncomingMessage) {
  const { method, url } = request;

  if (method && url) {
    const handler = routes[method][url] ?? null;
    return { handler };
  }

  return { handler: null };
}

export function notFound(response: ServerResponse<IncomingMessage>) {
  response.statusCode = 404;
  response.setHeader("Content-Type", "text/plain");
  return "Not found";
}

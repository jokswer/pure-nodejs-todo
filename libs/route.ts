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

async function readBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      try {
        const body = chunks.length
          ? JSON.parse(Buffer.concat(chunks).toString("utf-8"))
          : {};
        resolve(body);
      } catch (error) {
        reject(new Error("Invalid JSON in request body"));
      }
    });
  });
}

function notFound(response: ServerResponse<IncomingMessage>) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  return "Not found";
}

export async function parseRequest(
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>
) {
  try {
    const { method, url } = request;

    const body = await readBody(request);

    if (method && url && routes[method] && routes[method][url]) {
      const handler = routes[method][url];
      return {
        handler: () => handler(Object.assign(request, { body }), response),
      };
    }

    return { handler: () => notFound(response) };
  } catch (error) {
    response.statusCode = 400;
    response.end("Invalid JSON in request body");
    return { handler: null };
  }
}

import { IncomingMessage, ServerResponse } from "node:http";
import URL from "node:url";

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

function parsRouteWithParams(url: string, method: string) {
  const parsedUrl = URL.parse(url, true);
  const path = parsedUrl.pathname;

  const routeKeys = Object.keys(routes[method]).filter((key) =>
    key.includes(":")
  );

  const matchedKey = routeKeys.find((key) => {
    const regex = new RegExp(`^${key.replace(/:[^/]+/g, "([^/]+)")}$`);
    return regex.test(path);
  });

  if (matchedKey) {
    const regex = new RegExp(`^${matchedKey.replace(/:[^/]+/g, "([^/]+)")}$`);
    const dynamicParams = regex.exec(path).slice(1);
    const dynamicHandler = routes[method][matchedKey];

    const paramKeys = matchedKey
      .match(/:[^/]+/g)
      .map((key) => key.substring(1));

    const params = dynamicParams.reduce(
      (acc, val, i) => ({ ...acc, [paramKeys[i]]: val }),
      {}
    );

    return { params, dynamicHandler };
  }

  return null;
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

    const routeWithParams = parsRouteWithParams(url, method);

    if (routeWithParams) {
      const { params, dynamicHandler } = routeWithParams;
      return {
        handler: () =>
          dynamicHandler(Object.assign(request, { body, params }), response),
      };
    }

    return { handler: () => notFound(response) };
  } catch (error) {
    response.statusCode = 400;
    response.end("Invalid JSON in request body");
    return { handler: null };
  }
}

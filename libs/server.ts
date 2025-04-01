import { createServer } from "node:http";
import { parseRequest, addNewRoute, notFound } from "./route.ts";

const instance = createServer((req, res) => {
  const { handler } = parseRequest(req);
  
  let response;

  if (handler) {
    response = handler(req, res);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
  } else {
    response = notFound(res);
  }

  res.write(response);
  res.end();
});

export function Server() {
  const server = {
    get: function _get(url: string, handler) {
      return addNewRoute({ method: "GET", url, handler });
    },
    post: function _post(url: string, handler) {
      return addNewRoute({ method: "POST", url, handler });
    },
    put: function _put(url: string, handler) {
      return addNewRoute({ method: "PUT", url, handler });
    },
    delete: function _delete(url: string, handler) {
      return addNewRoute({ method: "DELETE", url, handler });
    },
    listen: function _listen(port: number) {
      return instance.listen(port);
    },
  };

  return server;
}

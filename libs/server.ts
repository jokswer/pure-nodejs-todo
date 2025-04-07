import { createServer } from "node:http";

import { parseRequest, addNewRoute } from "./route.ts";

const instance = createServer(async (req, res) => {
  try {
    const { handler } = await parseRequest(req, res);

    if (handler) {
      const response = await handler();
      res.write(JSON.stringify(response));
    }
  } catch (error) {
    console.error(error);
  } finally {
    res.end();
  }
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

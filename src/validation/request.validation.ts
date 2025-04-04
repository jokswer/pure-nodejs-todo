export function validateCreateTasksBody(body: Record<string, unknown>) {
  if (!body) {
    return "Body are required";
  }
  if (!body.description) {
    return "Description are required";
  }
  if (!body.state) {
    return "State are required";
  }
  if (
    body.state !== "Done" &&
    body.state !== "InProgress" &&
    body.state !== "Backlog"
  ) {
    return 'State should be "Done", "InProgress" or "Backlog"';
  }
  return null;
}
